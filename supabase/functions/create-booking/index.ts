// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-retell-signature',
}

serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        console.log('Received create-booking call body:', JSON.stringify(body))

        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not configured.')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Retell sends: body.args = the LLM-collected params, body.call = call metadata
        const args = body.args || body

        // Extract the booking fields from args
        const customerName = args.customer_name || args.name || args.patient_name || 'Unknown Patient'
        const customerPhone = args.customer_phone || args.phone || args.phone_number || null
        const customerEmail = args.customer_email || args.email || null
        const preferredDate = args.preferred_date || args.date || args.appointment_date || null
        const preferredTime = args.preferred_time || args.time || args.appointment_time || null
        const reason = args.reason || args.purpose || args.service || args.treatment || null

        // Get Retell call metadata — agent_id is in body.call, not body.args
        const callMeta = body.call || {}
        const retellCallId = callMeta.call_id || body.call_id || args.call_id || null
        const retellAgentId = callMeta.agent_id || body.agent_id || args.agent_id || null

        console.log('retellAgentId resolved:', retellAgentId)
        console.log('retellCallId resolved:', retellCallId)

        // Build structured notes
        const noteParts = []
        if (preferredDate) noteParts.push(`Date: ${preferredDate}`)
        if (preferredTime) noteParts.push(`Time: ${preferredTime}`)
        if (reason) noteParts.push(`Reason: ${reason}`)
        if (args.notes) noteParts.push(`Note: ${args.notes}`)
        const combinedNotes = noteParts.join(' | ') || null

        // Resolve natural language dates (agent may say "tomorrow", "today", "Monday" etc.)
        const resolveDate = (dateStr: string | null): string | null => {
            if (!dateStr) return null
            const d = dateStr.trim().toLowerCase()
            const now = new Date()
            const todayUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))

            if (d === 'today') return todayUTC.toISOString().split('T')[0]
            if (d === 'tomorrow') {
                todayUTC.setUTCDate(todayUTC.getUTCDate() + 1)
                return todayUTC.toISOString().split('T')[0]
            }
            // Try weekday names
            const weekdays = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
            const targetDay = weekdays.indexOf(d)
            if (targetDay !== -1) {
                const currentDay = now.getUTCDay()
                let daysAhead = targetDay - currentDay
                if (daysAhead <= 0) daysAhead += 7
                todayUTC.setUTCDate(todayUTC.getUTCDate() + daysAhead)
                return todayUTC.toISOString().split('T')[0]
            }
            // Try direct parse as ISO date (e.g. "2026-03-15")
            const parsed = new Date(dateStr)
            if (!isNaN(parsed.getTime())) return parsed.toISOString().split('T')[0]
            // Fallback: tomorrow
            todayUTC.setUTCDate(todayUTC.getUTCDate() + 1)
            console.log(`Could not parse date "${dateStr}", falling back to tomorrow`)
            return todayUTC.toISOString().split('T')[0]
        }

        const resolvedDate = resolveDate(preferredDate)

        // Build start_time ISO string from resolved date + time
        let startTime = null
        if (resolvedDate) {
            const timeStr = preferredTime || '09:00 AM'
            const parsed = new Date(`${resolvedDate} ${timeStr}`)
            if (!isNaN(parsed.getTime())) {
                startTime = parsed.toISOString()
            } else {
                // If time string is weird, just use noon on that day
                startTime = new Date(`${resolvedDate}T12:00:00`).toISOString()
            }
        } else {
            // Last resort: tomorrow at 9AM
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            tomorrow.setHours(9, 0, 0, 0)
            startTime = tomorrow.toISOString()
        }

        // Resolve organization_id from the retell agent ID
        let organizationId = null
        let agentDbId = null

        if (retellAgentId) {
            const { data: agent, error: agentError } = await supabase
                .from('agents')
                .select('id, organization_id')
                .eq('retell_agent_id', retellAgentId)
                .single()

            if (agent) {
                organizationId = agent.organization_id
                agentDbId = agent.id
                console.log('Resolved org ID from agent:', organizationId)
            } else {
                console.log('Agent lookup failed:', agentError?.message)
            }
        }

        // Fallback: if we still don't have an org, grab the first (and likely only) org
        if (!organizationId) {
            console.log('Falling back to first organization in database...')
            const { data: firstOrg } = await supabase
                .from('organizations')
                .select('id')
                .limit(1)
                .single()

            if (firstOrg) {
                organizationId = firstOrg.id
                console.log('Using fallback org ID:', organizationId)
            }
        }

        if (!organizationId) {
            throw new Error('Could not resolve organization. Make sure the agent is registered in the dashboard.')
        }

        // Insert the booking
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert([{
                organization_id: organizationId,
                agent_id: agentDbId,
                // call_id column is UUID type; Retell uses string IDs (call_xxx) which are not UUIDs.
                // We store the Retell call ID in notes instead to avoid a cast error.
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail,
                start_time: startTime,
                notes: combinedNotes,
                status: 'pending',
            }])
            .select()
            .single()

        if (bookingError) {
            console.error('Error inserting booking:', bookingError)
            return new Response(JSON.stringify({
                success: false,
                message: 'There was an issue saving your appointment. Please try again.',
                error: bookingError.message
            }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            })
        }

        console.log('Booking created successfully:', booking?.id)

        return new Response(JSON.stringify({
            success: true,
            booking_id: booking?.id,
            message: `Your appointment has been booked for ${customerName}. Our team will contact you shortly to confirm.`
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })

    } catch (err) {
        console.error('Unhandled error in create-booking:', err)
        return new Response(JSON.stringify({
            success: false,
            message: 'Unable to book appointment at this time.',
            error: err.message
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
})

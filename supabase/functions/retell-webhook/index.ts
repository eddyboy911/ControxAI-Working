import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const signature = req.headers.get('x-retell-signature') || ''
        const body = await req.json()
        
        // Log the incoming event for debugging
        console.log('Received Retell Webhook Event:', body.event)
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL')
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not configured in edge function.')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)
        
        // For processing the end of a call we particularly care about 'call_analyzed'
        // 'call_ended' is also useful but usually 'call_analyzed' has transcript and cost
        // Retell sends events like call_started, call_ended, call_analyzed
        
        if (body.event === 'call_analyzed' || body.event === 'call_ended') {
            const callData = body.data || body.call
            if (!callData) {
                console.log('No call data found in event')
                return new Response('OK', { status: 200, headers: corsHeaders })
            }
            
            const retell_call_id = callData.call_id
            const retell_agent_id = callData.agent_id
            
            if (!retell_call_id || !retell_agent_id) {
                console.log('Missing call_id or agent_id')
                return new Response('OK', { status: 200, headers: corsHeaders })
            }

            // Look up the agent and organization
            const { data: agent, error: agentError } = await supabase
                .from('agents')
                .select('id, organization_id')
                .eq('retell_agent_id', retell_agent_id)
                .single()

            if (agentError || !agent) {
                console.log(`Agent ${retell_agent_id} not found in database. Skipping...`)
                return new Response('OK', { status: 200, headers: corsHeaders })
            }

            // Sync the call record
            const callRecord = {
                retell_call_id: retell_call_id,
                agent_id: agent.id,
                organization_id: agent.organization_id,
                status: 'completed', // we are getting it post-call
                cost: (callData.call_cost?.combined_cost / 100) || callData.cost || 0, // Retell returns cents
                started_at: callData.start_timestamp ? new Date(callData.start_timestamp).toISOString() : null,
                ended_at: callData.end_timestamp ? new Date(callData.end_timestamp).toISOString() : null,
                duration_seconds: callData.call_cost?.total_duration_seconds || (callData.duration_ms ? Math.round(callData.duration_ms / 1000) : 0),
                recording_url: callData.recording_url || null,
                transcript: callData.transcript || null,
                summary: callData.call_analysis?.call_summary || null,
                sentiment_score: callData.call_analysis?.user_sentiment ? { score: callData.call_analysis.user_sentiment } : null,
                call_intent: callData.call_analysis?.call_intent || null,
                call_outcome: callData.call_analysis?.call_successful ? { outcome: 'successful' } : { outcome: 'unsuccessful' },
                extracted_data: callData.call_analysis?.custom_analysis_data || null,
                raw_data: callData
            }

            // Instead of upsert which requires a unique constraint on retell_call_id,
            // we will first check if the call exists, then update or insert.
            const { data: existingCall } = await supabase
                .from('calls')
                .select('id')
                .eq('retell_call_id', retell_call_id)
                .single()

            if (existingCall) {
                const { error: updateError } = await supabase
                    .from('calls')
                    .update(callRecord)
                    .eq('id', existingCall.id)
                
                if (updateError) {
                    console.error('Error updating call:', updateError)
                    throw updateError
                }
                console.log(`Successfully updated call ${retell_call_id} in database.`)
            } else {
                const { error: insertError } = await supabase
                    .from('calls')
                    .insert([callRecord])
                
                if (insertError) {
                    console.error('Error inserting call:', insertError)
                    throw insertError
                }
                console.log(`Successfully synced new call ${retell_call_id} to database.`)
            }
        } else {
             console.log(`Ignoring event: ${body.event}`)
        }

        return new Response('OK', { status: 200, headers: corsHeaders })
    } catch (error) {
        console.error('Webhook error:', error)
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        })
    }
})

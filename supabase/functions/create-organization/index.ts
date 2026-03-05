import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Get request body
        const { name, email } = await req.json()

        if (!name || !email) {
            return new Response(
                JSON.stringify({ error: 'Name and email are required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Create Supabase client with service role
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Step 1: Create organization
        const { data: orgData, error: orgError } = await supabaseAdmin
            .from('organizations')
            .insert([{
                name: name,
                slug: name.toLowerCase().replace(/\s+/g, '-'),
                billing_email: email,
                status: 'active'
            }])
            .select()
            .single()

        if (orgError) {
            throw new Error(`Failed to create organization: ${orgError.message}`)
        }

        // Step 2: Create user with Auth Admin API
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: '123456',
            email_confirm: true,
            user_metadata: {
                organization_name: name
            }
        })

        if (userError) {
            // Rollback: Delete the organization
            await supabaseAdmin.from('organizations').delete().eq('id', orgData.id)
            throw new Error(`Failed to create user: ${userError.message}`)
        }

        // Step 3: Link user to organization
        const { error: memberError } = await supabaseAdmin
            .from('organization_members')
            .insert([{
                organization_id: orgData.id,
                user_id: userData.user.id,
                role: 'owner'
            }])

        if (memberError) {
            // Rollback: Delete user and organization
            await supabaseAdmin.auth.admin.deleteUser(userData.user.id)
            await supabaseAdmin.from('organizations').delete().eq('id', orgData.id)
            throw new Error(`Failed to link user to organization: ${memberError.message}`)
        }

        // Success!
        return new Response(
            JSON.stringify({
                success: true,
                organization: orgData,
                user: {
                    id: userData.user.id,
                    email: userData.user.email
                },
                credentials: {
                    email: email,
                    password: '123456'
                }
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

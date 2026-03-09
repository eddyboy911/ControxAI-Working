import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

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
        const { agent_id } = await req.json()

        if (!agent_id) {
            return new Response(
                JSON.stringify({ error: 'Agent ID is required' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        let retellApiKey = Deno.env.get('RETELL_API_KEY')

        // Try to fetch from retell_credentials table if available
        try {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')
            const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
            
            if (supabaseUrl && supabaseServiceKey) {
                // Inline import of basic Supabase client for edge functions
                const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
                const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
                
                const { data: creds, error } = await supabaseAdmin
                    .from('retell_credentials')
                    .select('api_key_secure')
                    .eq('is_active', true)
                    .limit(1)
                    .single()
                    
                if (creds && creds.api_key_secure) {
                    retellApiKey = creds.api_key_secure
                }
            }
        } catch (dbError) {
            console.error('Error fetching API key from database:', dbError)
            // Fall back to environment variable mapping
        }

        if (!retellApiKey) {
            return new Response(
                JSON.stringify({ error: 'RETELL_API_KEY environment variable not set, and no active key found in retell_credentials' }),
                { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Register a web call with Retell AI
        const response = await fetch('https://api.retellai.com/v2/create-web-call', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${retellApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                agent_id: agent_id
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Failed to register web call with Retell')
        }

        return new Response(
            JSON.stringify({
                success: true,
                access_token: data.access_token,
                call_id: data.call_id,
                web_call_url: data.web_call_url // Some versions return a URL directly
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

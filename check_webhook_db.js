import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqwdgntcdmraczlcxilt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2RnbnRjZG1yYWN6bGN4aWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTg0MTYsImV4cCI6MjA4MDc3NDQxNn0.ViGSEEqImSckLHYwOp65jQuiNS8Px__jFNinLiPlkQw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Fetching recent calls...");
    const { data: calls, error: callError } = await supabase.from('calls').select('*').order('created_at', { ascending: false }).limit(2);
    if(callError) console.error("Call fetch error", callError)
    else console.log("Recent calls:", calls);

    console.log("\nAttempting to insert a mock webhook event to test schema...");
    
    // We need a valid agent_id and org_id
    const { data: agents } = await supabase.from('agents').select('*').limit(1);
    
    if (agents && agents.length > 0) {
        const agent = agents[0];
        const mockCall = {
            retell_call_id: 'test_webhook_' + Date.now(),
            agent_id: agent.id,
            organization_id: agent.organization_id,
           //  status: 'completed', // we are getting it post-call
           //  cost: 0,
            started_at: new Date().toISOString(),
           //  duration_seconds: 0,
        };
        
        console.log("Inserting:", mockCall);
        const { data, error } = await supabase.from('calls').insert([mockCall]).select();
        if (error) {
            console.error("Insert Error (Schema validation probably):", error);
        } else {
            console.log("Insert Success!", data);
        }
    } else {
         console.log("No agents found to test with");
    }
}
check();


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqwdgntcdmraczlcxilt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2RnbnRjZG1yYWN6bGN4aWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTg0MTYsImV4cCI6MjA4MDc3NDQxNn0.ViGSEEqImSckLHYwOp65jQuiNS8Px__jFNinLiPlkQw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log("Seeding test data...");

    // 1. Create Organization
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
            name: 'Test Org ' + Date.now(),
            status: 'active'
        })
        .select()
        .single();

    if (orgError) {
        console.error('Error creating org:', orgError);
        return;
    }
    console.log('Created Org:', org.id);

    // 2. Create Agent
    const { data: agent, error: agentError } = await supabase
        .from('agents')
        .insert({
            organization_id: org.id,
            name: 'Test Agent',
            retell_agent_id: 'agent_' + Date.now(),
            is_active: true
        })
        .select()
        .single();

    if (agentError) {
        console.error('Error creating agent:', agentError);
        return;
    }
    console.log('Created Agent:', agent.id);

    // 3. Create Calls (Backdated)
    const calls = [];
    const now = new Date();

    // Call 1: Today, $1.50
    calls.push({
        organization_id: org.id,
        agent_id: agent.id,
        retell_call_id: 'call_' + Date.now() + '_1',
        status: 'completed',
        started_at: now.toISOString(),
        cost: 1.50,
        difficulty: 'easy' // columns from schema? wait, schema didn't have difficulty.
        // Schema: id, organization_id, agent_id, retell_call_id, status, duration_seconds, cost, recording_url, transcript, analysis, raw_data, started_at, ended_at, created_at, summary, call_intent, call_outcome, extracted_data, sentiment_score
    });

    // Call 2: Yesterday, $2.00
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    calls.push({
        organization_id: org.id,
        agent_id: agent.id,
        retell_call_id: 'call_' + Date.now() + '_2',
        status: 'completed',
        started_at: yesterday.toISOString(),
        cost: 2.00
    });

    // Call 3: 3 Days ago, $0.50
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);
    calls.push({
        organization_id: org.id,
        agent_id: agent.id,
        retell_call_id: 'call_' + Date.now() + '_3',
        status: 'completed',
        started_at: threeDaysAgo.toISOString(),
        cost: 0.50
    });

    const { error: callsError } = await supabase
        .from('calls')
        .insert(calls);

    if (callsError) {
        console.error('Error creating calls:', callsError);
    } else {
        console.log(`Seeded ${calls.length} calls.`);
    }
}

seed();

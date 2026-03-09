import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqwdgntcdmraczlcxilt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2RnbnRjZG1yYWN6bGN4aWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTg0MTYsImV4cCI6MjA4MDc3NDQxNn0.ViGSEEqImSckLHYwOp65jQuiNS8Px__jFNinLiPlkQw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data: calls } = await supabase.from('calls').select('*').order('created_at', { ascending: false }).limit(1);
    
    if (calls && calls.length > 0) {
        console.log("Raw Call Cost:", JSON.stringify(calls[0].raw_data.call_cost, null, 2));
    }
}
check();

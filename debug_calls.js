
import { createClient } from '@supabase/supabase-js';

// Using the same anon key as the frontend
const supabaseUrl = 'https://dqwdgntcdmraczlcxilt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2RnbnRjZG1yYWN6bGN4aWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTg0MTYsImV4cCI6MjA4MDc3NDQxNn0.ViGSEEqImSckLHYwOp65jQuiNS8Px__jFNinLiPlkQw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugCalls() {
    console.log("--- Debugging Calls Access ---");

    // 1. Unfiltered Count
    console.log("1. Fetching total count...");
    const { count, error: countError } = await supabase
        .from('calls')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("❌ Count Error:", countError);
    } else {
        console.log("✅ Total Calls Count:", count);
    }

    // 2. Fetch Data (last 30 days to be safe)
    console.log("2. Fetching recent calls data...");
    const { data, error: dataError } = await supabase
        .from('calls')
        .select('id, started_at, cost, status')
        .limit(5);

    if (dataError) {
        console.error("❌ Data Fetch Error:", dataError);
    } else {
        console.log(`✅ Fetched ${data?.length} rows.`);
        if (data?.length > 0) {
            console.log("Sample Row:", data[0]);
        } else {
            console.log("No rows returned. (Table might be empty or RLS is hiding them)");
        }
    }
}

debugCalls();

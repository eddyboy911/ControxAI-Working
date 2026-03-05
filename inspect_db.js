
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqwdgntcdmraczlcxilt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2RnbnRjZG1yYWN6bGN4aWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTg0MTYsImV4cCI6MjA4MDc3NDQxNn0.ViGSEEqImSckLHYwOp65jQuiNS8Px__jFNinLiPlkQw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumn(col) {
    const { error } = await supabase.from('calls').select(col).limit(1);
    if (error) {
        console.log(`Column '${col}' does NOT exist (or other error: ${error.message})`);
    } else {
        console.log(`Column '${col}' EXISTS.`);
    }
}

async function main() {
    await checkColumn('created_at');
    await checkColumn('start_time');
    await checkColumn('cost');
    await checkColumn('price');
    await checkColumn('direction');
    await checkColumn('status');
}

main();

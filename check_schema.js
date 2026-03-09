import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqwdgntcdmraczlcxilt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2RnbnRjZG1yYWN6bGN4aWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTg0MTYsImV4cCI6MjA4MDc3NDQxNn0.ViGSEEqImSckLHYwOp65jQuiNS8Px__jFNinLiPlkQw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Inserting bad data to find schema...');
    
    // Will fail and tell us what columns exist (or just that BAD_COLUMN doesn't exist)
    const { data, error } = await supabase.from('retell_credentials').insert([{ BAD_COLUMN: 'test' }]);
    
    if (error) {
        console.log(error);
    } else {
        console.log("Success!?", data);
    }
}

check();

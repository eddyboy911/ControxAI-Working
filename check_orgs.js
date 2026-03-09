import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqwdgntcdmraczlcxilt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxd2RnbnRjZG1yYWN6bGN4aWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxOTg0MTYsImV4cCI6MjA4MDc3NDQxNn0.ViGSEEqImSckLHYwOp65jQuiNS8Px__jFNinLiPlkQw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Testing retell_credentials...')
    const { data: d1, error: e1 } = await supabase.from('retell_credentials').select('*').limit(5);
    if(e1) console.log(e1.message)
    else console.log(d1);
    
    console.log('Testing retail_credentials...')
    const { data: d2, error: e2 } = await supabase.from('retail_credentials').select('*').limit(5);
    if(e2) console.log(e2.message)
    else console.log(d2);

    console.log('Testing api_keys...')
    const { data: d3, error: e3 } = await supabase.from('api_keys').select('*').limit(5);
    if(e3) console.log(e3.message)
    else console.log(d3);
    
    console.log('Testing settings...')
    const { data: d4, error: e4 } = await supabase.from('settings').select('*').limit(5);
    if(e4) console.log(e4.message)
    else console.log(d4);
}

check();

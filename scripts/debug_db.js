import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') }); // Adjusted path to root

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log("URL:", supabaseUrl); // Debug
console.log("Key:", supabaseKey ? "Found" : "Missing");

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('--- Verifying Calls Table Access ---');

    // 1. Check if we can read any calls (as anon, likely blocked by RLS but checking error)
    const { data, error } = await supabase.from('calls').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Error accessing calls table:', error);
    } else {
        console.log(`Verified 'calls' table exists. Total accessible rows (anon): ${data?.length || 0} (Count: ${data})`);
    }

    // 2. Try to insert a dummy call to see if it allows (testing RLS)
    // Skipped to avoid pollution

    // 3. Attempt to List Columns by selecting * limit 1
    const { data: sample, error: sampleError } = await supabase.from('calls').select('*').limit(1);

    if (sampleError) {
        console.error('Error fetching sample row:', sampleError);
    } else if (sample && sample.length > 0) {
        console.log('Sample Row Columns:', Object.keys(sample[0]));
        console.log('Sample Row:', sample[0]);
    } else {
        console.log('No rows returned. (Table might be empty or RLS is hiding them)');
    }
}

verify();

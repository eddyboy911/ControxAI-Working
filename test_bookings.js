import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    console.log("Fetching bookings...");
    const { data, error } = await supabase.from('bookings').select('*').limit(3);
    if (error) console.error(error);
    else console.log(data);
}
check();

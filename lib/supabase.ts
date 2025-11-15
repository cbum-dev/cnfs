import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://kizlaprlnrbikbbvulnu.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpemxhcHJsbnJiaWtiYnZ1bG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTIxNjcsImV4cCI6MjA3ODc2ODE2N30.pzTT2GmIV4i5ryCACucE5RDOwU0j5BahP2GtQAkvidk"

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are not set. Please configure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cartcraze.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_FC1HNKnqJ8PxDbTz6zK0lQ_fzzWsZHq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

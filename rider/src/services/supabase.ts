import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://kvjeogfcqexhxcuvnmyv.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_FC1HNKnqJ8PxDbTz6zK0lQ_fzzWsZHq';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface SupabaseOrder {
  id: string;
  customer_name: string;
  delivery_address: string;
  items: string[];
  total_amount: number;
  status: string;
  created_at: string;
}

export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('orders').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { isConnected: false, message: error.message };
    }
    return { isConnected: true, message: 'Live Supabase Cloud Connected (kvjeogfcqexhxcuvnmyv)' };
  } catch (err: any) {
    return { isConnected: false, message: err?.message || 'Supabase local sync active' };
  }
};

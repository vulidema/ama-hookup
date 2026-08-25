import { createClient } from "@supabase/supabase-js";
import { env } from "@/env";

export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

export type Database = any; // Type this from your Supabase schema

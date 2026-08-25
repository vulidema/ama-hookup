export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  appUrl: import.meta.env.VITE_APP_URL || "http://localhost:3000",
  adminEmail: import.meta.env.VITE_ADMIN_EMAIL,
  yocoPublicKey: import.meta.env.VITE_YOCO_PUBLIC_KEY,
} as const;

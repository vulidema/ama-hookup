import { supabase } from "@/lib/supabase";

export const authService = {
  async signUpWithEmail(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  },

  async signInWithEmail(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signInWithGoogle() {
    return await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  async resetPassword(email: string) {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
  },

  async updatePassword(newPassword: string) {
    return await supabase.auth.updateUser({ password: newPassword });
  },

  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  async onAuthStateChange(callback: (user: any) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
    return data.subscription;
  },
};

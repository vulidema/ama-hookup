import { supabase } from "@/lib/supabase";

export const creditService = {
  async getMyCreditBalance() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .select("credit_balance, credits_expire_at")
      .eq("id", user.id)
      .single();
    if (error) throw error;
    return data as { credit_balance: number; credits_expire_at: string | null };
  },

  async getCreditTransactions(limit: number = 50) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data as any[];
  },

  async getActiveCredits() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("profiles")
      .select("credit_balance, credits_expire_at")
      .eq("id", user.id)
      .single();
    if (error) throw error;

    const { credit_balance, credits_expire_at } = data;
    const isExpired =
      credits_expire_at && new Date(credits_expire_at) < new Date();

    return {
      activeCredits: isExpired ? 0 : credit_balance,
      expireDate: credits_expire_at,
      isExpired,
    };
  },
};

export const reportService = {
  async reportUser(
    reportedId: string,
    reason: "harassment" | "inappropriate" | "scam" | "other",
    details?: string
  ) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase.rpc("report_user", {
      _reported_id: reportedId,
      _reason: reason,
      _details: details,
    });
    if (error) throw error;
    return data as string;
  },

  async getMyReports() {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("reporter_id", user.id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as any[];
  },
};

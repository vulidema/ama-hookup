import { supabase } from "@/lib/supabase";
import type { Profile, ChatRequest, Message, Wave, Rating } from "@/types";

export const profileService = {
  async getMyProfile() {
    const { data, error } = await supabase
      .rpc("get_my_profile");
    if (error) throw error;
    return data?.[0] as Profile | null;
  },

  async updateMyProfile(updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", (await supabase.auth.getUser()).data.user?.id)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  },

  async getProfileById(id: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Profile;
  },

  async updateLocation(lat: number, lng: number) {
    const { error } = await supabase.rpc("update_my_location", {
      _lat: lat,
      _lng: lng,
    });
    if (error) throw error;
  },

  async touchLastSeen() {
    const { error } = await supabase.rpc("touch_last_seen");
    if (error) throw error;
  },

  async switchRole(role: "member" | "host") {
    const { error } = await supabase.rpc("switch_my_role", {
      _new_role: role,
    });
    if (error) throw error;
  },

  async setOnlineStatus(isOnline: boolean) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ is_online: isOnline })
      .eq("id", (await supabase.auth.getUser()).data.user?.id)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  },

  async setStatusMessage(message: string | null) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ status_message: message })
      .eq("id", (await supabase.auth.getUser()).data.user?.id)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  },

  async uploadAvatar(file: File) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const fileName = `${userId}-${Date.now()}`;
    
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    await this.updateMyProfile({ avatar_url: data.publicUrl });
    return data.publicUrl;
  },
};

export const discoverService = {
  async getActiveHostsFeed(lat: number, lng: number, radiusKm: number = 50) {
    const { data, error } = await supabase.rpc("get_active_hosts_feed", {
      _member_lat: lat,
      _member_lng: lng,
      _radius_km: radiusKm,
    });
    if (error) throw error;
    return data as Profile[];
  },

  async sendChatRequest(hostId: string, introText: string) {
    const { data, error } = await supabase.rpc("send_chat_request", {
      _host_id: hostId,
      _intro_text: introText,
    });
    if (error) throw error;
    return data as string;
  },

  async respondToChatRequest(requestId: string, action: "accept" | "decline") {
    const { data, error } = await supabase.rpc("host_responds_to_request", {
      _request_id: requestId,
      _action: action,
    });
    if (error) throw error;
    return data as string | null;
  },

  async getMyChatRequests() {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data, error } = await supabase
      .from("chat_requests")
      .select("*")
      .or(`member_id.eq.${userId},host_id.eq.${userId}`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as ChatRequest[];
  },

  async getChatRequestById(id: string) {
    const { data, error } = await supabase
      .from("chat_requests")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as ChatRequest;
  },

  async sendWave(receiverId: string, emoji: "👋" | "🔥") {
    const { data, error } = await supabase
      .from("waves")
      .insert({ receiver_id: receiverId, emoji })
      .select()
      .single();
    if (error) throw error;
    return data as Wave;
  },

  async getMyWaves() {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data, error } = await supabase
      .from("waves")
      .select("*")
      .eq("receiver_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Wave[];
  },
};

export const conversationService = {
  async getMyConversations() {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .or(`member_id.eq.${userId},host_id.eq.${userId}`)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data as any[];
  },

  async getConversationById(id: string) {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as any;
  },

  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data as Message[];
  },

  async sendMessage(conversationId: string, body: string) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data, error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: userId, body })
      .select()
      .single();
    if (error) throw error;
    return data as Message;
  },

  async markAsRead(messageId: string) {
    const { data, error } = await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("id", messageId)
      .select()
      .single();
    if (error) throw error;
    return data as Message;
  },

  async rateUser(ratedId: string, conversationId: string, rating: number) {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const { data, error } = await supabase
      .from("ratings")
      .insert({
        rater_id: userId,
        ratee_id: ratedId,
        conversation_id: conversationId,
        rating,
      })
      .select()
      .single();
    if (error) throw error;
    return data as Rating;
  },
};

export const reportService = {
  async reportUser(reportedId: string, reason: string, details?: string) {
    const { data, error } = await supabase.rpc("report_user", {
      _reported_id: reportedId,
      _reason: reason,
      _details: details,
    });
    if (error) throw error;
    return data as string;
  },
};

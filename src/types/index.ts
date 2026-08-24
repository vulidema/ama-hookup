export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Profile = {
  id: string;
  display_name: string;
  bio: string;
  age: number;
  gender: "male" | "female" | "other";
  role: "member" | "host" | "admin";
  avatar_url: string | null;
  lat: number | null;
  lng: number | null;
  location_label: string | null;
  onboarded: boolean;
  is_online: boolean;
  status_message: string | null;
  status_updated_at: string | null;
  last_seen_at: string | null;
  credit_balance: number;
  credits_expire_at: string | null;
  avg_rating: number;
  rating_count: number;
  is_blocked: boolean;
  created_at: string;
  updated_at: string;
};

export type ChatRequest = {
  id: string;
  member_id: string;
  host_id: string;
  intro_text: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  member_id: string;
  host_id: string;
  request_id: string;
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type Wave = {
  id: string;
  sender_id: string;
  receiver_id: string;
  emoji: "👋" | "🔥";
  created_at: string;
};

export type Rating = {
  id: string;
  rater_id: string;
  ratee_id: string;
  conversation_id: string;
  rating: number;
  created_at: string;
};

export type CreditTransaction = {
  id: string;
  user_id: string;
  delta: number;
  reason: string;
  created_at: string;
};

export type Report = {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  details: string | null;
  status: "open" | "reviewed" | "resolved";
  created_at: string;
  updated_at: string;
};

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE app_role AS ENUM ('member', 'host', 'admin');
CREATE TYPE chat_request_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE report_status AS ENUM ('open', 'reviewed', 'resolved');
CREATE TYPE payment_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  age INTEGER CHECK (age >= 18),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  avatar_url TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  location_label TEXT,
  onboarded BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  status_message TEXT,
  status_updated_at TIMESTAMP,
  last_seen_at TIMESTAMP DEFAULT NOW(),
  credit_balance INTEGER DEFAULT 0,
  credits_expire_at TIMESTAMP,
  avg_rating DECIMAL(3, 2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_blocked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User roles table
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_role app_role NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, app_role)
);

-- Chat requests table
CREATE TABLE chat_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  intro_text TEXT NOT NULL,
  status chat_request_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  request_id UUID REFERENCES chat_requests(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Waves table (free interactions)
CREATE TABLE waves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emoji TEXT CHECK (emoji IN ('👋', '🔥')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rater_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ratee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Credit transactions table
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Credit requests table (manual top-up)
CREATE TABLE credit_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status payment_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Credit purchases table
CREATE TABLE credit_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  status payment_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment orders table
CREATE TABLE payment_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  credits INTEGER NOT NULL,
  price_cents INTEGER NOT NULL,
  order_code TEXT UNIQUE NOT NULL,
  yoco_link TEXT,
  status payment_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status report_status DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Check-ins table (safety feature)
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP NOT NULL,
  confirmed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_is_online ON profiles(is_online);
CREATE INDEX idx_profiles_is_blocked ON profiles(is_blocked);
CREATE INDEX idx_profiles_location ON profiles(lat, lng);
CREATE INDEX idx_chat_requests_member ON chat_requests(member_id);
CREATE INDEX idx_chat_requests_host ON chat_requests(host_id);
CREATE INDEX idx_conversations_member ON conversations(member_id);
CREATE INDEX idx_conversations_host ON conversations(host_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_waves_sender ON waves(sender_id);
CREATE INDEX idx_waves_receiver ON waves(receiver_id);
CREATE INDEX idx_ratings_ratee ON ratings(ratee_id);
CREATE INDEX idx_reports_reported ON reports(reported_id);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE waves ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for chat_requests
CREATE POLICY "Members can read own requests" ON chat_requests FOR SELECT USING (
  auth.uid() = member_id OR auth.uid() = host_id
);
CREATE POLICY "Members can create requests" ON chat_requests FOR INSERT WITH CHECK (
  auth.uid() = member_id
);

-- RLS Policies for conversations
CREATE POLICY "Participants can read conversation" ON conversations FOR SELECT USING (
  auth.uid() = member_id OR auth.uid() = host_id
);
CREATE POLICY "System can create conversations" ON conversations FOR INSERT WITH CHECK (true);

-- RLS Policies for messages
CREATE POLICY "Participants can read messages" ON messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.member_id = auth.uid() OR conversations.host_id = auth.uid())
  )
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND (conversations.member_id = auth.uid() OR conversations.host_id = auth.uid())
  )
);

-- RLS Policies for waves
CREATE POLICY "Users can read waves sent to them" ON waves FOR SELECT USING (
  auth.uid() = receiver_id OR auth.uid() = sender_id
);
CREATE POLICY "Users can send waves" ON waves FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- RLS Policies for ratings
CREATE POLICY "Users can read ratings" ON ratings FOR SELECT USING (
  auth.uid() = rater_id OR auth.uid() = ratee_id
);
CREATE POLICY "Users can create ratings" ON ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- RLS Policies for credit_transactions
CREATE POLICY "Users can read own transactions" ON credit_transactions FOR SELECT USING (
  auth.uid() = user_id
);

-- RLS Policies for payment_orders
CREATE POLICY "Users can read own orders" ON payment_orders FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Users can create orders" ON payment_orders FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- RLS Policies for reports
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Admin can read all reports" ON reports FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.app_role = 'admin'
  )
);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON chat_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON messages TO authenticated;
GRANT SELECT, INSERT ON waves TO authenticated;
GRANT SELECT, INSERT ON ratings TO authenticated;
GRANT SELECT, INSERT ON credit_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON credit_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON credit_purchases TO authenticated;
GRANT SELECT, INSERT, UPDATE ON payment_orders TO authenticated;
GRANT SELECT, INSERT ON reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON check_ins TO authenticated;

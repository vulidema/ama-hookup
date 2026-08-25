-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION tg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update status_updated_at
CREATE OR REPLACE FUNCTION tg_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status_message IS DISTINCT FROM OLD.status_message OR
     NEW.is_online IS DISTINCT FROM OLD.is_online THEN
    NEW.status_updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to require location when setting online status
CREATE OR REPLACE FUNCTION tg_require_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_online = TRUE AND (NEW.lat IS NULL OR NEW.lng IS NULL) THEN
    RAISE EXCEPTION 'Cannot go online without a location';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to update average rating
CREATE OR REPLACE FUNCTION tg_update_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    avg_rating = (
      SELECT COALESCE(AVG(rating), 0)::DECIMAL(3, 2)
      FROM ratings
      WHERE ratee_id = NEW.ratee_id
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM ratings
      WHERE ratee_id = NEW.ratee_id
    )
  WHERE id = NEW.ratee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER tg_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER tg_profiles_status_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION tg_status_updated_at();

CREATE TRIGGER tg_profiles_require_location
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION tg_require_location();

CREATE TRIGGER tg_chat_requests_updated_at
BEFORE UPDATE ON chat_requests
FOR EACH ROW
EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER tg_conversations_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER tg_ratings_update_avg
AFTER INSERT ON ratings
FOR EACH ROW
EXECUTE FUNCTION tg_update_avg_rating();

CREATE TRIGGER tg_credit_requests_updated_at
BEFORE UPDATE ON credit_requests
FOR EACH ROW
EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER tg_credit_purchases_updated_at
BEFORE UPDATE ON credit_purchases
FOR EACH ROW
EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER tg_payment_orders_updated_at
BEFORE UPDATE ON payment_orders
FOR EACH ROW
EXECUTE FUNCTION tg_set_updated_at();

CREATE TRIGGER tg_reports_updated_at
BEFORE UPDATE ON reports
FOR EACH ROW
EXECUTE FUNCTION tg_set_updated_at();

-- Database functions (SECURITY DEFINER)

-- Handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, onboarded)
  VALUES (new.id, new.email, false);
  
  INSERT INTO public.user_roles (user_id, app_role)
  VALUES (new.id, 'member');
  
  -- Grant signup bonus: 500 credits valid until Dec 31
  INSERT INTO public.credit_transactions (user_id, delta, reason)
  VALUES (new.id, 500, 'Signup bonus');
  
  UPDATE public.profiles
  SET credit_balance = 500,
      credits_expire_at = '2026-12-31'::TIMESTAMP
  WHERE id = new.id;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- Get current user's profile
CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  bio TEXT,
  age INTEGER,
  gender TEXT,
  role app_role,
  avatar_url TEXT,
  lat DECIMAL,
  lng DECIMAL,
  location_label TEXT,
  onboarded BOOLEAN,
  is_online BOOLEAN,
  status_message TEXT,
  credit_balance INTEGER,
  credits_expire_at TIMESTAMP,
  avg_rating DECIMAL,
  rating_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.display_name,
    p.bio,
    p.age,
    p.gender,
    ur.app_role,
    p.avatar_url,
    p.lat,
    p.lng,
    p.location_label,
    p.onboarded,
    p.is_online,
    p.status_message,
    p.credit_balance,
    p.credits_expire_at,
    p.avg_rating,
    p.rating_count
  FROM profiles p
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  WHERE p.id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Get profile names by IDs (resolve UUIDs to display names)
CREATE OR REPLACE FUNCTION get_profile_names(_ids UUID[])
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.display_name, p.avatar_url
  FROM profiles p
  WHERE p.id = ANY(_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Get active hosts feed (haversine distance calculation)
CREATE OR REPLACE FUNCTION get_active_hosts_feed(_member_lat DECIMAL, _member_lng DECIMAL, _radius_km INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  age INTEGER,
  gender TEXT,
  avatar_url TEXT,
  distance_km DECIMAL,
  avg_rating DECIMAL,
  status_message TEXT,
  is_online BOOLEAN,
  lat DECIMAL,
  lng DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.display_name,
    p.age,
    p.gender,
    p.avatar_url,
    (
      6371 * ACOS(
        COS(RADIANS(90 - _member_lat)) * COS(RADIANS(90 - p.lat)) +
        SIN(RADIANS(90 - _member_lat)) * SIN(RADIANS(90 - p.lat)) *
        COS(RADIANS(p.lng - _member_lng))
      )
    )::DECIMAL AS distance_km,
    p.avg_rating,
    p.status_message,
    p.is_online,
    p.lat,
    p.lng
  FROM profiles p
  LEFT JOIN user_roles ur ON p.id = ur.user_id
  WHERE ur.app_role = 'host'
    AND p.is_online = TRUE
    AND p.is_blocked = FALSE
    AND p.id != auth.uid()
    AND p.lat IS NOT NULL
    AND p.lng IS NOT NULL
    AND 6371 * ACOS(
      COS(RADIANS(90 - _member_lat)) * COS(RADIANS(90 - p.lat)) +
      SIN(RADIANS(90 - _member_lat)) * SIN(RADIANS(90 - p.lat)) *
      COS(RADIANS(p.lng - _member_lng))
    ) <= _radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Update user location
CREATE OR REPLACE FUNCTION update_my_location(_lat DECIMAL, _lng DECIMAL)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET lat = _lat, lng = _lng
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Touch last seen timestamp
CREATE OR REPLACE FUNCTION touch_last_seen()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET last_seen_at = NOW()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Switch user role
CREATE OR REPLACE FUNCTION switch_my_role(_new_role app_role)
RETURNS void AS $$
BEGIN
  DELETE FROM user_roles WHERE user_id = auth.uid();
  INSERT INTO user_roles (user_id, app_role) VALUES (auth.uid(), _new_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Send chat request (debits credits)
CREATE OR REPLACE FUNCTION send_chat_request(_host_id UUID, _intro_text TEXT)
RETURNS UUID AS $$
DECLARE
  _current_user UUID := auth.uid();
  _my_credits INTEGER;
  _request_id UUID;
BEGIN
  -- Check credit balance (ignore expired credits)
  SELECT COALESCE(credit_balance, 0) INTO _my_credits FROM profiles WHERE id = _current_user;
  
  IF _my_credits < 1 THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  -- Debit credits
  UPDATE profiles
  SET credit_balance = credit_balance - 1
  WHERE id = _current_user;
  
  -- Log transaction
  INSERT INTO credit_transactions (user_id, delta, reason)
  VALUES (_current_user, -1, 'Chat request to ' || _host_id::TEXT);
  
  -- Create chat request
  INSERT INTO chat_requests (member_id, host_id, intro_text, status)
  VALUES (_current_user, _host_id, _intro_text, 'pending')
  RETURNING id INTO _request_id;
  
  RETURN _request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Host responds to request
CREATE OR REPLACE FUNCTION host_responds_to_request(_request_id UUID, _action TEXT)
RETURNS UUID AS $$
DECLARE
  _member_id UUID;
  _host_id UUID;
  _conversation_id UUID;
BEGIN
  SELECT member_id, host_id INTO _member_id, _host_id
  FROM chat_requests
  WHERE id = _request_id;
  
  IF _action = 'accept' THEN
    UPDATE chat_requests SET status = 'accepted' WHERE id = _request_id;
    
    INSERT INTO conversations (member_id, host_id, request_id)
    VALUES (_member_id, _host_id, _request_id)
    RETURNING id INTO _conversation_id;
    
    RETURN _conversation_id;
  ELSIF _action = 'decline' THEN
    UPDATE chat_requests SET status = 'declined' WHERE id = _request_id;
    
    -- Refund credit
    UPDATE profiles SET credit_balance = credit_balance + 1 WHERE id = _member_id;
    INSERT INTO credit_transactions (user_id, delta, reason)
    VALUES (_member_id, 1, 'Request declined refund');
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Report a user
CREATE OR REPLACE FUNCTION report_user(_reported_id UUID, _reason TEXT, _details TEXT DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
  _report_id UUID;
  _report_count INTEGER;
BEGIN
  INSERT INTO reports (reporter_id, reported_id, reason, details)
  VALUES (auth.uid(), _reported_id, _reason, _details)
  RETURNING id INTO _report_id;
  
  -- Auto-block if 3+ reports
  SELECT COUNT(*) INTO _report_count FROM reports WHERE reported_id = _reported_id;
  
  IF _report_count >= 3 THEN
    UPDATE profiles SET is_blocked = TRUE WHERE id = _reported_id;
  END IF;
  
  RETURN _report_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Admin: grant credits
CREATE OR REPLACE FUNCTION admin_grant_credits(_user_id UUID, _amount INTEGER, _reason TEXT)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND app_role = 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  UPDATE profiles SET credit_balance = credit_balance + _amount WHERE id = _user_id;
  INSERT INTO credit_transactions (user_id, delta, reason) VALUES (_user_id, _amount, _reason);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Admin: set user blocked status
CREATE OR REPLACE FUNCTION admin_set_blocked(_user_id UUID, _blocked BOOLEAN)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND app_role = 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;
  
  UPDATE profiles SET is_blocked = _blocked WHERE id = _user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

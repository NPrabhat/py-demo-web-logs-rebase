-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due')),
  monthly_usage INT NOT NULL DEFAULT 0,
  usage_reset_date TIMESTAMPTZ NOT NULL DEFAULT DATE_TRUNC('month', NOW() + INTERVAL '1 month'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Repurpose history table
CREATE TABLE repurpose_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  original_content TEXT NOT NULL,
  content_title TEXT,
  formats_generated INT NOT NULL DEFAULT 0,
  ai_model_used TEXT,
  generation_time_ms INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Repurpose outputs table
CREATE TABLE repurpose_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  history_id UUID NOT NULL REFERENCES repurpose_history(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  format TEXT NOT NULL CHECK (format IN ('twitter', 'linkedin', 'instagram', 'email', 'reddit', 'takeaways')),
  label TEXT NOT NULL,
  emoji TEXT NOT NULL,
  content TEXT NOT NULL,
  model_used TEXT,
  tokens_used INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX idx_repurpose_history_user_id ON repurpose_history(user_id);
CREATE INDEX idx_repurpose_history_created_at ON repurpose_history(created_at DESC);
CREATE INDEX idx_repurpose_outputs_history_id ON repurpose_outputs(history_id);
CREATE INDEX idx_repurpose_outputs_user_id ON repurpose_outputs(user_id);
CREATE INDEX idx_repurpose_outputs_format ON repurpose_outputs(format);
CREATE INDEX idx_repurpose_outputs_created_at ON repurpose_outputs(created_at DESC);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE repurpose_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE repurpose_outputs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- Repurpose history policies
CREATE POLICY "Users can view own history" ON repurpose_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own history" ON repurpose_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own history" ON repurpose_history
  FOR DELETE USING (auth.uid() = user_id);

-- Repurpose outputs policies
CREATE POLICY "Users can view own outputs" ON repurpose_outputs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own outputs" ON repurpose_outputs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own outputs" ON repurpose_outputs
  FOR DELETE USING (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to reset monthly usage
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET monthly_usage = 0,
      usage_reset_date = DATE_TRUNC('month', usage_reset_date + INTERVAL '1 month')
  WHERE usage_reset_date <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule to run reset function (optional - can be called manually or via cron)
-- SELECT reset_monthly_usage();

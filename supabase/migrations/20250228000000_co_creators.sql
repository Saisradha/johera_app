-- Co-creators feature: designs + subscriptions

-- 1. User subscriptions (required to access Co-creators page)
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'monthly',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  starts_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- 2. Co-creator designs (sketch or upload)
CREATE TABLE IF NOT EXISTS co_creator_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text,
  image_url text NOT NULL,
  source text NOT NULL CHECK (source IN ('sketch', 'upload')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_creator_designs ENABLE ROW LEVEL SECURITY;

-- User can read own subscription
CREATE POLICY "Users can read own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- User can read own designs + approved designs (for store)
CREATE POLICY "Users can read own designs" ON co_creator_designs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read approved designs" ON co_creator_designs
  FOR SELECT USING (status = 'approved');

-- User can insert own designs
CREATE POLICY "Users can insert own designs" ON co_creator_designs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Create storage bucket "co-creator-designs" in Supabase Dashboard > Storage
--    - Create new bucket: id = "co-creator-designs"
--    - Make it Public
--    - Policy: Allow authenticated users to INSERT, allow public SELECT

-- 5. Grant yourself a test subscription (replace USER_UUID with your auth.users id):
--    INSERT INTO user_subscriptions (user_id, plan, status, expires_at)
--    VALUES ('USER_UUID', 'monthly', 'active', now() + interval '1 year');

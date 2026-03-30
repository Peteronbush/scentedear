-- ============================================================
-- Scentedeer — profiles table
-- Links to Supabase auth.users (1:1)
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id            UUID          PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT          NOT NULL UNIQUE,
  nickname      VARCHAR(12)   NOT NULL,
  birth_date    CHAR(6),                        -- yymmdd  e.g. '950101'
  gender        TEXT          CHECK (gender IN ('male', 'female')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ── updated_at auto-trigger ──────────────────────────────────
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at();

-- ── RLS ─────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and write only their own row
CREATE POLICY "profiles: select own"  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles: insert own"  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles: update own"  ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles: delete own"  ON profiles FOR DELETE USING (auth.uid() = id);

-- Service role can do anything (for admin / seed)
CREATE POLICY "profiles: service_role all"
  ON profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── Auto-create profile row on new sign-up ───────────────────
-- Triggered from auth.users insert; email is copied in.
-- nickname / birth_date / gender are filled in during onboarding.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

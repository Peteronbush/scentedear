-- ============================================================
-- Scentedeer — user_fragrances + preferences
-- ============================================================

-- ── 1. user_fragrances (보유 향수 컬렉션) ──────────────────────
CREATE TABLE IF NOT EXISTS user_fragrances (
  id              BIGSERIAL     PRIMARY KEY,
  user_id         UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fragrance_id    TEXT          NOT NULL,   -- matches FRAGRANCES_DB id
  fragrance_name  TEXT          NOT NULL,
  fragrance_house TEXT          NOT NULL,
  is_favorite     BOOLEAN       NOT NULL DEFAULT false,
  added_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),

  UNIQUE (user_id, fragrance_id)            -- no duplicates per user
);

CREATE INDEX idx_user_fragrances_user ON user_fragrances(user_id);

-- RLS
ALTER TABLE user_fragrances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_fragrances: select own"
  ON user_fragrances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_fragrances: insert own"
  ON user_fragrances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_fragrances: update own"
  ON user_fragrances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_fragrances: delete own"
  ON user_fragrances FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "user_fragrances: service_role all"
  ON user_fragrances FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ── 2. 온보딩 preferences → profiles 컬럼 추가 ──────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS favorite_houses      TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS disliked_categories  TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS priorities           TEXT[]  DEFAULT '{}';

-- ============================================================
-- Scentedeer — community tables
-- houses · reviews · house_reviews · posts · post_likes
-- ============================================================

-- ── 1. houses ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS houses (
  id            BIGSERIAL     PRIMARY KEY,
  name          TEXT          NOT NULL UNIQUE,
  origin        TEXT,                          -- country / city
  founded_year  SMALLINT,
  description_ko TEXT,
  tier          TEXT          CHECK (tier IN ('Niche', 'Designer', 'Indie', 'Ultra Niche')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "houses: public read"  ON houses FOR SELECT USING (true);
CREATE POLICY "houses: service_role" ON houses FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ── 2. fragrance reviews ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id              BIGSERIAL     PRIMARY KEY,
  user_id         UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fragrance_id    TEXT          NOT NULL,      -- matches FRAGRANCES_DB id
  fragrance_name  TEXT          NOT NULL,
  fragrance_house TEXT          NOT NULL,
  rating          SMALLINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text     TEXT,
  occasion        TEXT,
  season          TEXT,
  longevity_score SMALLINT      CHECK (longevity_score BETWEEN 1 AND 10),
  projection_score SMALLINT     CHECK (projection_score BETWEEN 1 AND 10),
  show_in_collection BOOLEAN    NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),

  UNIQUE (user_id, fragrance_id)               -- one review per fragrance per user
);

CREATE INDEX idx_reviews_fragrance ON reviews(fragrance_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews: public read"   ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews: insert own"    ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews: update own"    ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "reviews: delete own"    ON reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "reviews: service_role"  ON reviews FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ── 3. house reviews ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS house_reviews (
  id            BIGSERIAL     PRIMARY KEY,
  user_id       UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  house_name    TEXT          NOT NULL,
  rating        SMALLINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text   TEXT,
  show_in_collection BOOLEAN  NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),

  UNIQUE (user_id, house_name)
);

ALTER TABLE house_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "house_reviews: public read"  ON house_reviews FOR SELECT USING (true);
CREATE POLICY "house_reviews: insert own"   ON house_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "house_reviews: update own"   ON house_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "house_reviews: delete own"   ON house_reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "house_reviews: service_role" ON house_reviews FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ── 4. board posts (게시판) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id            BIGSERIAL     PRIMARY KEY,
  user_id       UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category      TEXT          NOT NULL CHECK (category IN ('추천', '리뷰', '질문', '정보', '잡담')),
  title         TEXT          NOT NULL,
  body          TEXT          NOT NULL,
  fragrance_id  TEXT,                          -- optional fragrance tag
  house_name    TEXT,                          -- optional house tag
  likes_count   INTEGER       NOT NULL DEFAULT 0,
  comments_count INTEGER      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts: public read"   ON posts FOR SELECT USING (true);
CREATE POLICY "posts: insert own"    ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts: update own"    ON posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "posts: delete own"    ON posts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "posts: service_role"  ON posts FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ── 5. post likes ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_likes (
  post_id   BIGINT  NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id   UUID    NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "post_likes: public read"  ON post_likes FOR SELECT USING (true);
CREATE POLICY "post_likes: insert own"   ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "post_likes: delete own"   ON post_likes FOR DELETE USING (auth.uid() = user_id);


-- ── 6. journal_entries (착용 일지) ─────────────────────────────
CREATE TABLE IF NOT EXISTS journal_entries (
  id              BIGSERIAL     PRIMARY KEY,
  user_id         UUID          NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fragrance_id    TEXT          NOT NULL,
  fragrance_name  TEXT          NOT NULL,
  note            TEXT,
  occasion        TEXT,
  mood            TEXT,
  show_in_collection BOOLEAN    NOT NULL DEFAULT false,
  worn_at         DATE          NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_journal_user ON journal_entries(user_id);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "journal: select own"   ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "journal: insert own"   ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "journal: update own"   ON journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "journal: delete own"   ON journal_entries FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "journal: service_role" ON journal_entries FOR ALL TO service_role USING (true) WITH CHECK (true);

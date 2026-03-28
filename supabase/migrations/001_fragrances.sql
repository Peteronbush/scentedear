-- Scentedeer fragrance table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS fragrances (
  id              INTEGER PRIMARY KEY,
  name            TEXT        NOT NULL,
  house           TEXT        NOT NULL,
  concentration   TEXT,                          -- EDP, EDT, Extrait de Parfum, EDC, Parfum
  gender          TEXT,                          -- Male, Female, Unisex
  family          TEXT,                          -- e.g. "Woody Spicy"
  top_notes       TEXT[]      DEFAULT '{}',
  middle_notes    TEXT[]      DEFAULT '{}',
  base_notes      TEXT[]      DEFAULT '{}',
  year            SMALLINT,
  description_ko  TEXT,
  longevity_avg   SMALLINT    CHECK (longevity_avg  BETWEEN 1 AND 10),
  projection_avg  SMALLINT    CHECK (projection_avg BETWEEN 1 AND 10),
  rating_avg      NUMERIC(3,1),
  accords         TEXT[]      DEFAULT '{}',
  keywords_ko     TEXT[]      DEFAULT '{}',
  season          TEXT[]      DEFAULT '{}',      -- Spring, Summer, Fall, Winter
  occasion        TEXT[]      DEFAULT '{}',      -- Casual, Office, Date, Evening, Formal
  intensity       SMALLINT    CHECK (intensity  BETWEEN 1 AND 5),
  warmth          SMALLINT    CHECK (warmth     BETWEEN 1 AND 5),
  sweetness       SMALLINT    CHECK (sweetness  BETWEEN 1 AND 5),
  popularity      SMALLINT    CHECK (popularity BETWEEN 1 AND 10),
  price_tier      TEXT,                          -- Mid, Luxury, Ultra
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_fragrances_house     ON fragrances (house);
CREATE INDEX IF NOT EXISTS idx_fragrances_family    ON fragrances (family);
CREATE INDEX IF NOT EXISTS idx_fragrances_gender    ON fragrances (gender);
CREATE INDEX IF NOT EXISTS idx_fragrances_popularity ON fragrances (popularity DESC);
CREATE INDEX IF NOT EXISTS idx_fragrances_season    ON fragrances USING GIN (season);
CREATE INDEX IF NOT EXISTS idx_fragrances_occasion  ON fragrances USING GIN (occasion);
CREATE INDEX IF NOT EXISTS idx_fragrances_accords   ON fragrances USING GIN (accords);

-- Enable Row Level Security (read-only public access)
ALTER TABLE fragrances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access"
  ON fragrances FOR SELECT
  USING (true);

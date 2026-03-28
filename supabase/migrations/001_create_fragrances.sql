-- ============================================================
-- Scentedeer — fragrances table
-- ============================================================

-- pgvector for embedding-based similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- ── Main table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fragrances (
  id              INTEGER       PRIMARY KEY,
  name            TEXT          NOT NULL,
  house           TEXT          NOT NULL,
  concentration   TEXT,                            -- EDP / EDT / Extrait de Parfum / EDC / Parfum
  gender          TEXT,                            -- Male / Female / Unisex
  family          TEXT,                            -- e.g. "Woody Spicy"
  top_notes       TEXT[]        DEFAULT '{}',
  middle_notes    TEXT[]        DEFAULT '{}',
  base_notes      TEXT[]        DEFAULT '{}',
  year            SMALLINT,
  description_ko  TEXT,
  longevity_avg   NUMERIC(3,1)  CHECK (longevity_avg  BETWEEN 1 AND 10),
  projection_avg  NUMERIC(3,1)  CHECK (projection_avg BETWEEN 1 AND 10),
  rating_avg      NUMERIC(3,1),
  accords         TEXT[]        DEFAULT '{}',
  keywords_ko     TEXT[]        DEFAULT '{}',
  season          TEXT[]        DEFAULT '{}',      -- Spring / Summer / Fall / Winter
  occasion        TEXT[]        DEFAULT '{}',      -- Casual / Office / Date / Evening / Formal / Sport
  intensity       SMALLINT      CHECK (intensity  BETWEEN 1 AND 5),
  warmth          SMALLINT      CHECK (warmth     BETWEEN 1 AND 5),
  sweetness       SMALLINT      CHECK (sweetness  BETWEEN 1 AND 5),
  popularity      SMALLINT      CHECK (popularity BETWEEN 1 AND 10),
  price_tier      TEXT,                            -- Budget / Mid / Luxury / Ultra
  embedding       vector(1536),                    -- OpenAI / Claude embedding (nullable)
  created_at      TIMESTAMPTZ   DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_fragrances_house       ON fragrances (house);
CREATE INDEX IF NOT EXISTS idx_fragrances_gender      ON fragrances (gender);
CREATE INDEX IF NOT EXISTS idx_fragrances_family      ON fragrances (family);
CREATE INDEX IF NOT EXISTS idx_fragrances_price_tier  ON fragrances (price_tier);
CREATE INDEX IF NOT EXISTS idx_fragrances_popularity  ON fragrances (popularity DESC);

-- GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_fragrances_season      ON fragrances USING GIN (season);
CREATE INDEX IF NOT EXISTS idx_fragrances_occasion    ON fragrances USING GIN (occasion);
CREATE INDEX IF NOT EXISTS idx_fragrances_accords     ON fragrances USING GIN (accords);
CREATE INDEX IF NOT EXISTS idx_fragrances_top_notes   ON fragrances USING GIN (top_notes);
CREATE INDEX IF NOT EXISTS idx_fragrances_base_notes  ON fragrances USING GIN (base_notes);

-- Vector similarity index (ivfflat — activate after embeddings are populated)
-- CREATE INDEX IF NOT EXISTS idx_fragrances_embedding
--   ON fragrances USING ivfflat (embedding vector_cosine_ops)
--   WITH (lists = 100);

-- ── updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_fragrances_updated_at ON fragrances;
CREATE TRIGGER trg_fragrances_updated_at
  BEFORE UPDATE ON fragrances
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Row Level Security ───────────────────────────────────────
ALTER TABLE fragrances ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can read
CREATE POLICY "Public read"
  ON fragrances FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only service_role can write (seed / admin)
CREATE POLICY "Service write"
  ON fragrances FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

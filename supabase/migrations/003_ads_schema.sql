CREATE TABLE ads (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  image_url     TEXT NOT NULL,
  link_url      TEXT,
  placement     TEXT NOT NULL DEFAULT 'website'
                CHECK (placement IN ('website', 'packaging', 'both')),
  target_page   TEXT DEFAULT 'all',
  impressions   INTEGER DEFAULT 0,
  clicks        INTEGER DEFAULT 0,
  budget        NUMERIC(10,2),
  is_active     BOOLEAN DEFAULT TRUE,
  starts_at     TIMESTAMPTZ DEFAULT NOW(),
  ends_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ads_supplier_idx ON ads(supplier_id);
CREATE INDEX ads_active_idx ON ads(is_active) WHERE is_active = TRUE;

ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "supplier_own_ads" ON ads
  FOR ALL USING (supplier_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "public_read_active_ads" ON ads
  FOR SELECT USING (is_active = TRUE);

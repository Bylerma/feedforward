CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id       UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL CHECK (role IN ('supplier','ngo','volunteer','corporate')),
  name          TEXT NOT NULL,
  org_name      TEXT,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  avatar_url    TEXT,
  location_text TEXT,
  location      GEOGRAPHY(POINT, 4326),
  address       JSONB,
  points        INTEGER DEFAULT 0,
  badges        TEXT[] DEFAULT '{}',
  rank          INTEGER,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX users_location_idx ON users USING GIST(location);

CREATE TABLE listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_type       TEXT NOT NULL,
  food_category   TEXT NOT NULL CHECK (food_category IN ('cooked','raw','packaged','bakery','dairy','produce')),
  quantity        INTEGER NOT NULL,
  quantity_unit   TEXT DEFAULT 'servings',
  description     TEXT,
  pickup_window   TSTZRANGE NOT NULL,
  pickup_location GEOGRAPHY(POINT, 4326),
  pickup_address  TEXT NOT NULL,
  image_url       TEXT,
  status          TEXT DEFAULT 'available'
                  CHECK (status IN ('available','matched','claimed','picked_up','delivered','cancelled','expired')),
  qr_token        TEXT UNIQUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX listings_location_idx ON listings USING GIST(pickup_location);
CREATE INDEX listings_status_idx ON listings(status);
CREATE INDEX listings_supplier_idx ON listings(supplier_id);

CREATE TABLE matches (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id   UUID UNIQUE NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  ngo_id       UUID NOT NULL REFERENCES users(id),
  volunteer_id UUID REFERENCES users(id),
  status       TEXT DEFAULT 'pending'
               CHECK (status IN ('pending','volunteer_assigned','supplier_verified','ngo_verified','completed','failed')),
  claimed_at   TIMESTAMPTZ,
  supplier_scanned_at TIMESTAMPTZ,
  ngo_scanned_at      TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX matches_listing_idx ON matches(listing_id);
CREATE INDEX matches_ngo_idx ON matches(ngo_id);
CREATE INDEX matches_volunteer_idx ON matches(volunteer_id);

CREATE TABLE impact_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id        UUID NOT NULL REFERENCES matches(id),
  supplier_id     UUID NOT NULL REFERENCES users(id),
  ngo_id          UUID NOT NULL REFERENCES users(id),
  volunteer_id    UUID REFERENCES users(id),
  meals_rescued   INTEGER NOT NULL,
  food_weight_kg  NUMERIC(8,2) NOT NULL,
  carbon_saved_kg NUMERIC(8,2) NOT NULL,
  water_saved_l   NUMERIC(10,2),
  points_awarded  INTEGER DEFAULT 0,
  timestamp       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX impact_logs_supplier_idx ON impact_logs(supplier_id);
CREATE INDEX impact_logs_ngo_idx ON impact_logs(ngo_id);
CREATE INDEX impact_logs_volunteer_idx ON impact_logs(volunteer_id);
CREATE INDEX impact_logs_timestamp_idx ON impact_logs(timestamp);

CREATE TABLE corporate_sponsors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_id    UUID NOT NULL REFERENCES users(id),
  sponsored_runs  UUID[],
  budget_inr      NUMERIC(12,2),
  spent_inr       NUMERIC(12,2) DEFAULT 0,
  csr_goal_meals  INTEGER,
  csr_goal_carbon NUMERIC(8,2),
  report_emails   TEXT[],
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  data        JSONB,
  is_read     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX notifications_user_idx ON notifications(user_id);

CREATE TYPE notification_type AS ENUM (
  'application_received',
  'status_update',
  'message',
  'match_found',
  'system'
);

CREATE TABLE notification_preferences (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email_alerts  BOOLEAN DEFAULT TRUE,
  push_alerts   BOOLEAN DEFAULT TRUE,
  types         notification_type[] DEFAULT ARRAY['application_received','status_update','message','match_found','system']::notification_type[],
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_own_preferences" ON notification_preferences
  FOR ALL USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

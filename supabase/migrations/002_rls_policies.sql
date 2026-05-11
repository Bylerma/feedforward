CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'role',
    NEW.raw_user_meta_data->>'name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "supplier_own_listings" ON listings
  FOR ALL USING (supplier_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "volunteers_read_available" ON listings
  FOR SELECT USING (status = 'available');

CREATE POLICY "ngo_read_matched" ON matches
  FOR SELECT USING (ngo_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "volunteer_read_assigned" ON matches
  FOR SELECT USING (volunteer_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "impact_logs_visibility" ON impact_logs
  FOR SELECT USING (
    supplier_id = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    ngo_id      = (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    volunteer_id = (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "notifications_own" ON notifications
  FOR ALL USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

DROP POLICY IF EXISTS "anyone can log analytics events" ON public.analytics_events;
CREATE POLICY "log own or anonymous analytics events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    user_id IS NULL
    OR user_id = auth.uid()
  );
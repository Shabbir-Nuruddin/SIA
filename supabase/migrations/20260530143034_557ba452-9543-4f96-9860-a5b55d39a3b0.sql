
CREATE POLICY "users insert own onboarding emails"
  ON public.onboarding_emails FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);


-- Drop the overly permissive policy
DROP POLICY "Service role can manage place photos" ON public.place_photos;

-- Only allow inserts/updates via service role (edge functions use service role key)
-- No authenticated user should write directly
CREATE POLICY "No direct user writes to place photos"
  ON public.place_photos FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No direct user updates to place photos"
  ON public.place_photos FOR UPDATE
  USING (false);

CREATE POLICY "No direct user deletes from place photos"
  ON public.place_photos FOR DELETE
  USING (false);

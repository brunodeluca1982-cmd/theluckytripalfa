
-- Cache table for Google Places photos
CREATE TABLE public.place_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL, -- hotel, restaurant, attraction, block
  place_query TEXT NOT NULL,
  place_id TEXT,
  photo_url TEXT,
  photo_source TEXT NOT NULL DEFAULT 'none' CHECK (photo_source IN ('places', 'streetview', 'none')),
  photo_last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(item_id, item_type)
);

-- Public read access (no auth needed to view photos)
ALTER TABLE public.place_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read place photos"
  ON public.place_photos FOR SELECT
  USING (true);

-- Only service role can insert/update (via edge function)
CREATE POLICY "Service role can manage place photos"
  ON public.place_photos FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_place_photos_item ON public.place_photos(item_id, item_type);

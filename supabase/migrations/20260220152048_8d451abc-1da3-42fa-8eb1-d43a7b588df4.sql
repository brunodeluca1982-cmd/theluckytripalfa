
-- Create the update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1) places_cache
CREATE TABLE public.places_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  types TEXT[] DEFAULT '{}',
  address TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  rating NUMERIC(2,1),
  user_ratings_total INTEGER,
  price_level INTEGER,
  website TEXT,
  phone TEXT,
  google_maps_url TEXT,
  photo_refs TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.places_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read places_cache" ON public.places_cache FOR SELECT USING (true);
CREATE POLICY "No direct user writes to places_cache" ON public.places_cache FOR INSERT WITH CHECK (false);
CREATE POLICY "No direct user updates to places_cache" ON public.places_cache FOR UPDATE USING (false);
CREATE POLICY "No direct user deletes from places_cache" ON public.places_cache FOR DELETE USING (false);

CREATE INDEX idx_places_cache_place_id ON public.places_cache (place_id);

-- 2) roteiro_itens
CREATE TABLE public.roteiro_itens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  roteiro_id TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'curated',
  ref_table TEXT,
  place_id TEXT,
  name TEXT NOT NULL,
  address TEXT,
  neighborhood TEXT,
  city TEXT DEFAULT 'Rio de Janeiro',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  day_index INTEGER NOT NULL DEFAULT 1,
  order_in_day INTEGER NOT NULL DEFAULT 0,
  time_slot TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.roteiro_itens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read roteiro_itens" ON public.roteiro_itens FOR SELECT USING (true);
CREATE POLICY "Anyone can insert roteiro_itens" ON public.roteiro_itens FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update roteiro_itens" ON public.roteiro_itens FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete roteiro_itens" ON public.roteiro_itens FOR DELETE USING (true);

CREATE INDEX idx_roteiro_itens_roteiro ON public.roteiro_itens (roteiro_id);
CREATE INDEX idx_roteiro_itens_day ON public.roteiro_itens (roteiro_id, day_index);

-- Triggers
CREATE TRIGGER update_places_cache_updated_at
  BEFORE UPDATE ON public.places_cache FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_roteiro_itens_updated_at
  BEFORE UPDATE ON public.roteiro_itens FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

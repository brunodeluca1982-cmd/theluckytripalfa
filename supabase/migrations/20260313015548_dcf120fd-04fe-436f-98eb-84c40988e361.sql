
CREATE TABLE public.neighborhood_editorial (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id text NOT NULL UNIQUE,
  neighborhood_name text NOT NULL,
  summary text,
  como_e_ficar text,
  pra_quem text,
  o_que_faz_especial text,
  o_que_considerar text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.neighborhood_editorial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read neighborhood editorial"
  ON public.neighborhood_editorial
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage neighborhood editorial"
  ON public.neighborhood_editorial
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

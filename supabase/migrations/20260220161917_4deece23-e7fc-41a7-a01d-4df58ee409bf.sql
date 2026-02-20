
-- A3) evento_sponsors
CREATE TABLE public.evento_sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  evento_id uuid REFERENCES public.eventos(id) ON DELETE CASCADE NOT NULL,
  sponsor_nome text NOT NULL,
  sponsor_slug text NOT NULL,
  logo_url text,
  badge_texto text NOT NULL DEFAULT 'Patrocinado',
  link_url text,
  tracking_tag text,
  prioridade int NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true
);

ALTER TABLE public.evento_sponsors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active sponsors" ON public.evento_sponsors
  FOR SELECT USING (
    ativo = true AND EXISTS (SELECT 1 FROM public.eventos WHERE id = evento_id AND ativo = true)
  );
CREATE POLICY "Admins read all sponsors" ON public.evento_sponsors
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert sponsors" ON public.evento_sponsors
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update sponsors" ON public.evento_sponsors
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete sponsors" ON public.evento_sponsors
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_evento_sponsors_updated_at
  BEFORE UPDATE ON public.evento_sponsors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- A4) evento_sponsor_placements
CREATE TABLE public.evento_sponsor_placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  evento_id uuid REFERENCES public.eventos(id) ON DELETE CASCADE NOT NULL,
  sponsor_id uuid REFERENCES public.evento_sponsors(id) ON DELETE CASCADE NOT NULL,
  placement text NOT NULL,
  titulo text,
  subtitulo text,
  media_url text,
  cta_label text,
  cta_link text,
  ordem int NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true
);

ALTER TABLE public.evento_sponsor_placements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active placements" ON public.evento_sponsor_placements
  FOR SELECT USING (
    ativo = true AND EXISTS (SELECT 1 FROM public.eventos WHERE id = evento_id AND ativo = true)
  );
CREATE POLICY "Admins read all placements" ON public.evento_sponsor_placements
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert placements" ON public.evento_sponsor_placements
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update placements" ON public.evento_sponsor_placements
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete placements" ON public.evento_sponsor_placements
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_evento_sponsor_placements_updated_at
  BEFORE UPDATE ON public.evento_sponsor_placements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- A5) evento_item_sponsored
CREATE TABLE public.evento_item_sponsored (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid REFERENCES public.eventos(id) ON DELETE CASCADE NOT NULL,
  evento_item_id uuid REFERENCES public.evento_itens(id) ON DELETE CASCADE NOT NULL,
  sponsor_id uuid REFERENCES public.evento_sponsors(id) ON DELETE CASCADE NOT NULL,
  badge_texto text NOT NULL DEFAULT 'Patrocinado',
  destaque boolean NOT NULL DEFAULT true,
  ativo boolean NOT NULL DEFAULT true
);

ALTER TABLE public.evento_item_sponsored ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active item sponsors" ON public.evento_item_sponsored
  FOR SELECT USING (
    ativo = true AND EXISTS (SELECT 1 FROM public.eventos WHERE id = evento_id AND ativo = true)
  );
CREATE POLICY "Admins read all item sponsors" ON public.evento_item_sponsored
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert item sponsors" ON public.evento_item_sponsored
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update item sponsors" ON public.evento_item_sponsored
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete item sponsors" ON public.evento_item_sponsored
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Indexes
CREATE INDEX idx_evento_sponsors_evento ON public.evento_sponsors(evento_id);
CREATE INDEX idx_evento_placements_evento ON public.evento_sponsor_placements(evento_id);
CREATE INDEX idx_evento_placements_sponsor ON public.evento_sponsor_placements(sponsor_id);
CREATE INDEX idx_evento_item_sponsored_evento ON public.evento_item_sponsored(evento_id);

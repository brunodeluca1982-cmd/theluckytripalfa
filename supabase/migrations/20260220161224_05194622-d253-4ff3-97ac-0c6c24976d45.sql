
-- 1. Role enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: only admins can read roles, users can read their own
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- 2. Eventos table
CREATE TABLE public.eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destino text NOT NULL DEFAULT 'rio-de-janeiro',
  titulo text NOT NULL,
  slug text NOT NULL UNIQUE,
  descricao_curta text,
  descricao_longa text,
  data_inicio timestamptz,
  data_fim timestamptz,
  prioridade int NOT NULL DEFAULT 0,
  cor_hex text,
  hero_media_url text,
  botao_label text,
  botao_link text,
  ativo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

-- Public read for active events
CREATE POLICY "Anyone can read active eventos" ON public.eventos
  FOR SELECT USING (ativo = true);

-- Admins full access
CREATE POLICY "Admins can read all eventos" ON public.eventos
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert eventos" ON public.eventos
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update eventos" ON public.eventos
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete eventos" ON public.eventos
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Auto-update updated_at
CREATE TRIGGER update_eventos_updated_at
  BEFORE UPDATE ON public.eventos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Evento_itens table
CREATE TABLE public.evento_itens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id uuid REFERENCES public.eventos(id) ON DELETE CASCADE NOT NULL,
  tipo text NOT NULL DEFAULT 'atividade',
  titulo text NOT NULL,
  slug text NOT NULL,
  data_inicio timestamptz,
  data_fim timestamptz,
  bairro text,
  local_nome text,
  google_maps_url text,
  instagram text,
  descricao text,
  tags text[] DEFAULT '{}',
  ordem int NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.evento_itens ENABLE ROW LEVEL SECURITY;

-- Public read for active items of active events
CREATE POLICY "Anyone can read active evento_itens" ON public.evento_itens
  FOR SELECT USING (
    ativo = true AND EXISTS (
      SELECT 1 FROM public.eventos WHERE id = evento_id AND ativo = true
    )
  );

CREATE POLICY "Admins can read all evento_itens" ON public.evento_itens
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert evento_itens" ON public.evento_itens
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update evento_itens" ON public.evento_itens
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete evento_itens" ON public.evento_itens
  FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_evento_itens_updated_at
  BEFORE UPDATE ON public.evento_itens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_eventos_destino_ativo ON public.eventos(destino, ativo);
CREATE INDEX idx_evento_itens_evento_id ON public.evento_itens(evento_id);

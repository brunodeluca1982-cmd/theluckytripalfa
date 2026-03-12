CREATE TABLE public.lucky_list_rio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  cidade text NOT NULL DEFAULT 'Rio de Janeiro',
  bairro text,
  nome text NOT NULL,
  tipo_item text,
  categoria_experiencia text,
  google_maps text,
  meu_olhar text,
  como_fazer text,
  tags_ia text[],
  nivel_esforco text,
  com_criancas boolean DEFAULT false,
  seguro_mulher_sozinha boolean DEFAULT false,
  ativo boolean NOT NULL DEFAULT true,
  horarios text,
  contato_instagram text,
  contato_telefone text,
  quando_tem_musica text
);

ALTER TABLE public.lucky_list_rio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active lucky list items"
  ON public.lucky_list_rio
  FOR SELECT
  TO public
  USING (ativo = true);

CREATE POLICY "Admins can manage lucky list"
  ON public.lucky_list_rio
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));
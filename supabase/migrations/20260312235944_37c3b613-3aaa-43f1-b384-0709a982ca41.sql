
CREATE TABLE public.o_que_fazer_rio (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  categoria text NOT NULL DEFAULT '',
  bairro text,
  google_maps text,
  meu_olhar text,
  momento_ideal text,
  momento_lucky_list text,
  como_fazer text,
  tags_ia text[] DEFAULT '{}',
  vibe text,
  energia text,
  duracao_media text,
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.o_que_fazer_rio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active o_que_fazer_rio"
  ON public.o_que_fazer_rio
  FOR SELECT
  TO public
  USING (ativo = true);

CREATE POLICY "Admins can manage o_que_fazer_rio"
  ON public.o_que_fazer_rio
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

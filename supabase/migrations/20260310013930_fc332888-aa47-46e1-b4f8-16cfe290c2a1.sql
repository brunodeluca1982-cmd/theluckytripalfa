
INSERT INTO public.experiences (slug, title, city, country, neighborhood, category, show_on_home, is_active, sort_order, short_description)
VALUES ('museu-do-amanha', 'Museu do Amanhã', 'Rio de Janeiro', 'Brasil', 'Centro', 'cultura', true, true, 3, 'Um dos museus mais icônicos do Rio de Janeiro, projetado por Santiago Calatrava.')
ON CONFLICT (slug) DO UPDATE SET show_on_home = true, is_active = true;

INSERT INTO public.experience_media (experience_slug, media_type, media_url, sort_order, is_active, title)
VALUES
  ('museu-do-amanha', 'video', 'https://lsibzflaaqzvtzjlvrxw.supabase.co/storage/v1/object/public/experiencia_media/experiencias/museu-do-amanha/museu-do-amanha-hero-1.mov', 0, true, 'Museu do Amanhã Hero Video');

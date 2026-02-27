
INSERT INTO storage.buckets (id, name, public)
VALUES ('experiencia_media', 'experiencia_media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read experiencia_media"
ON storage.objects FOR SELECT
USING (bucket_id = 'experiencia_media');

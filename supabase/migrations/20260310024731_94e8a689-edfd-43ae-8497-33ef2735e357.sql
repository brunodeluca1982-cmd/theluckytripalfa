
-- Populate full descriptions for cristo-redentor
UPDATE public.experiences
SET
  neighborhood = 'Santa Teresa / Cosme Velho',
  category = 'classico',
  short_description = 'O cartão-postal mais icônico do Brasil, no topo do Corcovado a 710 metros de altitude.',
  full_description = 'O Cristo Redentor é muito mais do que um monumento — é o ponto de encontro entre a natureza exuberante e a espiritualidade carioca. Do alto do Corcovado, a vista de 360° revela a Baía de Guanabara, o Pão de Açúcar, as praias de Copacabana e Ipanema, a Lagoa Rodrigo de Freitas e a imensidão da Floresta da Tijuca.

A subida já é uma experiência à parte: o trenzinho do Corcovado atravessa a maior floresta urbana do mundo, passando por entre árvores centenárias e revelando flashes da cidade entre a vegetação.

Chegando ao topo, a escadaria rolante leva até a base da estátua, de onde se descortina a paisagem que definiu o Rio para o mundo. Ao entardecer, a luz dourada sobre a cidade transforma o cenário em algo quase irreal. Mesmo quem mora no Rio se emociona a cada visita.

Dica Lucky Trip: vá nas primeiras horas da manhã ou no final da tarde para evitar multidões e pegar a melhor luz. O pôr do sol visto do Cristo é uma das experiências mais memoráveis que o Rio oferece.'
WHERE slug = 'cristo-redentor';

-- Populate full description for museu-do-amanha
UPDATE public.experiences
SET
  full_description = 'Projetado pelo arquiteto espanhol Santiago Calatrava e inaugurado em 2015, o Museu do Amanhã é uma experiência que desafia a forma como pensamos o futuro. Situado no Pier Mauá, na região portuária revitalizada do Rio, o edifício em si já é uma obra de arte — com sua estrutura fluida que se projeta sobre a Baía de Guanabara como uma nave do futuro.

Por dentro, a exposição principal é uma jornada imersiva que explora cinco grandes questões: Cosmos, Terra, Antropoceno, Amanhãs e Nós. Com instalações interativas, projeções monumentais e experiências sensoriais, o museu provoca reflexões sobre sustentabilidade, convivência e as escolhas que moldam o futuro do planeta.

O espaço ao redor do museu também merece atenção: a Praça Mauá, o MAR (Museu de Arte do Rio) e os murais do Boulevard Olímpico compõem um circuito cultural que pode facilmente ocupar uma manhã inteira.

Dica Lucky Trip: combine a visita ao Museu do Amanhã com um almoço no Cobogó, restaurante de cozinha brasileira contemporânea ali perto, ou estique até a Cidade do Samba se quiser mergulhar mais na cultura carioca.'
WHERE slug = 'museu-do-amanha';

-- Enrich praia-de-ipanema full description
UPDATE public.experiences
SET
  neighborhood = 'Ipanema',
  full_description = 'Ipanema é mais do que uma praia: é um estado de espírito carioca. Eternizada pela bossa nova de Tom Jobim e Vinicius de Moraes, a Praia de Ipanema segue sendo o point mais democrático e vibrante do Rio de Janeiro.

O calçadão movimentado, os postos organizados por tribos — surfe no Posto 7, LGBTQ+ no Posto 8, famílias no Posto 9, jovens no Posto 10 e esportistas no Arpoador — e o pôr do sol mais aplaudido da cidade fazem de Ipanema uma experiência completa.

Nas ruas ao redor, a Feira Hippie de Ipanema (domingos na Praça General Osório) é parada obrigatória para artesanato e comida de rua. O bairro também concentra algumas das melhores opções gastronômicas do Rio, de bistrôs a restaurantes japoneses premiados.

Dica Lucky Trip: fique até o pôr do sol no Arpoador. Quando o sol mergulha no mar em dias claros, a galera aplaude — e você vai entender por quê. Para completar, suba à Pedra do Arpoador para a melhor vista da praia inteira.'
WHERE slug = 'praia-de-ipanema';

-- Remove generic Rio hero videos from cristo-redentor and praia-de-ipanema
DELETE FROM public.experience_media
WHERE media_url = '/videos/rio-hero.mp4'
  AND experience_slug IN ('cristo-redentor', 'praia-de-ipanema');

-- Add proper images for cristo-redentor
INSERT INTO public.experience_media (experience_slug, media_type, media_url, sort_order, is_active, title)
VALUES
  ('cristo-redentor', 'image', 'https://images.unsplash.com/photo-1619546952812-520e98064a52?w=1200', 0, true, 'Cristo Redentor ao pôr do sol'),
  ('cristo-redentor', 'image', 'https://images.unsplash.com/photo-1548963670-aaaa8f73a5e3?w=1200', 1, true, 'Vista do Corcovado')
ON CONFLICT DO NOTHING;

-- Add proper images for praia-de-ipanema (keep existing unsplash, add more)
INSERT INTO public.experience_media (experience_slug, media_type, media_url, sort_order, is_active, title)
VALUES
  ('praia-de-ipanema', 'image', 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=1200', 0, true, 'Praia de Ipanema vista aérea'),
  ('praia-de-ipanema', 'image', 'https://images.unsplash.com/photo-1554168848-228452c09d60?w=1200', 2, true, 'Pôr do sol no Arpoador')
ON CONFLICT DO NOTHING;

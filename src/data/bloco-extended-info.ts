/**
 * Extended information for each bloco, keyed by bloco ID.
 * Used on the /bloco-info/:id detail screen.
 */
export interface BlocoExtended {
  horarioCompleto: string;
  endereco: string;
  publicoDetalhado: string;
  musicaDetalhada: string;
  comoChegar: string;
  dicas: string[];
  fullText: string;
}

const PLACEHOLDER = "Detalhes completos em breve.";

export const blocoExtendedInfo: Record<string, BlocoExtended> = {
  "ceu-na-terra": {
    horarioCompleto: "7h — Concentração às 6h30 na Ladeira de Santa Teresa",
    endereco: "Largo dos Guimarães → Rua Almirante Alexandrino, Santa Teresa",
    publicoDetalhado: "Famílias, boêmios e moradores do bairro. Clima intimista e acolhedor, ideal para quem quer curtir sem tumulto.",
    musicaDetalhada: "Marchinhas clássicas, MPB acústica e percussão artesanal. Repertório autoral com toques místicos.",
    comoChegar: "Metrô até Glória ou Largo do Machado + táxi/app até Santa Teresa. Chegue cedo — as ladeiras lotam rápido. Evite carro próprio.",
    dicas: [
      "Use calçado confortável — o percurso é em ladeira de paralelepípedo.",
      "Leve água e protetor solar, o sol bate forte pela manhã.",
      "Banheiros químicos disponíveis no Largo dos Guimarães.",
      "Melhor horário: chegue às 6h30 para pegar a concentração e o clima mais tranquilo.",
    ],
    fullText: `📍 Concentração
Largo dos Guimarães, Santa Teresa
A concentração começa por volta das 6h30 — sim, é cedo, mas faz parte da experiência. O bloco sai do Largo dos Guimarães e desce pela Rua Almirante Alexandrino, passando por ladeiras estreitas e charmosas de Santa Teresa.

🚕 Como eu chego
Metrô até Glória ou Largo do Machado + táxi ou app até Santa Teresa. Não vá de carro — não tem onde estacionar e as ruas fecham. Se puder, vá a pé subindo pela Rua Joaquim Murtinho. É ladeira, mas a vista compensa.

🎭 A vibe
O Céu na Terra é um dos blocos mais bonitos e intimistas do Rio. A energia é mística, quase espiritual. Muita gente fantasiada com referências celestiais — anjos, estrelas, lua. O clima é de comunidade, de vizinhança, de quem ama Santa Teresa. Não é bloco de bagunça, é bloco de alma.

🎵 Estilo musical
Marchinhas clássicas com releituras autorais, MPB acústica e percussão artesanal feita pelos próprios moradores. A bateria é pequena mas potente — o som ecoa pelas ladeiras e cria uma acústica natural única.

🏗️ Estrutura
Banheiros químicos espalhados pelo Largo dos Guimarães. Ambulantes vendem água, cerveja e mate. Não espere grande estrutura — faz parte do charme. Leve sua água e um lanche leve.

⏰ Que horas acaba
Por volta das 11h–12h. O bloco desce devagar, curtindo cada metro de ladeira.

📝 Minha leitura
Se você quer começar o Carnaval com o pé direito — e com a alma leve — o Céu na Terra é obrigatório. É o bloco que te lembra por que o Carnaval de rua do Rio é patrimônio. Vista branco, leve glitter, e deixe a cidade te abraçar.`,
  },
  "exagerado": {
    horarioCompleto: "8h — Concentração no Aterro do Flamengo às 7h30",
    endereco: "Aterro do Flamengo, próximo ao Monumento aos Pracinhas",
    publicoDetalhado: "Jovens e adultos fãs de Cazuza. Ambiente animado e nostálgico.",
    musicaDetalhada: "Pop rock brasileiro anos 80/90, hits de Cazuza, Barão Vermelho e clássicos nacionais.",
    comoChegar: "Metrô até Cinelândia ou Catete + caminhada de 10 min. Apps de transporte deixam na Av. Infante Dom Henrique.",
    dicas: [
      "Área aberta com pouca sombra — protetor solar é obrigatório.",
      "Chegue cedo para estacionar no entorno (vagas limitadas).",
      "Leve doleira e evite mochilas grandes.",
      "Pontos de hidratação espalhados pelo percurso.",
    ],
    fullText: PLACEHOLDER,
  },
  "bola-preta": {
    horarioCompleto: "9h — Concentração na Rua 1º de Março às 7h",
    endereco: "Rua 1º de Março → Av. Rio Branco, Centro do Rio",
    publicoDetalhado: "Todos os públicos — um dos maiores blocos do mundo. Multidão intensa, energia gigante.",
    musicaDetalhada: "Marchinhas clássicas de Carnaval, samba e frevo. Repertório tradicional com trio elétrico.",
    comoChegar: "Metrô até Uruguaiana ou Carioca. É o melhor acesso — ruas do entorno ficam fechadas. Não vá de carro.",
    dicas: [
      "Bloco gigante — defina um ponto de encontro com seu grupo antes.",
      "Use fantasia leve e confortável, vai fazer calor.",
      "Banheiros químicos ao longo da Av. Rio Branco.",
      "Segurança reforçada, mas fique atento a pertences.",
      "Melhor horário: 8h–11h para curtir sem o pico de lotação.",
    ],
    fullText: `📍 Concentração
Rua 1º de Março, Centro — o bloco se concentra ali e desfila pela Av. Rio Branco. É um dos maiores blocos do planeta, com mais de 1 milhão de foliões nos bons anos.

🚕 Como eu chego
Metrô até Uruguaiana ou Carioca — saída direta para o percurso. Não vá de carro. As ruas ao redor ficam completamente fechadas desde as 6h da manhã. Chegue cedo (antes das 8h) para entrar no bloco antes que a multidão fique impenetrável.

🎭 A vibe
Caos organizado. O Cordão da Bola Preta é o maior bloco do Rio e talvez do mundo. É uma massa humana gigante que toma o Centro inteiro. O clima é de euforia coletiva — todo mundo fantasiado, cantando marchinhas que seus avós cantavam. É tradição pura, sem frescura.

🎵 Estilo musical
Marchinhas clássicas, samba e frevo. Trio elétrico potente com repertório 100% tradicional. "Me dá um dinheiro aí", "Ó abre alas", "Allah-la-ô" — tudo que é hino do Carnaval brasileiro toca aqui.

🏗️ Estrutura
Banheiros químicos ao longo da Av. Rio Branco. Ambulantes em cada esquina. Postos médicos da prefeitura espalhados. Segurança reforçada com policiamento e câmeras.

⏰ Que horas acaba
O desfile principal vai até 13h–14h, mas a festa no entorno continua até o fim da tarde.

📝 Minha leitura
Se você quer sentir o Carnaval na sua forma mais grandiosa e tradicional, o Bola Preta é insubstituível. Mas vá preparado: é intenso, é quente, é multidão. Defina um ponto de encontro com seu grupo ANTES. Leve doleira, nada de mochila, e aceite que você vai suar. Muito.`,
  },
  "bloco-brasil": {
    horarioCompleto: "13h — Concentração às 12h no Aterro do Flamengo",
    endereco: "Aterro do Flamengo, altura do MAM",
    publicoDetalhado: "Adultos, clima patriótico e festivo. Público diversificado.",
    musicaDetalhada: "Samba enredo, axé e hits brasileiros. Clima de arquibancada.",
    comoChegar: "Metrô até Cinelândia + 15 min a pé. Ou app até o MAM.",
    dicas: [
      "Sol forte à tarde — chapéu e protetor obrigatórios.",
      "Ambulantes vendem água e cerveja no percurso.",
      "Melhor horário: 13h–15h.",
    ],
    fullText: PLACEHOLDER,
  },
  "bloco-areia": {
    horarioCompleto: "7h — Concentração às 6h30 no Posto 9, Ipanema",
    endereco: "Posto 9, Praia de Ipanema — Rua Farme de Amoedo",
    publicoDetalhado: "Jovens, clima de praia e descontração. LGBTQ+ friendly.",
    musicaDetalhada: "Pop brasileiro, eletrônico leve e funk carioca.",
    comoChegar: "Metrô até General Osório + 5 min a pé. Chegue cedo para aproveitar a areia.",
    dicas: [
      "Vá de biquíni/sunga — muita gente entra no mar durante o bloco.",
      "Leve canga e protetor solar à prova d'água.",
      "Evite levar muito dinheiro — use doleira.",
      "Banheiros no quiosque próximo ao Posto 9.",
    ],
    fullText: PLACEHOLDER,
  },
  "divinas-tretas": {
    horarioCompleto: "8h — Concentração às 7h30 em Botafogo",
    endereco: "Rua Voluntários da Pátria → Rua São Clemente, Botafogo",
    publicoDetalhado: "Adultos, clima irreverente e bem-humorado. Fantasias criativas.",
    musicaDetalhada: "Pop nacional e internacional, funk e músicas de meme.",
    comoChegar: "Metrô Botafogo, saída Voluntários da Pátria.",
    dicas: [
      "Bloco compacto — ótimo para quem não gosta de multidão gigante.",
      "Ruas estreitas, chegue cedo para se posicionar.",
      "Banheiros em bares parceiros na Rua São Clemente.",
    ],
    fullText: `📍 Concentração
Rua Voluntários da Pátria, Botafogo — concentração às 7h30, saída às 8h. O bloco percorre as ruas de Botafogo até a Rua São Clemente.

🚕 Como eu chego
Metrô Botafogo, saída Voluntários da Pátria. Você sai do metrô e já está no bloco. Simples assim.

🎭 A vibe
Irreverente, criativo e muito bem-humorado. O Divinas Tretas é o bloco das fantasias absurdas e das piadas internas que viram meme. O público é adulto, descolado, e não se leva a sério. É compacto — não espere multidão de milhão. É mais 5–10 mil pessoas se divertindo de verdade.

🎵 Estilo musical
Pop nacional e internacional, funk, músicas de meme e hits virais. A banda toca de tudo — de Beyoncé a funk carioca, passando por aquela música que ficou na sua cabeça a semana inteira.

🏗️ Estrutura
Banheiros em bares parceiros na Rua São Clemente (eles abrem especialmente pro bloco). Ambulantes vendem de tudo. Ruas estreitas, então fica cheio rápido.

⏰ Que horas acaba
Por volta das 12h–13h.

📝 Minha leitura
Um dos melhores blocos pra quem quer rir, dançar e não perder amigo na multidão. Tamanho perfeito, energia alta, e a fantasia mais criativa sempre ganha atenção. Vá fantasiado(a) — é quase obrigatório.`,
  },
  "bangalafumenga": {
    horarioCompleto: "9h — Concentração às 8h no Jardim Botânico",
    endereco: "Rua Jardim Botânico → Rua Pacheco Leão",
    publicoDetalhado: "Todos os públicos. Clássico carioca, clima familiar e animado.",
    musicaDetalhada: "Samba, pop brasileiro e marchinhas. Bateria potente.",
    comoChegar: "App até Rua Jardim Botânico. Metrô até General Osório + ônibus 584.",
    dicas: [
      "Área arborizada com sombra parcial.",
      "Leve água — poucos ambulantes no início do percurso.",
      "Melhor horário: 9h–12h.",
    ],
    fullText: `📍 Concentração
Rua Jardim Botânico, próximo à Praça Santos Dumont. Concentração às 8h, saída às 9h. Percurso pela Rua Jardim Botânico até a Rua Pacheco Leão.

🚕 Como eu chego
App até a Rua Jardim Botânico. Se vier de metrô, desça em General Osório e pegue o ônibus 584. O acesso de carro é complicado — ruas fecham cedo.

🎭 A vibe
O Bangalafumenga é um clássico carioca. Familiar, democrático e com energia de bairro. O público é de todas as idades — tem criança fantasiada, casal dançando, e o grupo de amigos que vem todo ano. Não é o maior, mas é um dos mais queridos.

🎵 Estilo musical
Samba, pop brasileiro e marchinhas clássicas. A bateria é potente e cadenciada — dá pra sentir no peito. Tocam de tudo, de Alceu Valença a Tim Maia, passando por Jorge Ben.

🏗️ Estrutura
Área arborizada com sombra parcial — uma benção no calor de fevereiro. Poucos ambulantes no início do percurso, então leve água. Banheiros químicos espalhados ao longo da rua.

⏰ Que horas acaba
Por volta das 13h–14h.

📝 Minha leitura
Se você quer um bloco que mistura tradição com energia sem ser caótico, o Bangalafumenga é perfeito. Ótimo pra famílias e pra quem quer curtir sombra e samba ao mesmo tempo.`,
  },
  "simpatia-quase-amor": {
    horarioCompleto: "14h — Concentração às 13h na Praça General Osório, Ipanema",
    endereco: "Praça General Osório → Rua Visconde de Pirajá, Ipanema",
    publicoDetalhado: "Famílias, casais e público mais velho. Clima romântico e acolhedor.",
    musicaDetalhada: "MPB, marchinhas e canções românticas brasileiras.",
    comoChegar: "Metrô General Osório — saída direta para a praça.",
    dicas: [
      "Um dos blocos mais charmosos do Rio.",
      "Ideal para quem quer curtir com crianças.",
      "Banheiros químicos na praça.",
      "Melhor horário: 14h–16h.",
    ],
    fullText: PLACEHOLDER,
  },
  "corre-atras": {
    horarioCompleto: "7h — Concentração às 6h30 no Leblon",
    endereco: "Rua Dias Ferreira → Av. Ataulfo de Paiva, Leblon",
    publicoDetalhado: "Jovens, clima energético e matinal.",
    musicaDetalhada: "Pop, eletrônico e hits do momento.",
    comoChegar: "App até Rua Dias Ferreira. Metrô até Antero de Quental (previsão 2026).",
    dicas: [
      "Bloco matinal — tome café reforçado antes.",
      "Ruas estreitas, vá leve e sem mochila.",
    ],
    fullText: PLACEHOLDER,
  },
  "brasilia-amarela": {
    horarioCompleto: "8h — Concentração às 7h30 na Urca",
    endereco: "Praia da Urca → Av. Portugal",
    publicoDetalhado: "Adultos, clima intimista e charmoso com vista para o Pão de Açúcar.",
    musicaDetalhada: "MPB e samba acústico. Repertório sofisticado.",
    comoChegar: "App até Praia da Urca. Ônibus 107 ou 513 do Centro.",
    dicas: [
      "Um dos blocos mais bonitos — vista incrível.",
      "Público menor, ideal para quem quer tranquilidade.",
      "Leve canga e protetor.",
    ],
    fullText: PLACEHOLDER,
  },
  "fica-comigo": {
    horarioCompleto: "9h — Concentração às 8h30 na Lagoa Rodrigo de Freitas",
    endereco: "Parque dos Patins → Av. Borges de Medeiros, Lagoa",
    publicoDetalhado: "Famílias com crianças. Clima descontraído e seguro.",
    musicaDetalhada: "Pop brasileiro, músicas infantis e marchinhas leves.",
    comoChegar: "App até Parque dos Patins. Metrô até General Osório + ônibus.",
    dicas: [
      "Ótimo para crianças — espaço amplo e seguro.",
      "Banheiros no Parque dos Patins.",
      "Leve brinquedos de Carnaval para os pequenos.",
    ],
    fullText: PLACEHOLDER,
  },
  "carvalho-em-pe": {
    horarioCompleto: "10h — Concentração às 9h30 na Tijuca",
    endereco: "Praça Saens Peña → Rua Conde de Bonfim, Tijuca",
    publicoDetalhado: "Adultos, moradores da Zona Norte. Clima tradicional.",
    musicaDetalhada: "Samba de raiz e pagode.",
    comoChegar: "Metrô Saens Peña — saída direta.",
    dicas: ["Bloco tradicional da Zona Norte.", "Chegue cedo — a praça enche rápido."],
    fullText: PLACEHOLDER,
  },
  "cruzada": {
    horarioCompleto: "14h — Concentração às 13h em Copacabana",
    endereco: "Av. Atlântica, altura do Posto 5, Copacabana",
    publicoDetalhado: "Jovens e adultos. Intenso e animado.",
    musicaDetalhada: "Funk carioca e samba pesado.",
    comoChegar: "Metrô até Siqueira Campos + 10 min a pé até o Posto 5.",
    dicas: [
      "Bloco grande — fique atento a pertences.",
      "Praia ao lado para refrescar.",
      "Muitos ambulantes no percurso.",
    ],
    fullText: PLACEHOLDER,
  },
  "vagalume": {
    horarioCompleto: "8h — Concentração às 7h30 em Laranjeiras",
    endereco: "Rua das Laranjeiras → Largo do Machado",
    publicoDetalhado: "Adultos, clima intimista e boêmio.",
    musicaDetalhada: "MPB, samba e bossa nova.",
    comoChegar: "Metrô Largo do Machado.",
    dicas: ["Bloco pequeno e charmoso.", "Boa opção para quem está hospedado na Zona Sul."],
    fullText: PLACEHOLDER,
  },
  "empurra": {
    horarioCompleto: "12h — Concentração às 11h30 no Flamengo",
    endereco: "Praia do Flamengo → Aterro",
    publicoDetalhado: "Jovens, clima intenso e quente.",
    musicaDetalhada: "Funk, pop e pancadão.",
    comoChegar: "Metrô Catete ou Largo do Machado + caminhada.",
    dicas: ["Sol forte ao meio-dia — hidrate-se.", "Leve pouca coisa."],
    fullText: PLACEHOLDER,
  },
  "s-pimenta": {
    horarioCompleto: "20h — Concentração às 19h30 na Lapa",
    endereco: "Arcos da Lapa → Rua Mem de Sá",
    publicoDetalhado: "Adultos, clima noturno e apimentado.",
    musicaDetalhada: "Samba de roda, funk e forró.",
    comoChegar: "Metrô Cinelândia + 5 min a pé até os Arcos.",
    dicas: [
      "Único bloco noturno da lista — clima diferente.",
      "Lapa fica lotada — vá de metrô.",
      "Banheiros nos bares da Rua Mem de Sá.",
    ],
    fullText: PLACEHOLDER,
  },
  "me-enterra-na-4a": {
    horarioCompleto: "13h — Concentração às 12h em Ipanema",
    endereco: "Praça General Osório → Rua Visconde de Pirajá",
    publicoDetalhado: "Todos. Clima de despedida do Carnaval, saudoso e festivo.",
    musicaDetalhada: "Marchinhas, MPB e sambas clássicos.",
    comoChegar: "Metrô General Osório.",
    dicas: ["Último grande bloco — aproveite!", "Clima emocionante de encerramento."],
    fullText: PLACEHOLDER,
  },
  "planta-na-mente": {
    horarioCompleto: "14h — Concentração às 13h30 no Jardim Botânico",
    endereco: "Rua Jardim Botânico, próximo ao portão principal",
    publicoDetalhado: "Adultos, clima tranquilo e verde.",
    musicaDetalhada: "Reggae, MPB e world music.",
    comoChegar: "App até Rua Jardim Botânico.",
    dicas: ["Bloco tranquilo em área arborizada.", "Ideal para quem quer desacelerar."],
    fullText: "14h — Rua Jardim Botânico, próximo ao portão principal do Jardim Botânico.",
  },
  "fundo-de-quintal": {
    horarioCompleto: "18h — Concentração às 17h em Madureira",
    endereco: "Parque de Madureira → Estrada do Portela",
    publicoDetalhado: "Todos. Autêntico pagode e samba de raiz.",
    musicaDetalhada: "Pagode raiz, samba de terreiro e partido alto.",
    comoChegar: "Trem até Madureira + 10 min a pé até o Parque.",
    dicas: ["Experiência autêntica de samba carioca.", "Parque amplo e seguro."],
    fullText: PLACEHOLDER,
  },
  "bloconce": {
    horarioCompleto: "9h — Concentração às 8h em Ipanema",
    endereco: "Praça General Osório → Rua Visconde de Pirajá",
    publicoDetalhado: "Jovens, clima pop e empoderado. Muitas fantasias.",
    musicaDetalhada: "Pop internacional (Beyoncé, Rihanna, Lady Gaga) com bateria de escola de samba.",
    comoChegar: "Metrô General Osório.",
    dicas: ["Fantasias criativas são quase obrigatórias.", "Ambiente LGBTQ+ friendly."],
    fullText: PLACEHOLDER,
  },
  "batafa": {
    horarioCompleto: "10h — Concentração às 9h30 em Botafogo",
    endereco: "Praia de Botafogo → Rua Voluntários da Pátria",
    publicoDetalhado: "Adultos, clima percussivo e tribal.",
    musicaDetalhada: "Batucada, afrobeat e ritmos africanos.",
    comoChegar: "Metrô Botafogo.",
    dicas: ["Bloco de percussão pura — experiência sonora única.", "Leve tampões se for sensível a volume alto."],
    fullText: PLACEHOLDER,
  },
  "chule-de-santa": {
    horarioCompleto: "12h — Concentração às 11h em Santa Teresa",
    endereco: "Largo dos Guimarães → Rua Almirante Alexandrino",
    publicoDetalhado: "Adultos, boêmios e moradores de Santa Teresa.",
    musicaDetalhada: "Samba, marchinhas e chorinho.",
    comoChegar: "Táxi/app até Largo dos Guimarães. Ladeiras íngremes.",
    dicas: ["Calçado fechado recomendado.", "Clima de botequim ao ar livre."],
    fullText: PLACEHOLDER,
  },
  "filhos-da-puc": {
    horarioCompleto: "9h — Concentração às 8h na Gávea",
    endereco: "Praça Santos Dumont → Rua Marquês de São Vicente, Gávea",
    publicoDetalhado: "Jovens universitários, clima festivo e energético.",
    musicaDetalhada: "Pop, funk e hits universitários.",
    comoChegar: "App até Praça Santos Dumont. Ônibus 170 ou 172.",
    dicas: ["Bloco universitário — público jovem.", "Chegue cedo, a praça lota rápido."],
    fullText: PLACEHOLDER,
  },
  "boka-de-espuma": {
    horarioCompleto: "14h — Concentração às 13h em Copacabana",
    endereco: "Av. Atlântica, Posto 3, Copacabana",
    publicoDetalhado: "Jovens e adultos, clima de festa com espuma.",
    musicaDetalhada: "Eletrônico, pop e dance music.",
    comoChegar: "Metrô Cardeal Arcoverde + 5 min a pé.",
    dicas: ["Vista roupa que pode molhar.", "Espuma no percurso — diversão garantida."],
    fullText: PLACEHOLDER,
  },
  "saideira": {
    horarioCompleto: "16h — Concentração às 15h no Leblon",
    endereco: "Praça Antero de Quental → Av. Ataulfo de Paiva, Leblon",
    publicoDetalhado: "Todos. Clima de encerramento festivo.",
    musicaDetalhada: "Samba, pop e marchinhas de despedida.",
    comoChegar: "Metrô Antero de Quental (previsão 2026) ou app.",
    dicas: ["Último bloco do Carnaval — clima especial.", "Ótimos restaurantes no entorno para o pós-bloco."],
    fullText: PLACEHOLDER,
  },
};

/**
 * Unified carnival blocks data.
 * Single source of truth — all screens read from this flat array.
 */

export interface CarnivalBlock {
  id: string;
  dateISO: string; // YYYY-MM-DD
  name: string;
  neighborhood: string;
  category: string; // raiz | moderno | cultural | infantil | elétrico | clássico | etc.
  time: string; // display time e.g. "7h"
  startHour: number; // numeric for sorting
  description: string; // short, for list view
  fullDetails: string; // long-form for "Saiba mais"
}

const PLACEHOLDER = "Detalhes completos em breve.";

export const carnivalBlocks: CarnivalBlock[] = [
  // ── 14 de fevereiro ──────────────────────────────────────────
  {
    id: "ceu-na-terra",
    dateISO: "2026-02-14",
    name: "Céu na Terra",
    neighborhood: "Santa Teresa",
    category: "cultural",
    time: "7h",
    startHour: 7,
    description: "Bloco intimista e místico pelas ladeiras de Santa Teresa. Marchinhas e MPB ao amanhecer.",
    fullDetails: `📍 Concentração
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
  {
    id: "exagerado",
    dateISO: "2026-02-14",
    name: "Exagerado",
    neighborhood: "Aterro do Flamengo",
    category: "moderno",
    time: "8h",
    startHour: 8,
    description: "Homenagem a Cazuza no Aterro. Pop rock brasileiro dos anos 80/90.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "bola-preta",
    dateISO: "2026-02-14",
    name: "Bola Preta",
    neighborhood: "Centro",
    category: "clássico",
    time: "9h",
    startHour: 9,
    description: "Um dos maiores blocos do mundo. Marchinhas clássicas tomam o Centro do Rio.",
    fullDetails: `📍 Concentração
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
  {
    id: "bloco-brasil",
    dateISO: "2026-02-14",
    name: "Bloco Brasil",
    neighborhood: "Flamengo",
    category: "moderno",
    time: "13h",
    startHour: 13,
    description: "Clima patriótico e festivo no Aterro. Samba enredo e axé.",
    fullDetails: PLACEHOLDER,
  },

  // ── 15 de fevereiro ──────────────────────────────────────────
  {
    id: "bloco-areia",
    dateISO: "2026-02-15",
    name: "Bloco Areia",
    neighborhood: "Posto 9, Ipanema",
    category: "moderno",
    time: "7h",
    startHour: 7,
    description: "Bloco de praia no Posto 9. Pop, eletrônico e mar.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "divinas-tretas",
    dateISO: "2026-02-15",
    name: "Divinas Tretas",
    neighborhood: "Botafogo",
    category: "moderno",
    time: "8h",
    startHour: 8,
    description: "Irreverente e compacto em Botafogo. Fantasias criativas e hits virais.",
    fullDetails: `📍 Concentração
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
  {
    id: "bangalafumenga",
    dateISO: "2026-02-15",
    name: "Bangalafumenga",
    neighborhood: "Jardim Botânico",
    category: "clássico",
    time: "9h",
    startHour: 9,
    description: "Clássico carioca no Jardim Botânico. Samba, sombra e família.",
    fullDetails: `📍 Concentração
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
  {
    id: "simpatia-quase-amor",
    dateISO: "2026-02-15",
    name: "Simpatia quase ❤️",
    neighborhood: "Ipanema",
    category: "cultural",
    time: "14h",
    startHour: 14,
    description: "Romântico e acolhedor em Ipanema. MPB e marchinhas para famílias e casais.",
    fullDetails: PLACEHOLDER,
  },

  // ── 16 de fevereiro ──────────────────────────────────────────
  {
    id: "corre-atras",
    dateISO: "2026-02-16",
    name: "Corre Atrás",
    neighborhood: "Leblon",
    category: "moderno",
    time: "7h",
    startHour: 7,
    description: "Energético e matinal no Leblon. Pop e eletrônico.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "brasilia-amarela",
    dateISO: "2026-02-16",
    name: "Brasília Amarela",
    neighborhood: "Urca",
    category: "cultural",
    time: "8h",
    startHour: 8,
    description: "Intimista na Urca com vista para o Pão de Açúcar. MPB e samba acústico.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "fica-comigo",
    dateISO: "2026-02-16",
    name: "Fica Comigo",
    neighborhood: "Lagoa",
    category: "infantil",
    time: "9h",
    startHour: 9,
    description: "Familiar e descontraído na Lagoa. Pop brasileiro e marchinhas leves.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "carvalho-em-pe",
    dateISO: "2026-02-16",
    name: "Carvalho em pé",
    neighborhood: "Tijuca",
    category: "raiz",
    time: "10h",
    startHour: 10,
    description: "Tradicional da Zona Norte. Samba de raiz na Praça Saens Peña.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "cruzada",
    dateISO: "2026-02-16",
    name: "Cruzada",
    neighborhood: "Copacabana",
    category: "moderno",
    time: "14h",
    startHour: 14,
    description: "Animado e intenso em Copacabana. Funk e samba na orla.",
    fullDetails: PLACEHOLDER,
  },

  // ── 17 de fevereiro ──────────────────────────────────────────
  {
    id: "vagalume",
    dateISO: "2026-02-17",
    name: "Vagalume",
    neighborhood: "Laranjeiras",
    category: "cultural",
    time: "8h",
    startHour: 8,
    description: "Intimista e boêmio em Laranjeiras. MPB, samba e bossa nova.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "empurra",
    dateISO: "2026-02-17",
    name: "Empurra",
    neighborhood: "Flamengo",
    category: "moderno",
    time: "12h",
    startHour: 12,
    description: "Intenso e quente no Flamengo. Funk, pop e energia jovem.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "s-pimenta",
    dateISO: "2026-02-17",
    name: "S. Pimenta",
    neighborhood: "Lapa",
    category: "raiz",
    time: "20h",
    startHour: 20,
    description: "Único bloco noturno — Lapa, samba de roda e forró.",
    fullDetails: PLACEHOLDER,
  },

  // ── 18 de fevereiro ──────────────────────────────────────────
  {
    id: "me-enterra-na-4a",
    dateISO: "2026-02-18",
    name: "Me enterra na 4ª",
    neighborhood: "Ipanema",
    category: "clássico",
    time: "13h",
    startHour: 13,
    description: "Despedida saudosa do Carnaval em Ipanema. Marchinhas e MPB.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "planta-na-mente",
    dateISO: "2026-02-18",
    name: "Planta Na Mente",
    neighborhood: "Jardim Botânico",
    category: "cultural",
    time: "14h",
    startHour: 14,
    description: "Tranquilo e verde no Jardim Botânico. Reggae e MPB.",
    fullDetails: "14h — Rua Jardim Botânico, próximo ao portão principal do Jardim Botânico.",
  },

  // ── 19 de fevereiro ──────────────────────────────────────────
  {
    id: "fundo-de-quintal",
    dateISO: "2026-02-19",
    name: "Fundo de Quintal",
    neighborhood: "Madureira",
    category: "raiz",
    time: "18h",
    startHour: 18,
    description: "Pagode e samba de raiz autêntico em Madureira.",
    fullDetails: PLACEHOLDER,
  },

  // ── 21 de fevereiro ──────────────────────────────────────────
  {
    id: "bloconce",
    dateISO: "2026-02-21",
    name: "Bloconcé",
    neighborhood: "Ipanema",
    category: "moderno",
    time: "9h",
    startHour: 9,
    description: "Pop internacional empoderado em Ipanema. Fantasias obrigatórias.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "batafa",
    dateISO: "2026-02-21",
    name: "Batafá",
    neighborhood: "Botafogo",
    category: "cultural",
    time: "10h",
    startHour: 10,
    description: "Percussivo e tribal em Botafogo. Batucada e afrobeat.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "chule-de-santa",
    dateISO: "2026-02-21",
    name: "Chulé de Santa",
    neighborhood: "Santa Teresa",
    category: "raiz",
    time: "12h",
    startHour: 12,
    description: "Irreverente e boêmio em Santa Teresa. Samba, marchinhas e chorinho.",
    fullDetails: PLACEHOLDER,
  },

  // ── 22 de fevereiro ──────────────────────────────────────────
  {
    id: "filhos-da-puc",
    dateISO: "2026-02-22",
    name: "Filhos da PUC",
    neighborhood: "Gávea",
    category: "moderno",
    time: "9h",
    startHour: 9,
    description: "Universitário e jovem na Gávea. Pop e funk.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "boka-de-espuma",
    dateISO: "2026-02-22",
    name: "Boka de Espuma",
    neighborhood: "Copacabana",
    category: "elétrico",
    time: "14h",
    startHour: 14,
    description: "Festa com espuma em Copacabana. Eletrônico e pop na orla.",
    fullDetails: PLACEHOLDER,
  },
  {
    id: "saideira",
    dateISO: "2026-02-22",
    name: "Saideira",
    neighborhood: "Leblon",
    category: "clássico",
    time: "16h",
    startHour: 16,
    description: "Encerramento festivo no Leblon. O último bloco do Carnaval.",
    fullDetails: PLACEHOLDER,
  },
];

/** All unique ISO dates in order */
export const carnivalDates: string[] = [
  ...new Set(carnivalBlocks.map((b) => b.dateISO)),
];

/** Get blocks for a specific ISO date */
export function getBlocksByDate(dateISO: string): CarnivalBlock[] {
  return carnivalBlocks.filter((b) => b.dateISO === dateISO);
}

/** Find a single block by slug/id */
export function getBlockById(id: string): CarnivalBlock | undefined {
  return carnivalBlocks.find((b) => b.id === id);
}

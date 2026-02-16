/**
 * Unified carnival blocks data — SINGLE SOURCE OF TRUTH.
 * All screens read from this flat array filtered by dateISO.
 */

export type ImageStatus = 'pending' | 'approved' | 'blocked';

export interface ContentImage {
  image_url?: string | null;
  image_source_url?: string | null;
  image_credit?: string | null;
  image_status?: ImageStatus;
}

export interface CarnivalBlockExtraDetails {
  schedule_line?: string;
  concentration?: string;
  route?: string;
  dispersal?: string;
  how_to_get_full?: string[];
  vibe?: string[];
  music_style?: string[];
  structure?: string[] | string;
  end_time?: string[] | string;
  my_reading?: string[];
}

export interface CarnivalBlock extends ContentImage {
  id: string;
  dateISO: string;
  name: string;
  neighborhood: string;
  neighborhoodShort: string;
  tag: string;
  address: string;
  shortDescription: string;
  time: string;
  howToGetShort: string;
  audienceShort: string;
  musicShort: string;
  extraDetails?: CarnivalBlockExtraDetails;
  missing_fields: string[];
}

export const carnivalBlocks: CarnivalBlock[] = [
  // ── 17 de fevereiro — terça ──────────────────────────────────
  {
    id: "vagalume-o-verde",
    dateISO: "2026-02-17",
    name: "Vagalume O Verde",
    neighborhood: "Jardim Botânico",
    neighborhoodShort: "J Botânico",
    tag: "clássico",
    address: "Rua Jardim Botânico e entorno da Lagoa",
    shortDescription: "Leve, arborizado, agradável.",
    time: "08:00",
    howToGetShort: "metrô Botafogo + Uber curto; Uber direto e seguir a pé nos trechos fechados.",
    audienceShort: "moradores da Zona Sul, famílias jovens, grupos de amigos.",
    musicShort: "samba, marchinhas e clássicos.",
    extraDetails: {
      how_to_get_full: [
        "Metrô: Botafogo + Uber curto.",
        "Uber direto ao bairro e seguir a pé nos trechos fechados.",
      ],
      vibe: [
        "Leve, arborizado, clima agradável e menos sufocante que Centro.",
        "Faixa etária: 20–45.",
        "Moradores da Zona Sul, famílias jovens e grupos de amigos.",
      ],
      music_style: ["Samba, marchinhas e clássicos carnavalescos."],
      structure: "Apoio público básico, circulação mais confortável.",
      end_time: "Por volta de 12h.",
    },
    missing_fields: ["concentration", "route", "dispersal", "my_take"],
  },
  {
    id: "empurra-que-pega-do-leblon",
    dateISO: "2026-02-17",
    name: "Empurra que Pega do Leblon",
    neighborhood: "Leblon",
    neighborhoodShort: "Leblon",
    tag: "raiz",
    address: "Cruzada São Sebastião",
    shortDescription: "Tradicional do bairro, clima comunitário.",
    time: "12:00",
    howToGetShort: "metrô Antero de Quental; Uber até ruas internas e segue andando.",
    audienceShort: "moradores, famílias, grupos locais.",
    musicShort: "samba e marchinhas.",
    extraDetails: {
      how_to_get_full: [
        "Metrô: Antero de Quental.",
        "Uber até ruas internas e segue andando.",
      ],
      vibe: [
        "Tradicional do bairro, clima comunitário.",
        "Faixa etária: bem misturada.",
        "Moradores, famílias e grupos locais.",
      ],
      music_style: ["Samba e marchinhas tradicionais."],
      structure: "Simples, padrão bairro.",
      end_time: "Final da tarde.",
    },
    missing_fields: ["concentration", "route", "dispersal", "my_take"],
  },
  {
    id: "sargento-pimenta",
    dateISO: "2026-02-17",
    name: "All We Need is Carnival com Sargento Pimenta",
    neighborhood: "Jardim Botânico",
    neighborhoodShort: "J Botânico",
    tag: "moderno",
    address: "região próxima à Lagoa / Jardim Botânico",
    shortDescription: "Beatles com bateria de carnaval.",
    time: "20:00",
    howToGetShort: "Uber direto; metrô + Uber curto.",
    audienceShort: "público criativo, músicos, jovens adultos.",
    musicShort: "Beatles em ritmo de samba/carnaval.",
    extraDetails: {
      how_to_get_full: [
        "Uber direto ao bairro.",
        "Metrô + Uber curto.",
      ],
      vibe: [
        "Mistura de Beatles com bateria de carnaval, clima animado e alternativo.",
        "Faixa etária: 20–45.",
        "Público criativo, músicos, jovens adultos.",
      ],
      music_style: ["Beatles em ritmo de samba e carnaval."],
      structure: "Apoio público padrão.",
      end_time: "Por volta de 23h.",
    },
    missing_fields: ["concentration", "route", "dispersal", "my_take"],
  },

  // ── 18 de fevereiro — quarta ─────────────────────────────────
  {
    id: "me-enterra-na-4a",
    dateISO: "2026-02-18",
    name: "Me Enterra na Quarta",
    neighborhood: "Centro",
    neighborhoodShort: "Centro",
    tag: "clássico",
    address: "circuito do Centro",
    shortDescription: "Despedida do carnaval.",
    time: "13:00",
    howToGetShort: "metrô Cinelândia; Uber até ruas próximas.",
    audienceShort: "público que não aceita que acabou.",
    musicShort: "marchinhas clássicas e repertório nostálgico.",
    extraDetails: {
      how_to_get_full: [
        "Metrô: Cinelândia.",
        "Uber até ruas próximas.",
      ],
      vibe: [
        "Bloco de despedida do carnaval.",
        "Faixa etária: 25–50.",
        "Público que não aceita que acabou.",
      ],
      music_style: ["Marchinhas clássicas e repertório nostálgico."],
      structure: "Padrão Centro.",
      end_time: "Fim da tarde.",
    },
    missing_fields: ["concentration", "route", "dispersal", "my_take"],
  },
  {
    id: "planta-na-mente",
    dateISO: "2026-02-18",
    name: "Planta Na Mente",
    neighborhood: "Lapa",
    neighborhoodShort: "Lapa",
    tag: "raiz",
    address: "Praça Cardeal Câmara, 71",
    shortDescription: "",
    time: "14:00",
    howToGetShort: "",
    audienceShort: "",
    musicShort: "",
    missing_fields: ["concentration", "route", "dispersal", "how_to_get_there", "vibe_details", "music_style", "structure", "end_time", "my_take"],
  },

  // ── 19 de fevereiro — quinta ─────────────────────────────────
  {
    id: "fundo-de-quintal",
    dateISO: "2026-02-19",
    name: "Fundo de Quintal no Bar da Lapa",
    neighborhood: "Centro/Lapa",
    neighborhoodShort: "Lapa",
    tag: "raiz",
    address: "região da Lapa",
    shortDescription: "Samba forte, clima de roda tradicional.",
    time: "18:00",
    howToGetShort: "metrô Carioca; Uber direto ao endereço.",
    audienceShort: "público 30+, sambistas e casais.",
    musicShort: "samba raiz.",
    extraDetails: {
      how_to_get_full: [
        "Metrô Carioca.",
        "Uber direto ao endereço.",
      ],
      vibe: [
        "Samba forte, clima de roda tradicional.",
        "Faixa etária: 28–55.",
        "Público 30+, sambistas e casais.",
      ],
      music_style: ["Samba raiz."],
      structure: "Evento em bar estruturado.",
      end_time: "Por volta de 23h.",
    },
    missing_fields: ["concentration", "route", "dispersal", "my_take"],
  },

  // ── 21 de fevereiro — sábado ─────────────────────────────────
  {
    id: "bloconce",
    dateISO: "2026-02-21",
    name: "Bloconcé",
    neighborhood: "Flamengo",
    neighborhoodShort: "Flamengo",
    tag: "moderno",
    address: "Praia do Flamengo",
    shortDescription: "Pop, coreografado e divertido.",
    time: "09:00",
    howToGetShort: "metrô Flamengo; Uber até Largo do Machado e segue a pé.",
    audienceShort: "jovens adultos e fãs de pop.",
    musicShort: "pop nacional e internacional.",
    extraDetails: {
      how_to_get_full: [
        "Metrô Flamengo.",
        "Uber até Largo do Machado e segue a pé.",
      ],
      vibe: [
        "Pop, coreografado e divertido.",
        "Faixa etária: 20–35.",
        "Jovens adultos e fãs de música pop.",
      ],
      music_style: ["Pop nacional e internacional."],
      structure: "Apoio público padrão Aterro.",
      end_time: "13h.",
    },
    missing_fields: ["concentration", "route", "dispersal", "my_take"],
  },
  {
    id: "batafa",
    dateISO: "2026-02-21",
    name: "Batafá",
    neighborhood: "Laranjeiras",
    neighborhoodShort: "Laranjeiras",
    tag: "clássico",
    address: "região das Laranjeiras",
    shortDescription: "Bairro, mais tranquilo.",
    time: "10:00",
    howToGetShort: "metrô Largo do Machado + caminhada.",
    audienceShort: "moradores e famílias.",
    musicShort: "samba e marchinhas.",
    extraDetails: {
      how_to_get_full: [
        "Metrô Largo do Machado + caminhada.",
      ],
      vibe: [
        "Bairro, mais tranquilo.",
        "Faixa etária: variada.",
        "Moradores e famílias.",
      ],
      music_style: ["Samba e marchinhas."],
      end_time: "Início da tarde.",
    },
    missing_fields: ["concentration", "route", "dispersal", "structure", "my_take"],
  },
  {
    id: "chule-de-santa",
    dateISO: "2026-02-21",
    name: "Chulé de Santa",
    neighborhood: "Santa Teresa",
    neighborhoodShort: "Santa Teresa",
    tag: "moderno",
    address: "Santa Teresa",
    shortDescription: "Alternativo, artístico.",
    time: "12:00",
    howToGetShort: "metrô Carioca + subida de Uber.",
    audienceShort: "público criativo e moradores do bairro.",
    musicShort: "samba e alternativo.",
    extraDetails: {
      how_to_get_full: [
        "Metrô Carioca + subida de Uber.",
      ],
      vibe: [
        "Alternativo, artístico.",
        "Faixa etária: 25–45.",
        "Público criativo e moradores do bairro.",
      ],
      music_style: ["Samba e alternativo."],
      end_time: "Final da tarde.",
    },
    missing_fields: ["concentration", "route", "dispersal", "structure", "my_take"],
  },
  {
    id: "bloco-beatles-para-criancas",
    dateISO: "2026-02-21",
    name: "Bloco Beatles Para Crianças",
    neighborhood: "Gávea",
    neighborhoodShort: "Gávea",
    tag: "infantil",
    address: "Gávea",
    shortDescription: "Totalmente familiar.",
    time: "15:00",
    howToGetShort: "Uber direto ao local.",
    audienceShort: "pais e crianças pequenas (até 10 anos).",
    musicShort: "Beatles adaptado para crianças.",
    extraDetails: {
      how_to_get_full: [
        "Uber direto ao local.",
      ],
      vibe: [
        "Infantil, totalmente familiar.",
        "Pais e crianças pequenas.",
      ],
      music_style: ["Beatles adaptado para crianças."],
      end_time: "Fim de tarde.",
    },
    missing_fields: ["concentration", "route", "dispersal", "structure", "my_take"],
  },

  // ── 22 de fevereiro — domingo ────────────────────────────────
  {
    id: "bloco-little-be",
    dateISO: "2026-02-22",
    name: "Bloco Little Be",
    neighborhood: "Ipanema",
    neighborhoodShort: "Ipanema",
    tag: "infantil",
    address: "Praça General Osório",
    shortDescription: "Familiar, tranquilo.",
    time: "08:00",
    howToGetShort: "metrô General Osório.",
    audienceShort: "pais e crianças.",
    musicShort: "repertório infantil e marchinhas leves.",
    extraDetails: {
      concentration: "Praça General Osório",
      how_to_get_full: [
        "Metrô General Osório.",
      ],
      vibe: [
        "Familiar, tranquilo.",
        "Pais e crianças.",
      ],
      music_style: ["Repertório infantil e marchinhas leves."],
      end_time: "11h.",
    },
    missing_fields: ["route", "dispersal", "structure", "my_take"],
  },
  {
    id: "filhos-da-puc",
    dateISO: "2026-02-22",
    name: "Filhos da PUC",
    neighborhood: "Leblon (PUC/Gávea)",
    neighborhoodShort: "Gávea",
    tag: "moderno",
    address: "região da PUC / Gávea",
    shortDescription: "Universitário e jovem.",
    time: "09:00",
    howToGetShort: "Uber direto à região.",
    audienceShort: "estudantes e jovens adultos (18–30).",
    musicShort: "samba e hits carnavalescos.",
    extraDetails: {
      how_to_get_full: [
        "Uber direto à região.",
      ],
      vibe: [
        "Universitário e jovem.",
        "Faixa etária: 18–30.",
        "Estudantes e jovens adultos.",
      ],
      music_style: ["Samba e hits carnavalescos."],
      end_time: "Meio da tarde.",
    },
    missing_fields: ["concentration", "route", "dispersal", "structure", "my_take"],
  },
  {
    id: "boka-de-espuma",
    dateISO: "2026-02-22",
    name: "Boka de Espuma",
    neighborhood: "Botafogo",
    neighborhoodShort: "Botafogo",
    tag: "irreverente",
    address: "Botafogo",
    shortDescription: "Irreverente e animado.",
    time: "14:00",
    howToGetShort: "metrô Botafogo.",
    audienceShort: "jovens adultos e grupos grandes (20–40).",
    musicShort: "samba e pop.",
    extraDetails: {
      how_to_get_full: [
        "Metrô Botafogo.",
      ],
      vibe: [
        "Irreverente e animado.",
        "Faixa etária: 20–40.",
        "Jovens adultos e grupos grandes.",
      ],
      music_style: ["Samba e pop."],
      end_time: "Final da tarde.",
    },
    missing_fields: ["concentration", "route", "dispersal", "structure", "my_take"],
  },
  {
    id: "saideira",
    dateISO: "2026-02-22",
    name: "Saideira",
    neighborhood: "Leme",
    neighborhoodShort: "Leme",
    tag: "clássico",
    address: "orla do Leme",
    shortDescription: "Clima de encerramento.",
    time: "16:00",
    howToGetShort: "metrô Cardeal Arcoverde + caminhada.",
    audienceShort: "público misturado.",
    musicShort: "marchinhas e samba.",
    extraDetails: {
      how_to_get_full: [
        "Metrô Cardeal Arcoverde + caminhada.",
      ],
      vibe: [
        "Clima de encerramento.",
        "Faixa etária: variada.",
        "Público misturado.",
      ],
      music_style: ["Marchinhas e samba."],
      end_time: "Início da noite.",
    },
    missing_fields: ["concentration", "route", "dispersal", "structure", "my_take"],
  },
];

/** All unique ISO dates in order */
export const carnivalDates: string[] = [
  ...new Set(carnivalBlocks.map((b) => b.dateISO)),
];

/** Get blocks for a specific ISO date, sorted by start hour (ascending) */
export function getBlocksByDate(dateISO: string): CarnivalBlock[] {
  return carnivalBlocks
    .filter((b) => b.dateISO === dateISO)
    .sort((a, b) => parseInt(a.time) - parseInt(b.time));
}

/** Find a single block by slug/id */
export function getBlockById(id: string): CarnivalBlock | undefined {
  return carnivalBlocks.find((b) => b.id === id);
}

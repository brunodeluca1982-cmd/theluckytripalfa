/**
 * LUCKY LIST — RIO DE JANEIRO
 * 
 * PREMIUM LAYER - Subscriber-only content
 * 
 * Rules:
 * - Every block is explicitly labeled: "Lucky List only — premium layer"
 * - Uses consistent Lucky List Detail template
 * - Reserved fields: "External booking / partner link", "Media area"
 * - Items outside base map neighborhoods ONLY live here
 */

import type { ImageStatus } from '@/lib/image-utils';

export interface LuckyListItem {
  id: string;
  title: string;
  category: string;
  neighborhoodId: string | null; // null = city-level or outside base map
  neighborhoodName: string | null;
  teaser: string;
  googleMaps?: string;
  instagram?: string;
  price?: string;
  description: string;
  externalLink?: string;
  mediaUrl?: string;
  image_url?: string | null;
  image_source_url?: string | null;
  image_credit?: string | null;
  image_status?: ImageStatus;
  /** Internal label for premium content */
  premiumLabel: "Lucky List only — premium layer";
}

export const luckyListIntro = `Exclusiva para assinantes | Bruno De Luca — The Lucky Trip
Aqui estão os detalhes que não cabem no guia aberto.
Não são lugares novos — são formas melhores de viver os lugares.`;

export const luckyListItems: LuckyListItem[] = [
  // IPANEMA
  {
    id: "trechos-praia-ipanema",
    title: "Trechos certos da Praia de Ipanema",
    category: "Praia",
    neighborhoodId: "ipanema",
    neighborhoodName: "Ipanema",
    teaser: "Ipanema muda completamente de acordo com o quarteirão.",
    description: `Ipanema muda completamente de acordo com o quarteirão.

• Entre Vinicius de Moraes e Aníbal de Mendonça
Trecho mais equilibrado da praia.
Menos tumulto, mais famílias, casais e moradores.
Bom para quem quer ficar mais tempo sem stress.

📍 Como chegar
Desça pela Rua Vinicius de Moraes e caminhe até a areia.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  {
    id: "por-do-sol-arpoador-sem-muvuca",
    title: "Onde ficar no pôr do sol do Arpoador (sem muvuca)",
    category: "Experiência",
    neighborhoodId: "ipanema",
    neighborhoodName: "Ipanema",
    teaser: "Todo mundo vai, poucos sabem onde parar.",
    description: `Todo mundo vai, poucos sabem onde parar.

• Pedras laterais com menos fluxo
• Ângulos onde o som da multidão não chega
• Melhor posição para sentar sem ficar espremido

📍 Acesso
Caminhe pela lateral esquerda das pedras olhando para o mar.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  {
    id: "sup-nascer-do-sol",
    title: "Stand Up Paddle ao nascer do sol",
    category: "Experiência",
    neighborhoodId: "ipanema",
    neighborhoodName: "Ipanema",
    teaser: "Experiência transformadora, mas só se feita direito.",
    instagram: "@supcopa",
    description: `Experiência transformadora, mas só se feita direito.

• Vá durante a semana
• Chegue antes das 6h
• Evite qualquer feriado

📍 Referência
Arpoador / início de Copacabana`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // URCA (Outside base map - Lucky List only)
  {
    id: "pista-claudio-coutinho-leitura",
    title: "Pista Cláudio Coutinho — leitura correta do uso",
    category: "Caminhada / Trilha",
    neighborhoodId: null,
    neighborhoodName: "Urca",
    teaser: "Todo mundo caminha, poucos entendem o ritmo.",
    description: `Todo mundo caminha, poucos entendem o ritmo.

• Manhã cedo ou fim de tarde
• Meio do dia é quente e cheio
• Extremamente segura por ser área militar

📍 Acesso
Uber direto até "Pista Cláudio Coutinho".`,
    premiumLabel: "Lucky List only — premium layer",
  },
  {
    id: "trilha-morro-urca",
    title: "Trilha do Morro da Urca — como fazer sem erro",
    category: "Caminhada / Trilha",
    neighborhoodId: null,
    neighborhoodName: "Urca",
    teaser: "A trilha é moderada, mas exige atenção.",
    description: `A trilha é moderada, mas exige atenção.

• Leve água
• Não vá após chuva
• Vá cedo
• Evite fins de semana

📍 Início
Final da Pista Cláudio Coutinho.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  {
    id: "passeio-barco-urca",
    title: "Passeio de barco discreto na Urca",
    category: "Experiência",
    neighborhoodId: null,
    neighborhoodName: "Urca",
    teaser: "Pouca gente percebe, mas existem barcos pequenos ali.",
    description: `Pouca gente percebe, mas existem barcos pequenos ali.
É uma forma silenciosa e linda de ver a Baía e o Pão de Açúcar.

📍 Onde
Em frente à Mureta da Urca, converse diretamente com os barqueiros no fim de tarde.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // JARDIM BOTÂNICO
  {
    id: "jardim-botanico-criancas",
    title: "Jardim Botânico com crianças (roteiro interno)",
    category: "Parque",
    neighborhoodId: "jardim-botanico",
    neighborhoodName: "Jardim Botânico",
    teaser: "Funciona melhor se você seguir um caminho específico.",
    description: `Funciona melhor se você seguir um caminho específico.

• Entrada certa
• Trechos planos
• Áreas com sombra
• Animais que sempre atraem atenção

📍 Acesso
Uber até "Jardim Botânico RJ".`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // GÁVEA
  {
    id: "parque-lage-quando-vale",
    title: "Parque Lage — quando realmente vale a pena",
    category: "Parque",
    neighborhoodId: "gavea",
    neighborhoodName: "Gávea",
    teaser: "O parque muda muito conforme o horário.",
    description: `O parque muda muito conforme o horário.

• Antes das 9h: silencioso e bonito
• Depois das 10h: cheio e ruidoso

📍 Acesso
Uber até "Parque Lage".`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // SANTA TERESA
  {
    id: "bondinho-santa-teresa",
    title: "Bondinho de Santa Teresa — melhor horário",
    category: "Experiência",
    neighborhoodId: "santa-teresa",
    neighborhoodName: "Santa Teresa",
    teaser: "Não é transporte, é experiência.",
    description: `Não é transporte, é experiência.

• Evite início da manhã e fim da tarde
• Meio da manhã funciona melhor

📍 Embarque
Centro do Rio.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  {
    id: "parque-ruinas",
    title: "Parque das Ruínas — onde parar",
    category: "Experiência",
    neighborhoodId: "santa-teresa",
    neighborhoodName: "Santa Teresa",
    teaser: "Vista muda conforme o ponto.",
    description: `Vista muda conforme o ponto.

• Vá até o final do mirante
• Evite horários de excursão

📍 Acesso
Depois do bondinho, caminhada curta.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // GUARATIBA (Outside base map - Lucky List only)
  {
    id: "bira-guaratiba",
    title: "Bira de Guaratiba — onde sentar",
    category: "Experiência",
    neighborhoodId: null,
    neighborhoodName: "Guaratiba",
    teaser: "A vista muda completamente de mesa para mesa.",
    description: `A vista muda completamente de mesa para mesa.

• Priorize mesas externas
• Vá no fim da tarde
• Evite chegar com pressa

📍 Acesso
Carro ou Uber. Distância faz parte da experiência.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  {
    id: "casa-do-remo",
    title: "Casa do Remo — leitura do lugar",
    category: "Experiência",
    neighborhoodId: null,
    neighborhoodName: "Guaratiba",
    teaser: "Aqui não é sobre comer rápido.",
    description: `Aqui não é sobre comer rápido.

• Vá para ficar
• Observe o entorno
• Clima silencioso e contemplativo

📍 Acesso
Uber direto para Guaratiba.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // BARRA DA TIJUCA
  {
    id: "melhor-trecho-ciclovia-barra",
    title: "Melhor trecho da ciclovia da Barra",
    category: "Atividade ao ar livre",
    neighborhoodId: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
    teaser: "Nem toda a orla é igual.",
    description: `Nem toda a orla é igual.

• Jardim Oceânico até Reserva
• Mais vento, menos gente, visual melhor

📍 Acesso
Entrada pelo Jardim Oceânico.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // GRUMARI (Outside base map - Lucky List only)
  {
    id: "grumari-onde-parar",
    title: "Grumari — onde parar",
    category: "Praia",
    neighborhoodId: null,
    neighborhoodName: "Grumari",
    teaser: "Não fique na primeira entrada.",
    description: `Não fique na primeira entrada.

• Caminhe um pouco mais
• Menos carros
• Mais natureza

📍 Acesso
Carro é essencial.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // RECREIO
  {
    id: "prainha-dia-certo",
    title: "Prainha — dia certo",
    category: "Praia",
    neighborhoodId: "recreio",
    neighborhoodName: "Recreio",
    teaser: "Funciona muito melhor fora do fim de semana.",
    description: `Funciona muito melhor fora do fim de semana.

📍 Acesso
Carro ou Uber.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // CENTRO
  {
    id: "ccbb-rua-mercado-saida",
    title: "CCBB + Rua do Mercado (saída certa)",
    category: "Cultura",
    neighborhoodId: "centro",
    neighborhoodName: "Centro",
    teaser: "O segredo é a ordem.",
    description: `O segredo é a ordem.

• Entre pelo CCBB
• Saia pela Rua do Mercado
• Fins de semana têm samba familiar

📍 Acesso
VLT ou Uber.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // PORTO MARAVILHA (Outside base map - Lucky List only)
  {
    id: "aquario-museu-amanha-criancas",
    title: "Aquário + Museu do Amanhã com crianças",
    category: "Cultura",
    neighborhoodId: null,
    neighborhoodName: "Porto Maravilha",
    teaser: "Faça tudo andando.",
    description: `Faça tudo andando.

📍 Acesso
VLT "AquaRio".`,
    premiumLabel: "Lucky List only — premium layer",
  },
  
  // FLORESTA DA TIJUCA (Outside base map - Lucky List only)
  {
    id: "pedra-bonita",
    title: "Pedra Bonita",
    category: "Trilha",
    neighborhoodId: null,
    neighborhoodName: "Floresta da Tijuca",
    teaser: "Trilha fácil a moderada com vista incrível.",
    description: `Trilha fácil a moderada.
Curta, acessível e com uma das vistas mais bonitas do Rio.
Ótima opção para quem quer trilha sem sofrimento.`,
    premiumLabel: "Lucky List only — premium layer",
  },
  {
    id: "pedra-da-gavea",
    title: "Pedra da Gávea",
    category: "Trilha",
    neighborhoodId: null,
    neighborhoodName: "Floresta da Tijuca",
    teaser: "Trilha difícil, exige preparo físico.",
    description: `Trilha difícil.
Exige preparo físico e atenção.
Não recomendo sem guia para quem não conhece.
Vista espetacular, mas não é passeio casual.`,
    premiumLabel: "Lucky List only — premium layer",
  },
];

// Group Lucky List items by neighborhood for display
export const getLuckyListByNeighborhood = (): Record<string, LuckyListItem[]> => {
  const grouped: Record<string, LuckyListItem[]> = {};
  
  luckyListItems.forEach(item => {
    const key = item.neighborhoodName || "Fora do Mapa";
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  
  return grouped;
};

// Get items that are outside the base map (for special display)
export const getOutsideBaseMapItems = (): LuckyListItem[] => {
  return luckyListItems.filter(item => item.neighborhoodId === null);
};

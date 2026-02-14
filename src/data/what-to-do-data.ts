/**
 * O QUE FAZER — RIO DE JANEIRO
 * 
 * PUBLIC LAYER - Accessible to all users
 * 
 * Rules:
 * - Organized strictly by neighborhood
 * - Each item belongs to ONE neighborhood only
 * - Uses consistent Activity Detail template
 * - Reserved fields: "External booking / partner link", "Media area"
 * - Only BASE MAP neighborhoods can appear here
 */

import type { ImageStatus } from './carnival-blocks';

export interface Activity {
  id: string;
  title: string;
  category: string;
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
}

export interface NeighborhoodActivities {
  neighborhoodId: string;
  neighborhoodName: string;
  introText: string;
  activities: Activity[];
}

export const whatToDoIntro = `No Rio, o que fazer nunca é só o lugar.
É quem frequenta, a hora certa, o jeito de chegar e o que você faz depois.
Aqui estão as experiências essenciais para entender a cidade — e, quando houver camadas menos óbvias, eu te levo para a Lucky List.`;

export const activitiesByNeighborhood: Record<string, NeighborhoodActivities> = {
  ipanema: {
    neighborhoodId: "ipanema",
    neighborhoodName: "Ipanema",
    introText: "",
    activities: [
      {
        id: "praia-ipanema",
        title: "Praia de Ipanema",
        category: "Praia",
        description: `Ipanema é mais do que uma praia: é um estado de espírito carioca.
Foi aqui que o Rio ganhou projeção cultural internacional, da bossa nova ao lifestyle moderno, misturando artistas, intelectuais, esportistas, moradores antigos e visitantes do mundo todo.
Ao longo das décadas, cada trecho da areia ganhou identidade própria, grupos diferentes, horários específicos e rituais que se repetem até hoje.
É uma praia democrática, viva, observada e observadora.
Se você quer apenas sentir Ipanema, caminhar pela orla já resolve.
Mas se quiser entender onde ir, em que horário e por quê, os melhores trechos e picos estão detalhados na Lucky List clicável.`,
      },
      {
        id: "por-do-sol-arpoador",
        title: "Pôr do sol no Arpoador",
        category: "Experiência",
        description: `Clássico absoluto do Rio.
Aqui o sol se põe no mar, algo raro na costa brasileira, e isso transformou o lugar num ritual coletivo.
Funciona todos os dias, mas em dias de semana o clima é mais fluido.
As pessoas se sentam nas pedras, o silêncio cresce aos poucos e, quando o sol toca o horizonte, o aplauso acontece quase sem combinar.
O Arpoador tem muitos segredos além do óbvio.
Para entender os melhores pontos, horários, ângulos e rotas menos cheias, vá para a Lucky List.`,
      },
      {
        id: "sup-arpoador",
        title: "Stand Up Paddle no Arpoador",
        category: "Experiência",
        description: `Experiência simples e poderosa.
Ver o sol nascer de dentro do mar é algo que marca.
Nível fácil, feito com instrutor.
Evite fins de semana e alta temporada: fica realmente lotado.`,
      },
    ],
  },
  "jardim-botanico": {
    neighborhoodId: "jardim-botanico",
    neighborhoodName: "Jardim Botânico",
    introText: "",
    activities: [
      {
        id: "jardim-botanico-parque",
        title: "Jardim Botânico",
        category: "Parque",
        description: `Um dos espaços mais bonitos e bem cuidados da cidade.
Funciona muito bem para famílias, inclusive com crianças pequenas.
Plano, agradável, educativo e silencioso.
Um respiro verde no meio do Rio.`,
      },
    ],
  },
  gavea: {
    neighborhoodId: "gavea",
    neighborhoodName: "Gávea",
    introText: "",
    activities: [
      {
        id: "parque-lage",
        title: "Parque Lage",
        category: "Parque",
        description: `Cenário cinematográfico aos pés do Corcovado.
É daqueles lugares que impressionam mesmo quem já mora no Rio.
Caminhada leve, visual marcante e clima artístico.
Bom para manhãs sem pressa.`,
      },
    ],
  },
  "sao-conrado": {
    neighborhoodId: "sao-conrado",
    neighborhoodName: "São Conrado",
    introText: "",
    activities: [
      {
        id: "voo-asa-delta",
        title: "Voo de asa-delta ou parapente",
        category: "Experiência",
        description: `Uma das experiências mais impactantes da cidade.
Decola da Pedra Bonita e pousa na praia de São Conrado.
Nível fácil com instrutor.
Sensação de liberdade total.`,
      },
    ],
  },
  "barra-da-tijuca": {
    neighborhoodId: "barra-da-tijuca",
    neighborhoodName: "Barra da Tijuca",
    introText: "",
    activities: [
      {
        id: "ciclovia-barra",
        title: "Ciclovia da Orla da Barra",
        category: "Atividade ao ar livre",
        description: `Longa, plana e com visual aberto.
Ideal para bike, caminhada ou corrida.`,
      },
      {
        id: "por-do-sol-pier-barra",
        title: "Pôr do sol no Píer da Barra",
        category: "Experiência",
        description: `Um dos pores do sol mais amplos da cidade.
Menos turístico que a Zona Sul, mais contemplativo.`,
      },
    ],
  },
  recreio: {
    neighborhoodId: "recreio",
    neighborhoodName: "Recreio",
    introText: "",
    activities: [
      {
        id: "prainha",
        title: "Prainha",
        category: "Praia",
        description: `Mais selvagem e preservada.
Boa para surf e para quem quer fugir do óbvio.`,
      },
    ],
  },
  centro: {
    neighborhoodId: "centro",
    neighborhoodName: "Centro",
    introText: "",
    activities: [
      {
        id: "ccbb-rio",
        title: "CCBB Rio",
        category: "Cultura",
        description: `O prédio por si só já vale a visita.
Exposições bem curadas e acesso fácil.`,
      },
      {
        id: "rua-do-mercado",
        title: "Rua do Mercado",
        category: "Cultura",
        description: `Região revitalizada, especialmente viva nos fins de semana.
Rodas de samba, bares e clima de centro histórico reocupado.`,
      },
    ],
  },
  // Empty neighborhoods (base map but no public activities yet)
  leblon: {
    neighborhoodId: "leblon",
    neighborhoodName: "Leblon",
    introText: "",
    activities: [],
  },
  copacabana: {
    neighborhoodId: "copacabana",
    neighborhoodName: "Copacabana",
    introText: "",
    activities: [],
  },
  leme: {
    neighborhoodId: "leme",
    neighborhoodName: "Leme",
    introText: "",
    activities: [],
  },
  arpoador: {
    neighborhoodId: "arpoador",
    neighborhoodName: "Arpoador",
    introText: "",
    activities: [],
  },
  botafogo: {
    neighborhoodId: "botafogo",
    neighborhoodName: "Botafogo",
    introText: "",
    activities: [],
  },
  flamengo: {
    neighborhoodId: "flamengo",
    neighborhoodName: "Flamengo",
    introText: "",
    activities: [],
  },
  "santa-teresa": {
    neighborhoodId: "santa-teresa",
    neighborhoodName: "Santa Teresa",
    introText: "",
    activities: [],
  },
};

// City-level iconic experiences (shown on main O Que Fazer page)
export const cityLevelActivities = [
  {
    id: "cristo-redentor",
    title: "Cristo Redentor",
    description: "A icônica estátua no topo do Corcovado.",
  },
  {
    id: "pao-de-acucar",
    title: "Pão de Açúcar",
    description: "Passeio de bondinho com vistas panorâmicas.",
  },
];

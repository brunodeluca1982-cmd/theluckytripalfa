export interface Camarote {
  id: string;
  name: string;
  reality: string;
  whoAttends: string;
  whatToExpect: string;
  energy: string;
}

export interface StrategicCategory {
  id: string;
  label: string;
  icon: string; // lucide icon name hint
  camarotes: { name: string; reason: string; audienceProfile: string; energy: string }[];
}

export interface DecisionShortcut {
  intent: string;
  camaroteName: string;
}

export const strategicCategories: StrategicCategory[] = [
  {
    id: "most-exclusive",
    label: "Mais Exclusivo",
    icon: "crown",
    camarotes: [
      {
        name: "Camarote Nº1",
        reason: "Curadoria rigorosa, lista de convidados realmente restrita, menor circulação e público de altíssimo nível.",
        audienceProfile: "Grandes empresários, artistas globais, investidores premium e convidados estratégicos.",
        energy: "Discreto, sofisticado, menos barulho e mais status.",
      },
      {
        name: "Camarote Arpoador",
        reason: "Experiência premium com menos exposição e mais conforto.",
        audienceProfile: "Criativos, executivos off-duty, público mais reservado.",
        energy: "Elegante, confortável e sem histeria.",
      },
    ],
  },
  {
    id: "best-value",
    label: "Melhor Custo-Benefício",
    icon: "sparkles",
    camarotes: [
      {
        name: "Camarote Allegria",
        reason: "Entrega estrutura sólida, open bar completo e ambiente energético a um preço abaixo dos gigantes do topo.",
        audienceProfile: "Grupos jovens, amigos, público misto.",
        energy: "Festa acessível sem perder qualidade.",
      },
      {
        name: "Camarote VerdeRosa",
        reason: "Infraestrutura sólida, conforto consistente e preço mais equilibrado.",
        audienceProfile: "Turistas conscientes, empresários locais, cariocas tradicionais.",
        energy: "Confortável e seguro.",
      },
    ],
  },
  {
    id: "best-networking",
    label: "Melhor para Networking",
    icon: "users",
    camarotes: [
      {
        name: "Nosso Camarote",
        reason: "Alta concentração de empresários, influenciadores e marcas patrocinadoras.",
        audienceProfile: "Executivos, criadores, convidados corporativos.",
        energy: "Festival corporativo com Carnaval acontecendo dentro.",
      },
      {
        name: "Camarote Nº1",
        reason: "Networking mais seletivo e menos diluído.",
        audienceProfile: "Alto nível empresarial e círculo artístico.",
        energy: "Conversas estratégicas entre escolas de samba.",
      },
    ],
  },
  {
    id: "best-content",
    label: "Melhor para Conteúdo",
    icon: "camera",
    camarotes: [
      {
        name: "Nosso Camarote",
        reason: "Line-up forte, celebridades e alto volume de momentos prontos para o Instagram.",
        audienceProfile: "Influenciadores, marcas e criadores de conteúdo.",
        energy: "Holofote constante.",
      },
      {
        name: "Camarote Allegria",
        reason: "Ambiente jovem, shows animados e forte densidade visual para vídeo.",
        audienceProfile: "Público digital e comunicativo.",
        energy: "Fluxo orgânico de conteúdo fácil.",
      },
    ],
  },
];

export const honestRanking: Camarote[] = [
  {
    id: "n1",
    name: "Camarote Nº1",
    reality: "O único que ainda mantém um filtro real. Não é sobre volume. É sobre curadoria.",
    whoAttends: "Grandes empresários, artistas de primeiro escalão e convidados estratégicos.",
    whatToExpect: "Menos euforia coletiva. Mais conversas significativas.",
    energy: "Mais Verdadeiramente Exclusivo",
  },
  {
    id: "nosso",
    name: "Nosso Camarote",
    reality: "O mais midiático. Se você quer visibilidade, esse é o lugar.",
    whoAttends: "Influenciadores, patrocinadores, executivos, marcas.",
    whatToExpect: "Estrutura de festival. Alta densidade. Câmeras em toda parte.",
    energy: "Maior Vitrine Social",
  },
  {
    id: "arpoador",
    name: "Camarote Arpoador",
    reality: "Menos barulho, mais conforto. Não tenta ser o maior.",
    whoAttends: "Executivos relaxados, criativos, público mais maduro.",
    whatToExpect: "Experiência confortável e menos congestionada.",
    energy: "Melhor Equilíbrio",
  },
  {
    id: "allegria",
    name: "Camarote Allegria",
    reality: "Entrega energia forte sem cobrar como o topo da pirâmide.",
    whoAttends: "Grupos jovens, turistas animados, público social.",
    whatToExpect: "Alta energia e ambiente descontraído.",
    energy: "Melhor Festa pelo Preço",
  },
  {
    id: "verderosa",
    name: "Camarote VerdeRosa",
    reality: "Não é hype, mas é confiável. Infraestrutura sólida.",
    whoAttends: "Empresários locais, famílias e turistas que buscam segurança.",
    whatToExpect: "Carnaval confortável sem exagero.",
    energy: "Tradicional e Confortável",
  },
];

export const decisionShortcuts: DecisionShortcut[] = [
  { intent: "Se você quer status real", camaroteName: "Camarote Nº1" },
  { intent: "Se você quer visibilidade", camaroteName: "Nosso Camarote" },
  { intent: "Se você quer equilíbrio", camaroteName: "Camarote Arpoador" },
  { intent: "Se você quer festa com melhor preço", camaroteName: "Camarote Allegria" },
  { intent: "Se você quer conforto sem excesso", camaroteName: "Camarote VerdeRosa" },
];

export interface PublicProfile {
  id: string;
  label: string;
  description: string;
}

export const publicAnalysis: PublicProfile[] = [
  { id: "paulistas", label: "Paulistas", description: "Chegam organizados, ingressos comprados antecipadamente, foco total na experiência premium." },
  { id: "mineiros", label: "Mineiros", description: "Animados, sociáveis, circulam bem entre camarotes." },
  { id: "cariocas", label: "Cariocas", description: "Sabem se movimentar, ficam menos dentro e mais vivendo os arredores." },
  { id: "moderno", label: "Público Moderno", description: "Mix de criativos, publicitários e empreendedores de tech." },
  { id: "tradicional", label: "Público Tradicional", description: "Empresários locais e famílias influentes." },
];

export const closingStatement = "Carnaval não é sobre onde você está. É sobre o que você quer viver dentro dele.";

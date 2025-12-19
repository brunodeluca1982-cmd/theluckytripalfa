/**
 * ═══════════════════════════════════════════════════════════════════════════
 * THE LUCKY TRIP — AI ASSISTANT KNOWLEDGE BASE
 * "Inteligência Humana em Viagens"
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ██████████████████████████████████████████████████████████████████████████
 * ██  SYSTEM PROMPT LOCK — DO NOT MODIFY                                  ██
 * ██████████████████████████████████████████████████████████████████████████
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * LANGUAGE RULE
 * ═══════════════════════════════════════════════════════════════════════════
 * - Always communicate in Brazilian Portuguese
 * - Interface labels and questions MUST be in Portuguese
 * - No English output to user ever
 * - No emojis
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SCOPE RULE (CRITICAL)
 * ═══════════════════════════════════════════════════════════════════════════
 * - ONLY use information from The Lucky Trip internal database
 * - Do NOT invent places, restaurants, attractions, distances or prices
 * - If information is unavailable, respond EXACTLY with:
 *   "Ih! Essa aí eu não sei te responder… quer falar com o Bruno? 
 *   Chama ele no WhatsApp! 21998102132"
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * ROLE DEFINITION
 * ═══════════════════════════════════════════════════════════════════════════
 * You are NOT a creative travel writer.
 * You are a planner, organizer and validator.
 * 
 * YOUR JOB:
 * - Organize itineraries
 * - Calculate time consistency
 * - Detect logistical problems
 * - Suggest small optimizations based on distance, duration, sequence
 * - Respect the user's choices
 * 
 * DO NOT:
 * - Create new attractions
 * - Suggest alternatives outside the database
 * - Write long explanations
 * - Use emojis
 * - Sound promotional or exaggerated
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * CORE FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 1) BUILD ITINERARY
 *    - Assign start time
 *    - Assign estimated duration (from database)
 *    - Calculate displacement time and distance between activities
 *    - Show timeline clearly
 * 
 * 2) IMPROVE ITINERARY
 *    - Only adjust order, spacing or timing
 *    - Preserve all selected places
 *    - Do NOT add or remove activities unless user asks
 *    - Suggest improvements in short, objective sentences
 * 
 * 3) INCONSISTENCY DETECTION
 *    If problems detected (too far, overlapping times, excessive load):
 *    - Warn politely and clearly
 *    - Examples:
 *      "Esse deslocamento está longo para esse horário."
 *      "Esse dia está muito apertado."
 *    - Offer two options:
 *      "Ajustar automaticamente" / "Manter como está"
 * 
 * 4) CURATION RESPECT
 *    - Activities from "Roteiro do Bruno" have priority
 *    - Never downgrade or question curated items
 *    - Treat them as validated experiences
 * 
 * 5) USER DRAFT FLOW
 *    - Allow activities to move: "Rascunho" → "Meu Roteiro"
 *    - Recalculate times automatically when moved
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * OUTPUT STYLE
 * ═══════════════════════════════════════════════════════════════════════════
 * - Short sentences
 * - Functional tone
 * - No storytelling
 * - No filler
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * SAFETY RULE
 * ═══════════════════════════════════════════════════════════════════════════
 * Medical, legal, financial, or high-stakes questions → trigger fallback
 * 
 * ██████████████████████████████████████████████████████████████████████████
 * ██  END SYSTEM PROMPT LOCK                                              ██
 * ██████████████████████████████████████████████████████████████████████████
 */

/**
 * FIXED FALLBACK MESSAGE — DO NOT MODIFY
 * This exact message must be used when AI cannot answer.
 */
export const AI_FALLBACK_MESSAGE = "Ih! Essa aí eu não sei te responder… quer falar com o Bruno? Chama ele no WhatsApp! 21998102132";

/**
 * Safety/sensitive topics that trigger fallback
 */
export const SAFETY_KEYWORDS = [
  'médico', 'medico', 'hospital', 'emergência', 'emergencia', 'doença', 'doenca',
  'remédio', 'remedio', 'medicamento', 'vacina', 'saúde', 'saude',
  'advogado', 'lei', 'legal', 'processo', 'justiça', 'justica', 'crime',
  'investimento', 'investir', 'banco', 'empréstimo', 'emprestimo', 'financiamento',
  'seguro de vida', 'seguro saúde', 'seguro saude',
  'droga', 'drogas', 'ilegal', 'polícia', 'policia',
  'aborto', 'arma', 'violência', 'violencia',
];

export type KnowledgeTopic = 'chegar' | 'ficar' | 'comer' | 'fazer' | 'seguranca';

export interface KnowledgeEntry {
  id: string;
  topic: KnowledgeTopic;
  title: string;
  text: string;
  keywords: string[];
}

export const RIO_KB: KnowledgeEntry[] = [
  // === CHEGAR (How to get there) ===
  {
    id: 'chegar-aeroporto',
    topic: 'chegar',
    title: 'Aeroportos do Rio',
    text: 'O Rio tem dois aeroportos: Galeão (GIG), principal para voos internacionais e domésticos de longa distância, e Santos Dumont (SDU), mais central, ideal para ponte aérea SP-RJ. Do Galeão até a Zona Sul, espere 40-60 min de carro. Santos Dumont fica a 15 min de Copacabana.',
    keywords: ['aeroporto', 'galeão', 'santos dumont', 'chegar', 'voo', 'avião'],
  },
  {
    id: 'chegar-transporte',
    topic: 'chegar',
    title: 'Do aeroporto ao hotel',
    text: 'Recomendamos Uber ou 99 do aeroporto — seguro e com preço justo. Evite táxis comuns sem agendamento. Do Galeão, a corrida até Ipanema/Leblon custa entre R$90-150. Tem também o BRT Galeão-Alvorada, mas só vale se você conhecer bem a cidade.',
    keywords: ['uber', 'táxi', 'transporte', 'aeroporto', 'hotel'],
  },

  // === FICAR (Where to stay) ===
  {
    id: 'ficar-bairros',
    topic: 'ficar',
    title: 'Melhores bairros para ficar',
    text: 'Para primeira viagem: Ipanema ou Leblon. São seguros, com praia, restaurantes e vida noturna a pé. Copacabana é mais movimentada e tem hotéis mais baratos. Barra da Tijuca é ideal para quem prefere praias mais tranquilas e tem carro.',
    keywords: ['bairro', 'hotel', 'ficar', 'ipanema', 'leblon', 'copacabana', 'barra'],
  },
  {
    id: 'ficar-ipanema-leblon',
    topic: 'ficar',
    title: 'Ipanema vs Leblon',
    text: 'Ipanema é mais vibrante, com mais opções de restaurantes e bares. Leblon é mais tranquilo e familiar, considerado o bairro mais exclusivo do Rio. Ambos têm praias lindas e são muito seguros. A diferença de preço de hospedagem é pequena.',
    keywords: ['ipanema', 'leblon', 'diferença', 'bairro', 'ficar'],
  },

  // === COMER (Where to eat) ===
  {
    id: 'comer-recomendacoes',
    topic: 'comer',
    title: 'Onde comer bem no Rio',
    text: 'Para experiência premium: Oro (Leblon), Lasai (Botafogo) e Oteque (Botafogo) têm estrelas Michelin. Para casual com qualidade: Zazá Bistrô (Ipanema), CT Boucherie (Leblon) e Sushi Leblon. Botecos autênticos: Bracarense e Jobi em Leblon.',
    keywords: ['restaurante', 'comer', 'gastronomia', 'comida', 'onde comer'],
  },
  {
    id: 'comer-cafe',
    topic: 'comer',
    title: 'Cafés e brunch',
    text: 'Para café da manhã especial: Talho Capixaba (Leblon) é clássico, Bibi Sucos para açaí autêntico, e Empório Jardim (Jardim Botânico) para brunch. Fedora e Bazzar também são excelentes opções em Ipanema.',
    keywords: ['café', 'brunch', 'café da manhã', 'açaí'],
  },

  // === FAZER (What to do) ===
  {
    id: 'fazer-3dias',
    topic: 'fazer',
    title: 'O que fazer em 3 dias',
    text: 'Dia 1: Cristo Redentor pela manhã (vá cedo), almoço no Aprazível, tarde em Ipanema. Dia 2: Pão de Açúcar no fim da tarde pro pôr do sol, praia de manhã, jantar em Leblon. Dia 3: Jardim Botânico, Santa Teresa, e despedida com chope no Jobi.',
    keywords: ['3 dias', 'roteiro', 'o que fazer', 'itinerário'],
  },
  {
    id: 'fazer-praia',
    topic: 'fazer',
    title: 'Praias do Rio',
    text: 'Ipanema é a praia mais icônica — vá no Posto 9 pro vibe mais jovem ou Posto 10 mais tranquilo. Leblon é familiar. Copacabana é histórica mas muito cheia. Para praias selvagens: Prainha e Grumari (precisa de carro). Arpoador tem o melhor pôr do sol.',
    keywords: ['praia', 'ipanema', 'copacabana', 'leblon', 'arpoador'],
  },
  {
    id: 'fazer-passeios',
    topic: 'fazer',
    title: 'Passeios imperdíveis',
    text: 'Além do Cristo e Pão de Açúcar: trilha do Morro Dois Irmãos (vista linda de Ipanema), Jardim Botânico, Parque Lage (café no casarão), Escadaria Selarón em Santa Teresa, e passeio de barco pela Baía de Guanabara.',
    keywords: ['passeio', 'turismo', 'cristo', 'pão de açúcar', 'trilha'],
  },

  // === SEGURANÇA (Safety) ===
  {
    id: 'seguranca-geral',
    topic: 'seguranca',
    title: 'Segurança no Rio',
    text: 'O Rio é seguro para turistas nas áreas certas. Zona Sul (Ipanema, Leblon, Copacabana, Botafogo) é tranquila dia e noite. Evite ostentação, não use celular na rua de forma descuidada, e prefira Uber à noite. Na praia, não leve objetos de valor.',
    keywords: ['segurança', 'seguro', 'perigoso', 'roubo', 'cuidado'],
  },
  {
    id: 'seguranca-noite',
    topic: 'seguranca',
    title: 'Sair à noite',
    text: 'A vida noturna em Ipanema e Leblon é segura. Evite andar sozinho em ruas vazias tarde da noite. Lapa é animada mas requer mais atenção — vá em grupo e de Uber. Em Copacabana, prefira a parte de Ipanema (perto do Arpoador).',
    keywords: ['noite', 'balada', 'bar', 'lapa', 'segurança'],
  },
  {
    id: 'seguranca-praia',
    topic: 'seguranca',
    title: 'Segurança na praia',
    text: 'Leve apenas o necessário: canga, protetor, dinheiro trocado e celular velho se possível. Não deixe pertences sozinhos. Use as barracas de praia para guardar coisas enquanto entra no mar. Evite praias desertas ou muito afastadas dos postos.',
    keywords: ['praia', 'segurança', 'roubo', 'pertences'],
  },
];

/**
 * Check if query contains safety/sensitive topics
 * These topics ALWAYS trigger fallback
 */
export const containsSafetyTopic = (query: string): boolean => {
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return SAFETY_KEYWORDS.some(keyword => 
    normalizedQuery.includes(keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))
  );
};

/**
 * Find matching knowledge entries for a user query
 * Returns empty array if no confident match found
 * STRICT MATCHING — no partial guesses
 */
export const findKnowledgeMatch = (query: string): KnowledgeEntry[] => {
  const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Require at least one strong keyword match
  const matches = RIO_KB.filter(entry => {
    const matchesKeyword = entry.keywords.some(keyword => {
      const normalizedKeyword = keyword.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normalizedQuery.includes(normalizedKeyword);
    });
    return matchesKeyword;
  });
  
  return matches;
};

/**
 * Get entries by topic
 */
export const getEntriesByTopic = (topic: KnowledgeTopic): KnowledgeEntry[] => {
  return RIO_KB.filter(entry => entry.topic === topic);
};

/**
 * Topic to destination module mapping for deep links
 */
export const topicToModuleMap: Record<KnowledgeTopic, { path: string; label: string }> = {
  chegar: { path: '/como-chegar', label: 'Como chegar' },
  ficar: { path: '/onde-ficar-rio', label: 'Onde ficar' },
  comer: { path: '/eat-map-view', label: 'Onde comer' },
  fazer: { path: '/o-que-fazer', label: 'O que fazer' },
  seguranca: { path: '/destino/rio-de-janeiro', label: 'Destino' },
};

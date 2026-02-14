/**
 * RIO DE JANEIRO - THE LUCKY TRIP
 * Curated Guide Data
 * 
 * Source: RIO_DE_JANEIRO_THE_LUCKY_TRIP.pdf (Bruno De Luca)
 * DO NOT modify without explicit permission.
 */

import type { ImageStatus } from './carnival-blocks';

// ============= HOTELS =============
export interface GuideHotel {
  id: string;
  name: string;
  neighborhood: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  instagram?: string;
  description: string;
  kidFriendly?: boolean;
  image_url?: string | null;
  image_source_url?: string | null;
  image_credit?: string | null;
  image_status?: ImageStatus;
}

export const guideHotels: GuideHotel[] = [
  // Ipanema & Leblon
  { id: 'fasano', name: 'Hotel Fasano Rio de Janeiro', neighborhood: 'Ipanema', priceLevel: '$$$$', instagram: '@fasano', description: 'O endereço mais clássico do luxo carioca.' },
  { id: 'janeiro', name: 'Janeiro Hotel', neighborhood: 'Leblon', priceLevel: '$$$$', instagram: '@janeirolifestyle', description: 'Minimalista, silencioso e luminoso.' },
  { id: 'ritz-leblon', name: 'Ritz Leblon', neighborhood: 'Leblon', priceLevel: '$$$', instagram: '@ritzleblon', description: 'Discreto e confortável.' },
  { id: 'ipanema-inn', name: 'Ipanema Inn', neighborhood: 'Ipanema', priceLevel: '$$$', instagram: '@ipanemainn', description: 'Pequeno, acolhedor e com clima de casa.' },
  { id: 'mar-ipanema', name: 'Mar Ipanema Hotel', neighborhood: 'Ipanema', priceLevel: '$$$', instagram: '@mariipanemahotel', description: 'Urbano, prático e muito bem localizado.' },
  { id: 'promenade-palladium', name: 'Promenade Palladium', neighborhood: 'Leblon', priceLevel: '$$', instagram: '@promenadehotels', description: 'Tem cara de residência do bairro.' },
  
  // Copacabana & Leme
  { id: 'copa-palace', name: 'Copacabana Palace', neighborhood: 'Copacabana', priceLevel: '$$$$', instagram: '@copacabanapalace', description: 'Ícone absoluto do Brasil.' },
  { id: 'emiliano', name: 'Emiliano Rio', neighborhood: 'Copacabana', priceLevel: '$$$$', instagram: '@emiliano_rio', description: 'Arquitetura elegante, serviço preciso e rooftop reservado.' },
  { id: 'fairmont', name: 'Fairmont Rio', neighborhood: 'Copacabana', priceLevel: '$$$$', instagram: '@fairmontricopacabana', description: 'O antigo Rio Palace. Da piscina, o Pão de Açúcar entra no enquadramento.' },
  { id: 'hilton-copa', name: 'Hilton Copacabana', neighborhood: 'Copacabana', priceLevel: '$$$', instagram: '@hiltoncopacabana', description: 'Hotel grande, vista panorâmica e logística fácil.' },
  { id: 'windsor-leme', name: 'Windsor Leme', neighborhood: 'Leme', priceLevel: '$$$', instagram: '@windsorhoteis', description: 'Mais silencioso, com clima de bairro e mar na porta.' },
  { id: 'arena-leme', name: 'Arena Leme', neighborhood: 'Leme', priceLevel: '$$', instagram: '@arenahotels', description: 'Moderno, funcional e bem localizado.' },
  
  // São Conrado
  { id: 'nacional', name: 'Hotel Nacional', neighborhood: 'São Conrado', priceLevel: '$$$$', instagram: '@hotelnacionalrio', description: 'Projeto de Niemeyer à beira-mar.' },
  
  // Barra da Tijuca
  { id: 'hyatt-barra', name: 'Hyatt Regency Barra', neighborhood: 'Barra da Tijuca', priceLevel: '$$$$', instagram: '@hyattregencyrio', description: 'Clima de resort dentro da cidade.', kidFriendly: true },
  { id: 'windsor-barra', name: 'Windsor Barra', neighborhood: 'Barra da Tijuca', priceLevel: '$$$', instagram: '@windsorhoteis', description: 'Clássico da orla.' },
  { id: 'lsh-barra', name: 'LSH Hotel', neighborhood: 'Jardim Oceânico', priceLevel: '$$$', instagram: '@lshhotel', description: 'Compacto, moderno e bem localizado.' },
  { id: 'laghetto-barra', name: 'Laghetto Stilo Barra', neighborhood: 'Barra da Tijuca', priceLevel: '$$', instagram: '@laghettostilobarra', description: 'Boa relação custo-benefício.' },
  
  // Recreio
  { id: 'c-design', name: 'C Design Hotel', neighborhood: 'Recreio', priceLevel: '$$$', instagram: '@cdesignhotel', description: 'Pé na areia, fachada marcante e clima jovem.' },
  
  // Santa Teresa
  { id: 'santa-teresa-mgallery', name: 'Santa Teresa Hotel RJ MGallery', neighborhood: 'Santa Teresa', priceLevel: '$$$$', instagram: '@santateresahotel', description: 'Refúgio criativo. Amy Winehouse, Alicia Keys e Alanis Morissette já se hospedaram aqui.' },
  { id: 'mama-shelter', name: 'Mama Shelter Rio', neighborhood: 'Santa Teresa', priceLevel: '$$$', instagram: '@mamashelterrj', description: 'Colorido, jovem e animado.' },
];

// ============= RESTAURANTS =============
export interface GuideRestaurant {
  id: string;
  name: string;
  neighborhood: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  category: string;
  instagram?: string;
  description: string;
  kidFriendly?: boolean;
  mealType: ('breakfast' | 'brunch' | 'lunch' | 'dinner' | 'drinks')[];
  image_url?: string | null;
  image_source_url?: string | null;
  image_credit?: string | null;
  image_status?: ImageStatus;
}

export const guideRestaurants: GuideRestaurant[] = [
  // Ipanema
  { id: 'lasai', name: 'Lasai', neighborhood: 'Ipanema', priceLevel: '$$$$', category: 'Alta Gastronomia', instagram: '@lasai_rj', description: 'Um dos restaurantes mais impactantes do Brasil.', mealType: ['dinner'] },
  { id: 'oteque', name: 'Oteque', neighborhood: 'Ipanema', priceLevel: '$$$$', category: 'Alta Gastronomia', instagram: '@oteque_rj', description: 'Entrar no Oteque é como entrar numa cena lenta de cinema.', mealType: ['dinner'] },
  { id: 'nido', name: 'Nido Ristorante', neighborhood: 'Ipanema', priceLevel: '$$$', category: 'Italiano', instagram: '@nidorestaurante', description: 'Meu italiano afetivo. Massas impecáveis.', mealType: ['lunch', 'dinner'] },
  { id: 'zaza', name: 'Zazá Bistrô Café', neighborhood: 'Ipanema', priceLevel: '$$$', category: 'Bistrô', instagram: '@zazabistro', description: 'Delicinhas a qualquer hora do dia.', mealType: ['brunch', 'lunch', 'dinner'], kidFriendly: true },
  { id: 'jobi', name: 'Jobi', neighborhood: 'Ipanema', priceLevel: '$$', category: 'Boteco', instagram: '@jobi_oficial', description: 'Clássico absoluto. Chope bem tirado.', mealType: ['lunch', 'dinner', 'drinks'] },
  { id: 'barzin', name: 'Barzin', neighborhood: 'Ipanema', priceLevel: '$$$', category: 'Bar', instagram: '@barzin', description: 'Boa opção pra começar a noite.', mealType: ['drinks'] },
  
  // Leblon
  { id: 'satyricon', name: 'Satyricon', neighborhood: 'Leblon', priceLevel: '$$$$', category: 'Peixes & Frutos do Mar', instagram: '@satyriconrio', description: 'Meu restaurante de peixes. Clássico, elegante.', mealType: ['lunch', 'dinner'] },
  { id: 'boteco-rainha', name: 'Boteco Rainha', neighborhood: 'Leblon', priceLevel: '$$$', category: 'Brasileiro', instagram: '@botecorainhaleblon', description: 'Comida brasileira muito bem executada.', mealType: ['lunch', 'dinner'] },
  { id: 'gula-gula-leblon', name: 'Gula Gula', neighborhood: 'Leblon', priceLevel: '$$', category: 'Brasileiro', instagram: '@gulagulaoficial', description: 'Restaurante carioca raiz. Funciona sempre.', mealType: ['lunch', 'dinner'], kidFriendly: true },
  { id: 'casa-tua', name: 'Casa Tua', neighborhood: 'Leblon', priceLevel: '$$$', category: 'Italiano', instagram: '@casatua', description: 'Italiano com clima de casa.', mealType: ['lunch', 'dinner'] },
  
  // Copacabana
  { id: 'belmonte', name: 'Belmonte Praia', neighborhood: 'Copacabana', priceLevel: '$$', category: 'Brasileiro', instagram: '@belmonteoficial', description: 'Clássico de frente pro mar. O rooftop é um espetáculo.', mealType: ['lunch', 'dinner', 'drinks'] },
  { id: 'mee', name: 'Mee', neighborhood: 'Copacabana', priceLevel: '$$$$', category: 'Asiático', instagram: '@meerestaurante', description: 'Alta gastronomia asiática dentro do Copacabana Palace.', mealType: ['dinner'] },
  { id: 'cipriani', name: 'Cipriani', neighborhood: 'Copacabana', priceLevel: '$$$$', category: 'Italiano', instagram: '@ciprianiristorante', description: 'Italiano clássico, serviço de alto nível.', mealType: ['dinner'] },
  
  // Jardim Botânico
  { id: 'elena', name: 'Elena', neighborhood: 'Jardim Botânico', priceLevel: '$$$$', category: 'Contemporâneo', instagram: '@elenarestaurante.rj', description: 'Restaurante contemporâneo, sofisticado e animado.', mealType: ['lunch', 'dinner'] },
  { id: 'ella', name: 'Ella Pizzaria', neighborhood: 'Jardim Botânico', priceLevel: '$$', category: 'Pizzaria', instagram: '@ellapizzaria', description: 'Pizza de personalidade. Uma das minhas preferidas.', mealType: ['dinner'], kidFriendly: true },
  { id: 'emporio-jardim', name: 'Empório Jardim', neighborhood: 'Jardim Botânico', priceLevel: '$$', category: 'Café / Brunch', instagram: '@emporiojardim', description: 'Café da manhã e brunch dos mais consistentes do Rio.', mealType: ['breakfast', 'brunch'], kidFriendly: true },
  
  // Lagoa
  { id: 'capricciosa', name: 'Capricciosa', neighborhood: 'Lagoa', priceLevel: '$$$', category: 'Italiano', instagram: '@capricciosaoficial', description: 'Italiano contemporâneo com vista privilegiada da Lagoa.', mealType: ['lunch', 'dinner'] },
  { id: 'ct-boucherie', name: 'CT Boucherie', neighborhood: 'Lagoa', priceLevel: '$$$$', category: 'Contemporâneo', instagram: '@ctboucherie', description: 'Cozinha autoral com técnica francesa e produto brasileiro.', mealType: ['dinner'] },
  
  // São Conrado
  { id: 'gurume-fashion', name: 'Gurumê Fashion Mall', neighborhood: 'São Conrado', priceLevel: '$$$', category: 'Japonês', instagram: '@gurume_oficial', description: 'Japonês moderno, constante e confiável.', mealType: ['lunch', 'dinner'] },
  { id: 'qui-qui', name: 'Qui Qui', neighborhood: 'São Conrado', priceLevel: '$$', category: 'Praia', description: 'Quiosque de praia no Pepino. Casual e conectado ao surf.', mealType: ['lunch'] },
  
  // Barra da Tijuca
  { id: 'mocellin', name: 'Mocellin', neighborhood: 'Barra da Tijuca', priceLevel: '$$$', category: 'Carnes', instagram: '@mocelinrestaurante', description: 'Carne de verdade, tradição e sabor forte.', mealType: ['lunch', 'dinner'] },
  { id: 'barra-grill', name: 'Barra Grill', neighborhood: 'Barra da Tijuca', priceLevel: '$$$', category: 'Carnes', instagram: '@barragrillrestaurante', description: 'Clássico absoluto de carnes na Barra.', mealType: ['lunch', 'dinner'] },
  { id: 'mocellin-mar', name: 'Mocellin Mar', neighborhood: 'Barra da Tijuca', priceLevel: '$$$', category: 'Peixes', instagram: '@mocelinmar', description: 'Especializado em peixes, de frente pra praia.', mealType: ['lunch', 'dinner'] },
  { id: 'gurume-barra', name: 'Gurumê Barra', neighborhood: 'Barra da Tijuca', priceLevel: '$$$', category: 'Japonês', instagram: '@gurume_oficial', description: 'Japonês moderno, constante e confiável.', mealType: ['lunch', 'dinner'] },
  { id: 'pobre-juan', name: 'Pobre Juan VillageMall', neighborhood: 'Barra da Tijuca', priceLevel: '$$$', category: 'Churrascaria', instagram: '@restaurantepobrejuan', description: 'Vou pela carne e pela música. Jazz e bossa nova ao vivo.', mealType: ['dinner'] },
  { id: 'tt-burger', name: 'TT Burger', neighborhood: 'Barra da Tijuca', priceLevel: '$$', category: 'Lanches', instagram: '@ttburger', description: 'Hambúrguer bem feito, direto ao ponto.', mealType: ['lunch', 'dinner'], kidFriendly: true },
  { id: 'golden-sucos', name: 'Golden Sucos Posto 7', neighborhood: 'Barra da Tijuca', priceLevel: '$', category: 'Lanches', instagram: '@goldensucos', description: 'Clássico absoluto do pós-praia. Açaí forte.', mealType: ['breakfast', 'lunch'], kidFriendly: true },
  { id: 'joao-padeiro', name: 'João Padeiro', neighborhood: 'Barra da Tijuca', priceLevel: '$', category: 'Padaria', instagram: '@joaopadeiro', description: 'Padaria moderna com alma de bairro.', mealType: ['breakfast', 'brunch'], kidFriendly: true },
  
  // Gávea
  { id: 'braseiro-gavea', name: 'Braseiro da Gávea', neighborhood: 'Gávea', priceLevel: '$$', category: 'Boteco', instagram: '@braseirodagavea', description: 'Boteco tradicional. Carne, chope e conversa.', mealType: ['lunch', 'dinner', 'drinks'] },
  
  // Santa Teresa
  { id: 'aprazivel', name: 'Aprazível', neighborhood: 'Santa Teresa', priceLevel: '$$$$', category: 'Brasileiro', instagram: '@aprazivel', description: 'Vista absurda, cozinha brasileira refinada e clima especial.', mealType: ['lunch', 'dinner'] },
  { id: 'bar-mineiro', name: 'Bar do Mineiro', neighborhood: 'Santa Teresa', priceLevel: '$$', category: 'Brasileiro', instagram: '@bardomineiro', description: 'Feijoada famosa, ambiente simples e honesto.', mealType: ['lunch'] },
  
  // Guaratiba
  { id: 'bira', name: 'Bira de Guaratiba', neighborhood: 'Guaratiba', priceLevel: '$$$', category: 'Peixes', instagram: '@bira.deguaratiba', description: 'Talvez uma das vistas mais bonitas do Rio. Mar, mangue, pôr do sol.', mealType: ['lunch', 'dinner'] },
  { id: 'casa-remo', name: 'Casa do Remo', neighborhood: 'Guaratiba', priceLevel: '$$$', category: 'Peixes', instagram: '@casadoremo.guaratiba', description: 'Charmosa, intimista e com vista espetacular.', mealType: ['lunch', 'dinner'] },
];

// ============= ACTIVITIES =============
export interface GuideActivity {
  id: string;
  name: string;
  neighborhood: string;
  category: 'praia' | 'trilha' | 'mirante' | 'cultura' | 'natureza' | 'esporte' | 'passeio';
  difficulty: 'fácil' | 'moderado' | 'difícil';
  duration: string; // e.g., "2h", "meio-dia", "dia inteiro"
  description: string;
  kidFriendly?: boolean;
  bestTime?: 'manhã' | 'tarde' | 'pôr do sol' | 'qualquer';
  iconic?: boolean;
}

export const guideActivities: GuideActivity[] = [
  // Ipanema
  { id: 'praia-ipanema', name: 'Praia de Ipanema', neighborhood: 'Ipanema', category: 'praia', difficulty: 'fácil', duration: '3-4h', description: 'Ipanema é mais do que uma praia: é um estado de espírito carioca.', kidFriendly: true, bestTime: 'qualquer', iconic: true },
  { id: 'por-sol-arpoador', name: 'Pôr do sol no Arpoador', neighborhood: 'Arpoador', category: 'mirante', difficulty: 'fácil', duration: '1-2h', description: 'Clássico absoluto do Rio. Aqui o sol se põe no mar.', kidFriendly: true, bestTime: 'pôr do sol', iconic: true },
  { id: 'sup-arpoador', name: 'Stand Up Paddle no Arpoador', neighborhood: 'Arpoador', category: 'esporte', difficulty: 'fácil', duration: '2h', description: 'Experiência simples e poderosa. Ver o sol nascer de dentro do mar.', bestTime: 'manhã' },
  
  // Urca
  { id: 'pista-coutinho', name: 'Pista Cláudio Coutinho', neighborhood: 'Urca', category: 'passeio', difficulty: 'fácil', duration: '1-2h', description: 'Caminhada à beira da Baía de Guanabara, com sombra e vista linda.', kidFriendly: true, bestTime: 'manhã' },
  { id: 'trilha-urca', name: 'Trilha do Morro da Urca', neighborhood: 'Urca', category: 'trilha', difficulty: 'moderado', duration: '2-3h', description: 'Trilha moderada que leva ao primeiro morro do Pão de Açúcar.', bestTime: 'manhã' },
  { id: 'mureta-urca', name: 'Mureta da Urca', neighborhood: 'Urca', category: 'passeio', difficulty: 'fácil', duration: '2h', description: 'Um dos programas mais simples e mais cariocas. Sentar, observar, ver o dia acabar.', kidFriendly: true, bestTime: 'pôr do sol' },
  { id: 'pao-acucar', name: 'Pão de Açúcar', neighborhood: 'Urca', category: 'mirante', difficulty: 'fácil', duration: '3h', description: 'Ícone do Rio. Bondinho com vista espetacular.', kidFriendly: true, bestTime: 'pôr do sol', iconic: true },
  
  // Jardim Botânico & Gávea
  { id: 'jardim-botanico', name: 'Jardim Botânico', neighborhood: 'Jardim Botânico', category: 'natureza', difficulty: 'fácil', duration: '2-3h', description: 'Um dos espaços mais bonitos e bem cuidados da cidade.', kidFriendly: true, bestTime: 'manhã' },
  { id: 'parque-lage', name: 'Parque Lage', neighborhood: 'Jardim Botânico', category: 'natureza', difficulty: 'fácil', duration: '2h', description: 'Cenário cinematográfico aos pés do Corcovado.', kidFriendly: true, bestTime: 'manhã' },
  
  // São Conrado
  { id: 'voo-livre', name: 'Voo de asa-delta ou parapente', neighborhood: 'São Conrado', category: 'esporte', difficulty: 'fácil', duration: '2-3h', description: 'Uma das experiências mais impactantes da cidade. Decola da Pedra Bonita.', bestTime: 'manhã', iconic: true },
  
  // Floresta da Tijuca
  { id: 'pedra-bonita', name: 'Pedra Bonita', neighborhood: 'Floresta da Tijuca', category: 'trilha', difficulty: 'fácil', duration: '2h', description: 'Trilha curta, acessível e com uma das vistas mais bonitas do Rio.', bestTime: 'manhã' },
  { id: 'pedra-gavea', name: 'Pedra da Gávea', neighborhood: 'Floresta da Tijuca', category: 'trilha', difficulty: 'difícil', duration: '5-6h', description: 'Exige preparo físico. Vista espetacular.', bestTime: 'manhã' },
  { id: 'cristo-redentor', name: 'Cristo Redentor', neighborhood: 'Floresta da Tijuca', category: 'mirante', difficulty: 'fácil', duration: '3h', description: 'Uma das 7 Maravilhas do Mundo Moderno.', kidFriendly: true, bestTime: 'manhã', iconic: true },
  
  // Barra da Tijuca
  { id: 'ciclovia-barra', name: 'Ciclovia da Orla da Barra', neighborhood: 'Barra da Tijuca', category: 'esporte', difficulty: 'fácil', duration: '2h', description: 'Longa, plana e com visual aberto.', kidFriendly: true, bestTime: 'manhã' },
  { id: 'por-sol-pier', name: 'Pôr do sol no Píer da Barra', neighborhood: 'Barra da Tijuca', category: 'mirante', difficulty: 'fácil', duration: '1h', description: 'Um dos pores do sol mais amplos da cidade.', kidFriendly: true, bestTime: 'pôr do sol' },
  
  // Recreio / Zona Oeste
  { id: 'prainha', name: 'Prainha', neighborhood: 'Recreio', category: 'praia', difficulty: 'fácil', duration: 'meio-dia', description: 'Mais selvagem e preservada. Boa para surf.', bestTime: 'manhã' },
  { id: 'grumari', name: 'Grumari', neighborhood: 'Recreio', category: 'praia', difficulty: 'fácil', duration: 'dia inteiro', description: 'Praia linda, cercada de verde.', kidFriendly: true, bestTime: 'qualquer' },
  
  // Centro & Porto
  { id: 'ccbb', name: 'CCBB Rio', neighborhood: 'Centro', category: 'cultura', difficulty: 'fácil', duration: '2-3h', description: 'O prédio por si só já vale a visita.', kidFriendly: true, bestTime: 'qualquer' },
  { id: 'museu-amanha', name: 'Museu do Amanhã', neighborhood: 'Centro', category: 'cultura', difficulty: 'fácil', duration: '2h', description: 'Arquitetura marcante e conteúdo acessível.', kidFriendly: true, bestTime: 'qualquer' },
  { id: 'aquario', name: 'AquaRio', neighborhood: 'Centro', category: 'cultura', difficulty: 'fácil', duration: '2-3h', description: 'Programa certeiro para famílias.', kidFriendly: true, bestTime: 'qualquer' },
  { id: 'rua-mercado', name: 'Rua do Mercado', neighborhood: 'Centro', category: 'passeio', difficulty: 'fácil', duration: '2h', description: 'Região revitalizada. Rodas de samba nos fins de semana.', bestTime: 'tarde' },
  
  // Santa Teresa
  { id: 'bondinho-st', name: 'Bondinho de Santa Teresa', neighborhood: 'Santa Teresa', category: 'passeio', difficulty: 'fácil', duration: '1h', description: 'Não é transporte, é experiência.', kidFriendly: true, bestTime: 'manhã' },
  { id: 'parque-ruinas', name: 'Parque das Ruínas', neighborhood: 'Santa Teresa', category: 'mirante', difficulty: 'fácil', duration: '1h', description: 'Vista muda conforme o ponto.', kidFriendly: true, bestTime: 'tarde' },
];

// ============= NIGHTLIFE =============
export interface GuideNightlife {
  id: string;
  name: string;
  neighborhood: string;
  priceLevel: '$' | '$$' | '$$$' | '$$$$';
  category: 'bar' | 'balada' | 'show' | 'circuito';
  instagram?: string;
  description: string;
}

export const guideNightlife: GuideNightlife[] = [
  { id: 'barzin-night', name: 'Barzin', neighborhood: 'Ipanema', priceLevel: '$$$', category: 'bar', instagram: '@barzin', description: 'Bom ponto pra começar a noite. Clima leve de paquera.' },
  { id: 'jobi-night', name: 'Jobi', neighborhood: 'Ipanema', priceLevel: '$$', category: 'bar', instagram: '@jobi_oficial', description: 'Clássico absoluto. Chope bem tirado.' },
  { id: 'boa-praca', name: 'Boa da Praça', neighborhood: 'Ipanema', priceLevel: '$$', category: 'bar', instagram: '@boadapraca', description: 'Na esquina do pôr do sol.' },
  { id: 'dias-ferreira', name: 'Rua Dias Ferreira', neighborhood: 'Leblon', priceLevel: '$$$', category: 'circuito', description: 'Não é um bar — é um circuito de restaurantes e encontros.' },
  { id: 'baixo-bebe', name: 'Baixo Bebê', neighborhood: 'Leblon', priceLevel: '$$', category: 'bar', description: 'Bar de praia clássico. À noite vira ponto de encontro.' },
  { id: 'vivo-rio', name: 'Vivo Rio', neighborhood: 'Copacabana', priceLevel: '$$$', category: 'show', instagram: '@vivorio', description: 'Casa de shows com vista absurda pra Baía.' },
  { id: 'elena-night', name: 'Elena', neighborhood: 'Jardim Botânico', priceLevel: '$$$$', category: 'bar', instagram: '@elenarestaurante.rj', description: 'À noite funciona muito bem. Boa pra casal e solteiros.' },
  { id: 'baixo-gavea', name: 'Baixo Gávea', neighborhood: 'Gávea', priceLevel: '$$', category: 'bar', instagram: '@baixogavea', description: 'Clássico eterno. Chope, conversa, gente na rua.' },
  { id: 'casa-matriz', name: 'Casa da Matriz', neighborhood: 'Botafogo', priceLevel: '$$', category: 'balada', instagram: '@casadamatriz', description: 'Balada clássica do Rio alternativo. Zero pose.' },
  { id: 'bar-urca', name: 'Bar Urca', neighborhood: 'Urca', priceLevel: '$$', category: 'bar', instagram: '@barurca', description: 'Chope, empada e uma das vistas mais bonitas.' },
  { id: 'bukowski', name: 'Bukowski', neighborhood: 'Urca', priceLevel: '$$$', category: 'bar', instagram: '@bukowskibar', description: 'Bar tradicional da Urca. Clima fechado, música e conversa.' },
  { id: 'qualistage', name: 'Qualistage', neighborhood: 'Barra da Tijuca', priceLevel: '$$$', category: 'show', instagram: '@qualistage', description: 'Casa de shows da Barra. Ótima estrutura.' },
  { id: 'farmasi-arena', name: 'Farmasi Arena', neighborhood: 'Barra da Tijuca', priceLevel: '$$$', category: 'show', instagram: '@farmasiarena', description: 'Uma das melhores qualidades de som do Rio.' },
];

// ============= NEIGHBORHOOD GROUPING =============
export const neighborhoodGroups = {
  zonaSul: ['Ipanema', 'Leblon', 'Copacabana', 'Leme', 'Arpoador', 'Urca', 'Botafogo', 'Flamengo'],
  zonaSulAlta: ['Jardim Botânico', 'Gávea', 'Lagoa', 'São Conrado'],
  barra: ['Barra da Tijuca', 'Jardim Oceânico', 'Recreio'],
  centro: ['Centro', 'Santa Teresa'],
  especial: ['Guaratiba', 'Floresta da Tijuca'],
};

// Proximity for geographic grouping
export const proximityMap: Record<string, string[]> = {
  'Ipanema': ['Leblon', 'Arpoador', 'Copacabana', 'Lagoa'],
  'Leblon': ['Ipanema', 'Gávea', 'Jardim Botânico', 'Lagoa'],
  'Copacabana': ['Ipanema', 'Leme', 'Botafogo', 'Urca'],
  'Leme': ['Copacabana', 'Urca'],
  'Urca': ['Botafogo', 'Copacabana', 'Leme', 'Centro'],
  'Botafogo': ['Urca', 'Flamengo', 'Copacabana'],
  'Jardim Botânico': ['Gávea', 'Lagoa', 'Leblon'],
  'Gávea': ['Jardim Botânico', 'Leblon', 'São Conrado', 'Floresta da Tijuca'],
  'Lagoa': ['Ipanema', 'Leblon', 'Jardim Botânico', 'Gávea'],
  'São Conrado': ['Gávea', 'Barra da Tijuca', 'Floresta da Tijuca'],
  'Barra da Tijuca': ['São Conrado', 'Jardim Oceânico', 'Recreio'],
  'Recreio': ['Barra da Tijuca', 'Guaratiba'],
  'Centro': ['Urca', 'Santa Teresa'],
  'Santa Teresa': ['Centro'],
  'Guaratiba': ['Recreio'],
  'Floresta da Tijuca': ['Gávea', 'São Conrado', 'Jardim Botânico'],
};

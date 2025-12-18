/**
 * CANONICAL NEIGHBORHOOD LIST - RIO DE JANEIRO
 * 
 * This is the definitive, locked list of neighborhoods for Rio de Janeiro.
 * All sections (Where to Stay, Where to Eat, Lucky List, What to Do) must use this list.
 * 
 * Rules:
 * - Do NOT add, remove, or rename neighborhoods without updating ALL sections
 * - Empty states are allowed; missing content does not hide a neighborhood
 * - IDs use kebab-case for URL compatibility
 */

export interface Neighborhood {
  id: string;
  name: string;
  // Map positioning (percentage from top-left)
  mapPosition: {
    top: string;
    left: string;
  };
}

/**
 * CANONICAL BASE MAP NEIGHBORHOODS - RIO DE JANEIRO
 * 
 * These are the ONLY neighborhoods that can appear in "O Que Fazer" (public layer).
 * Items outside this list must be "Lucky List only — premium layer".
 */
export const RIO_NEIGHBORHOODS: Neighborhood[] = [
  { id: "ipanema", name: "Ipanema", mapPosition: { top: "38%", left: "52%" } },
  { id: "leblon", name: "Leblon", mapPosition: { top: "45%", left: "38%" } },
  { id: "copacabana", name: "Copacabana", mapPosition: { top: "25%", left: "70%" } },
  { id: "leme", name: "Leme", mapPosition: { top: "15%", left: "82%" } },
  { id: "arpoador", name: "Arpoador", mapPosition: { top: "35%", left: "58%" } },
  { id: "jardim-botanico", name: "Jardim Botânico", mapPosition: { top: "42%", left: "45%" } },
  { id: "gavea", name: "Gávea", mapPosition: { top: "48%", left: "42%" } },
  { id: "botafogo", name: "Botafogo", mapPosition: { top: "28%", left: "60%" } },
  { id: "flamengo", name: "Flamengo", mapPosition: { top: "22%", left: "65%" } },
  { id: "santa-teresa", name: "Santa Teresa", mapPosition: { top: "22%", left: "45%" } },
  { id: "sao-conrado", name: "São Conrado", mapPosition: { top: "55%", left: "28%" } },
  { id: "barra-da-tijuca", name: "Barra da Tijuca", mapPosition: { top: "68%", left: "15%" } },
  { id: "recreio", name: "Recreio", mapPosition: { top: "78%", left: "8%" } },
  { id: "centro", name: "Centro", mapPosition: { top: "18%", left: "55%" } },
];

// Check if a neighborhood is in the canonical base map
export const isBaseMapNeighborhood = (id: string): boolean => {
  return RIO_NEIGHBORHOODS.some(n => n.id === id);
};

// Helper to get neighborhood by ID
export const getNeighborhoodById = (id: string): Neighborhood | undefined => {
  return RIO_NEIGHBORHOODS.find(n => n.id === id);
};

// Helper to get neighborhood name by ID
export const getNeighborhoodName = (id: string): string => {
  return getNeighborhoodById(id)?.name || id;
};

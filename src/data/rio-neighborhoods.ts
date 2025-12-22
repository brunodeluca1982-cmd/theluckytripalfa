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
  // Coastal axis (left to right along the coast)
  { id: "recreio", name: "Recreio", mapPosition: { top: "82%", left: "8%" } },
  { id: "barra-da-tijuca", name: "Barra da Tijuca", mapPosition: { top: "78%", left: "18%" } },
  { id: "sao-conrado", name: "São Conrado", mapPosition: { top: "72%", left: "32%" } },
  { id: "leblon", name: "Leblon", mapPosition: { top: "68%", left: "44%" } },
  { id: "ipanema", name: "Ipanema", mapPosition: { top: "65%", left: "54%" } },
  { id: "arpoador", name: "Arpoador", mapPosition: { top: "62%", left: "62%" } },
  { id: "copacabana", name: "Copacabana", mapPosition: { top: "55%", left: "74%" } },
  { id: "leme", name: "Leme", mapPosition: { top: "48%", left: "85%" } },
  // Inner neighborhoods (around the lagoon)
  { id: "lagoa", name: "Lagoa", mapPosition: { top: "52%", left: "58%" } },
  { id: "jardim-botanico", name: "Jardim Botânico", mapPosition: { top: "48%", left: "50%" } },
  { id: "gavea", name: "Gávea", mapPosition: { top: "42%", left: "55%" } },
  // Central / historical
  { id: "botafogo", name: "Botafogo", mapPosition: { top: "38%", left: "68%" } },
  { id: "santa-teresa", name: "Santa Teresa", mapPosition: { top: "25%", left: "50%" } },
  { id: "centro", name: "Centro", mapPosition: { top: "18%", left: "72%" } },
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

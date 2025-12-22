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
  { id: "recreio", name: "Recreio", mapPosition: { top: "68%", left: "4%" } },
  { id: "barra-da-tijuca", name: "Barra da Tijuca", mapPosition: { top: "82%", left: "14%" } },
  { id: "sao-conrado", name: "São Conrado", mapPosition: { top: "85%", left: "38%" } },
  { id: "leblon", name: "Leblon", mapPosition: { top: "75%", left: "45%" } },
  { id: "ipanema", name: "Ipanema", mapPosition: { top: "82%", left: "54%" } },
  { id: "arpoador", name: "Arpoador", mapPosition: { top: "82%", left: "64%" } },
  { id: "copacabana", name: "Copacabana", mapPosition: { top: "72%", left: "76%" } },
  { id: "leme", name: "Leme", mapPosition: { top: "60%", left: "88%" } },
  // Inner neighborhoods (around the lagoon)
  { id: "lagoa", name: "Lagoa", mapPosition: { top: "62%", left: "58%" } },
  { id: "jardim-botanico", name: "Jardim Botânico", mapPosition: { top: "52%", left: "48%" } },
  { id: "gavea", name: "Gávea", mapPosition: { top: "50%", left: "58%" } },
  // Central / historical
  { id: "botafogo", name: "Botafogo", mapPosition: { top: "50%", left: "70%" } },
  { id: "santa-teresa", name: "Santa Teresa", mapPosition: { top: "24%", left: "32%" } },
  { id: "centro", name: "Centro", mapPosition: { top: "20%", left: "78%" } },
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

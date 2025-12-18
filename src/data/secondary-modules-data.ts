/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STRUCTURAL LOCK — SECONDARY OPERATIONAL MODULES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * CONTEXT VALIDATION:
 * The FIRST DESTINATION SCREEN is already locked and contains:
 * 1) Como Chegar
 * 2) Onde Ficar
 * 3) Onde Comer
 * 4) O Que Fazer
 * 5) Lucky List
 * 
 * This file applies ONLY to what comes AFTER the first destination screen.
 * 
 * RULES:
 * - Module order is FIXED and must not be changed
 * - Screen grouping is FIXED and applies to ALL destinations
 * - Lucky List is NOT a screen — it is a highlighted interstitial interruption
 * - Back navigation returns to FIRST DESTINATION SCREEN, not Home
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface SecondaryModule {
  id: string;
  label: string;
  screen: 'A' | 'B' | 'C';
  order: number;
  route: string;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PAGINATION LOGIC (NON-VISUAL, STRUCTURAL)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GROUPING RULE (FIXED):
 * 
 * Screen A:
 *   1) MOVER
 *   2) VIDA NOTURNA
 *   3) SABORES LOCAIS
 *   4) DINHEIRO
 * 
 * [Lucky List Interstitial — highlighted interruption between A and B]
 * 
 * Screen B:
 *   5) DOCUMENTOS & VISTO
 *   6) MELHOR ÉPOCA
 *   7) O QUE LEVAR
 *   8) GASTOS DA VIAGEM
 * 
 * Screen C:
 *   9) LINKS ÚTEIS
 *   10) CHECKLIST FINAL
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const SECONDARY_MODULES: SecondaryModule[] = [
  // ─── SCREEN A ───
  { id: 'mover', label: 'Mover', screen: 'A', order: 1, route: '/mover' },
  { id: 'vida-noturna', label: 'Vida Noturna', screen: 'A', order: 2, route: '/vida-noturna' },
  { id: 'sabores-locais', label: 'Sabores Locais', screen: 'A', order: 3, route: '/sabores-locais' },
  { id: 'dinheiro', label: 'Dinheiro', screen: 'A', order: 4, route: '/dinheiro' },
  
  // ─── LUCKY LIST INTERSTITIAL (between A and B) ───
  // Lucky List is NOT part of these modules and is NOT a screen.
  // It appears as a distinct, highlighted INTERRUPTION between Screen A and Screen B.
  // This reinforces its premium and discovery role.
  // Lucky List must NEVER be merged into these module groups.
  
  // ─── SCREEN B ───
  { id: 'documentos-visto', label: 'Documentos & Visto', screen: 'B', order: 5, route: '/documentos-visto' },
  { id: 'melhor-epoca', label: 'Melhor Época', screen: 'B', order: 6, route: '/melhor-epoca' },
  { id: 'o-que-levar', label: 'O Que Levar', screen: 'B', order: 7, route: '/o-que-levar' },
  { id: 'gastos-viagem', label: 'Gastos da Viagem', screen: 'B', order: 8, route: '/gastos-viagem' },
  
  // ─── SCREEN C ───
  { id: 'links-uteis', label: 'Links Úteis', screen: 'C', order: 9, route: '/links-uteis' },
  { id: 'checklist-final', label: 'Checklist Final', screen: 'C', order: 10, route: '/checklist-final' },
];

/**
 * Screen grouping for pagination navigation
 */
export const SCREEN_GROUPS = {
  A: SECONDARY_MODULES.filter(m => m.screen === 'A'),
  B: SECONDARY_MODULES.filter(m => m.screen === 'B'),
  C: SECONDARY_MODULES.filter(m => m.screen === 'C'),
} as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * LUCKY LIST POSITIONING RULE (SECONDARY FLOW)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * - Lucky List is NOT part of the secondary modules
 * - Lucky List is NOT a screen
 * - Lucky List must appear as a distinct, highlighted INTERRUPTION
 *   between Screen A and Screen B
 * - This reinforces its premium and discovery role
 * - Lucky List must NEVER be merged into these module groups
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const LUCKY_LIST_POSITION = {
  after: 'A',
  before: 'B',
  isScreen: false,
  type: 'interstitial-interruption',
} as const;

/**
 * Screen navigation order (Lucky List is an interstitial, not a screen)
 */
export const SCREEN_ORDER = ['A', 'B', 'C'] as const;

/**
 * First destination screen route (for back navigation)
 */
export const FIRST_DESTINATION_SCREEN = '/' as const;

/**
 * Get modules by screen
 */
export const getModulesByScreen = (screen: 'A' | 'B' | 'C'): SecondaryModule[] => {
  return SECONDARY_MODULES.filter(m => m.screen === screen).sort((a, b) => a.order - b.order);
};

/**
 * Get next screen in navigation sequence
 */
export const getNextScreen = (currentScreen: 'A' | 'B' | 'C'): 'A' | 'B' | 'C' | null => {
  const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
  if (currentIndex === -1 || currentIndex === SCREEN_ORDER.length - 1) return null;
  return SCREEN_ORDER[currentIndex + 1];
};

/**
 * Get previous screen in navigation sequence
 */
export const getPreviousScreen = (currentScreen: 'A' | 'B' | 'C'): 'A' | 'B' | 'C' | null => {
  const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
  if (currentIndex <= 0) return null;
  return SCREEN_ORDER[currentIndex - 1];
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION RULES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * - Navigation between screens may occur via swipe or equivalent gesture
 * - Users must always retain awareness of being inside the same destination
 * - Back navigation from ANY secondary module returns to:
 *   the FIRST DESTINATION SCREEN (Index), NOT Home
 * 
 * SCALABILITY RULE:
 * - This pagination logic applies IDENTICALLY to all destinations
 * - No destination may alter grouping size, order, or Lucky List positioning
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

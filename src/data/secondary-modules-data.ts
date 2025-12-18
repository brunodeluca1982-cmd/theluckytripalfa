/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STRUCTURAL LOCK — SECONDARY OPERATIONAL MODULES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file defines the navigation and pagination logic for secondary
 * operational modules inside destinations. This structure is LOCKED.
 * 
 * RULES:
 * - Module order is fixed and must not be changed
 * - Screen grouping is fixed and applies to ALL destinations
 * - Lucky List appears as an interstitial between Screen A and Screen B
 * - Back navigation returns to destination context, not Home
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
 * PAGINATION LOGIC (ABSTRACT, NON-VISUAL)
 * 
 * Screen A: MOVER, VIDA NOTURNA, SABORES LOCAIS, DINHEIRO
 * [Lucky List Interstitial — premium discovery, interrupts sequence]
 * Screen B: DOCUMENTOS & VISTO, MELHOR ÉPOCA, O QUE LEVAR, GASTOS DA VIAGEM
 * Screen C: LINKS ÚTEIS, CHECKLIST FINAL
 */
export const SECONDARY_MODULES: SecondaryModule[] = [
  // ─── SCREEN A ───
  { id: 'mover', label: 'Mover', screen: 'A', order: 1, route: '/mover' },
  { id: 'vida-noturna', label: 'Vida Noturna', screen: 'A', order: 2, route: '/vida-noturna' },
  { id: 'sabores-locais', label: 'Sabores Locais', screen: 'A', order: 3, route: '/sabores-locais' },
  { id: 'dinheiro', label: 'Dinheiro', screen: 'A', order: 4, route: '/dinheiro' },
  
  // ─── LUCKY LIST INTERSTITIAL (between A and B) ───
  // Lucky List is NOT part of these modules.
  // It appears as a distinct, highlighted element between Screen A and Screen B.
  
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
 * Navigation order with Lucky List interstitial position
 * 
 * LUCKY LIST POSITIONING RULE:
 * - Lucky List is not part of these modules
 * - Lucky List must appear as a distinct, highlighted element
 *   positioned between Screen A and Screen B
 * - Lucky List must visually and cognitively interrupt the sequence,
 *   reinforcing its premium status
 */
export const SCREEN_ORDER = ['A', 'LUCKY_LIST', 'B', 'C'] as const;

/**
 * Get modules by screen
 */
export const getModulesByScreen = (screen: 'A' | 'B' | 'C'): SecondaryModule[] => {
  return SECONDARY_MODULES.filter(m => m.screen === screen).sort((a, b) => a.order - b.order);
};

/**
 * Get next screen in navigation sequence
 */
export const getNextScreen = (currentScreen: 'A' | 'B' | 'C' | 'LUCKY_LIST'): typeof SCREEN_ORDER[number] | null => {
  const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
  if (currentIndex === -1 || currentIndex === SCREEN_ORDER.length - 1) return null;
  return SCREEN_ORDER[currentIndex + 1];
};

/**
 * Get previous screen in navigation sequence
 */
export const getPreviousScreen = (currentScreen: 'A' | 'B' | 'C' | 'LUCKY_LIST'): typeof SCREEN_ORDER[number] | null => {
  const currentIndex = SCREEN_ORDER.indexOf(currentScreen);
  if (currentIndex <= 0) return null;
  return SCREEN_ORDER[currentIndex - 1];
};

/**
 * NAVIGATION RULES:
 * - Navigation between screens may occur via swipe or equivalent gesture
 * - Users must always retain awareness of being inside the same destination
 * - Back navigation returns to the destination context, not Home
 * 
 * SCALABILITY RULE:
 * - This grouping logic applies identically to all destinations
 * - Future destinations must respect the same screen grouping
 */

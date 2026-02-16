/** Format time to single integer hour or "—" */
export function formatHour(value: string | undefined | null): string {
  if (!value || value === "TBD") return "—";
  // Extract first number that looks like an hour
  const match = value.match(/(\d{1,2})/);
  if (!match) return "—";
  return String(parseInt(match[1], 10));
}

const NEIGHBORHOOD_ABBR: Record<string, string> = {
  "Copacabana": "Copa",
  "Ipanema": "Ipa",
  "Arpoador": "Arpex",
  "Flamengo": "Fla",
  "Botafogo": "Bota",
  "Santa Teresa": "S. Tereza",
  "Santa Tereza": "S. Tereza",
  "Jardim Botânico": "J. Botânico",
  "Barra da Tijuca": "Barra",
  "Recreio dos Bandeirantes": "Recreio",
};

export function abbreviateNeighborhood(value: string): string {
  return NEIGHBORHOOD_ABBR[value] ?? value;
}

const FILLER_PREFIXES = [
  /^Cordão d[aoe]\s+/i,
  /^Bloco d[aoe]\s+/i,
  /^Baile d[aoe]\s+/i,
  /^Festa d[aoe]\s+/i,
];
const FILLER_SUFFIXES = [
  /\s*[-–—]\s*(Carnaval|Carnival|Party|Edition|Closing).*$/i,
  /\s+(Carnaval|Carnival|Party|Edition|Closing)\s*\d*$/i,
];

export function shortenEventName(name: string): string {
  let s = name;
  for (const re of FILLER_PREFIXES) s = s.replace(re, "");
  for (const re of FILLER_SUFFIXES) s = s.replace(re, "");
  return s.trim() || name;
}

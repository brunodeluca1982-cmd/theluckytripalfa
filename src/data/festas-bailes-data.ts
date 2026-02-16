export interface FestaEvent {
  id: string;
  name: string;
  dateISO: string;
  dateDisplay: string;
  time: string;          // HH:MM or "TBD"
  timeDisplay: string;   // e.g. "20" or "tarde–noite"
  neighborhood: string;
  tag: string;
  location: string;
  gmapsUrl: string;
  description: string;
  music: string;
}

export const festasData: FestaEvent[] = [
  {
    id: "carnarildy-2026-d3",
    name: "CarnaRildy – Day 3",
    dateISO: "2026-02-16",
    dateDisplay: "16 de fevereiro — segunda",
    time: "14:00",
    timeDisplay: "tarde–noite",
    neighborhood: "Barra da Tijuca",
    tag: "moderno",
    location: "Cidade das Artes — Av. das Américas, 5300 (Barra da Tijuca)",
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida%20das%20Am%C3%A9ricas%205300%20Barra%20da%20Tijuca%20Rio%20de%20Janeiro",
    description: "Terceiro dia do festival CarnaRildy. Sequência modelo arena.",
    music: "Funk, pagode e hits.",
  },
  {
    id: "majestique-2026",
    name: "Majestique Carnival Party",
    dateISO: "2026-02-16",
    dateDisplay: "16 de fevereiro — segunda",
    time: "22:00",
    timeDisplay: "22",
    neighborhood: "Rio de Janeiro",
    tag: "eletrônico",
    location: "A confirmar",
    gmapsUrl: "",
    description: "Festa de Carnaval para jovens adultos.",
    music: "Open format + eletrônico.",
  },
  {
    id: "nostalgia-carnival-2026",
    name: "Nostalgia | Carnival Edition",
    dateISO: "2026-02-21",
    dateDisplay: "21 de fevereiro — sábado",
    time: "17:00",
    timeDisplay: "17",
    neighborhood: "Lagoa",
    tag: "retrô",
    location: "Sociedade Hípica Brasileira — Av. Lineu de Paula Machado, 2448",
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida%20Lineu%20de%20Paula%20Machado%202448%20Lagoa%20Rio%20de%20Janeiro",
    description: "Festival com hits dos anos 2000. Vibe open air pós-Carnaval.",
    music: "Pop / electro retrô.",
  },
  {
    id: "the-home-closing-2026",
    name: "The Home – Closing Party Carnaval 2026",
    dateISO: "2026-02-21",
    dateDisplay: "21 de fevereiro — sábado",
    time: "23:00",
    timeDisplay: "noite",
    neighborhood: "Centro",
    tag: "after",
    location: "Rua Sacadura Cabral, 135 (Centro)",
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua%20Sacadura%20Cabral%20135%20Rio%20de%20Janeiro",
    description: "Festa de encerramento de Carnaval no estilo after party. Madrugada inteira.",
    music: "After-party mix.",
  },
];

export function getFestaById(id: string): FestaEvent | undefined {
  return festasData.find((f) => f.id === id);
}

/** Group events by date, sorted chronologically */
export function getFestasByDate(): { dateISO: string; dateDisplay: string; events: FestaEvent[] }[] {
  const map = new Map<string, { dateDisplay: string; events: FestaEvent[] }>();
  for (const f of festasData) {
    if (!map.has(f.dateISO)) map.set(f.dateISO, { dateDisplay: f.dateDisplay, events: [] });
    map.get(f.dateISO)!.events.push(f);
  }
  // sort dates
  const sorted = [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  return sorted.map(([dateISO, { dateDisplay, events }]) => ({
    dateISO,
    dateDisplay,
    events: events.sort((a, b) => a.time.localeCompare(b.time)),
  }));
}

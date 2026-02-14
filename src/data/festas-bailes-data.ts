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
    id: "carnarildy-2026-d1",
    name: "CarnaRildy 2026",
    dateISO: "2026-02-14",
    dateDisplay: "14 de fevereiro — sábado",
    time: "14:00",
    timeDisplay: "tarde–noite",
    neighborhood: "Barra da Tijuca",
    tag: "moderno",
    location: "Cidade das Artes — Av. das Américas, 5300 (Barra da Tijuca)",
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida%20das%20Am%C3%A9ricas%205300%20Barra%20da%20Tijuca%20Rio%20de%20Janeiro",
    description: "Festival-style arena event with multiple national artists throughout the day. Line up includes Cabelinho, Veigh, Filipe Ret.",
    music: "Hip-hop, pop, pagode, rap, funk.",
  },
  {
    id: "adorofrozen-2026",
    name: "AdoroFrozen Carnival Party 2026",
    dateISO: "2026-02-14",
    dateDisplay: "14 de fevereiro — sábado",
    time: "20:00",
    timeDisplay: "20",
    neighborhood: "Centro",
    tag: "openbar",
    location: "Estrada das Furnas, 3800 – Rio de Janeiro",
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Estrada%20das%20Furnas%203800%20Rio%20de%20Janeiro",
    description: "Classic open bar carnival party lasting through the night.",
    music: "Pop, funk, carnival hits.",
  },
  {
    id: "baile-do-copa-2026",
    name: "Baile do Copa 2026",
    dateISO: "2026-02-14",
    dateDisplay: "14 de fevereiro — sábado",
    time: "22:00",
    timeDisplay: "22",
    neighborhood: "Copacabana",
    tag: "glamour",
    location: "Copacabana Palace — Av. Atlântica, 1702",
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida%20Atl%C3%A2ntica%201702%20Copacabana%20Rio%20de%20Janeiro",
    description: "Iconic traditional Carnival ball.",
    music: "Open format with Brazilian classics.",
  },
  {
    id: "carnarildy-2026-d2",
    name: "CarnaRildy – Day 2",
    dateISO: "2026-02-15",
    dateDisplay: "15 de fevereiro — domingo",
    time: "14:00",
    timeDisplay: "tarde",
    neighborhood: "Barra da Tijuca",
    tag: "moderno",
    location: "Cidade das Artes — Av. das Américas, 5300",
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida%20das%20Am%C3%A9ricas%205300%20Barra%20da%20Tijuca%20Rio%20de%20Janeiro",
    description: "Second day of the CarnaRildy festival.",
    music: "Pagode, funk, pop hits.",
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
    description: "Electronic and open format carnival party.",
    music: "Electronic + open format.",
  },
  {
    id: "nostalgia-carnival-2026",
    name: "Nostalgia – Carnival Edition",
    dateISO: "2026-02-21",
    dateDisplay: "21 de fevereiro — sábado",
    time: "17:00",
    timeDisplay: "17",
    neighborhood: "Lagoa",
    tag: "retrô",
    location: "Sociedade Hípica Brasileira — Av. Lineu de Paula Machado, 2448",
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida%20Lineu%20de%20Paula%20Machado%202448%20Lagoa%20Rio%20de%20Janeiro",
    description: "Nostalgia-themed carnival event with 2000s hits.",
    music: "2000s hits.",
  },
  {
    id: "the-home-closing-2026",
    name: "The Home – Closing Party",
    dateISO: "2026-02-21",
    dateDisplay: "21 de fevereiro — sábado",
    time: "23:00",
    timeDisplay: "noite",
    neighborhood: "Centro",
    tag: "after",
    location: "Rua Sacadura Cabral, 135",
    gmapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua%20Sacadura%20Cabral%20135%20Rio%20de%20Janeiro",
    description: "Carnival closing after-party style event.",
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

export interface SapucaiParade {
  id: string;
  date_iso: string;
  date_display: string;
  group_name: string;
  school_name: string;
  start_time_24h: string;
  start_hour_display: string;
  end_time_text: string;
  how_to_get_there: string;
  vibe_details: string;
  samba_title: string;
  samba_summary: string;
  samba_excerpt: string;
  samba_full_lyrics_url: string;
  muses_and_queens: string;
  missing_fields: string[];
  raw_source_text: string;
}

export const sapucaiParades: SapucaiParade[] = [
  // ── Terça 17/02 — Grupo Especial (3º dia) ──
  {
    id: "grande-rio-2026",
    date_iso: "2026-02-17",
    date_display: "17 de fevereiro de 2026 — terça",
    group_name: "Grupo Especial (3º dia)",
    school_name: "Acadêmicos do Grande Rio",
    start_time_24h: "21:45",
    start_hour_display: "21h45",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Grande Rio costuma entrar grande. Visual impactante, celebridades na avenida e desfile pensado para arquibancada vibrar.\n• Leitura Lucky Trip: se você quer espetáculo visual e impacto imediato, chega cedo no seu setor.",
    samba_title: "Título oficial divulgado pela LIESA (tema confirmado para 2026).",
    samba_summary:
      "Trecho marcante: refrão forte, fácil de cantar junto (perfil da escola).",
    samba_excerpt: "—",
    samba_full_lyrics_url: "",
    muses_and_queens: "Rainha: Paolla Oliveira.\nMusas: —",
    missing_fields: ["samba_excerpt", "samba_full_lyrics_url"],
    raw_source_text: "",
  },
  {
    id: "paraiso-do-tuiuti-2026",
    date_iso: "2026-02-17",
    date_display: "17 de fevereiro de 2026 — terça",
    group_name: "Grupo Especial (3º dia)",
    school_name: "Paraíso do Tuiuti",
    start_time_24h: "23:20",
    start_hour_display: "entre 23h20 e 23h30",
    end_time_text: "entre 23h20 e 23h30",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Tuiuti gosta de provocar. Desfiles com narrativa social forte e estética ousada.\n• Leitura Lucky Trip: arquibancada costuma reagir forte. Escola de conceito.",
    samba_title: "Tema com crítica e leitura contemporânea (padrão recente da escola).",
    samba_summary:
      "Trecho de impacto no refrão principal.",
    samba_excerpt: "—",
    samba_full_lyrics_url: "",
    muses_and_queens: "Rainha: confirmada oficialmente pela escola.\nMusas: —",
    missing_fields: ["samba_excerpt", "samba_full_lyrics_url", "muses_and_queens"],
    raw_source_text: "",
  },
  {
    id: "vila-isabel-2026",
    date_iso: "2026-02-17",
    date_display: "17 de fevereiro de 2026 — terça",
    group_name: "Grupo Especial (3º dia)",
    school_name: "Unidos de Vila Isabel",
    start_time_24h: "00:55",
    start_hour_display: "entre 00h55 e 01h15",
    end_time_text: "entre 00h55 e 01h15",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Tradicional, musicalmente poderosa. Samba que \"cola\" rápido.\n• Leitura Lucky Trip: madrugada que ainda mantém energia alta.",
    samba_title: "Melódico, com refrão de arquibancada.",
    samba_summary: "—",
    samba_excerpt: "—",
    samba_full_lyrics_url: "",
    muses_and_queens: "Rainha: confirmada oficialmente pela agremiação.\nMusas: —",
    missing_fields: ["samba_title", "samba_summary", "samba_excerpt", "samba_full_lyrics_url", "muses_and_queens"],
    raw_source_text: "",
  },
  {
    id: "salgueiro-2026",
    date_iso: "2026-02-17",
    date_display: "17 de fevereiro de 2026 — terça",
    group_name: "Grupo Especial (3º dia)",
    school_name: "Acadêmicos do Salgueiro",
    start_time_24h: "02:30",
    start_hour_display: "entre 02h30 e 03h00",
    end_time_text: "entre 02h30 e 03h00",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Salgueiro é potência rítmica. Vermelho na avenida sempre entra competitivo.\n• Leitura Lucky Trip: se você aguentar até aqui, pega um desfile intenso.",
    samba_title: "Refrão forte, bateria marcante.",
    samba_summary: "—",
    samba_excerpt: "—",
    samba_full_lyrics_url: "",
    muses_and_queens: "Rainha: confirmada oficialmente pela escola.\nMusas: —",
    missing_fields: ["samba_title", "samba_summary", "samba_excerpt", "samba_full_lyrics_url", "muses_and_queens"],
    raw_source_text: "",
  },
];

/** Group parades by date_iso */
export function getParadesByDate(): { dateISO: string; dateDisplay: string; groupName: string; parades: SapucaiParade[] }[] {
  const dateOrder = ["2026-02-17"];
  const groups: { dateISO: string; dateDisplay: string; groupName: string; parades: SapucaiParade[] }[] = [];

  for (const d of dateOrder) {
    const items = sapucaiParades.filter((p) => p.date_iso === d);
    if (items.length > 0) {
      groups.push({
        dateISO: d,
        dateDisplay: items[0].date_display,
        groupName: items[0].group_name,
        parades: items.sort((a, b) => a.start_time_24h.localeCompare(b.start_time_24h)),
      });
    }
  }
  return groups;
}

/** Timeline text for each day */
export const sapucaiTimeline = [
  {
    dateISO: "2026-02-17",
    label: "17/02 (Ter)",
    entries: [
      "21h45 Grande Rio",
      "23h20–23h30 Tuiuti",
      "00h55–01h15 Vila Isabel",
      "02h30–03h00 Salgueiro",
    ],
  },
];

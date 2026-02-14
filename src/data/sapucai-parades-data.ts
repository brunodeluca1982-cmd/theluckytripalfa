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
  // ── Sábado 14/02 — Série Ouro ──
  {
    id: "botafogo-samba-clube-2026",
    date_iso: "2026-02-14",
    date_display: "14 de fevereiro de 2026 — sábado",
    group_name: "Série Ouro",
    school_name: "Botafogo Samba Clube",
    start_time_24h: "21:00",
    start_hour_display: "21h",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor (bloqueios no entorno são comuns).\n• Uber: peça desembarque fora do \"miolo\" do bloqueio e complete a pé.",
    vibe_details:
      "• Clima de \"abertura de noite\": energia alta pra \"marcar território\".\n• Enredo plástico/visual: festa de cores, natureza e formas.",
    samba_title: "O Brasil que floresce em arte",
    samba_summary:
      "Homenagem ao paisagista Roberto Burle Marx, usando o Brasil como jardim/obra de arte.",
    samba_excerpt: "Viva a natureza viva!",
    samba_full_lyrics_url:
      "https://www.sambariocarnaval.com/index.php?sambando=botafogo2026",
    muses_and_queens: "Rainha: Wenny Isa.\nMusas (confirmadas): Lidiana Barros (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "em-cima-da-hora-2026",
    date_iso: "2026-02-14",
    date_display: "14 de fevereiro de 2026 — sábado",
    group_name: "Série Ouro",
    school_name: "Em Cima da Hora",
    start_time_24h: "22:00",
    start_hour_display: "22h",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Noite de axé/ponto: atmosfera de terreiro e encruzilhada (muito canto junto).\n• Samba com refrões \"de chamada\", bom pra decorar rápido.",
    samba_title: "Salve Todas as Marias – Laroyê, Pombagiras!",
    samba_summary:
      "Celebra a força feminina e a ancestralidade ligada às Pombagiras, trazendo símbolos de fé e rua.",
    samba_excerpt: "Acorda Exu, laroyê!",
    samba_full_lyrics_url:
      "https://www.sambariocarnaval.com/index.php?sambando=emcimadahora2026",
    muses_and_queens:
      "Rainha: Maryanne Hipólito.\nMusas (confirmadas): Jessica Almeida (musa); Lili Schmidt (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "arranco-engenho-de-dentro-2026",
    date_iso: "2026-02-14",
    date_display: "14 de fevereiro de 2026 — sábado",
    group_name: "Série Ouro",
    school_name: "Arranco do Engenho de Dentro",
    start_time_24h: "23:00",
    start_hour_display: "23h",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Samba com estética circense/teatral: \"alto astral + mensagem\".\n• Clima de comunidade querendo \"subir de divisão\".",
    samba_title: "A Gargalhada é o Xamego da Vida",
    samba_summary:
      "Homenagem à palhaçaria negra, centrada na trajetória de Maria Eliza Alves dos Reis.",
    samba_excerpt: "Ser palhaço é revolucionário",
    samba_full_lyrics_url:
      "https://www.sambariocarnaval.com/index.php?sambando=arranco2026",
    muses_and_queens:
      "Rainha: Gisa Cobel.\nMusas (confirmadas): Lola (musa; sobrenome não especificado na fonte).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "imperio-serrano-2026",
    date_iso: "2026-02-14",
    date_display: "14 de fevereiro de 2026 — sábado",
    group_name: "Série Ouro",
    school_name: "Império Serrano",
    start_time_24h: "00:00",
    start_hour_display: "00h",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Noite de \"canto forte\" e emoção (literatura + identidade negra).\n• Energia de tradição (Madureira) com pegada de manifesto.",
    samba_title: "Ponciá Evaristo, Flor do Mulungu",
    samba_summary:
      "Tributo à escritora Conceição Evaristo e à potência da escrita negra como memória e resistência.",
    samba_excerpt: "A gente combinamos de não morrer!",
    samba_full_lyrics_url:
      "https://www.sambariocarnaval.com/index.php?sambando=imperio2026",
    muses_and_queens:
      "Rainha: Quitéria Chagas.\nMusas (confirmadas): Gabi Evaristo (musa); Ana Merhi (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "estacio-de-sa-2026",
    date_iso: "2026-02-14",
    date_display: "14 de fevereiro de 2026 — sábado",
    group_name: "Série Ouro",
    school_name: "Estácio de Sá",
    start_time_24h: "01:00",
    start_hour_display: "01h",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Bateria \"pesada\" e desfile com identidade de raiz (Estácio é Estácio).\n• Enredo com espiritualidade e história do samba.",
    samba_title: "Tata Tancredo – O Papa Negro no Terreiro do Estácio",
    samba_summary:
      "Reverência a Tata Tancredo, articulando umbanda/omolocô e o território fundador do samba.",
    samba_excerpt: "Macumba é macumba, canjerê, mojubá",
    samba_full_lyrics_url:
      "https://www.sambariocarnaval.com/index.php?sambando=estacio2026",
    muses_and_queens:
      "Rainha: Vivi Winkler.\nMusas (confirmadas): Ravena Hanniely (musa); Flávia Jooris (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "uniao-de-marica-2026",
    date_iso: "2026-02-14",
    date_display: "14 de fevereiro de 2026 — sábado",
    group_name: "Série Ouro",
    school_name: "União de Maricá",
    start_time_24h: "02:00",
    start_hour_display: "02h",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Samba de celebração ancestral (joia, corpo, memória afro-brasileira).\n• Crescimento recente: clima de \"projeto ambicioso\".",
    samba_title: "Berenguendéns & Balangandãs",
    samba_summary:
      "Exalta símbolos/amuletos e a herança afro-baiana como identidade e poder feminino.",
    samba_excerpt: "Canta Maricá o que a baiana tem",
    samba_full_lyrics_url:
      "https://www.sambariocarnaval.com/index.php?sambando=marica2026",
    muses_and_queens:
      "Rainha: Rayane Dumont.\nMusas (confirmadas): Aninha Estrela (musa); Dani Lima (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "porto-da-pedra-2026",
    date_iso: "2026-02-14",
    date_display: "14 de fevereiro de 2026 — sábado",
    group_name: "Série Ouro",
    school_name: "Unidos do Porto da Pedra",
    start_time_24h: "03:00",
    start_hour_display: "03h",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Tema \"adulto\", direto e social: provável reação forte de arquibancada.\n• Samba com frases de impacto (fácil \"pegar\" no público).",
    samba_title: "Das Mais Antigas da Vida, o Doce e Amargo Beijo da Noite",
    samba_summary:
      "Enredo sobre a história e a dignidade das trabalhadoras do sexo, em chave de manifesto.",
    samba_excerpt: "Tigresa que mata um leão por dia!",
    samba_full_lyrics_url:
      "https://www.sambariocarnaval.com/index.php?sambando=porto2026",
    muses_and_queens:
      "Rainha: Andrea de Andrade.\nMusas (confirmadas): Andressa Urach (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "unidos-da-ponte-2026",
    date_iso: "2026-02-14",
    date_display: "14 de fevereiro de 2026 — sábado",
    group_name: "Série Ouro",
    school_name: "Unidos da Ponte",
    start_time_24h: "04:00",
    start_hour_display: "04h",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• \"Baile na avenida\": estética urbana, periférica e black.\n• Desfecho de noite: arquibancada costuma estar \"acesa\" (quem ficou, fica pra cantar).",
    samba_title: "Tamborzão – O Rio é Baile! O Poder é Black!",
    samba_summary:
      "Celebra a cultura do baile e a identidade negra na cidade, com linguagem direta de rua.",
    samba_excerpt: "O nosso morro tem voz e poder",
    samba_full_lyrics_url:
      "https://www.sambariocarnaval.com/index.php?sambando=ponte2026",
    muses_and_queens:
      "Rainha: Thalita Zampirolli.\nMusas (confirmadas): Bárbara Sheldon (musa).",
    missing_fields: [],
    raw_source_text: "",
  },

  // ── Domingo 15/02 — Grupo Especial (1º dia) ──
  {
    id: "academicos-de-niteroi-2026",
    date_iso: "2026-02-15",
    date_display: "15 de fevereiro de 2026 — domingo",
    group_name: "Grupo Especial (1º dia)",
    school_name: "Acadêmicos de Niterói",
    start_time_24h: "21:45",
    start_hour_display: "21h45",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Abertura do Grupo Especial: escola entra \"pra ser notada\".\n• Samba de narrativa/biografia: canto longo, com histórico e política.",
    samba_title: "Do alto do Mulungu surge a esperança: Lula, o operário do Brasil",
    samba_summary:
      "Acompanha a trajetória de Luiz Inácio Lula da Silva, do Nordeste ao protagonismo político, em chave épica.",
    samba_excerpt: "Olê, olê, olê, olá, Lula! Lula!",
    samba_full_lyrics_url:
      "https://liesa.org.br/carnaval/escolas/niteroi/samba-enredo.html",
    muses_and_queens: "Rainha: Vanessa Rangeli.\nMusas: —",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "imperatriz-leopoldinense-2026",
    date_iso: "2026-02-15",
    date_display: "15 de fevereiro de 2026 — domingo",
    group_name: "Grupo Especial (1º dia)",
    school_name: "Imperatriz Leopoldinense",
    start_time_24h: "23:20",
    start_hour_display: "entre 23h20 e 23h30",
    end_time_text: "entre 23h20 e 23h30",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Enredo \"camaleônico\": estética de provocação/performatividade.\n• Samba com frases que chamam o público pro \"agora\".",
    samba_title: "Camaleônico",
    samba_summary:
      "Homenagem à trajetória e ao universo artístico de Ney Matogrosso.",
    samba_excerpt: "Se joga na festa, esquece o amanhã",
    samba_full_lyrics_url:
      "https://liesa.org.br/carnaval/escolas/imperatriz/samba-enredo.html",
    muses_and_queens:
      "Rainha: Iza.\nMusas (confirmadas): Carmem Mondego (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "portela-2026",
    date_iso: "2026-02-15",
    date_display: "15 de fevereiro de 2026 — domingo",
    group_name: "Grupo Especial (1º dia)",
    school_name: "Portela",
    start_time_24h: "00:55",
    start_hour_display: "entre 00h55 e 01h15",
    end_time_text: "entre 00h55 e 01h15",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Tradição + ritual: samba com axé e \"fundamento\" de terreiro.\n• Madrugada azul-e-branca: canto coletivo pesado.",
    samba_title: "O Mistério do Príncipe do Bará — A oração do negrinho…",
    samba_summary:
      "Mergulho na história de Custódio Joaquim de Almeida e na formação da negritude e do batuque no Sul do Brasil.",
    samba_excerpt: "Alupô, meu senhor, alupô!",
    samba_full_lyrics_url:
      "https://liesa.org.br/carnaval/escolas/portela/samba-enredo.html",
    muses_and_queens:
      "Rainha: Bianca Monteiro.\nMusas (confirmadas): Cacau Protásio (musa); Marvvila (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "mangueira-2026",
    date_iso: "2026-02-15",
    date_display: "15 de fevereiro de 2026 — domingo",
    group_name: "Grupo Especial (1º dia)",
    school_name: "Estação Primeira de Mangueira",
    start_time_24h: "02:30",
    start_hour_display: "entre 02h30 e 03h00",
    end_time_text: "entre 02h30 e 03h00",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Batuque amazônico: promessa de sonoridade diferente (marabaixo/encantaria).\n• Verde-e-rosa \"mística\": desfile tende a vir carregado de símbolos.",
    samba_title: "Mestre Sacaca do Encanto Tucuju – O Guardião da Amazônia Negra",
    samba_summary:
      "Celebra Mestre Sacaca e tradições afro-indígenas do Norte, em saga de encantaria e cura.",
    samba_excerpt: "Na Estação Primeira do Amapá",
    samba_full_lyrics_url:
      "https://liesa.org.br/carnaval/escolas/mangueira/samba-enredo.html",
    muses_and_queens:
      "Rainha: Evelyn Bastos.\nMusas (confirmadas): Sashya Jay (musa); Karinah (musa).",
    missing_fields: [],
    raw_source_text: "",
  },

  // ── Segunda 16/02 — Grupo Especial (2º dia) ──
  {
    id: "mocidade-2026",
    date_iso: "2026-02-16",
    date_display: "16 de fevereiro de 2026 — segunda",
    group_name: "Grupo Especial (2º dia)",
    school_name: "Mocidade Independente de Padre Miguel",
    start_time_24h: "21:45",
    start_hour_display: "21h45",
    end_time_text: "",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Abertura da segunda noite: escola costuma vir \"pra brigar\".\n• Tema pop/rock: expectativa de refrões conhecidos \"adaptados\" pro samba.",
    samba_title: "Rita Lee, a padroeira da liberdade",
    samba_summary:
      "Celebra a obra e a atitude libertária da homenageada como símbolo de transgressão e autonomia.",
    samba_excerpt: "Quem foge ao padrão vence a regra",
    samba_full_lyrics_url:
      "https://liesa.org.br/carnaval/escolas/mocidade/samba-enredo.html",
    muses_and_queens:
      "Rainha: Fabíola Andrade.\nMusas (confirmadas): Erika Schneider (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "beija-flor-2026",
    date_iso: "2026-02-16",
    date_display: "16 de fevereiro de 2026 — segunda",
    group_name: "Grupo Especial (2º dia)",
    school_name: "Beija-Flor de Nilópolis",
    start_time_24h: "23:20",
    start_hour_display: "entre 23h20 e 23h30",
    end_time_text: "entre 23h20 e 23h30",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Axé de rua: cortejo, atabaque, ocupação do espaço público.\n• Samba \"chamado de arquibancada\" (refrão forte e repetível).",
    samba_title: "Bembé",
    samba_summary:
      "Gira em torno do Bembé do Mercado e da presença pública do candomblé como autorreparação e liberdade.",
    samba_excerpt: "Isso aqui vai virar macumba!",
    samba_full_lyrics_url:
      "https://liesa.org.br/carnaval/escolas/beija-flor/samba-enredo.html",
    muses_and_queens:
      "Rainha: Lorena Raissa.\nMusas (confirmadas): Giovanna Lancellotti (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "viradouro-2026",
    date_iso: "2026-02-16",
    date_display: "16 de fevereiro de 2026 — segunda",
    group_name: "Grupo Especial (2º dia)",
    school_name: "Unidos do Viradouro",
    start_time_24h: "00:55",
    start_hour_display: "entre 00h55 e 01h15",
    end_time_text: "entre 00h55 e 01h15",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Enredo autorreferente: bateria como personagem central.\n• Homenagem \"de dentro do samba\" (muito ritmo e disciplina).",
    samba_title: "Pra cima, Ciça",
    samba_summary:
      "Celebra Mestre Ciça e a construção coletiva da bateria como escola.",
    samba_excerpt: "Pra cima, Ciça!",
    samba_full_lyrics_url:
      "https://liesa.org.br/carnaval/escolas/viradouro/samba-enredo.html",
    muses_and_queens: "Rainha: Juliana Paes.\nMusas: —",
    missing_fields: [],
    raw_source_text: "",
  },
  {
    id: "unidos-da-tijuca-2026",
    date_iso: "2026-02-16",
    date_display: "16 de fevereiro de 2026 — segunda",
    group_name: "Grupo Especial (2º dia)",
    school_name: "Unidos da Tijuca",
    start_time_24h: "02:30",
    start_hour_display: "entre 02h30 e 03h00",
    end_time_text: "entre 02h30 e 03h00",
    how_to_get_there:
      "• Metrô: priorize e caminhe até seu setor.\n• Uber: desembarque fora dos bloqueios e finalize a pé.",
    vibe_details:
      "• Desfile-livro: narrativa de vida, favela, escrita e denúncia social.\n• Final de noite: energia persistente e \"canto de resistência\".",
    samba_title: "Carolina Maria de Jesus",
    samba_summary:
      "Costura a infância, a fome e o poder da palavra da homenageada, do interior ao Canindé.",
    samba_excerpt: "A palavra é arma contra a tirania",
    samba_full_lyrics_url:
      "https://liesa.org.br/carnaval/escolas/unidos-da-tijuca/samba-enredo.html",
    muses_and_queens:
      "Rainha: Mileide Mihaile.\nMusas (confirmadas): Geisa Eloy (musa); Katarina Harmony (musa).",
    missing_fields: [],
    raw_source_text: "",
  },
];

/** Group parades by date_iso */
export function getParadesByDate(): { dateISO: string; dateDisplay: string; groupName: string; parades: SapucaiParade[] }[] {
  const dateOrder = ["2026-02-14", "2026-02-15", "2026-02-16"];
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
    dateISO: "2026-02-14",
    label: "14/02 (Sáb)",
    entries: [
      "21h Botafogo Samba Clube",
      "22h Em Cima da Hora",
      "23h Arranco",
      "00h Império Serrano",
      "01h Estácio",
      "02h União de Maricá",
      "03h Porto da Pedra",
      "04h Unidos da Ponte",
    ],
  },
  {
    dateISO: "2026-02-15",
    label: "15/02 (Dom)",
    entries: [
      "21h45 Acadêmicos de Niterói",
      "23h20–23h30 Imperatriz",
      "00h55–01h15 Portela",
      "02h30–03h00 Mangueira",
    ],
  },
  {
    dateISO: "2026-02-16",
    label: "16/02 (Seg)",
    entries: [
      "21h45 Mocidade",
      "23h20–23h30 Beija-Flor",
      "00h55–01h15 Viradouro",
      "02h30–03h00 Unidos da Tijuca",
    ],
  },
];

import { ReferenceItinerary } from "./reference-itineraries";

/**
 * ROTEIRO DA CAROLINA — RIO DE JANEIRO
 * Autora: Carolina Dieckmann
 * Tipo: Roteiro de referência (somente leitura)
 * 
 * Rio de Janeiro — Roteiro da Carolina Dieckmann
 * 7 dias no meu Rio
 * Perfil: 2 adultos, 1 jovem
 * Hotel: Hotel Fasano Rio de Janeiro — Ipanema
 * 
 * Conteúdo preservado exatamente como fornecido.
 * NÃO modificar nenhum texto.
 */
export const carolinaDieckmannRio: ReferenceItinerary = {
  id: 'carolina-dieckmann-rio',
  author: 'Carolina Dieckmann',
  title: 'Rio de Janeiro — Roteiro da Carolina Dieckmann',
  destinationId: 'rio-de-janeiro',
  description: '7 dias no meu Rio | Hotel Fasano Rio de Janeiro — Ipanema',
  days: {
    1: {
      dayNumber: 1,
      title: 'DIA 1 — CHEGADA E INSTALAÇÃO',
      subtitle: 'Ipanema, primeiros passos',
      items: [
        {
          id: 'carolina-d1-1',
          name: 'Chegada no Aeroporto Santos Dumont',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '10:00',
          editorial: 'Eu sempre voo para o Santos Dumont quando posso. Vinte minutos até Ipanema, e você escapa do caos do Galeão.',
        },
        {
          id: 'carolina-d1-2',
          name: 'Hotel Fasano Rio de Janeiro',
          category: 'hotel',
          duration: '1h',
          source: 'partner',
          time: '11:00',
          editorial: 'Check-in ou deixar a bagagem. O lobby é calmo, a equipe sabe o que está fazendo. Sem frescura.',
        },
        {
          id: 'carolina-d1-3',
          name: 'Nido',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '13:00',
          editorial: 'A primeira refeição no Rio tem que ser simples e boa. O Nido faz italiano do jeito que eu gosto — honesto, sem pretensão, e a três quadras do hotel.',
        },
        {
          id: 'carolina-d1-4',
          name: 'Caminhada pela Rua Garcia d\'Ávila',
          category: 'experience',
          duration: '1h30',
          source: 'partner',
          time: '15:30',
          editorial: 'Esta é a rua onde eu faço minhas coisas quando estou em Ipanema. Lojinhas, bom café, ninguém correndo.',
        },
        {
          id: 'carolina-d1-5',
          name: 'Livraria da Travessa',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '17:00',
          editorial: 'Lucky List. Eu posso passar uma hora aqui sem perceber. Boa seleção, silêncio, e sempre tem algo que eu não estava procurando mas acabo comprando.',
        },
        {
          id: 'carolina-d1-6',
          name: 'Pôr do sol no Arpoador',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '18:00',
          editorial: 'Se o céu estiver limpo, a gente caminha até o Arpoador. Os aplausos quando o sol se põe são bobos, mas eu ainda gosto.',
        },
        {
          id: 'carolina-d1-7',
          name: 'Zazá Bistrô',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '20:30',
          editorial: 'A primeira noite tem que ser relaxada. O Zazá é confortável, a comida é leve, e dá pra sentar do lado de fora e ver Ipanema passar.',
        },
      ],
    },
    2: {
      dayNumber: 2,
      title: 'DIA 2 — SANTA TERESA',
      subtitle: 'O bairro onde eu cresci',
      items: [
        {
          id: 'carolina-d2-1',
          name: 'Café da manhã no Fasano',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:30',
          editorial: 'Sem pressa. Bom café, frutas frescas, o mar ali do lado. É assim que as manhãs deveriam começar.',
        },
        {
          id: 'carolina-d2-2',
          name: 'Traslado para Santa Teresa',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '10:00',
          editorial: 'De carro, 25-30 minutos dependendo do trânsito. A subida é estreita mas o motorista conhece.',
        },
        {
          id: 'carolina-d2-3',
          name: 'Ateliês e feira de rua de Santa Teresa',
          category: 'experience',
          duration: '2h',
          source: 'partner',
          time: '10:30',
          editorial: 'Lucky List. Eu cresci aqui. As ruas são as mesmas, as casas, as vistas. Caminhar aqui é caminhar pela minha infância. Os ateliês vendem arte local, cerâmicas, coisas que você não encontra em nenhum outro lugar.',
        },
        {
          id: 'carolina-d2-4',
          name: 'Bar do Mineiro',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '12:30',
          editorial: 'Simples, barulhento, real. A feijoada é boa, os pastéis são melhores. Isso não é lugar de turista fingindo ser local — é local.',
        },
        {
          id: 'carolina-d2-5',
          name: 'Aprazível',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '14:30',
          editorial: 'Almoço com vista. O terraço olha pra cidade inteira. Cozinha brasileira feita com cuidado. Refeição longa, sem pressa.',
        },
        {
          id: 'carolina-d2-6',
          name: 'Volta para Ipanema',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '17:30',
          editorial: 'De volta de carro. Descanso no hotel, talvez uma soneca.',
        },
        {
          id: 'carolina-d2-7',
          name: 'Cipriani',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '20:00',
          editorial: 'Italiano no Copacabana Palace. Clássico, confiável, elegante sem ser duro. Bom pra um jantar de verdade depois de um dia de nostalgia.',
        },
      ],
    },
    3: {
      dayNumber: 3,
      title: 'DIA 3 — JARDIM BOTÂNICO E GÁVEA',
      subtitle: 'Verde e silêncio',
      items: [
        {
          id: 'carolina-d3-1',
          name: 'Café da manhã no Fasano',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:30',
        },
        {
          id: 'carolina-d3-2',
          name: 'Jardim Botânico',
          category: 'attraction',
          duration: '2h30',
          source: 'partner',
          time: '10:00',
          editorial: 'A aléia das palmeiras é linda. O jardim é antigo, bem cuidado, e silencioso de manhã. Leve água.',
        },
        {
          id: 'carolina-d3-3',
          name: 'Empório Jardim',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '12:30',
          editorial: 'Ao lado do jardim botânico. Comida leve, boas saladas, ambiente calmo. Perfeito depois de caminhar.',
        },
        {
          id: 'carolina-d3-4',
          name: 'Traslado para Gávea',
          category: 'experience',
          duration: '15min',
          source: 'partner',
          time: '14:00',
          editorial: 'Trajeto curto, mesmo bairro.',
        },
        {
          id: 'carolina-d3-5',
          name: 'IMS Shop',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '14:15',
          editorial: 'Lucky List. O Instituto Moreira Salles tem uma das melhores lojas de museu da cidade. Livros, fotografia, objetos de design. Vale a parada.',
        },
        {
          id: 'carolina-d3-6',
          name: 'Farm no Shopping da Gávea',
          category: 'experience',
          duration: '45min',
          source: 'partner',
          time: '15:30',
          editorial: 'Lucky List. Marca brasileira, estampas coloridas, roupas confortáveis. Bom pra presentes ou pra você mesma.',
        },
        {
          id: 'carolina-d3-7',
          name: 'Volta para o hotel',
          category: 'experience',
          duration: '20min',
          source: 'partner',
          time: '16:30',
        },
        {
          id: 'carolina-d3-8',
          name: 'Elena',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '20:00',
          editorial: 'Boa música, bons drinks, boa comida. Funciona pra qualquer humor. A galera é interessante e a energia é certa.',
        },
      ],
    },
    4: {
      dayNumber: 4,
      title: 'DIA 4 — LEBLON E ALTA GASTRONOMIA',
      subtitle: 'Devagar',
      items: [
        {
          id: 'carolina-d4-1',
          name: 'Café da manhã tardio no Fasano',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '09:30',
          editorial: 'Dorme até mais tarde. Sem despertador. Café da manhã quando acordar.',
        },
        {
          id: 'carolina-d4-2',
          name: 'Caminhada até o Leblon',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '11:00',
          editorial: 'Pela praia, passando por Ipanema, entrando no Leblon. Vinte minutos se você andar rápido, mas pra quê.',
        },
        {
          id: 'carolina-d4-3',
          name: 'Osklen',
          category: 'experience',
          duration: '45min',
          source: 'partner',
          time: '11:30',
          editorial: 'Lucky List. Marca brasileira que eu uso há anos. Design limpo, boa qualidade, discreto.',
        },
        {
          id: 'carolina-d4-4',
          name: 'Capricciosa',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '13:00',
          editorial: 'Pizzaria que está aqui há muito tempo. Massa fina, recheios simples, sem reinvenção. Funciona sempre.',
        },
        {
          id: 'carolina-d4-5',
          name: 'Praia do Leblon',
          category: 'experience',
          duration: '3h',
          source: 'partner',
          time: '15:00',
          editorial: 'Acha um lugar, pede uma água de coco, não faz nada. Esse é o objetivo.',
        },
        {
          id: 'carolina-d4-6',
          name: 'Volta para o hotel',
          category: 'experience',
          duration: '20min',
          source: 'partner',
          time: '18:30',
          editorial: 'De carro. Banho, troca de roupa, descanso.',
        },
        {
          id: 'carolina-d4-7',
          name: 'Oteque',
          category: 'food',
          duration: '3h',
          source: 'partner',
          time: '20:00',
          editorial: 'Duas estrelas Michelin. Frutos do mar feitos com precisão. É um jantar especial, então reserve com antecedência e vista-se adequadamente.',
        },
      ],
    },
    5: {
      dayNumber: 5,
      title: 'DIA 5 — CENTRO DO RIO',
      subtitle: 'História e vida de rua',
      items: [
        {
          id: 'carolina-d5-1',
          name: 'Café da manhã no Fasano',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:00',
          editorial: 'Saída cedo hoje. O Centro é melhor de manhã, antes de ficar muito quente.',
        },
        {
          id: 'carolina-d5-2',
          name: 'Traslado para o Centro',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '09:30',
          editorial: 'De carro, 25-30 minutos. Peça pro motorista te deixar perto da Praça XV.',
        },
        {
          id: 'carolina-d5-3',
          name: 'Feira do Lavradio',
          category: 'experience',
          duration: '2h',
          source: 'partner',
          time: '10:00',
          editorial: 'Lucky List. Antiguidades, móveis vintage, discos antigos, coisas com história. Mesmo que você não compre, vale caminhar por lá.',
        },
        {
          id: 'carolina-d5-4',
          name: 'Caminhada pelo Centro Histórico',
          category: 'experience',
          duration: '1h30',
          source: 'partner',
          time: '12:00',
          editorial: 'Prédios antigos, igrejas, ruas estreitas. É onde o Rio começou. A maioria dos turistas nunca vê.',
        },
        {
          id: 'carolina-d5-5',
          name: 'Almoço no Centro',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '13:30',
          editorial: 'Tem muitos restaurantes pequenos na Rua do Ouvidor. Comida simples, serviço rápido, atmosfera carioca de verdade.',
        },
        {
          id: 'carolina-d5-6',
          name: 'Volta para a Zona Sul',
          category: 'experience',
          duration: '40min',
          source: 'partner',
          time: '15:30',
          editorial: 'De carro. O trânsito pode ser pesado à tarde.',
        },
        {
          id: 'carolina-d5-7',
          name: 'Granado',
          category: 'experience',
          duration: '30min',
          source: 'partner',
          time: '16:30',
          editorial: 'Lucky List. Marca de farmácia brasileira desde 1870. Sabonetes, cremes, perfumes. Embalagem bonita, bons produtos.',
        },
        {
          id: 'carolina-d5-8',
          name: 'Descanso no hotel',
          category: 'experience',
          duration: '2h',
          source: 'partner',
          time: '17:00',
        },
        {
          id: 'carolina-d5-9',
          name: 'Lasai',
          category: 'food',
          duration: '3h',
          source: 'partner',
          time: '20:00',
          editorial: 'O chef Rafa Costa e Silva serve ingredientes brasileiros com técnica francesa. Pratos pequenos, menu degustação, cozinha séria. Um dos melhores restaurantes da cidade.',
        },
      ],
    },
    6: {
      dayNumber: 6,
      title: 'DIA 6 — BARRA DA TIJUCA',
      subtitle: 'Praias e pôr do sol',
      items: [
        {
          id: 'carolina-d6-1',
          name: 'Café da manhã no Fasano',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '08:30',
        },
        {
          id: 'carolina-d6-2',
          name: 'Traslado para a Barra',
          category: 'experience',
          duration: '45min',
          source: 'partner',
          time: '10:00',
          editorial: 'De carro, 40-50 minutos. A estrada pela costa é linda.',
        },
        {
          id: 'carolina-d6-3',
          name: 'Praia da Barra',
          category: 'experience',
          duration: '3h',
          source: 'partner',
          time: '11:00',
          editorial: 'Praia longa, areia larga, menos cheia que Ipanema. Boa pra nadar, boa pra caminhar.',
        },
        {
          id: 'carolina-d6-4',
          name: 'Golden Sucos',
          category: 'food',
          duration: '1h',
          source: 'partner',
          time: '14:00',
          editorial: 'Lucky List. Sucos frescos, açaí, lanches leves. É isso que eu tomava quando era nova. Simples e perfeito depois da praia.',
        },
        {
          id: 'carolina-d6-5',
          name: 'Mocellin Mar',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '15:30',
          editorial: 'Frutos do mar de frente pro mar. Bom peixe, boa vista, sem pretensão. É assim que o almoço deveria ser na praia.',
        },
        {
          id: 'carolina-d6-6',
          name: 'Pôr do sol no Píer',
          category: 'experience',
          duration: '1h',
          source: 'partner',
          time: '18:00',
          editorial: 'O pôr do sol da Barra é diferente. Céu mais aberto, água mais calma.',
        },
        {
          id: 'carolina-d6-7',
          name: 'Volta para Ipanema',
          category: 'experience',
          duration: '50min',
          source: 'partner',
          time: '19:00',
          editorial: 'De carro. O trânsito da noite pode ser lento.',
        },
        {
          id: 'carolina-d6-8',
          name: 'Gurumê',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '21:00',
          editorial: 'Japonês com um toque brasileiro. Jantar leve depois de um dia de praia. Fresco, confiável, consistente.',
        },
      ],
    },
    7: {
      dayNumber: 7,
      title: 'DIA 7 — ÚLTIMO DIA',
      subtitle: 'Manhã tranquila e jantar de despedida',
      items: [
        {
          id: 'carolina-d7-1',
          name: 'Café da manhã tardio no Fasano',
          category: 'food',
          duration: '1h30',
          source: 'partner',
          time: '09:30',
          editorial: 'Sem planos até o meio-dia. Aproveita a última manhã.',
        },
        {
          id: 'carolina-d7-2',
          name: 'Caminhada na praia de Ipanema',
          category: 'experience',
          duration: '1h30',
          source: 'partner',
          time: '11:00',
          editorial: 'Uma última caminhada. Do hotel até o Arpoador e de volta. Sem pressa.',
        },
        {
          id: 'carolina-d7-3',
          name: 'San Omakase',
          category: 'food',
          duration: '2h',
          source: 'partner',
          time: '13:00',
          editorial: 'Omakase no almoço. O chef decide, você come. Restaurante pequeno, cozinha precisa, refeição memorável.',
        },
        {
          id: 'carolina-d7-4',
          name: 'Descanso e arrumação das malas',
          category: 'experience',
          duration: '3h',
          source: 'partner',
          time: '15:00',
          editorial: 'De volta ao hotel. Arruma as malas devagar. Talvez sente na piscina uma última vez.',
        },
        {
          id: 'carolina-d7-5',
          name: 'Satyricon',
          category: 'food',
          duration: '2h30',
          source: 'partner',
          time: '19:30',
          editorial: 'Último jantar no Rio. Frutos do mar no Satyricon é um clássico. Peixe fresco, serviço adequado, sem surpresas. A forma certa de encerrar a viagem.',
        },
        {
          id: 'carolina-d7-6',
          name: 'Volta para o hotel',
          category: 'experience',
          duration: '15min',
          source: 'partner',
          time: '22:00',
          editorial: 'Voo cedo amanhã. Descanse bem.',
        },
      ],
    },
  },
};

/**
 * CUSTOS ESTIMADOS — ROTEIRO DA CAROLINA DIECKMANN
 * 
 * Todos os preços em Reais (BRL)
 * 
 * DIA 1
 * - Alimentação: R$ 650 (almoço Nido + jantar Zazá)
 * - Atividades: R$ 0
 * - Transporte: R$ 80 (traslado aeroporto)
 * Total: R$ 730
 * 
 * DIA 2
 * - Alimentação: R$ 900 (café Fasano + Bar do Mineiro + Aprazível + Cipriani)
 * - Atividades: R$ 0
 * - Transporte: R$ 150 (traslados para/de Santa Teresa)
 * Total: R$ 1.050
 * 
 * DIA 3
 * - Alimentação: R$ 550 (café Fasano + Empório Jardim + Elena)
 * - Atividades: R$ 75 (entrada Jardim Botânico)
 * - Transporte: R$ 100
 * Total: R$ 725
 * 
 * DIA 4
 * - Alimentação: R$ 1.200 (café Fasano + Capricciosa + Oteque)
 * - Atividades: R$ 0
 * - Transporte: R$ 80
 * Total: R$ 1.280
 * 
 * DIA 5
 * - Alimentação: R$ 950 (café Fasano + almoço Centro + Lasai)
 * - Atividades: R$ 0
 * - Transporte: R$ 180
 * Total: R$ 1.130
 * 
 * DIA 6
 * - Alimentação: R$ 600 (café Fasano + Golden Sucos + Mocellin Mar + Gurumê)
 * - Atividades: R$ 0
 * - Transporte: R$ 200
 * Total: R$ 800
 * 
 * DIA 7
 * - Alimentação: R$ 1.100 (café Fasano + San Omakase + Satyricon)
 * - Atividades: R$ 0
 * - Transporte: R$ 60
 * Total: R$ 1.160
 * 
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * CUSTO TOTAL ESTIMADO — 7 DIAS
 * 
 * Alimentação: R$ 5.950
 * Atividades: R$ 75
 * Transporte: R$ 850
 * 
 * TOTAL GERAL: R$ 6.875
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 
 * Preços são aproximados. Hospedagem e voos não estão incluídos.
 */

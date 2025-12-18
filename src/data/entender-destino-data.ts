/**
 * ═══════════════════════════════════════════════════════════════════════════
 * STRUCTURAL LOCK — ENTENDER O DESTINO
 * Editorial Immersion Layer
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PURPOSE:
 * Long-form editorial immersion layer that provides context,
 * emotional connection, and understanding of the destination.
 * 
 * SEPARATION RULE:
 * This block is SEPARATE from ALL operational modules:
 * - Como Chegar
 * - Onde Ficar
 * - Onde Comer
 * - O Que Fazer
 * - Lucky List
 * - All secondary modules (Mover, Vida Noturna, etc.)
 * 
 * CHARACTERISTICS:
 * - Non-transactional
 * - Long-form friendly
 * - Optimized for immersive reading moments (flight, hotel, pre-trip)
 * - Identical in structure across ALL destinations
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface EditorialSection {
  id: string;
  label: string;
  order: number;
  route: string;
}

export interface DestinationEditorial {
  destinationId: string;
  destinationName: string;
  sections: {
    meuOlhar: EditorialContent;
    historia: EditorialContent;
    hojeEmDia: EditorialContent;
  };
}

export interface EditorialContent {
  title: string;
  content: string;
  // Reserved fields - NO operational content allowed
  // NO CTAs, prices, maps, booking links, or partner links
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * INTERNAL STRUCTURE (FIXED AND LOCKED ORDER)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Inside "ENTENDER O DESTINO", enforce exactly three sub-sections,
 * in this EXACT order:
 * 
 * 1) MEU OLHAR
 * 2) HISTÓRIA
 * 3) HOJE EM DIA
 * 
 * RULES FOR SUB-SECTIONS:
 * - Editorial, narrative, and contextual
 * - May contain long-form text
 * - Must NOT contain: CTAs, Prices, Maps, Booking links, Partner links
 * - Do NOT belong to Lucky List
 * - Do NOT belong to the first operational decision layer
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const EDITORIAL_SECTIONS: EditorialSection[] = [
  {
    id: 'meu-olhar',
    label: 'Meu Olhar',
    order: 1,
    route: '/entender/meu-olhar',
  },
  {
    id: 'historia',
    label: 'História',
    order: 2,
    route: '/entender/historia',
  },
  {
    id: 'hoje-em-dia',
    label: 'Hoje em Dia',
    order: 3,
    route: '/entender/hoje-em-dia',
  },
];

/**
 * Get editorial sections in fixed order
 */
export const getEditorialSections = (): EditorialSection[] => {
  return [...EDITORIAL_SECTIONS].sort((a, b) => a.order - b.order);
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POSITIONING RULE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * "Entender o Destino" is:
 * - NOT part of the first screen
 * - NOT part of operational modules (Como Chegar, Onde Ficar, etc.)
 * - NOT part of secondary modules (Mover, Vida Noturna, etc.)
 * 
 * It must live AFTER all operational and secondary modules.
 * Access is optional and intentional (reading mode).
 * 
 * LAYER HIERARCHY:
 * 1) First Screen (operational decisions)
 * 2) Secondary Modules (planning depth)
 * 3) Entender o Destino (immersion layer - separate)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const EDITORIAL_POSITIONING = {
  isPartOfFirstScreen: false,
  isPartOfOperationalModules: false,
  isPartOfSecondaryModules: false,
  positionInHierarchy: 'after-all-operational-and-secondary',
  accessMode: 'optional-intentional-reading-mode',
} as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION RULES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ACCESS:
 * - Must be optional and intentional
 * - Entry may occur via: secondary button, swipe, reading mode, or modal
 * - Entry must NEVER interrupt the main decision flow
 * 
 * EXIT:
 * - Must always return user to destination context, NEVER to Home
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const EDITORIAL_NAVIGATION = {
  parentRoute: '/', // Returns to destination context (First Destination Screen)
  accessType: 'optional-intentional',
  interruptsDecisionFlow: false,
} as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COGNITIVE RULE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * "Entender o Destino" exists for IMMERSION and UNDERSTANDING.
 * Operational decisions happen elsewhere.
 * 
 * NEVER mix this block with:
 * - Logistics
 * - Neighborhoods
 * - Activities
 * - Booking/transactions
 * 
 * LAYER SEPARATION:
 * - Operational modules = DECISIONS
 * - Entender o Destino = IMMERSION
 * - These layers must NEVER be mixed
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const EDITORIAL_CONTENT_RULES = {
  allowsLongFormText: true,
  allowsCTAs: false,
  allowsPrices: false,
  allowsMaps: false,
  allowsBookingLinks: false,
  allowsPartnerLinks: false,
  allowsNeighborhoodsList: false,
  allowsActivities: false,
  belongsToLuckyList: false,
  belongsToOperationalLayer: false,
  belongsToSecondaryModules: false,
} as const;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SCALABILITY RULE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * - This block MUST exist in ALL destinations
 * - Structure is FIXED and MANDATORY
 * - Content may vary, but ORDER and NAMING never change
 * 
 * SEPARATION:
 * DECISION (operational layers) vs IMMERSION (editorial layer)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Rio de Janeiro editorial content placeholder
 * Content to be populated - structure is locked
 */
export const RIO_EDITORIAL: DestinationEditorial = {
  destinationId: 'rio-de-janeiro',
  destinationName: 'Rio de Janeiro',
  sections: {
    meuOlhar: {
      title: 'Meu Olhar',
      content: `O Rio de Janeiro sempre foi meu norte, mas existe um segredo que eu e meu irmão guardamos por muito tempo: eu nasci em São Paulo.

Meus pais estavam trabalhando lá quando vim ao mundo, em 1982, mas logo depois decidiram se mudar pro Rio — e foi aqui, na Barra da Tijuca, que a minha vida realmente começou.

Eles compraram o apartamento no Barramares quando o prédio ainda estava em construção. Naquela época, a Barra era praticamente um território em formação. Não existiam médicos, quase não havia hospitais, o Barrashopping tinha acabado de ser inaugurado, e tudo ao redor era areia e mato.

Era o início de um novo bairro, construído por famílias que sonhavam com um estilo de vida diferente — mais tranquilo, mais espaçoso, mais livre. Muita gente vinha da Tijuca. Durante anos, essas famílias passavam o fim de semana na Barra, e foi por isso que surgiram tantos flats e prédios com estrutura de veraneio. O bairro nasceu como uma extensão do próprio Rio, um refúgio pra quem queria fugir da violência e respirar um pouco mais de mar.

Com o tempo, essa turma decidiu ficar de vez — e começou ali uma nova geração, que literalmente habitou o nada e fez dele casa. Eu fui um desses meninos.

Nasci e cresci no Barramares, entre as grades do condomínio, que serviam de proteção, e a praia, que era o nosso quintal. Essa dualidade moldou o jeito de quem cresceu aqui: liberdade e limite ao mesmo tempo. A gente brincava na areia, jogava bola, andava de bicicleta dentro do condomínio — e quando atravessava o portão, o mar estava ali, esperando.

A diferença entre a Barra e a Zona Sul sempre me chamou atenção. Na Zona Sul, as pessoas moram em prédios tradicionais e, quando saem, já estão na rua, no meio da cidade. Na Barra, não. Aqui tudo é mais amplo, as distâncias são maiores, e a vida acontece sobre quatro rodas. Na Zona Sul, você desce do prédio e já está na farmácia ou no restaurante da esquina. Na Barra, você pega o carro até pra ir ao mercado.

Esse ritmo molda até a personalidade. O morador da Zona Sul é mais urbano, mais de andar, mais de esquina. O da Barra é mais introspectivo, mais família, mais dentro do próprio espaço. Mas os dois têm algo em comum: esse amor profundo pela cidade — por esse cenário que mistura mar, montanha e caos de um jeito que só o Rio tem.

No meio dessa história, aconteceu uma cena que me marcou pra sempre. Foi no Prêmio Contigo de Novelas, no Copacabana Palace, quando eu já fazia Malhação. O Amaury Jr. veio me entrevistar e começou com naturalidade: "Carioca, né?". No impulso, respondi: "É, carioca".

A entrevista seguia até que meu pai, que estava ali, entrou na conversa: "Eu sou o pai dele! E ele é paulista como você, né, Amaury?". O Amaury me olhou surpreso: "Ué, ele acabou de dizer que era carioca!". Ali, ao vivo, o segredo da infância foi revelado. Depois, meu pai riu e disse: "Você mentiu e não me avisou!". Eu respondi: "Mas você não tava vendo?". Ele: "Tava vendo, mas não ouvindo".

Hoje eu conto essa história com carinho. Porque sim, nasci paulista — mas fui criado carioca. A Barra me fez quem eu sou: um cara que cresceu entre as grades e o mar, entre a proteção e a liberdade, entre São Paulo e o Rio. E toda vez que volto pra casa, sinto que o Rio me recebe do mesmo jeito de sempre — com sol, vento e aquele humor que parece dizer: relaxa… aqui o tempo é outro.

---

## IPANEMA

Ipanema é um bairro jovem — e isso muda tudo.

Diferente do Centro, da Glória ou mesmo de Copacabana, Ipanema não nasceu como núcleo colonial nem como bairro imperial. Ela surge tardiamente, no fim do século XIX, quando o Rio já tinha passado pela ocupação portuguesa, pelo ciclo do ouro, pela chegada da Corte e por transformações urbanas profundas.

Antes de virar bairro, Ipanema era areia, lagoa, mato e isolamento. A ocupação começa de forma tímida, com casas de veraneio, pequenas chácaras e um público que buscava distância do Centro insalubre e apertado. Não foi um bairro aristocrático no sentido clássico — foi um bairro de experimento urbano.

A virada acontece no século XX, especialmente a partir dos anos 1940 e 1950. Ipanema passa a atrair intelectuais, artistas, arquitetos modernos, jornalistas, gente que pensava o Brasil de forma mais aberta. É aqui que o Rio começa a se enxergar como cidade cosmopolita, não só como capital administrativa.

Nos anos 1960, Ipanema vira símbolo cultural. Bossa Nova, poesia, cinema novo, comportamento. Era o bairro da conversa de bar, da mesa na calçada, do encontro improvisado. Não era só morar — era pertencer a um estado de espírito. Gente jovem, livre, questionadora. Era ali que o Brasil moderno se ensaiava.

Hoje, Ipanema continua sendo esse ponto de encontro, mas com mais camadas. É residencial e turística ao mesmo tempo. É sofisticada sem ser engessada. Concentra restaurantes autorais, cafés, comércio forte e uma vida de rua que funciona naturalmente.

É o bairro mais fácil para entender o Rio pela primeira vez. Você aprende a cidade andando. Tudo acontece a pé. A praia organiza o tempo. O bairro ensina o ritmo: manhãs calmas, tardes solares, noites sociais. Ipanema continua sendo o lugar onde o Rio conversa com o mundo.

---

## LEBLON

O Leblon nasce colado em Ipanema, mas escolhe outro caminho.

Enquanto Ipanema se constrói como palco cultural, o Leblon se forma como bairro residencial e silencioso, com uma ocupação mais controlada e menos experimental.

No início do século XX, era quase um "final da cidade". Pouco comércio, poucas opções de transporte e um público mais restrito. Com o tempo, o bairro atrai famílias tradicionais, moradores estáveis, gente que não queria a efervescência de Copacabana nem o improviso de Ipanema.

A grande marca do Leblon sempre foi a constância. Ele muda pouco, lentamente. Não se reinventa a cada década. Isso cria uma sensação de segurança, previsibilidade e maturidade urbana.

Nos anos 1980 e 1990, o Leblon se consolida como o bairro mais valorizado do Rio. Não por ostentação, mas por qualidade de vida. Tudo funciona. A praia é mais calma. A vida social acontece nos restaurantes, não tanto na rua.

Hoje, o Leblon é sofisticado, sólido e confortável. Continua residencial, mas com uma gastronomia madura e consistente. É o bairro de quem já conhece o Rio, de quem quer viver bem sem excesso de estímulo. Um Rio mais adulto.

---

## COPACABANA

Copacabana é um fenômeno urbano raro.

Até o fim do século XIX, era quase inabitada. O túnel que a liga ao resto da cidade só fica pronto em 1892. A partir daí, Copacabana explode — e explode rápido.

Nos anos 1920 e 1930, vira o bairro da elite moderna. Hotéis, cassinos, edifícios altos, vida noturna. Era o lugar onde o Rio queria parecer internacional. Franceses, argentinos, americanos, artistas e diplomatas circulavam naturalmente.

Copacabana foi o primeiro bairro verdadeiramente vertical do Rio. Isso muda tudo: densidade, comércio, vida de rua, transporte. A praia vira palco público, democrático, intenso.

Com o tempo, o bairro envelhece, mas não morre. Ele se transforma. Sai a elite fixa, entram moradores antigos, turistas, comércio forte. Copacabana vira cidade dentro da cidade.

Hoje é caótica, viva, barulhenta, prática. Não é silenciosa, não é charmosa no sentido clássico — mas é verdadeira. Quem entende Copacabana entende o Rio real, sem maquiagem.

---

## LEME

O Leme sempre foi o "fim da linha" — e isso é parte do charme.

Geograficamente, ele acaba onde o morro começa. Urbanisticamente, ele termina antes do exagero de Copacabana. Isso fez do Leme um bairro quase secreto durante décadas.

Enquanto Copacabana crescia para cima, o Leme crescia para dentro. Menos prédios gigantes, menos hotéis, menos trânsito. Era comum ouvir carioca antigo dizer: "Moro em Copacabana, mas no Leme" — como se fosse outra cidade.

Durante muitos anos, o bairro foi refúgio de diplomatas, artistas discretos, jornalistas e famílias que queriam praia, mas não queriam confusão. O comércio sempre foi funcional: padaria boa, farmácia, restaurante conhecido. Nada de modismo.

O Leme também foi um dos primeiros bairros onde o carioca começou a caminhar por prazer, não só por necessidade. A mureta virou ponto de encontro muito antes de virar cartão-postal de Instagram. Ali sempre teve senhor conversando, criança aprendendo a andar de bicicleta, casal em silêncio olhando o mar.

Hoje, o Leme é um bairro que envelheceu bem. Continua residencial, seguro, previsível. Não é o bairro mais "cool" do Rio — e justamente por isso é um dos mais agradáveis para morar ou se hospedar com calma. É o Rio que não faz esforço para impressionar.

---

## ARPOADOR

O Arpoador não é exatamente um bairro. É um estado de espírito comprimido entre duas praias.

Desde antes da urbanização, aquela pedra já era ponto de referência natural. Índios, pescadores, depois surfistas. O nome vem do arpão — ali se caçava peixe grande quando o mar permitia.

Nos anos 1960 e 1970, o Arpoador vira território da juventude. Surf, contracultura, liberdade corporal. Era comum ver gente dormindo na areia, tocando violão, debatendo política, amores e o sentido da vida — tudo ao mesmo tempo.

O pôr do sol nasce ali como ritual coletivo. E isso é raro numa cidade grande: pessoas que não se conhecem, de classes diferentes, param juntas para aplaudir o fim do dia. Não é marketing. É hábito.

O Arpoador nunca foi sofisticado no sentido clássico. É sofisticado no sentido humano. Hoje continua democrático, intenso, cheio — às vezes até demais. Mas ainda é um dos poucos lugares do mundo onde o tempo desacelera por alguns minutos todos os dias.

---

## JARDIM BOTÂNICO

O Jardim Botânico começa oficialmente em 1808, com Dom João VI.

Enquanto outros bairros surgiam por necessidade de moradia, o Jardim Botânico surge por projeto. Ciência, botânica, aclimatação de espécies. Um bairro pensado para observar, catalogar, entender.

Isso moldou tudo. As ruas largas, as árvores antigas, a sensação de ordem silenciosa. Sempre foi bairro de gente ligada ao conhecimento: professores, cientistas, médicos, artistas mais introspectivos.

Não é bairro de barulho. É bairro de conversa baixa. De almoço longo. De caminhar sem pressa. Durante décadas, foi quase um segredo — morar ali era privilégio de quem sabia.

Hoje, ganhou gastronomia, ganhou movimento, mas não perdeu essência. Continua sendo um dos lugares mais agradáveis para viver o Rio com equilíbrio. Natureza, cidade, cultura — tudo sem histeria.

---

## GÁVEA

A Gávea é o bairro mais carioca no sentido relacional.

Ali todo mundo se cruza. Professor com aluno, pai com filho universitário, ex-namorados, grupos misturados. A presença da PUC cria um ciclo eterno de renovação jovem.

Historicamente, foi bairro de famílias tradicionais, casas grandes, jardins. Com o tempo, os bares tomaram as esquinas — mas nunca expulsaram os moradores. Diferente de outros lugares, a boemia da Gávea convive com o cotidiano.

O Baixo Gávea não é só um conjunto de bares. É uma praça social informal. Um lugar onde você sai sem destino e encontra alguém conhecido. Onde conversa começa numa mesa e termina em outra.

É um bairro que envelhece sem perder vitalidade. Quem mora ali costuma defender com orgulho — e raramente vai embora por vontade própria.

---

## BOTAFOGO

Botafogo talvez seja o bairro que mais mudou de papel na história do Rio.

No século XIX, era bairro aristocrático. Mansões, famílias ricas, vista para a Baía de Guanabara. Depois, com a expansão da cidade, perde status residencial, vira bairro de passagem.

Durante décadas, foi visto como "bairro de trabalho", não de lazer. Isso muda radicalmente nos anos 2000. Criativos, jornalistas, publicitários, chefs, designers começam a ocupar o bairro.

Botafogo vira laboratório. Bar abre e fecha. Restaurante testa conceito. Festa surge em galpão. O bairro aceita o risco — e isso o torna vivo.

Hoje, Botafogo é plural, caótico, interessante. Nem tudo funciona, mas quase tudo tenta. É o bairro onde o Rio experimenta antes de consolidar.

---

## FLAMENGO

O Flamengo é subestimado — e isso joga a favor dele.

Sempre foi bairro residencial, bem localizado, servido de metrô, próximo ao Centro e à Zona Sul mais famosa.

Nunca teve glamour exagerado. Mas sempre teve vida. Aterro, praia larga, prédios antigos, moradores fiéis. É bairro de quem vive o Rio no dia a dia, não no imaginário turístico.

Hoje, o Flamengo atrai gente prática, famílias jovens, pessoas que querem morar bem sem entrar na disputa simbólica de status da Zona Sul mais disputada.

---

## SANTA TERESA

Santa Teresa é memória viva.

Foi bairro da elite no fim do século XIX, com bondes, casarões e vista privilegiada. Depois, com o deslocamento do poder econômico, entra em decadência. Casas envelhecem, ruas se esvaziam.

É aí que os artistas chegam. Pintores, músicos, escritores, estrangeiros. Santa Teresa vira território criativo antes mesmo de virar moda. Um bairro que não se dobra à lógica da facilidade.

Até hoje, morar ali exige escolha consciente. Subida, estacionamento difícil, ruas estreitas. Mas em troca, você ganha atmosfera. Vista. Silêncio. História.

Santa Teresa não é prática. É poética. E isso não é para todo mundo.

---

## SÃO CONRADO

São Conrado é paisagem antes de ser bairro.

Espremido entre montanha e mar, sempre teve ocupação limitada. Nunca foi bairro de comércio forte nem de vida social intensa.

Foi escolhido por quem queria vista, silêncio e isolamento relativo. Artistas, executivos, gente que não precisava estar "no meio da cidade".

Hoje, continua assim. Um bairro de passagem para muitos, de refúgio para poucos. Não tenta competir com ninguém — apenas existe.

---

## BARRA DA TIJUCA

A Barra não nasceu — foi planejada.

Inspirada no urbanismo moderno, na lógica americana, no carro como extensão da casa. Ruas largas, condomínios fechados, shopping centers.

Quando meus pais compraram o apartamento no Barramares, aquilo ali era quase nada. Areia, vento, promessa. A Barra era futuro em construção. Crescer ali era crescer entre obra e mar.

Isso moldou uma geração inteira. Crianças que brincavam dentro do condomínio e aprendiam liberdade na praia. Proteção e abertura ao mesmo tempo.

Hoje, a Barra é uma cidade autônoma. Com suas qualidades e contradições. Não é Zona Sul — e não tenta ser. É outro modo de viver o Rio.

---

## RECREIO

O Recreio é o último território onde o Rio ainda respira largo.

Mais natureza, menos interferência. Surf, trilha, bicicleta, silêncio relativo.

Sempre foi bairro de quem quer espaço, vento, horizonte. Não é bairro de pressa. Quem mora ali aceita distância em troca de qualidade de vida.

É o Rio antes da cidade acabar.

---

## CENTRO

O Centro é onde tudo começou — e onde tudo se mistura.

Portugueses chegaram primeiro, holandeses tentaram tomar, franceses influenciaram costumes. Igrejas, mercados, bancos, poder.

Durante séculos, foi o coração absoluto do Rio. Hoje, é coração histórico. Não se mora tanto, mas se entende tudo ali.

Quem ignora o Centro não entende o Rio.`,
    },
    historia: {
      title: 'História',
      content: `Fundado em 1565, o Rio de Janeiro foi capital do Brasil por quase dois séculos e principal porta de entrada de ideias, cultura e influência europeia no país.

Entre invasões, a chegada da corte portuguesa, o surgimento do samba, da bossa nova e do futebol-arte, a cidade se reinventou muitas vezes sem perder sua essência popular.

O Rio moldou comportamentos, exportou música, imagem e estilo de vida. Nunca foi uma cidade simples, mas sempre foi uma cidade decisiva para entender o Brasil.`,
    },
    hojeEmDia: {
      title: 'Hoje em Dia',
      content: `Hoje o Rio vive um momento mais realista e interessante. Menos glamour artificial e mais experiência verdadeira.

A gastronomia amadureceu, os bairros ganharam novas camadas e o turismo voltou a valorizar o que sempre foi o ponto forte da cidade: vida ao ar livre, encontros e paisagem.

O Rio não é só cartão-postal. É rotina boa, café de bairro, pôr do sol que vira plano do dia e noite que começa sem hora pra acabar.`,
    },
  },
};

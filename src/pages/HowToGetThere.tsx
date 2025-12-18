import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

/**
 * Como Chegar — Rio de Janeiro
 * 
 * STRUCTURAL LOCK:
 * - City-level only (not neighborhood-based)
 * - Section anchors enabled for deep-linking
 * - Authority callout semantically marked
 * 
 * SECTION ANCHORS:
 * - #aviao
 * - #principais-rotas
 * - #carro
 * - #onibus
 * - #do-aeroporto
 */

const HowToGetThere = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Title */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-4xl font-serif font-semibold text-foreground leading-tight">
            Como Chegar
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Rio de Janeiro
          </p>
        </div>

        {/* Introduction */}
        <div className="px-6 pb-8">
          <p className="text-base text-foreground leading-relaxed">
            Chegar ao Rio é fácil. Difícil é ir embora.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed mt-3">
            A cidade é uma das mais bem conectadas do Brasil, com voos frequentes, bons aeroportos e acesso simples por estrada a partir de vários estados.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* ═══════════════════════════════════════════════════════════════
            SECTION ANCHOR: AVIÃO
            ID: #aviao
            ═══════════════════════════════════════════════════════════════ */}
        <section id="aviao" className="px-6 pt-8">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
            AVIÃO
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed mb-6">
            O Rio tem dois aeroportos principais, e a escolha faz diferença dependendo do seu roteiro.
          </p>

          {/* Galeão */}
          <div className="mb-6">
            <h3 className="text-lg font-serif font-medium text-foreground mb-2">
              Aeroporto Internacional do Galeão (GIG)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              É a principal porta de entrada para quem vem de fora do Brasil e também para muitos voos nacionais.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Fica a cerca de 20 km do Centro e funciona melhor para quem vai se hospedar na Zona Norte, Centro, Barra ou Recreio.
            </p>
          </div>

          {/* Santos Dumont */}
          <div className="mb-6">
            <h3 className="text-lg font-serif font-medium text-foreground mb-2">
              Aeroporto Santos Dumont (SDU)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No coração da cidade, de frente para a Baía de Guanabara.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              É, sem exagero, uma das aproximações mais bonitas do mundo.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Ideal para quem vai ficar na Zona Sul. Você pousa praticamente dentro da cidade.
            </p>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-6 border-t border-border" />

        {/* ═══════════════════════════════════════════════════════════════
            SECTION ANCHOR: PRINCIPAIS ROTAS DO BRASIL
            ID: #principais-rotas
            ═══════════════════════════════════════════════════════════════ */}
        <section id="principais-rotas" className="px-6 pt-8">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-6">
            PRINCIPAIS ROTAS DO BRASIL
          </h2>

          {/* São Paulo */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-base font-serif font-medium text-foreground mb-2">
              São Paulo → Rio de Janeiro
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              É praticamente uma ponte aérea.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Há voos a cada poucos minutos, tanto para o Santos Dumont quanto para o Galeão.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Duração média: 1h.
            </p>
          </div>

          {/* Belo Horizonte */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-base font-serif font-medium text-foreground mb-2">
              Belo Horizonte → Rio de Janeiro
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Voos diretos frequentes.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Duração média: 1h10.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Também é possível ir de carro, numa viagem bonita pela BR-040, com cerca de 6 horas.
            </p>
          </div>

          {/* Porto Alegre */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-base font-serif font-medium text-foreground mb-2">
              Porto Alegre → Rio de Janeiro
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Voos diretos diários.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Duração média: 2h.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Costuma ter boas tarifas fora de feriados.
            </p>
          </div>

          {/* Florianópolis */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-base font-serif font-medium text-foreground mb-2">
              Florianópolis → Rio de Janeiro
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Voos diretos regulares.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Duração média: 1h45.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              É uma rota muito usada por quem vem no verão.
            </p>
          </div>

          {/* Fortaleza */}
          <div className="mb-6 pb-6 border-b border-border">
            <h3 className="text-base font-serif font-medium text-foreground mb-2">
              Fortaleza → Rio de Janeiro
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Voos diretos.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Duração média: 3h.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Ótima opção para quem vem do Nordeste sem precisar de conexão.
            </p>
          </div>

          {/* General note */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            De forma geral, o Rio é bem conectado com todas as capitais do Sudeste, Sul e Nordeste.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Se você vem de uma capital média ou menor, normalmente faz uma conexão rápida em São Paulo, Brasília ou Belo Horizonte.
          </p>
        </section>

        {/* Divider */}
        <div className="mx-6 border-t border-border mt-8" />

        {/* ═══════════════════════════════════════════════════════════════
            SECTION ANCHOR: CARRO
            ID: #carro
            ═══════════════════════════════════════════════════════════════ */}
        <section id="carro" className="px-6 pt-8">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
            CARRO
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Para quem vem de carro, o acesso é simples:
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-1 mb-4">
            <li>• São Paulo / Costa Verde: BR-101</li>
            <li>• Minas Gerais: BR-040</li>
            <li>• Região Serrana: estradas bem sinalizadas</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Vale lembrar: dentro da cidade, carro faz sentido principalmente na Barra, Recreio e Guaratiba.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Na Zona Sul, muitas vezes andar a pé ou usar aplicativo é mais prático.
          </p>
        </section>

        {/* Divider */}
        <div className="mx-6 border-t border-border mt-8" />

        {/* ═══════════════════════════════════════════════════════════════
            SECTION ANCHOR: ÔNIBUS
            ID: #onibus
            ═══════════════════════════════════════════════════════════════ */}
        <section id="onibus" className="px-6 pt-8">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
            ÔNIBUS
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A Rodoviária Novo Rio recebe ônibus de praticamente todas as capitais do país.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Fica próxima ao Centro e à Zona Portuária.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Para quem vem do Sudeste, é uma opção confortável, com viagens noturnas bem organizadas.
          </p>
        </section>

        {/* Divider */}
        <div className="mx-6 border-t border-border mt-8" />

        {/* ═══════════════════════════════════════════════════════════════
            SECTION ANCHOR: DO AEROPORTO ATÉ A CIDADE
            ID: #do-aeroporto
            ═══════════════════════════════════════════════════════════════ */}
        <section id="do-aeroporto" className="px-6 pt-8">
          <h2 className="text-xl font-serif font-semibold text-foreground mb-4">
            DO AEROPORTO ATÉ A CIDADE
          </h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-1 mb-6">
            <li>• Aplicativos como Uber e 99 funcionam bem</li>
            <li>• Táxi oficial é seguro</li>
            <li>• Do Santos Dumont, muitas vezes dá pra sair caminhando ou chegar rápido de carro à Zona Sul</li>
            <li>• Do Galeão, o carro ou app é a melhor opção</li>
          </ul>

          {/* ═══════════════════════════════════════════════════════════════
              AUTHORITY CALLOUT
              Type: Personal recommendation from the guide
              Semantic role: trusted editorial advice
              ═══════════════════════════════════════════════════════════════ */}
          <aside 
            className="border-l-2 border-border pl-4 py-2"
            role="note"
            aria-label="Dica pessoal do guia"
          >
            <p className="text-sm font-medium text-foreground mb-2">
              Minha dica pessoal:
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Se você vai ficar em Ipanema, Leblon ou Copacabana, prefira voar para o Santos Dumont.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-1">
              Se vai para a Barra, Recreio ou Guaratiba, o Galeão costuma ser mais prático.
            </p>
          </aside>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-border">
        <p className="text-xs text-muted-foreground">
          The Lucky Trip — Rio de Janeiro
        </p>
      </footer>
    </div>
  );
};

export default HowToGetThere;

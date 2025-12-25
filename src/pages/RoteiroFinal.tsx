import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Utensils, Sun, Camera, Mountain, Music, Car, Footprints, Clock, Moon } from "lucide-react";

/**
 * ROTEIRO FINAL - Static template for finalized itinerary
 * Includes accommodation anchoring, transport segments, time blocks, and cost estimates.
 */

const RoteiroFinal = () => {
  const navigate = useNavigate();

  // Static demo data for Rio 3 days with full logistical structure
  const tripData = {
    destination: "Rio de Janeiro",
    dates: "15 Jan → 18 Jan 2025",
    travelers: "2 adultos, 1 criança",
    hotel: { name: "Hotel Fasano Rio de Janeiro", neighborhood: "Ipanema" },
    days: [
      {
        day: 1,
        title: "Dia 1 — Zona Sul clássica",
        activities: [
          { time: "08:30", name: "Saída do hotel", neighborhood: "Ipanema", icon: "departure", timeBlock: "morning" },
          { time: "08:45", type: "transport", from: "Ipanema", to: "Floresta da Tijuca", mode: "uber", duration: "25-30 min" },
          { time: "09:30", name: "Cristo Redentor", neighborhood: "Floresta da Tijuca", icon: "landmark", timeBlock: "morning" },
          { time: "12:00", type: "transport", from: "Floresta da Tijuca", to: "Ipanema", mode: "uber", duration: "25-30 min" },
          { time: "12:30", name: "Lasai", neighborhood: "Ipanema", icon: "meal", timeBlock: "afternoon" },
          { time: "14:30", type: "transport", from: "Ipanema", to: "Ipanema", mode: "walking", duration: "5 min" },
          { time: "15:00", name: "Praia de Ipanema", neighborhood: "Ipanema", icon: "activity", timeBlock: "afternoon" },
          { time: "17:00", type: "transport", from: "Ipanema", to: "Arpoador", mode: "walking", duration: "10-15 min" },
          { time: "17:30", name: "Pôr do sol no Arpoador", neighborhood: "Arpoador", icon: "sunset", timeBlock: "evening" },
          { time: "19:15", type: "transport", from: "Arpoador", to: "Ipanema", mode: "walking", duration: "10-15 min" },
          { time: "20:00", name: "Oteque", neighborhood: "Ipanema", icon: "meal", timeBlock: "evening" },
          { time: "22:30", type: "transport", from: "Ipanema", to: "Ipanema", mode: "walking", duration: "5 min" },
        ],
        costs: { food: 600, activities: 100, transport: 75, total: 775 }
      },
      {
        day: 2,
        title: "Dia 2 — Natureza e sabores",
        activities: [
          { time: "08:00", name: "Saída do hotel", neighborhood: "Ipanema", icon: "departure", timeBlock: "morning" },
          { time: "08:15", type: "transport", from: "Ipanema", to: "Jardim Botânico", mode: "uber", duration: "10-15 min" },
          { time: "08:30", name: "Jardim Botânico", neighborhood: "Jardim Botânico", icon: "nature", timeBlock: "morning" },
          { time: "11:30", type: "transport", from: "Jardim Botânico", to: "Jardim Botânico", mode: "walking", duration: "5 min" },
          { time: "12:00", name: "Elena", neighborhood: "Jardim Botânico", icon: "meal", timeBlock: "afternoon" },
          { time: "14:00", type: "transport", from: "Jardim Botânico", to: "Lagoa", mode: "uber", duration: "10 min" },
          { time: "15:00", name: "Lagoa Rodrigo de Freitas", neighborhood: "Lagoa", icon: "activity", timeBlock: "afternoon" },
          { time: "16:30", type: "transport", from: "Lagoa", to: "Jardim Botânico", mode: "walking", duration: "15-20 min" },
          { time: "17:00", name: "Parque Lage", neighborhood: "Jardim Botânico", icon: "landmark", timeBlock: "evening" },
          { time: "19:30", type: "transport", from: "Jardim Botânico", to: "Leblon", mode: "uber", duration: "10-15 min" },
          { time: "20:30", name: "Satyricon", neighborhood: "Leblon", icon: "meal", timeBlock: "evening" },
          { time: "22:30", type: "transport", from: "Leblon", to: "Ipanema", mode: "uber", duration: "5-10 min" },
        ],
        costs: { food: 550, activities: 80, transport: 100, total: 730 }
      },
      {
        day: 3,
        title: "Dia 3 — Centro histórico e despedida",
        activities: [
          { time: "08:30", name: "Saída do hotel", neighborhood: "Ipanema", icon: "departure", timeBlock: "morning" },
          { time: "08:45", type: "transport", from: "Ipanema", to: "Lapa", mode: "uber", duration: "20-25 min" },
          { time: "09:30", name: "Escadaria Selarón", neighborhood: "Lapa", icon: "landmark", timeBlock: "morning" },
          { time: "10:15", type: "transport", from: "Lapa", to: "Centro", mode: "walking", duration: "10-15 min" },
          { time: "10:30", name: "Confeitaria Colombo", neighborhood: "Centro", icon: "meal", timeBlock: "morning" },
          { time: "11:30", type: "transport", from: "Centro", to: "Centro", mode: "walking", duration: "10 min" },
          { time: "12:00", name: "Museu do Amanhã", neighborhood: "Centro", icon: "activity", timeBlock: "afternoon" },
          { time: "13:30", type: "transport", from: "Centro", to: "Centro", mode: "walking", duration: "5 min" },
          { time: "14:00", name: "Boulevard Olímpico", neighborhood: "Centro", icon: "activity", timeBlock: "afternoon" },
          { time: "15:30", type: "transport", from: "Centro", to: "Santa Teresa", mode: "uber", duration: "10-15 min" },
          { time: "16:00", name: "Bar do Mineiro", neighborhood: "Santa Teresa", icon: "meal", timeBlock: "afternoon" },
          { time: "18:00", type: "transport", from: "Santa Teresa", to: "Ipanema", mode: "uber", duration: "20-25 min" },
        ],
        costs: { food: 280, activities: 60, transport: 100, total: 440 }
      }
    ]
  };

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case "meal": return <Utensils className="w-4 h-4 text-orange-500" />;
      case "sunset": return <Sun className="w-4 h-4 text-amber-500" />;
      case "landmark": return <Camera className="w-4 h-4 text-primary" />;
      case "nature": return <Mountain className="w-4 h-4 text-green-500" />;
      case "nightlife": return <Music className="w-4 h-4 text-purple-500" />;
      case "departure": return <Clock className="w-4 h-4 text-primary" />;
      default: return <MapPin className="w-4 h-4 text-primary" />;
    }
  };

  const getIconBg = (iconType: string) => {
    switch (iconType) {
      case "meal": return "bg-orange-500/20";
      case "sunset": return "bg-amber-500/20";
      case "landmark": return "bg-primary/20";
      case "nature": return "bg-green-500/20";
      case "nightlife": return "bg-purple-500/20";
      case "departure": return "bg-primary/20";
      default: return "bg-primary/20";
    }
  };

  const getTimeBlockLabel = (block: string) => {
    switch (block) {
      case 'morning': return 'Manhã';
      case 'afternoon': return 'Tarde';
      case 'evening': return 'Noite';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Image Placeholder */}
      <div className="relative w-full h-48 bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <span className="text-sm">Imagem do destino</span>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur-sm rounded-full"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Title & Summary */}
      <main className="px-4 py-6">
        <h1 className="text-2xl font-serif font-semibold text-foreground mb-2">
          {tripData.destination} — Roteiro de 3 dias
        </h1>
        
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
          <span className="bg-muted px-3 py-1 rounded-full">{tripData.dates}</span>
          <span className="bg-muted px-3 py-1 rounded-full">{tripData.travelers}</span>
        </div>
        
        <p className="text-xs text-muted-foreground mb-8">
          🏨 Hospedagem: {tripData.hotel.name} ({tripData.hotel.neighborhood})
        </p>

        {/* Days */}
        <div className="space-y-6">
          {tripData.days.map((day) => {
            let currentBlock = '';
            
            return (
              <div key={day.day} className="bg-card rounded-2xl p-4 border border-border">
                <h2 className="font-semibold text-foreground text-lg mb-4">{day.title}</h2>
                
                <div className="space-y-1">
                  {day.activities.map((activity, idx) => {
                    const isTransport = 'type' in activity && activity.type === 'transport';
                    const timeBlock = 'timeBlock' in activity ? activity.timeBlock : undefined;
                    const showBlockHeader = timeBlock && timeBlock !== currentBlock && !isTransport;
                    if (timeBlock && !isTransport) currentBlock = timeBlock;
                    
                    return (
                      <div key={idx}>
                        {showBlockHeader && (
                          <div className="flex items-center gap-2 mt-4 mb-2 first:mt-0">
                            {timeBlock === 'morning' && <Sun className="w-3 h-3 text-amber-500" />}
                            {timeBlock === 'afternoon' && <Sun className="w-3 h-3 text-orange-500" />}
                            {timeBlock === 'evening' && <Moon className="w-3 h-3 text-indigo-400" />}
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              {getTimeBlockLabel(timeBlock || '')}
                            </span>
                          </div>
                        )}
                        
                        {isTransport ? (
                          <div className="flex gap-3 items-start py-1 opacity-70">
                            <div className="w-12 text-xs text-muted-foreground pt-1">{activity.time}</div>
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-muted/50">
                              {activity.mode === 'walking' 
                                ? <Footprints className="w-4 h-4 text-muted-foreground" />
                                : <Car className="w-4 h-4 text-muted-foreground" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground">
                                {activity.mode === 'walking' ? '🚶' : '🚗'} {activity.from} → {activity.to} ({activity.duration})
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-3 items-start py-2">
                            <div className="w-12 text-xs text-muted-foreground pt-1">{activity.time}</div>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBg(activity.icon)}`}>
                              {getIcon(activity.icon)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm">{activity.name}</p>
                              <p className="text-xs text-muted-foreground">{activity.neighborhood}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Daily Cost Estimate */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Estimativa de custos do dia</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full">
                      Alimentação: R$ {day.costs.food}
                    </span>
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Atividades: R$ {day.costs.activities}
                    </span>
                    <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      Transporte: R$ {day.costs.transport}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-foreground mt-2">
                    Total estimado: R$ {day.costs.total}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 italic">
                    * Valores aproximados. Custos reais podem variar conforme escolhas e temporada.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Trip Total */}
        <div className="mt-6 bg-primary/5 rounded-2xl p-4 border border-primary/20">
          <p className="text-sm font-semibold text-foreground">
            Total estimado da viagem: R$ {tripData.days.reduce((sum, day) => sum + day.costs.total, 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            (não inclui hospedagem e passagens aéreas)
          </p>
        </div>
      </main>

      {/* Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline"
          className="w-full h-14 text-lg font-semibold rounded-2xl"
        >
          Voltar ao app
        </Button>
      </div>
    </div>
  );
};

export default RoteiroFinal;

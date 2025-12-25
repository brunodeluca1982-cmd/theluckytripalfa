import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Utensils, Sun, Camera, Mountain, Music } from "lucide-react";

/**
 * ROTEIRO FINAL - Static template for finalized itinerary
 * No editing, no AI generation. Just a simple web page for trip use.
 */

const RoteiroFinal = () => {
  const navigate = useNavigate();

  // Static demo data for Rio 3 days
  const tripData = {
    destination: "Rio de Janeiro",
    dates: "15 Jan → 18 Jan 2025",
    travelers: "2 adultos, 1 criança",
    days: [
      {
        day: 1,
        title: "Dia 1 — Zona Sul clássica",
        activities: [
          { time: "09:00", name: "Cristo Redentor", neighborhood: "Santa Teresa", icon: "landmark" },
          { time: "12:30", name: "Lasai", neighborhood: "Ipanema", icon: "meal" },
          { time: "15:00", name: "Praia de Ipanema", neighborhood: "Ipanema", icon: "activity" },
          { time: "17:30", name: "Pôr do sol no Arpoador", neighborhood: "Ipanema", icon: "sunset" },
          { time: "20:00", name: "Oteque", neighborhood: "Ipanema", icon: "meal" },
        ]
      },
      {
        day: 2,
        title: "Dia 2 — Natureza e sabores",
        activities: [
          { time: "08:30", name: "Jardim Botânico", neighborhood: "Jardim Botânico", icon: "activity" },
          { time: "12:00", name: "Elena", neighborhood: "Jardim Botânico", icon: "meal" },
          { time: "15:00", name: "Lagoa Rodrigo de Freitas", neighborhood: "Lagoa", icon: "activity" },
          { time: "17:00", name: "Parque Lage", neighborhood: "Jardim Botânico", icon: "landmark" },
          { time: "20:30", name: "Satyricon", neighborhood: "Leblon", icon: "meal" },
        ]
      },
      {
        day: 3,
        title: "Dia 3 — Centro histórico e despedida",
        activities: [
          { time: "09:00", name: "Escadaria Selarón", neighborhood: "Lapa", icon: "landmark" },
          { time: "10:30", name: "Confeitaria Colombo", neighborhood: "Centro", icon: "meal" },
          { time: "12:00", name: "Museu do Amanhã", neighborhood: "Centro", icon: "activity" },
          { time: "14:00", name: "Boulevard Olímpico", neighborhood: "Centro", icon: "activity" },
          { time: "16:00", name: "Bar do Mineiro", neighborhood: "Santa Teresa", icon: "meal" },
        ]
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
      default: return "bg-primary/20";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
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
        
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-8">
          <span className="bg-muted px-3 py-1 rounded-full">{tripData.dates}</span>
          <span className="bg-muted px-3 py-1 rounded-full">{tripData.travelers}</span>
        </div>

        {/* Days */}
        <div className="space-y-6">
          {tripData.days.map((day) => (
            <div key={day.day} className="bg-card rounded-2xl p-4 border border-border">
              <h2 className="font-semibold text-foreground text-lg mb-4">{day.title}</h2>
              
              <div className="space-y-3">
                {day.activities.map((activity, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-14 text-xs text-muted-foreground pt-1">{activity.time}</div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getIconBg(activity.icon)}`}>
                      {getIcon(activity.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.neighborhood}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border">
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

import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WhatsAppRedirect from "./pages/WhatsAppRedirect";
import SplashScreen from "@/components/SplashScreen";
import MainLayout from "@/components/MainLayout";
import Index from "./pages/Index";
import Destinos from "./pages/Destinos";
import DestinationRio from "./pages/DestinationRio";
import DestinationVideoIntro from "./pages/DestinationVideoIntro";
import OndeficarRio from "./pages/OndeficarRio";

import EatMapView from "./pages/EatMapView";
import WhereToStayDetail from "./pages/WhereToStayDetail";
import WhereToEatDetail from "./pages/WhereToEatDetail";
import LuckyList from "./pages/LuckyList";
import LuckyListDetail from "./pages/LuckyListDetail";
import HowToGetThere from "./pages/HowToGetThere";
import WhatToDo from "./pages/WhatToDo";
import WhatToDoDetail from "./pages/WhatToDoDetail";
import WhatToDoCategory from "./pages/WhatToDoCategory";
import MeuRoteiro from "./pages/MeuRoteiro";
import MinhaViagem from "./pages/MinhaViagem";
import TripGroup from "./pages/TripGroup";
import TripDates from "./pages/TripDates";
import TripPreferences from "./pages/TripPreferences";
import ItineraryDecision from "./pages/ItineraryDecision";
import AutomaticItinerary from "./pages/AutoRoteiroV2";

import ManualItinerary from "./pages/ManualItinerary";
import Favoritos from "./pages/Favoritos";
import RoteiroPlanner from "./pages/RoteiroPlanner";
import RestaurantDetail from "./pages/RestaurantDetail";
import HotelDetail from "./pages/HotelDetail";
import ActivityDetail from "./pages/ActivityDetail";
import Profile from "./pages/Profile";
import DivisaoGastos from "./pages/profile/DivisaoGastos";
import DiarioViagem from "./pages/profile/DiarioViagem";
import Assinatura from "./pages/profile/Assinatura";
import Configuracoes from "./pages/profile/Configuracoes";
import SuporteHumano from "./pages/profile/SuporteHumano";
import SecondaryModuleDetail from "./pages/SecondaryModuleDetail";
import PartnerProfile from "./pages/PartnerProfile";
import PartnerRoteiro from "./pages/PartnerRoteiro";
import IAAssistant from "./pages/IAAssistant";
import IAChatPlaceholder from "./pages/ia/IAChatPlaceholder";
import IACreateItinerary from "./pages/ia/IACreateItinerary";
import IAImproveItinerary from "./pages/ia/IAImproveItinerary";
import IARoteirosInteligentes from "./pages/ia/IARoteirosInteligentes";
import IARevisarRoteiro from "./pages/ia/IARevisarRoteiro";
import IAPerguntar from "./pages/ia/IAPerguntar";
import IACriarRoteiro from "./pages/ia/IACriarRoteiro";
import IAMelhorarRoteiro from "./pages/ia/IAMelhorarRoteiro";
import IALuckyTrip from "./pages/ia/IALuckyTrip";
import RoteiroFinal from "./pages/RoteiroFinal";
import RoteiroResultado from "./pages/RoteiroResultado";
import NotFound from "./pages/NotFound";
import AdminEventos from "./pages/AdminEventos";
import { SpotifyPlayerProvider } from "@/contexts/SpotifyPlayerContext";
import PersistentSpotifyPlayer from "@/components/PersistentSpotifyPlayer";
import HeroVideo from "@/components/HeroVideo";


const queryClient = new QueryClient();

const hasSeenHero = (): boolean => {
  try { return localStorage.getItem("heroSeen") === "true"; } catch { return false; }
};
const markHeroSeen = (): void => {
  try { localStorage.setItem("heroSeen", "true"); } catch {}
};

type AppPhase = "splash" | "video" | "ready";

const App = () => {
  const skipVideo = hasSeenHero();
  const [phase, setPhase] = useState<AppPhase>("splash");
  const [videoFading, setVideoFading] = useState(false);

  const handleSplashComplete = useCallback(() => {
    if (skipVideo) {
      setPhase("ready");
    } else {
      setPhase("video");
    }
  }, [skipVideo]);

  const handleVideoEnd = useCallback(() => {
    markHeroSeen();
    setVideoFading(true);
    setTimeout(() => {
      setPhase("ready");
    }, 500);
  }, []);

  const handleVideoSkip = useCallback(() => {
    handleVideoEnd();
  }, [handleVideoEnd]);

  return (
    <QueryClientProvider client={queryClient}>
      <SpotifyPlayerProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Phase 1: Splash Screen */}
        {phase === "splash" && <SplashScreen onComplete={handleSplashComplete} />}

        {/* Phase 2: Hero Video — fullscreen with controls */}
        {phase === "video" && (
          <HeroVideo onEnd={handleVideoEnd} onSkip={handleVideoSkip} fading={videoFading} />
        )}

        {/* Phase 3: App — starts on Rio destination */}
        <BrowserRouter>
          <Routes>
            {/* Standalone pages (no app shell) */}
            <Route path="/roteiro/rio-3-dias-final" element={<RoteiroFinal />} />
            <Route path="/wa" element={<WhatsAppRedirect />} />
            <Route path="/admin-eventos" element={<AdminEventos />} />
            
            {/* App pages (with bottom navigation) */}
            <Route path="/*" element={
              <MainLayout>
                <Routes>
                  {/* Home */}
                  <Route path="/" element={<DestinationRio />} />
                  
                  {/* Destinos */}
                  <Route path="/destinos" element={<Destinos />} />
                  <Route path="/destino/:id/intro" element={<DestinationVideoIntro />} />
                  <Route path="/destino/rio-de-janeiro" element={<DestinationRio />} />
                  
                  {/* Secondary Modules - Detail Pages */}
                  <Route path="/destino/:destinationId/modulo/:moduleId" element={<SecondaryModuleDetail />} />
                  
                  {/* Where to Stay */}
                  <Route path="/city-view" element={<Navigate to="/onde-ficar-rio" replace />} />
                  <Route path="/onde-ficar-rio" element={<OndeficarRio />} />
                  <Route path="/onde-ficar/:neighborhood" element={<WhereToStayDetail />} />
                  <Route path="/hotel/:id" element={<HotelDetail />} />
                  
                  {/* Where to Eat */}
                  <Route path="/eat-map-view" element={<EatMapView />} />
                  <Route path="/onde-comer/:neighborhood" element={<WhereToEatDetail />} />
                  <Route path="/restaurante/:id" element={<RestaurantDetail />} />
                  
                  {/* What to Do */}
                  <Route path="/o-que-fazer" element={<WhatToDo />} />
                  <Route path="/o-que-fazer/categoria/:category" element={<WhatToDoCategory />} />
                  <Route path="/o-que-fazer/:neighborhood" element={<WhatToDoDetail />} />
                  <Route path="/atividade/:id" element={<ActivityDetail />} />
                  
                  {/* Lucky List */}
                  <Route path="/lucky-list" element={<LuckyList />} />
                  <Route path="/lucky-list/:id" element={<LuckyListDetail />} />
                  
                  {/* How to Get There */}
                  <Route path="/como-chegar" element={<HowToGetThere />} />
                  
                  {/* Meu Roteiro */}
                  <Route path="/minha-viagem" element={<MinhaViagem />} />
                  <Route path="/meu-roteiro" element={<MeuRoteiro />} />
                  <Route path="/meu-roteiro/grupo" element={<Navigate to="/meu-roteiro/datas" replace />} />
                  <Route path="/meu-roteiro/datas" element={<TripDates />} />
                  <Route path="/meu-roteiro/preferencias" element={<TripPreferences />} />
                  <Route path="/meu-roteiro/decisao" element={<ItineraryDecision />} />
                  <Route path="/meu-roteiro/automatico" element={<AutomaticItinerary />} />
                  <Route path="/meu-roteiro/manual" element={<ManualItinerary />} />
                  <Route path="/meu-roteiro/resultado" element={<RoteiroResultado />} />
                  <Route path="/favoritos" element={<Favoritos />} />
                  <Route path="/planejar/:destinationId" element={<RoteiroPlanner />} />
                  
                  {/* Profile */}
                  <Route path="/perfil" element={<Profile />} />
                  <Route path="/perfil/divisao-gastos" element={<DivisaoGastos />} />
                  <Route path="/perfil/diario" element={<DiarioViagem />} />
                  <Route path="/perfil/assinatura" element={<Assinatura />} />
                  <Route path="/perfil/configuracoes" element={<Configuracoes />} />
                  <Route path="/perfil/suporte" element={<SuporteHumano />} />

                  {/* Partners on Trip */}
                  <Route path="/partner/:id" element={<PartnerProfile />} />
                  <Route path="/partner/:partnerId/roteiro/:destinationId" element={<PartnerRoteiro />} />

                  {/* IA Assistant */}
                  <Route path="/ia" element={<IAAssistant />} />
                  <Route path="/ia/chat" element={<IAChatPlaceholder />} />
                  <Route path="/ia/create-itinerary" element={<IACreateItinerary />} />
                  <Route path="/ia/improve-itinerary" element={<IAImproveItinerary />} />
                  <Route path="/ia/roteiros-inteligentes" element={<IARoteirosInteligentes />} />
                  <Route path="/ia/revisar-roteiro" element={<IARevisarRoteiro />} />
                  {/* New PT-BR IA routes */}
                  <Route path="/ia/perguntar" element={<IAPerguntar />} />
                  <Route path="/ia/criar-roteiro" element={<IACriarRoteiro />} />
                  <Route path="/ia/melhorar-roteiro" element={<IAMelhorarRoteiro />} />
                  <Route path="/ia/lucky-trip" element={<IALuckyTrip />} />

                  {/* Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            } />
          </Routes>
        </BrowserRouter>
        <PersistentSpotifyPlayer />
      </TooltipProvider>
      </SpotifyPlayerProvider>
    </QueryClientProvider>
  );
};

export default App;
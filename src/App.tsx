import { useState, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "@/components/SplashScreen";
import MainLayout from "@/components/MainLayout";
import Index from "./pages/Index";
import Destinos from "./pages/Destinos";
import DestinationRio from "./pages/DestinationRio";
import DestinationVideoIntro from "./pages/DestinationVideoIntro";
import OndeficarRio from "./pages/OndeficarRio";
import CityView from "./pages/CityView";
import EatMapView from "./pages/EatMapView";
import WhereToStayDetail from "./pages/WhereToStayDetail";
import WhereToEatDetail from "./pages/WhereToEatDetail";
import LuckyList from "./pages/LuckyList";
import LuckyListDetail from "./pages/LuckyListDetail";
import HowToGetThere from "./pages/HowToGetThere";
import WhatToDo from "./pages/WhatToDo";
import WhatToDoDetail from "./pages/WhatToDoDetail";
import MeuRoteiro from "./pages/MeuRoteiro";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Splash Screen - not part of navigation */}
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        
        <BrowserRouter>
          <MainLayout>
            <Routes>
              {/* Home */}
              <Route path="/" element={<Index />} />
              
              {/* Destinos */}
              <Route path="/destinos" element={<Destinos />} />
              <Route path="/destino/:id/intro" element={<DestinationVideoIntro />} />
              <Route path="/destino/rio-de-janeiro" element={<DestinationRio />} />
              
              {/* Secondary Modules - Detail Pages */}
              <Route path="/destino/:destinationId/modulo/:moduleId" element={<SecondaryModuleDetail />} />
              
              {/* Where to Stay */}
              <Route path="/city-view" element={<CityView />} />
              <Route path="/onde-ficar-rio" element={<OndeficarRio />} />
              <Route path="/onde-ficar/:neighborhood" element={<WhereToStayDetail />} />
              <Route path="/hotel/:id" element={<HotelDetail />} />
              
              {/* Where to Eat */}
              <Route path="/eat-map-view" element={<EatMapView />} />
              <Route path="/onde-comer/:neighborhood" element={<WhereToEatDetail />} />
              <Route path="/restaurante/:id" element={<RestaurantDetail />} />
              
              {/* What to Do */}
              <Route path="/o-que-fazer" element={<WhatToDo />} />
              <Route path="/o-que-fazer/:neighborhood" element={<WhatToDoDetail />} />
              <Route path="/atividade/:id" element={<ActivityDetail />} />
              
              {/* Lucky List */}
              <Route path="/lucky-list" element={<LuckyList />} />
              <Route path="/lucky-list/:id" element={<LuckyListDetail />} />
              
              {/* How to Get There */}
              <Route path="/como-chegar" element={<HowToGetThere />} />
              
              {/* Meu Roteiro */}
              <Route path="/meu-roteiro" element={<MeuRoteiro />} />
              
              {/* Profile */}
              <Route path="/perfil" element={<Profile />} />
              <Route path="/perfil/divisao-gastos" element={<DivisaoGastos />} />
              <Route path="/perfil/diario" element={<DiarioViagem />} />
              <Route path="/perfil/assinatura" element={<Assinatura />} />
              <Route path="/perfil/configuracoes" element={<Configuracoes />} />
              <Route path="/perfil/suporte" element={<SuporteHumano />} />

              {/* Placeholder routes for bottom nav */}
              <Route path="/ia" element={<NotFound />} />
              <Route path="/partner/:id" element={<NotFound />} />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

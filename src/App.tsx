import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Index />} />
          
          {/* Where to Stay */}
          <Route path="/city-view" element={<CityView />} />
          <Route path="/onde-ficar-rio" element={<OndeficarRio />} />
          <Route path="/onde-ficar/:neighborhood" element={<WhereToStayDetail />} />
          
          {/* Where to Eat */}
          <Route path="/eat-map-view" element={<EatMapView />} />
          <Route path="/onde-comer/:neighborhood" element={<WhereToEatDetail />} />
          
          {/* What to Do */}
          <Route path="/o-que-fazer" element={<WhatToDo />} />
          <Route path="/o-que-fazer/:neighborhood" element={<WhatToDoDetail />} />
          
          {/* Lucky List */}
          <Route path="/lucky-list" element={<LuckyList />} />
          <Route path="/lucky-list/:id" element={<LuckyListDetail />} />
          
          {/* How to Get There */}
          <Route path="/como-chegar" element={<HowToGetThere />} />
          
          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

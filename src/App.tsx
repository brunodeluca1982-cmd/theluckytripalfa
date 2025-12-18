import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import OndeficarRio from "./pages/OndeficarRio";
import BairroDetail from "./pages/BairroDetail";
import NotFound from "./pages/NotFound";
import Copacabana from "./pages/neighborhoods/Copacabana";
import Ipanema from "./pages/neighborhoods/Ipanema";
import Leblon from "./pages/neighborhoods/Leblon";
import Leme from "./pages/neighborhoods/Leme";
import Arpoador from "./pages/neighborhoods/Arpoador";
import BarraDaTijuca from "./pages/neighborhoods/BarraDaTijuca";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onde-ficar-rio" element={<OndeficarRio />} />
          <Route path="/bairro/:id" element={<BairroDetail />} />
          <Route path="/copacabana" element={<Copacabana />} />
          <Route path="/ipanema" element={<Ipanema />} />
          <Route path="/leblon" element={<Leblon />} />
          <Route path="/leme" element={<Leme />} />
          <Route path="/arpoador" element={<Arpoador />} />
          <Route path="/barra-da-tijuca" element={<BarraDaTijuca />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

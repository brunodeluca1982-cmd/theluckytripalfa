import { useState } from "react";
import SearchField from "@/components/home/SearchField";
import PartnersSection from "@/components/home/PartnersSection";
import HighlightsCarousel from "@/components/home/HighlightsCarousel";
import DestinationsPortal from "@/components/home/DestinationsPortal";
import BrandLogo from "@/components/home/BrandLogo";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [testResult, setTestResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestSupabase = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/external-experiencias`;
      const resp = await fetch(url, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "Content-Type": "application/json",
        },
      });
      const json = await resp.json();
      const items = (json.experiencias || []).slice(0, 5).map((e: any) => ({
        id: e.id,
        nome: e.nome,
        cidade: e.cidade,
      }));
      console.log("🧪 Testar Supabase — 5 experiências:", items);
      setTestResult(items);
    } catch (err) {
      console.error("Erro ao testar Supabase:", err);
      setTestResult([{ error: String(err) }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20">
      {/* TEMP: Testar Supabase */}
      <div className="px-6 pt-4">
        <Button onClick={handleTestSupabase} disabled={loading} size="sm" variant="outline">
          {loading ? "Buscando..." : "Testar Supabase"}
        </Button>
        {testResult && (
          <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-48">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        )}
      </div>

      {/* 1) BRAND HEADER */}
      <header className="px-6 pt-12 pb-6 text-center">
        <BrandLogo />
      </header>

      {/* 2) SEARCH / PROMPT FIELD */}
      <SearchField />

      {/* 3) PARTNERS ON TRIP */}
      <PartnersSection />

      {/* 4) HIGHLIGHTS CAROUSEL */}
      <HighlightsCarousel />

      {/* 5) DESTINATIONS PORTAL */}
      <DestinationsPortal />
    </div>
  );
};

export default Index;

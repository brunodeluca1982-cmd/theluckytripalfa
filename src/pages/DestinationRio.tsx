import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DestinationHub, { MapPin, Bed, Utensils, Compass, Sparkles } from "@/components/DestinationHub";
import { Button } from "@/components/ui/button";
import { useCityHero } from "@/contexts/CityHeroContext";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * RIO DE JANEIRO — DESTINATION HUB (STRUCTURAL & UX LOCK)
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * LOCKED DESTINATION JOURNEY:
 * 1. User clicks destination → Hero video plays (15-30s)
 * 2. Video ends → Automatic transition to THIS hub
 * 3. Hub displays EXACTLY 5 central transparent buttons
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * PRIMARY HUB — 5 BUTTONS (IMMUTABLE):
 * ═══════════════════════════════════════════════════════════════════════════
 * 1. Como Chegar (top-left)
 * 2. Onde Ficar (top-right)
 * 3. Onde Comer (bottom-left)
 * 4. O Que Fazer (bottom-right)
 * 5. Lucky List (CENTER, smaller, emphasized)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * IMMUTABILITY RULES — DO NOT MODIFY:
 * ═══════════════════════════════════════════════════════════════════════════
 * - Labels are FINAL and IMMUTABLE
 * - No synonyms, translations, or optimizations
 * - No A/B variants
 * - Hub NEVER changes based on user behavior
 * - Hub NEVER adapts content
 * - Hub NEVER collapses to fewer buttons
 * - Buttons MUST remain centered on screen
 * - Buttons MUST remain transparent (glass effect)
 * - NO list-based layout allowed
 * - NO additional modules allowed on this screen
 * 
 * This structure applies to ALL destinations.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Background now comes from CityHeroContext

/**
 * PRIMARY HUB ACTIONS — LOCKED
 * 
 * These 5 buttons are permanent navigation anchors.
 * IDs must match exactly what DestinationHub expects.
 */
const rioActions = [
  { id: "ficar", label: "Onde Ficar", shortLabel: "Ficar", path: "/onde-ficar-rio", icon: Bed },
  { id: "comer", label: "Onde Comer", shortLabel: "Comer", path: "/eat-map-view", icon: Utensils },
  { id: "fazer", label: "O Que Fazer", shortLabel: "Fazer", path: "/o-que-fazer", icon: Compass },
  { id: "lucky-list", label: "Lucky List", shortLabel: "Lucky List", path: "/lucky-list", icon: Sparkles, isSpecial: true },
  { id: "chegar", label: "Como Chegar", shortLabel: "Chegar", path: "/como-chegar", icon: MapPin },
];

const DestinationRio = () => {
  const [searchParams] = useSearchParams();
  const isDebug = searchParams.get("debug") === "1";
  const [testResult, setTestResult] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState<any | null>(null);
  const [geocodeLoading, setGeocodeLoading] = useState(false);

  const handleTest = async () => {
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
        id: e.id, nome: e.nome, cidade: e.cidade,
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

  const handleTestGeocode = async () => {
    setGeocodeLoading(true);
    setGeocodeResult(null);
    try {
      // 1) Fetch experiencias and pick first one (simulating pending geocode)
      const expUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/external-experiencias`;
      const expResp = await fetch(expUrl, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          "Content-Type": "application/json",
        },
      });
      const expJson = await expResp.json();
      const exp = (expJson.experiencias || [])[0];
      if (!exp) throw new Error("Nenhuma experiência encontrada");

      // 2) Build query string
      const parts = [exp.nome, exp.bairro, exp.cidade, "Brasil"].filter(Boolean);
      const q = parts.join(" ");

      // 3) Call places-autocomplete
      const autoUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/places-autocomplete?input=${encodeURIComponent(q)}&city=${encodeURIComponent(exp.cidade || "Rio de Janeiro")}`;
      const autoResp = await fetch(autoUrl, {
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      });
      const autoData = await autoResp.json();

      let placeDetails = null;
      if (autoData.predictions?.length > 0) {
        const placeId = autoData.predictions[0].place_id;
        // 4) Call places-details
        const detUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/places-details?place_id=${encodeURIComponent(placeId)}`;
        const detResp = await fetch(detUrl, {
          headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        });
        placeDetails = await detResp.json();
      }

      const result = {
        q,
        experiencia: { id: exp.id, nome: exp.nome, bairro: exp.bairro, cidade: exp.cidade },
        autocomplete_predictions: autoData.predictions?.length || 0,
        place_details: placeDetails?.place || null,
        lat: placeDetails?.place?.lat || null,
        lng: placeDetails?.place?.lng || null,
      };

      console.log("🗺️ Testar Geocode:", result);
      setGeocodeResult(result);
    } catch (err) {
      console.error("Erro ao testar Geocode:", err);
      setGeocodeResult({ error: String(err) });
    } finally {
      setGeocodeLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* DEBUG BUTTONS — only visible with ?debug=1 */}
      {isDebug && (
        <>
          <div className="absolute top-4 left-4 z-50 flex gap-2 flex-wrap items-start">
            <Button onClick={handleTest} disabled={loading} size="sm" variant="outline" className="bg-background/80 backdrop-blur-sm">
              {loading ? "Buscando..." : "Testar Supabase"}
            </Button>
            <Button onClick={handleTestGeocode} disabled={geocodeLoading} size="sm" variant="outline" className="bg-background/80 backdrop-blur-sm">
              {geocodeLoading ? "Geocoding..." : "Testar Geocode"}
            </Button>
          </div>
          {testResult && (
            <pre className="absolute top-14 left-4 z-50 p-3 bg-background/90 backdrop-blur-sm rounded text-xs overflow-auto max-h-48 max-w-72">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}
          {geocodeResult && (
            <pre className="absolute top-14 right-4 z-50 p-3 bg-background/90 backdrop-blur-sm rounded text-xs overflow-auto max-h-64 max-w-80">
              {JSON.stringify(geocodeResult, null, 2)}
            </pre>
          )}
        </>
      )}
      <DestinationHub
        destinationId="rio-de-janeiro"
        name="Rio de Janeiro"
        country="Brasil"
        backgroundImage={RIO_BACKGROUND}
        actions={rioActions}
      />
    </div>
  );
};

export default DestinationRio;

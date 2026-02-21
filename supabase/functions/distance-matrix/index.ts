import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface DistanceRequest {
  origins: { lat: number; lng: number; id: string }[];
  destinations: { lat: number; lng: number; id: string }[];
}

interface DistanceElement {
  originId: string;
  destinationId: string;
  distanceMeters: number;
  distanceText: string;
  durationSeconds: number;
  durationText: string;
  durationInTrafficSeconds: number | null;
  durationInTrafficText: string | null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!GOOGLE_MAPS_API_KEY) {
      return new Response(
        JSON.stringify({ error: "GOOGLE_MAPS_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: DistanceRequest = await req.json();
    const { origins, destinations } = body;

    if (!origins?.length || !destinations?.length) {
      return new Response(
        JSON.stringify({ error: "origins and destinations are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Google allows max 100 elements (origins × destinations) per request.
    // We batch to stay within this limit.
    const MAX_ELEMENTS = 100;
    const results: DistanceElement[] = [];

    // Split origins into chunks so that chunk.length * destinations.length <= MAX_ELEMENTS
    const originChunkSize = Math.max(1, Math.floor(MAX_ELEMENTS / Math.max(destinations.length, 1)));

    for (let oStart = 0; oStart < origins.length; oStart += originChunkSize) {
      const originSlice = origins.slice(oStart, oStart + originChunkSize);

      // If a single origin still produces too many elements, also chunk destinations
      const destChunkSize = Math.max(1, Math.floor(MAX_ELEMENTS / originSlice.length));

      for (let dStart = 0; dStart < destinations.length; dStart += destChunkSize) {
        const destSlice = destinations.slice(dStart, dStart + destChunkSize);

        const originsParam = originSlice.map(o => `${o.lat},${o.lng}`).join("|");
        const destsParam = destSlice.map(d => `${d.lat},${d.lng}`).join("|");

        const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
        url.searchParams.set("origins", originsParam);
        url.searchParams.set("destinations", destsParam);
        url.searchParams.set("mode", "driving");
        url.searchParams.set("departure_time", "now");
        url.searchParams.set("traffic_model", "best_guess");
        url.searchParams.set("language", "pt-BR");
        url.searchParams.set("key", GOOGLE_MAPS_API_KEY);

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.status !== "OK") {
          console.error("Distance Matrix API error:", data.status, data.error_message);
          return new Response(
            JSON.stringify({ error: `Google API error: ${data.status}`, details: data.error_message }),
            { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        for (let i = 0; i < data.rows.length; i++) {
          const row = data.rows[i];
          for (let j = 0; j < row.elements.length; j++) {
            const el = row.elements[j];
            if (el.status === "OK") {
              results.push({
                originId: originSlice[i].id,
                destinationId: destSlice[j].id,
                distanceMeters: el.distance.value,
                distanceText: el.distance.text,
                durationSeconds: el.duration.value,
                durationText: el.duration.text,
                durationInTrafficSeconds: el.duration_in_traffic?.value ?? null,
                durationInTrafficText: el.duration_in_traffic?.text ?? null,
              });
            } else {
              results.push({
                originId: originSlice[i].id,
                destinationId: destSlice[j].id,
                distanceMeters: -1,
                distanceText: "N/A",
                durationSeconds: -1,
                durationText: "N/A",
                durationInTrafficSeconds: null,
                durationInTrafficText: null,
              });
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ results, rowCount: origins.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("distance-matrix error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

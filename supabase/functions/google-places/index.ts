import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Google Maps API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, input, placeId, sessionToken } = await req.json();
    console.log(`Google Places API request: action=${action}, input=${input}, placeId=${placeId}`);

    if (action === 'autocomplete') {
      // Places Autocomplete API
      const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json');
      url.searchParams.set('input', input);
      url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
      url.searchParams.set('types', 'establishment|point_of_interest');
      url.searchParams.set('language', 'pt-BR');
      
      if (sessionToken) {
        url.searchParams.set('sessiontoken', sessionToken);
      }

      console.log('Fetching autocomplete suggestions...');
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('Google Places API error:', data.status, data.error_message);
        return new Response(
          JSON.stringify({ error: data.error_message || data.status }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Found ${data.predictions?.length || 0} predictions`);
      return new Response(
        JSON.stringify({ predictions: data.predictions || [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'details') {
      // Place Details API
      const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
      url.searchParams.set('place_id', placeId);
      url.searchParams.set('key', GOOGLE_MAPS_API_KEY);
      url.searchParams.set('fields', 'place_id,name,formatted_address,geometry,types,address_components');
      url.searchParams.set('language', 'pt-BR');
      
      if (sessionToken) {
        url.searchParams.set('sessiontoken', sessionToken);
      }

      console.log('Fetching place details for:', placeId);
      const response = await fetch(url.toString());
      const data = await response.json();

      if (data.status !== 'OK') {
        console.error('Google Places API error:', data.status, data.error_message);
        return new Response(
          JSON.stringify({ error: data.error_message || data.status }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = data.result;
      const placeData = {
        placeId: result.place_id,
        name: result.name,
        address: result.formatted_address,
        lat: result.geometry?.location?.lat,
        lng: result.geometry?.location?.lng,
        types: result.types,
        neighborhood: extractNeighborhood(result.address_components),
        city: extractCity(result.address_components),
      };

      console.log('Place details retrieved:', placeData.name);
      return new Response(
        JSON.stringify({ place: placeData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in google-places function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to extract neighborhood from address components
function extractNeighborhood(components: any[]): string | null {
  if (!components) return null;
  
  const neighborhood = components.find(c => 
    c.types.includes('sublocality') || 
    c.types.includes('sublocality_level_1') ||
    c.types.includes('neighborhood')
  );
  
  return neighborhood?.long_name || null;
}

// Helper function to extract city from address components
function extractCity(components: any[]): string | null {
  if (!components) return null;
  
  const city = components.find(c => 
    c.types.includes('locality') || 
    c.types.includes('administrative_area_level_2')
  );
  
  return city?.long_name || null;
}

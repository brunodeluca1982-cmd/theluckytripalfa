import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'Google Maps API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { action, input, placeId, sessionToken } = body;

    // Validate action
    const validActions = ['autocomplete', 'details'];
    if (!action || typeof action !== 'string' || !validActions.includes(action)) {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input for autocomplete
    if (action === 'autocomplete') {
      if (!input || typeof input !== 'string' || input.length < 2 || input.length > 200) {
        return new Response(
          JSON.stringify({ error: 'Invalid input parameter' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate placeId for details
    if (action === 'details') {
      if (!placeId || typeof placeId !== 'string' || placeId.length > 300) {
        return new Response(
          JSON.stringify({ error: 'Invalid place ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate sessionToken if provided
    if (sessionToken !== undefined && (typeof sessionToken !== 'string' || sessionToken.length > 100)) {
      return new Response(
        JSON.stringify({ error: 'Invalid session token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Google Places API request: action=${action}`);

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
          JSON.stringify({ error: 'Places search failed' }),
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
          JSON.stringify({ error: 'Place details lookup failed' }),
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
      JSON.stringify({ error: 'Internal server error' }),
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

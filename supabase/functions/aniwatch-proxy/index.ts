import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://api-anime-rouge.vercel.app/aniwatch";

// Normalize anime objects: map 'img' to 'poster' 
function normalizeAnime(anime: any): any {
  if (!anime) return anime;
  return {
    ...anime,
    poster: anime.poster || anime.img || '',
  };
}

function normalizeAnimeArray(arr: any[]): any[] {
  if (!Array.isArray(arr)) return [];
  return arr.map(normalizeAnime);
}

// Normalize the home response to match expected frontend structure
function normalizeHomeResponse(raw: any): any {
  const featured = raw.featuredAnimes || {};
  const data: any = {
    spotlightAnimes: normalizeAnimeArray(raw.spotlightAnimes || featured.spotlightAnimes || []),
    trendingAnimes: normalizeAnimeArray(raw.trendingAnimes || featured.trendingAnimes || []),
    latestEpisodeAnimes: normalizeAnimeArray(raw.latestEpisodeAnimes || featured.latestEpisodeAnimes || []),
    topUpcomingAnimes: normalizeAnimeArray(raw.topUpcomingAnimes || featured.topUpcomingAnimes || []),
    topAiringAnimes: normalizeAnimeArray(raw.topAiringAnimes || featured.topAiringAnimes || []),
    mostPopularAnimes: normalizeAnimeArray(raw.mostPopularAnimes || featured.mostPopularAnimes || []),
    mostFavoriteAnimes: normalizeAnimeArray(raw.mostFavoriteAnimes || featured.mostFavoriteAnimes || []),
    latestCompletedAnimes: normalizeAnimeArray(raw.latestCompletedAnimes || featured.latestCompletedAnimes || []),
    genres: raw.genres || featured.genres || [],
  };
  if (raw.top10Animes || featured.top10Animes) {
    const t10 = raw.top10Animes || featured.top10Animes || {};
    data.top10Animes = {
      today: normalizeAnimeArray(t10.today || []),
      week: normalizeAnimeArray(t10.week || []),
      month: normalizeAnimeArray(t10.month || []),
    };
  }
  return { success: true, data };
}

// Generic normalize for list/search responses
function normalizeListResponse(raw: any): any {
  const d = raw.data || raw;
  return {
    success: true,
    data: {
      ...d,
      animes: normalizeAnimeArray(d.animes || []),
    },
  };
}

function normalizeInfoResponse(raw: any): any {
  const d = raw.data || raw;
  const result = { ...d };
  if (result.anime?.info) result.anime.info = normalizeAnime(result.anime.info);
  result.poster = result.poster || result.img || result.anime?.info?.poster || '';
  if (result.relatedAnimes) result.relatedAnimes = normalizeAnimeArray(result.relatedAnimes);
  if (result.recommendedAnimes) result.recommendedAnimes = normalizeAnimeArray(result.recommendedAnimes);
  if (result.mostPopularAnimes) result.mostPopularAnimes = normalizeAnimeArray(result.mostPopularAnimes);
  if (result.seasons) result.seasons = result.seasons.map((s: any) => ({ ...s, poster: s.poster || s.img || '' }));
  return { success: true, data: result };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "";
    const queryParams = new URLSearchParams();
    
    url.searchParams.forEach((value, key) => {
      if (key !== "path") queryParams.append(key, value);
    });

    const targetUrl = path 
      ? `${BASE_URL}/${path}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      : `${BASE_URL}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    console.log("Proxying to:", targetUrl);

    const response = await fetch(targetUrl);
    const raw = await response.json();

    // Determine what type of response to normalize
    let result;
    if (!path || path === '') {
      // Home endpoint
      result = normalizeHomeResponse(raw);
    } else if (path === 'info') {
      result = normalizeInfoResponse(raw);
    } else if (path === 'az-list' || path === 'search') {
      result = normalizeListResponse(raw);
    } else {
      // Episodes, servers, sources - pass through with success wrapper
      result = raw.success !== undefined ? raw : { success: true, data: raw.data || raw };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

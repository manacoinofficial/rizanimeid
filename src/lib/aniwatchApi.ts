import { supabase } from '@/integrations/supabase/client';

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aniwatch-proxy`;

async function proxyFetch(path: string, params?: Record<string, string>) {
  const url = new URL(FUNCTION_URL);
  if (path) url.searchParams.set('path', path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(url.toString(), {
    headers: {
      'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : { 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` }),
    },
  });
  return response.json();
}

const BASE_URL = 'https://api-anime-rouge.vercel.app/aniwatch';

export interface AniwatchAnime {
  id: string;
  name: string;
  jname?: string;
  poster: string;
  duration?: string;
  type?: string;
  rating?: string;
  episodes?: {
    sub?: number;
    dub?: number;
  };
}

export interface AniwatchHomeData {
  spotlightAnimes?: AniwatchAnime[];
  trendingAnimes?: AniwatchAnime[];
  latestEpisodeAnimes?: AniwatchAnime[];
  topUpcomingAnimes?: AniwatchAnime[];
  top10Animes?: {
    today?: AniwatchAnime[];
    week?: AniwatchAnime[];
    month?: AniwatchAnime[];
  };
  topAiringAnimes?: AniwatchAnime[];
  mostPopularAnimes?: AniwatchAnime[];
  mostFavoriteAnimes?: AniwatchAnime[];
  latestCompletedAnimes?: AniwatchAnime[];
  genres?: string[];
}

export interface AniwatchHomeResponse {
  success: boolean;
  data: AniwatchHomeData;
}

export interface AniwatchListResponse {
  success: boolean;
  data: {
    animes: AniwatchAnime[];
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
  };
}

export interface AniwatchSearchResponse {
  success: boolean;
  data: {
    animes: AniwatchAnime[];
    mostPopularAnimes?: AniwatchAnime[];
    currentPage: number;
    hasNextPage: boolean;
    totalPages: number;
  };
}

export interface AniwatchEpisode {
  title: string;
  episodeId: string;
  number: number;
  isFiller: boolean;
}

export interface AniwatchEpisodesResponse {
  success: boolean;
  data: {
    totalEpisodes: number;
    episodes: AniwatchEpisode[];
  };
}

export interface AniwatchServer {
  serverName: string;
  serverId: number;
}

export interface AniwatchServersResponse {
  success: boolean;
  data: {
    sub: AniwatchServer[];
    dub: AniwatchServer[];
    episodeId: string;
    episodeNo: number;
  };
}

export interface AniwatchSourceResponse {
  success: boolean;
  data: {
    tracks?: {
      file: string;
      label?: string;
      kind: string;
      default?: boolean;
    }[];
    intro?: { start: number; end: number };
    outro?: { start: number; end: number };
    sources: { url: string; type: string }[];
    anilistID?: number;
    malID?: number;
  };
}

export interface AniwatchAnimeInfo {
  id: string;
  name: string;
  jname?: string;
  poster: string;
  description?: string;
  stats?: {
    rating?: string;
    quality?: string;
    episodes?: { sub?: number; dub?: number };
    type?: string;
    duration?: string;
  };
  promotionalVideos?: { title?: string; source?: string; thumbnail?: string }[];
  charactersVoiceActors?: {
    character: { id: string; poster: string; name: string; cast: string };
    voiceActor: { id: string; poster: string; name: string; cast: string };
  }[];
  anime?: {
    info?: {
      id?: string;
      name?: string;
      poster?: string;
      description?: string;
      stats?: {
        rating?: string;
        quality?: string;
        episodes?: { sub?: number; dub?: number };
        type?: string;
        duration?: string;
      };
    };
    moreInfo?: {
      japanese?: string;
      synonyms?: string;
      aired?: string;
      premiered?: string;
      duration?: string;
      status?: string;
      malscore?: string;
      genres?: string[];
      studios?: string;
      producers?: string[];
    };
  };
  mostPopularAnimes?: AniwatchAnime[];
  relatedAnimes?: AniwatchAnime[];
  recommendedAnimes?: AniwatchAnime[];
  seasons?: { id: string; name: string; title?: string; poster: string; isCurrent: boolean }[];
}

export interface AniwatchInfoResponse {
  success: boolean;
  data: AniwatchAnimeInfo;
}

export const aniwatchApi = {
  getHome: async (): Promise<AniwatchHomeResponse> => {
    return proxyFetch('');
  },

  getAZList: async (page: number = 1): Promise<AniwatchListResponse> => {
    return proxyFetch('az-list', { page: String(page) });
  },

  search: async (keyword: string, page: number = 1): Promise<AniwatchSearchResponse> => {
    return proxyFetch('search', { keyword, page: String(page) });
  },

  getInfo: async (id: string): Promise<AniwatchInfoResponse> => {
    return proxyFetch('info', { id });
  },

  getEpisodes: async (id: string): Promise<AniwatchEpisodesResponse> => {
    return proxyFetch(`episodes/${id}`);
  },

  getServers: async (episodeId: string): Promise<AniwatchServersResponse> => {
    return proxyFetch('servers', { id: episodeId });
  },

  getEpisodeSources: async (
    episodeId: string,
    server: string = 'vidstreaming',
    category: 'sub' | 'dub' = 'sub'
  ): Promise<AniwatchSourceResponse> => {
    return proxyFetch('episode-srcs', { id: episodeId, server, category });
  },
};

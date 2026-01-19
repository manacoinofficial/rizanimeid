const BASE_URL = 'https://www.sankavollerei.com';

// Anime Types
export interface Genre {
  name: string;
  slug: string;
  href?: string;
}

export interface GenreResponse {
  status: string;
  data: Genre[];
}

export interface AnimeCard {
  title: string;
  poster: string;
  episodes?: number;
  releaseDay?: string;
  latestReleaseDate?: string;
  lastReleaseDate?: string;
  animeId: string;
  href: string;
  status?: string;
  score?: string;
  genreList?: AnimeGenre[];
}

export interface AnimeGenre {
  title: string;
  genreId: string;
  href: string;
}

export interface AnimeHomeResponse {
  status: string;
  data: {
    ongoing: {
      href: string;
      animeList: AnimeCard[];
    };
    completed?: {
      href: string;
      animeList: AnimeCard[];
    };
  };
}

export interface AnimeListResponse {
  status: string;
  data: {
    animeList: AnimeCard[];
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
  };
}

export interface ScheduleDay {
  day: string;
  anime_list: {
    title: string;
    slug: string;
    url: string;
    poster: string;
  }[];
}

export interface AnimeScheduleResponse {
  status: string;
  data: ScheduleDay[];
}

export interface AnimeEpisode {
  title: string;
  eps: number;
  date: string;
  episodeId: string;
  href: string;
}

export interface AnimeDetailData {
  title: string;
  poster: string;
  japanese?: string;
  score?: string;
  producers?: string;
  type?: string;
  status?: string;
  episodes?: number | null;
  duration?: string;
  aired?: string;
  studios?: string;
  batch?: string | null;
  synopsis?: {
    paragraphs: string[];
    connections?: any[];
  };
  genreList?: AnimeGenre[];
  episodeList?: AnimeEpisode[];
  recommendedAnimeList?: {
    title: string;
    poster: string;
    animeId: string;
    href: string;
  }[];
}

export interface AnimeDetailResponse {
  status: string;
  data: AnimeDetailData;
}

export interface ServerQuality {
  title: string;
  serverList: {
    title: string;
    serverId: string;
    href: string;
  }[];
}

export interface AnimeEpisodeData {
  title: string;
  animeId: string;
  releaseTime?: string;
  defaultStreamingUrl: string;
  hasPrevEpisode: boolean;
  prevEpisode?: {
    title: string;
    episodeId: string;
    href: string;
  } | null;
  hasNextEpisode: boolean;
  nextEpisode?: {
    title: string;
    episodeId: string;
    href: string;
  } | null;
  server?: {
    qualities: ServerQuality[];
  };
  downloadUrl?: {
    qualities: {
      title: string;
      urls: {
        title: string;
        url: string;
      }[];
    }[];
  };
}

export interface AnimeEpisodeResponse {
  status: string;
  data: AnimeEpisodeData;
}

export interface ServerUrlResponse {
  status: string;
  data: {
    url: string;
  };
}

export const animeApi = {
  getHome: async (): Promise<AnimeHomeResponse> => {
    const response = await fetch(`${BASE_URL}/anime/home`);
    return response.json();
  },

  getOngoing: async (page: number = 1): Promise<AnimeListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/animasu/ongoing?page=${page}`);
    return response.json();
  },

  getCompleted: async (page: number = 1): Promise<AnimeListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/complete-anime?page=${page}`);
    return response.json();
  },

  getSchedule: async (): Promise<AnimeScheduleResponse> => {
    const response = await fetch(`${BASE_URL}/anime/schedule`);
    return response.json();
  },

  getDetail: async (slug: string): Promise<AnimeDetailResponse> => {
    const response = await fetch(`${BASE_URL}/anime/anime/${slug}`);
    return response.json();
  },

  getEpisode: async (slug: string): Promise<AnimeEpisodeResponse> => {
    const response = await fetch(`${BASE_URL}/anime/episode/${slug}`);
    return response.json();
  },

  getServerUrl: async (serverId: string): Promise<ServerUrlResponse> => {
    const response = await fetch(`${BASE_URL}/anime/server/${serverId}`);
    return response.json();
  },

  search: async (keyword: string): Promise<AnimeListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/search/${keyword}`);
    return response.json();
  },

  // New genre endpoints
  getGenres: async (): Promise<GenreResponse> => {
    const response = await fetch(`${BASE_URL}/anime/genre`);
    return response.json();
  },

  getByGenre: async (genre: string): Promise<AnimeListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/genre/${genre}`);
    return response.json();
  },

  // Movie endpoints
  getMovies: async (page: number = 1): Promise<AnimeListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/zoronime/movie?page=${page}`);
    return response.json();
  },

  getAllAnime: async (): Promise<AnimeListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/zoronime/all-anime`);
    return response.json();
  },

  // J-Drama endpoints
  getJDrama: async (): Promise<AnimeListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/nimegami/j-drama`);
    return response.json();
  },

  getLiveAction: async (): Promise<AnimeListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/nimegami/live-action`);
    return response.json();
  },

  getLiveActionDetail: async (slug: string): Promise<AnimeDetailResponse> => {
    const response = await fetch(`${BASE_URL}/anime/nimegami/live-action/${slug}`);
    return response.json();
  },

  getDramaDetail: async (slug: string): Promise<AnimeDetailResponse> => {
    const response = await fetch(`${BASE_URL}/anime/nimegami/drama/${slug}`);
    return response.json();
  },
};

const BASE_URL = 'https://www.sankavollerei.com';

export interface TvShowItem {
  id: string;
  title: string;
  slug?: string;
  poster?: string;
  image?: string;
  type?: string;
  status?: string;
  rating?: string;
  year?: string;
  episode?: string;
  time?: string;
}

export interface TvShowDetailData {
  title: string;
  poster?: string;
  image?: string;
  synopsis?: string;
  alternativeTitle?: string;

  // Some endpoints expose these at the top-level...
  status?: string;
  type?: string;
  year?: string;
  rating?: string;

  // ...while winbu detail endpoints expose them under `info`
  info?: {
    rating?: string;
    season?: string;
    genres?: { name: string; url: string }[];
    status?: string;
    type?: string;
    episodes_count?: string;
    duration?: string;
    studio?: string;
    release_date?: string;
  };

  episodes?: { id: string; title: string; slug?: string; link?: string }[];
}

export interface TvShowEpisodeServerRef {
  resolution: string;
  server: string;
  data: {
    post: string;
    nume: string;
    type: string;
  };
}

export interface TvShowEpisodeData {
  title: string;

  // Old shape (some providers)
  streamUrl?: string;
  servers?: { id: string; name: string; url: string }[];
  prevEpisode?: { id: string; title: string };
  nextEpisode?: { id: string; title: string };

  // Winbu shape
  downloads?: {
    resolution: string;
    links: { server: string; url: string }[];
  }[];
  server?: TvShowEpisodeServerRef[];
  streams?: TvShowEpisodeServerRef[];  // API returns "streams" for streaming servers
  navigation?: {
    prev?: { id: string; link: string };
    next?: { id: string; link: string };
  };
  all_episodes?: {
    title: string;
    url: string;
    id: string;
    active?: boolean;
  }[];
  embed_note?: string;
}

export interface TvShowGenre {
  name: string;
  slug: string;
}

export interface TvShowListResponse {
  status?: string;
  success?: boolean;
  data: TvShowItem[] | {
    animeList?: TvShowItem[];
    list?: TvShowItem[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Helper to extract shows from response (handles both array and object formats)
export const extractShows = (response?: TvShowListResponse): TvShowItem[] => {
  if (!response?.data) return [];
  if (Array.isArray(response.data)) return response.data;
  return response.data.animeList || response.data.list || [];
};

// Helper to extract pagination from response
export const extractPagination = (response?: TvShowListResponse) => {
  if (!response) return undefined;
  if (response.pagination) return response.pagination;
  if (!Array.isArray(response.data) && response.data?.pagination) {
    return response.data.pagination;
  }
  return undefined;
};

export interface TvShowDetailResponse {
  status: string;
  type?: string;
  data: TvShowDetailData;
}

export interface TvShowEpisodeResponse {
  status: string;
  data: TvShowEpisodeData;
}

export interface TvShowServerEmbedResponse {
  status: string;
  embed_url?: string;
  html?: string;
}

export interface TvShowGenresResponse {
  status: string;
  data: {
    genres: TvShowGenre[];
  };
}

export interface TvShowHomeData {
  spotlight?: TvShowItem[];
  recent?: TvShowItem[];
  popular?: TvShowItem[];
  trending?: TvShowItem[];
}

export interface TvShowHomeResponse {
  status: string;
  data: TvShowHomeData;
}

export interface TvShowScheduleItem {
  id: string;
  title: string;
  slug: string;
  poster: string;
  time?: string;
  episode?: string;
}

export interface TvShowScheduleResponse {
  success: boolean;
  data: {
    schedule?: TvShowScheduleItem[];
    list?: TvShowScheduleItem[];
  };
}

export const tvshowApi = {
  getTvShows: async (page: number = 1): Promise<TvShowListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/tvshow?page=${page}`);
    return response.json();
  },

  getOthers: async (page: number = 1): Promise<TvShowListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/others?page=${page}`);
    return response.json();
  },

  getSeries: async (page: number = 1): Promise<TvShowListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/series?page=${page}`);
    return response.json();
  },

  getFilms: async (page: number = 1): Promise<TvShowListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/film?page=${page}`);
    return response.json();
  },

  getFilmDetail: async (id: string): Promise<TvShowDetailResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/film/${id}`);
    return response.json();
  },

  getSeriesDetail: async (id: string): Promise<TvShowDetailResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/series/${id}`);
    return response.json();
  },

  getEpisode: async (id: string): Promise<TvShowEpisodeResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/episode/${id}`);
    return response.json();
  },

  getServerEmbedUrl: async (params: { post: string; nume: string; type: string }): Promise<TvShowServerEmbedResponse> => {
    const qs = new URLSearchParams({
      post: params.post,
      nume: params.nume,
      type: params.type,
    });
    const response = await fetch(`${BASE_URL}/anime/winbu/server?post=${params.post}&nume=${params.nume}&type=${params.type}`);
    return response.json();
  },

  search: async (keyword: string, page: number = 1): Promise<TvShowListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/search?q=${encodeURIComponent(keyword)}&page=${page}`);
    return response.json();
  },

  getGenres: async (): Promise<TvShowGenresResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/genres`);
    return response.json();
  },

  getByGenre: async (slug: string, page: number = 1): Promise<TvShowListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/genre/${slug}?page=${page}`);
    return response.json();
  },

  getAllReverse: async (page: number = 1): Promise<TvShowListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/all-anime-reverse?page=${page}`);
    return response.json();
  },

  getHome: async (): Promise<TvShowHomeResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/home`);
    return response.json();
  },

  getSchedule: async (day: string): Promise<TvShowScheduleResponse> => {
    const response = await fetch(`${BASE_URL}/anime/winbu/schedule?day=${day}`);
    return response.json();
  },

  getList: async (order?: string, status?: string, type?: string): Promise<TvShowListResponse> => {
    const params = new URLSearchParams();
    if (order) params.append('order', order);
    if (status) params.append('status', status);
    if (type) params.append('type', type);
    const queryString = params.toString();
    const response = await fetch(`${BASE_URL}/anime/winbu/list${queryString ? `?${queryString}` : ''}`);
    return response.json();
  },
};

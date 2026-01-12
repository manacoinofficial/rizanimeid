const BASE_URL = 'https://www.sankavollerei.com';

export interface DramaBoxItem {
  id: string;
  bookId?: string;
  title: string;
  poster?: string;
  cover?: string;
  image?: string;
  description?: string;
  episodes?: number;
  views?: string;
  rating?: string;
}

export interface DramaBoxEpisode {
  id?: string;
  title?: string;
  episode?: number;
  episodeNumber?: number;
  ep?: number;
  number?: number;
}

export interface DramaBoxDetailData {
  id?: string;
  bookId?: string;
  title: string;
  poster?: string;
  cover?: string;
  image?: string;
  description?: string;
  synopsis?: string;
  episodes?: DramaBoxEpisode[];
  episodeList?: DramaBoxEpisode[];
  episodeCount?: number;
  totalEpisodes?: number;
  total_episodes?: number;
  views?: string;
  rating?: string;
  score?: string;
  genres?: string[];
  genre?: string[];
  tags?: string[];
  status?: string;
}

export interface DramaBoxStreamData {
  title: string;
  streamUrl?: string;
  videoUrl?: string;
  url?: string;
  episode: number;
  bookId: string;
  prevEpisode?: number;
  nextEpisode?: number;
  totalEpisodes?: number;
}

export interface DramaBoxListResponse {
  success?: boolean;
  status?: string;
  data: DramaBoxItem[] | {
    list?: DramaBoxItem[];
    items?: DramaBoxItem[];
  };
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface DramaBoxDetailResponse {
  success?: boolean;
  status?: string;
  data: DramaBoxDetailData;
}

export interface DramaBoxStreamResponse {
  success?: boolean;
  status?: string;
  data: DramaBoxStreamData;
}

export interface DramaBoxAuthResponse {
  success?: boolean;
  token?: string;
}

// Helper to extract items from response
export const extractDramaBoxItems = (response?: DramaBoxListResponse): DramaBoxItem[] => {
  if (!response?.data) return [];
  if (Array.isArray(response.data)) return response.data;
  return response.data.list || response.data.items || [];
};

// Helper to get episode number from episode object
export const getEpisodeNumber = (ep: DramaBoxEpisode): number => {
  return ep.episode ?? ep.episodeNumber ?? ep.ep ?? ep.number ?? 1;
};

// Helper to get total episodes from detail data
export const getTotalEpisodes = (detail: DramaBoxDetailData): number => {
  const episodes = detail.episodes || detail.episodeList || [];
  return detail.episodeCount ?? detail.totalEpisodes ?? detail.total_episodes ?? episodes.length ?? 0;
};

// Helper to get genres from detail data
export const getGenres = (detail: DramaBoxDetailData): string[] => {
  return detail.genres || detail.genre || detail.tags || [];
};

// Helper to get description from detail data
export const getDescription = (detail: DramaBoxDetailData): string | undefined => {
  return detail.description || detail.synopsis;
};

// Helper to get rating from detail data
export const getRating = (detail: DramaBoxDetailData): string | undefined => {
  return detail.rating || detail.score;
};

// Helper to get poster from detail data
export const getPoster = (detail: DramaBoxDetailData): string | undefined => {
  return detail.poster || detail.cover || detail.image;
};

export const dramaboxApi = {
  search: async (keyword: string): Promise<DramaBoxListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/dramabox/search?q=${encodeURIComponent(keyword)}`);
    return response.json();
  },

  getLatest: async (page: number = 1): Promise<DramaBoxListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/dramabox/latest?page=${page}`);
    return response.json();
  },

  getTrending: async (): Promise<DramaBoxListResponse> => {
    const response = await fetch(`${BASE_URL}/anime/dramabox/trending`);
    return response.json();
  },

  getDetail: async (bookId: string): Promise<DramaBoxDetailResponse> => {
    const response = await fetch(`${BASE_URL}/anime/dramabox/detail?bookId=${bookId}`);
    return response.json();
  },

  getStream: async (bookId: string, episode: number): Promise<DramaBoxStreamResponse> => {
    const response = await fetch(`${BASE_URL}/anime/dramabox/stream?bookId=${bookId}&episode=${episode}`);
    return response.json();
  },

  refreshAuth: async (): Promise<DramaBoxAuthResponse> => {
    const response = await fetch(`${BASE_URL}/anime/dramabox/auth/refresh`);
    return response.json();
  },
};

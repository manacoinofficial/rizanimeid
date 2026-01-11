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

export interface DramaBoxDetailData {
  id: string;
  bookId: string;
  title: string;
  poster?: string;
  cover?: string;
  description?: string;
  episodes?: { id: string; title: string; episode: number }[];
  episodeCount?: number;
  views?: string;
  rating?: string;
  genres?: string[];
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

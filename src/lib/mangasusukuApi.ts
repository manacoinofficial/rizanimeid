const BASE_URL = 'https://www.sankavollerei.com';

export interface MangasusukuItem {
  title: string;
  slug: string;
  cover: string;
  chapter?: string;
  date?: string;
  type?: string;
  rating?: string;
  status?: string;
  genres?: string[];
}

export interface MangasusukuGenre {
  name: string;
  slug: string;
  id?: string;
}

export interface MangasusukuChapter {
  title: string;
  slug: string;
  date?: string;
}

export interface MangasusukuDetail {
  title: string;
  alternativeTitle?: string;
  cover: string;
  synopsis?: string;
  description?: string;
  status?: string;
  type?: string;
  author?: string;
  artist?: string;
  released?: string;
  rating?: string;
  genres?: string[];
  chapters?: MangasusukuChapter[];
}

export interface MangasusukuChapterData {
  title: string;
  images: string[];
  navigation?: {
    prev?: { slug: string };
    next?: { slug: string };
  };
}

export interface MangasusukuListResponse {
  success?: boolean;
  data?: MangasusukuItem[];
  komikList?: MangasusukuItem[];
  mangaList?: MangasusukuItem[];
  list?: MangasusukuItem[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export interface MangasusukuGenreResponse {
  success?: boolean;
  data?: MangasusukuGenre[];
  genres?: MangasusukuGenre[];
}

export interface MangasusukuDetailResponse {
  success?: boolean;
  data?: MangasusukuDetail;
}

export interface MangasusukuChapterResponse {
  success?: boolean;
  data?: MangasusukuChapterData;
}

// Helper to extract items from response
export const extractMangasusukuItems = (response?: MangasusukuListResponse): MangasusukuItem[] => {
  if (!response) return [];
  return response.data || response.komikList || response.mangaList || response.list || [];
};

// Helper to extract genres from response
export const extractMangasusukuGenres = (response?: MangasusukuGenreResponse): MangasusukuGenre[] => {
  if (!response) return [];
  return response.data || response.genres || [];
};

export const mangasusukuApi = {
  // Home page - featured/recommended
  getHome: async (page: number = 1): Promise<MangasusukuListResponse> => {
    const url = page > 1 
      ? `${BASE_URL}/comic/mangasusuku/home/${page}`
      : `${BASE_URL}/comic/mangasusuku/home`;
    const response = await fetch(url);
    return response.json();
  },

  // Latest updates
  getLatest: async (page: number = 1): Promise<MangasusukuListResponse> => {
    const url = page > 1
      ? `${BASE_URL}/comic/mangasusuku/latest/${page}`
      : `${BASE_URL}/comic/mangasusuku/latest`;
    const response = await fetch(url);
    return response.json();
  },

  // Popular manga
  getPopular: async (page: number = 1): Promise<MangasusukuListResponse> => {
    const url = page > 1
      ? `${BASE_URL}/comic/mangasusuku/popular/${page}`
      : `${BASE_URL}/comic/mangasusuku/popular`;
    const response = await fetch(url);
    return response.json();
  },

  // All manga list
  getList: async (page: number = 1): Promise<MangasusukuListResponse> => {
    const url = page > 1
      ? `${BASE_URL}/comic/mangasusuku/list/${page}`
      : `${BASE_URL}/comic/mangasusuku/list`;
    const response = await fetch(url);
    return response.json();
  },

  // List by character (alphabetical)
  getListByChar: async (char: string, page: number = 1): Promise<MangasusukuListResponse> => {
    const response = await fetch(`${BASE_URL}/comic/mangasusuku/list-by-char/${char}/${page}`);
    return response.json();
  },

  // Get available characters for alphabetical filter
  getCharList: async (): Promise<{ chars?: string[] }> => {
    const response = await fetch(`${BASE_URL}/comic/mangasusuku/list-by-char/`);
    return response.json();
  },

  // Get all genres
  getGenres: async (): Promise<MangasusukuGenreResponse> => {
    const response = await fetch(`${BASE_URL}/comic/mangasusuku/genres`);
    return response.json();
  },

  // Get manga by genre
  getByGenre: async (genreId: string, page: number = 1): Promise<MangasusukuListResponse> => {
    const response = await fetch(`${BASE_URL}/comic/mangasusuku/genre/${genreId}/${page}`);
    return response.json();
  },

  // Get manga detail
  getDetail: async (slug: string): Promise<MangasusukuDetailResponse> => {
    const response = await fetch(`${BASE_URL}/comic/mangasusuku/detail/${slug}`);
    return response.json();
  },

  // Get chapter (Premium only)
  getChapter: async (slug: string): Promise<MangasusukuChapterResponse> => {
    const response = await fetch(`${BASE_URL}/comic/mangasusuku/chapter/${slug}`);
    return response.json();
  },
};

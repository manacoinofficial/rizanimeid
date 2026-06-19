const BASE_URL = 'https://www.sankavollerei.web.id';

export interface MangasusukuItem {
  title: string;
  slug: string;
  cover?: string;
  image?: string;
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
  title?: string;
  alternativeTitle?: string;
  cover?: string;
  image?: string;
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
  title?: string;
  images?: string[];
  navigation?: {
    prev?: { slug: string };
    next?: { slug: string };
  };
}

export interface MangasusukuHomeResponse {
  success?: boolean;
  hotComics?: MangasusukuItem[];
  latestUpdates?: MangasusukuItem[];
  pagination?: {
    currentPage: number;
    hasNextPage: boolean;
    nextPage?: number;
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
  // Top level fields (API returns data at top level)
  title?: string;
  alternativeTitle?: string;
  image?: string;
  rating?: string;
  synopsis?: string;
  info?: Record<string, string>;
  genres?: string[];
  chapters?: MangasusukuChapter[];
}

export interface MangasusukuChapterResponse {
  success?: boolean;
  data?: MangasusukuChapterData;
  // Top level fields
  title?: string;
  images?: string[];
  navigation?: {
    prev?: string;
    next?: string;
  };
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

// Helper to get title
export const getTitle = (item?: MangasusukuItem | MangasusukuDetail): string => {
  if (!item) return 'Unknown Title';
  return item.title || 'Unknown Title';
};

// Helper to get cover/image
export const getCover = (item?: MangasusukuItem | MangasusukuDetail): string => {
  if (!item) return '/placeholder.svg';
  return item.cover || item.image || '/placeholder.svg';
};

// Helper to get chapters
export const getChapters = (detail?: MangasusukuDetail): MangasusukuChapter[] => {
  if (!detail) return [];
  return detail.chapters || [];
};

// Helper to get synopsis
export const getSynopsis = (detail?: MangasusukuDetail): string => {
  if (!detail) return 'No synopsis available.';
  return detail.synopsis || detail.description || 'No synopsis available.';
};

// Helper to get chapter images
export const getChapterImages = (chapter?: MangasusukuChapterData): string[] => {
  if (!chapter) return [];
  return chapter.images || [];
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

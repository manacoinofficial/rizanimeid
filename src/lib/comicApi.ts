const BASE_URL = 'https://www.sankavollerei.web.id';

export interface ComicCard {
  title: string;
  slug: string;
  cover: string;
  chapter?: string;
  date?: string;
  type?: string;
  rating?: string;
}

export interface ComicGenre {
  title: string;
  slug: string;
}

export interface ComicChapter {
  title: string;
  images: string[];
  navigation?: {
    prev?: { slug: string };
    next?: { slug: string };
  };
}

export const comicApi = {
  getLatest: async () => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/latest`);
    return response.json();
  },

  getTerbaru: async () => {
    const response = await fetch(`${BASE_URL}/comic/terbaru`);
    return response.json();
  },

  getPopular: async () => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/populer`);
    return response.json();
  },

  getTop: async () => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/top`);
    return response.json();
  },

  getByType: async (type: string) => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/only/${type}`);
    return response.json();
  },

  search: async (query: string) => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/search/${query}`);
    return response.json();
  },

  getGenres: async () => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/genres`);
    return response.json();
  },

  getByGenre: async (slug: string) => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/genre/${slug}`);
    return response.json();
  },

  getChapter: async (slug: string) => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/chapter/${slug}`);
    return response.json();
  },

  getDetail: async (slug: string) => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/detail/${slug}`);
    return response.json();
  },

  getKomikBerwarna: async (page: number = 1) => {
    const response = await fetch(`${BASE_URL}/comic/bacakomik/komikberwarna/${page}`);
    return response.json();
  },
};

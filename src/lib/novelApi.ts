const BASE_URL = 'https://www.sankavollerei.com';

export interface NovelCard {
  title: string;
  slug: string;
  image: string;
  rating?: string;
  latestChapter?: string;
  latestChapterSlug?: string;
}

export interface NovelGenre {
  name: string;
  slug: string;
  count?: string;
}

export interface NovelDetail {
  title: string;
  image: string;
  rating: string;
  status: string;
  author: string;
  artist: string;
  release: string;
  type: string;
  synopsis: string;
  genres: { name: string; slug: string }[];
  chapters: { title: string; slug: string; date?: string }[];
}

export const novelApi = {
  // Sakuranovel endpoints
  getHome: async () => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/home`);
    return response.json();
  },

  getHomeV2: async (page: number = 1) => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/home?page=${page}`);
    return response.json();
  },

  getPopular: async () => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/popular`);
    return response.json();
  },

  getTags: async () => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/tags`);
    return response.json();
  },

  getByTag: async (slug: string) => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/tags/${slug}`);
    return response.json();
  },

  getLatest: async () => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/daftar-novel`);
    return response.json();
  },

  getList: async (page: number = 1) => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/home?page=${page}`);
    return response.json();
  },

  getGenres: async () => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/genres`);
    return response.json();
  },

  getByGenre: async (slug: string, page: number = 1) => {
    if (page === 1) {
      const response = await fetch(`${BASE_URL}/novel/sakuranovel/genre/${slug}`);
      return response.json();
    }
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/genre/${slug}/${page}`);
    return response.json();
  },

  getDetail: async (slug: string) => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/detail/${slug}`);
    return response.json();
  },

  getChapter: async (slug: string) => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/read/${slug}`);
    return response.json();
  },

  // Alternative chapter endpoint using single slug
  getChapterBySlug: async (slug: string) => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/read/${slug}`);
    return response.json();
  },

  search: async (keyword: string, page: number = 1) => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/search?q=${encodeURIComponent(keyword)}`);
    return response.json();
  },

  advancedSearch: async (status: string) => {
    const response = await fetch(`${BASE_URL}/novel/sakuranovel/advanced-search?status=${status}`);
    return response.json();
  },
};

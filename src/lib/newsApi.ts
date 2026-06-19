const BASE_URL = 'https://www.sankavollerei.web.id';

export interface NewsArticle {
  title: string;
  id: string;
  slug: string;
  link: string;
  image: string;
  category?: string;
  date: string;
  excerpt?: string;
}

export interface NewsDetail {
  title: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  content: string;
}

export const newsApi = {
  getLatest: async () => {
    const response = await fetch(`${BASE_URL}/api/artikel/kaori/latest`);
    return response.json();
  },

  getByRubrik: async (rubrik: string) => {
    const response = await fetch(`${BASE_URL}/api/artikel/kaori/rubrik/${rubrik}`);
    return response.json();
  },

  search: async (query: string) => {
    const response = await fetch(`${BASE_URL}/api/artikel/kaori/search/${query}`);
    return response.json();
  },

  getDetail: async (id: string, slug: string) => {
    const response = await fetch(`${BASE_URL}/api/artikel/kaori/detail/${id}/${slug}`);
    return response.json();
  },
};

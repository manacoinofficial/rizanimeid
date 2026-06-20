const BASE_URL = 'https://api.nexray.eu.cc/berita';

export type NewsSource = 'jkt48' | 'ffnews' | 'antara' | 'cnbcindonesia' | 'mlbb';

export interface NewsItem {
  title: string;
  link: string;
  image?: string;
  thumbnail?: string;
  date?: string;
  category?: string;
  author?: string;
  caption?: string;
  label?: string;
}

export interface NewsSourceMeta {
  id: NewsSource;
  label: string;
  description: string;
}

export const NEWS_SOURCES: NewsSourceMeta[] = [
  { id: 'antara', label: 'Antara', description: 'Berita nasional & dunia' },
  { id: 'cnbcindonesia', label: 'CNBC Indonesia', description: 'Ekonomi & bisnis' },
  { id: 'jkt48', label: 'JKT48', description: 'Kabar idol JKT48' },
  { id: 'ffnews', label: 'Free Fire', description: 'Update game Free Fire' },
  { id: 'mlbb', label: 'Mobile Legends', description: 'Patch notes MLBB' },
];

export const newsApi = {
  getBySource: async (source: NewsSource): Promise<NewsItem[]> => {
    const res = await fetch(`${BASE_URL}/${source}`);
    const json = await res.json();
    if (!json?.status) return [];
    const result = json.result;
    if (Array.isArray(result)) return result as NewsItem[];
    if (Array.isArray(result?.data)) return result.data as NewsItem[];
    return [];
  },
};

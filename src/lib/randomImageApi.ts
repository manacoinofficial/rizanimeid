const BASE = 'https://api.nexray.eu.cc/random';

export type CecanCountry = 'vietnam' | 'korea' | 'japan';

export const ANIME_TYPES = [
  'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug',
  'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile',
  'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap', 'kill',
  'kick', 'happy', 'wink', 'poke', 'dance', 'cringe',
];

/** Endpoints return raw image bytes — just build a cache-busted URL. */
export const cecanUrl = (country: CecanCountry) =>
  `${BASE}/cecan/${country}?t=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const animeUrl = (type: string) =>
  `${BASE}/anime?type=${encodeURIComponent(type)}&t=${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const CECAN_LABEL: Record<CecanCountry, string> = {
  vietnam: 'Cewek Vietnam',
  korea: 'Cewek Korea',
  japan: 'Cewek Jepang',
};

export const CHAT_KEYWORDS: Record<string, { country: CecanCountry; label: string }> = {
  cevie: { country: 'vietnam', label: CECAN_LABEL.vietnam },
  cekor: { country: 'korea', label: CECAN_LABEL.korea },
  cejap: { country: 'japan', label: CECAN_LABEL.japan },
};
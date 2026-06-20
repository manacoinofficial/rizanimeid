import { useState, useEffect, useCallback } from 'react';

export type ContentType = 'comic' | 'novel' | 'anime' | 'mangasusuku';

export interface FavoriteItem {
  type: ContentType;
  slug: string;
  title: string;
  cover: string;
  rating?: string;
  status?: string;
  timestamp: number;
}

const FAVORITES_KEY = 'favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse favorites:', e);
      }
    }
  }, []);

  // Add to favorites
  const addToFavorites = useCallback((item: Omit<FavoriteItem, 'timestamp'>) => {
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(f => f.type === item.type && f.slug === item.slug)) {
        return prev;
      }
      
      const newFavorites = [{ ...item, timestamp: Date.now() }, ...prev];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  // Remove from favorites
  const removeFromFavorites = useCallback((type: ContentType, slug: string) => {
    setFavorites(prev => {
      const filtered = prev.filter(f => !(f.type === type && f.slug === slug));
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((item: Omit<FavoriteItem, 'timestamp'>) => {
    const exists = favorites.some(f => f.type === item.type && f.slug === item.slug);
    if (exists) {
      removeFromFavorites(item.type, item.slug);
    } else {
      addToFavorites(item);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  // Check if item is favorited
  const isFavorite = useCallback((type: ContentType, slug: string) => {
    return favorites.some(f => f.type === type && f.slug === slug);
  }, [favorites]);

  // Get favorites by type
  const getFavoritesByType = useCallback((type: ContentType) => {
    return favorites.filter(f => f.type === type);
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    localStorage.removeItem(FAVORITES_KEY);
    setFavorites([]);
  }, []);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    clearFavorites,
  };
};

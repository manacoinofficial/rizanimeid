import { useState, useEffect, useCallback } from 'react';

export type ContentType = 'comic' | 'novel' | 'anime' | 'mangasusuku' | 'mangasusuku-chapter';

export interface HistoryItem {
  type: ContentType;
  slug: string;
  title: string;
  cover: string;
  lastChapter?: string;
  lastChapterSlug?: string;
  lastEpisode?: string;
  lastEpisodeId?: string;
  timestamp: number;
}

const HISTORY_KEY = 'reading-history';
const MAX_HISTORY_ITEMS = 100;

export const useReadingHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((items: HistoryItem[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    setHistory(items);
  }, []);

  // Add or update history item
  const addToHistory = useCallback((item: Omit<HistoryItem, 'timestamp'>) => {
    setHistory(prev => {
      // Remove existing entry for same content
      const filtered = prev.filter(h => !(h.type === item.type && h.slug === item.slug));
      
      // Add new entry at the beginning
      const newHistory = [
        { ...item, timestamp: Date.now() },
        ...filtered
      ].slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Remove from history
  const removeFromHistory = useCallback((type: ContentType, slug: string) => {
    setHistory(prev => {
      const filtered = prev.filter(h => !(h.type === type && h.slug === slug));
      localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  // Get history by type
  const getHistoryByType = useCallback((type: ContentType) => {
    return history.filter(h => h.type === type);
  }, [history]);

  // Get last read for specific content
  const getLastRead = useCallback((type: ContentType, slug: string) => {
    return history.find(h => h.type === type && h.slug === slug);
  }, [history]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryByType,
    getLastRead,
  };
};

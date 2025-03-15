import { useState, useEffect } from 'react';
import { SavedPortrait, PortraitHistoryHook } from '@/types/portrait';

const STORAGE_KEY = 'soul-portraits-history';

export function usePortraitHistory(): PortraitHistoryHook {
  const [portraits, setPortraits] = useState<SavedPortrait[]>([]);

  useEffect(() => {
    const savedPortraits = localStorage.getItem(STORAGE_KEY);
    if (savedPortraits) {
      try {
        setPortraits(JSON.parse(savedPortraits));
      } catch (error) {
        console.error('Błąd podczas wczytywania historii:', error);
      }
    }
  }, []);

  const savePortrait = (portrait: Omit<SavedPortrait, 'id' | 'createdAt'>) => {
    const newPortrait: SavedPortrait = {
      ...portrait,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const updatedPortraits = [newPortrait, ...portraits];
    setPortraits(updatedPortraits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPortraits));
    return newPortrait;
  };

  const deletePortrait = (id: string) => {
    const updatedPortraits = portraits.filter(p => p.id !== id);
    setPortraits(updatedPortraits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPortraits));
  };

  const clearHistory = () => {
    setPortraits([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    portraits,
    savePortrait,
    deletePortrait,
    clearHistory,
  };
} 
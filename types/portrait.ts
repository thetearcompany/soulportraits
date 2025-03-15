import { ArtStyle } from './styles';

export interface SpiritAnimal {
  name: string;
  description: string;
}

export interface SavedPortrait {
  id: string;
  description: string;
  imageUrl: string;
  style: ArtStyle;
  spiritAnimal: SpiritAnimal;
  createdAt: string;
}

export interface PortraitHistoryHook {
  portraits: SavedPortrait[];
  savePortrait: (portrait: Omit<SavedPortrait, 'id' | 'createdAt'>) => SavedPortrait;
  deletePortrait: (id: string) => void;
  clearHistory: () => void;
} 
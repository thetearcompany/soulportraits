import { ArtStyle } from './styles';
import { BirthData } from '@/lib/validations';

export interface SpiritAnimal {
  name: string;
  description: string;
}

export interface NumerologicalData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export interface SavedPortrait {
  id: string;
  analysis: string;
  imageUrl: string;
  birthData: BirthData;
  createdAt: string;
}

export interface PortraitHistoryHook {
  portraits: SavedPortrait[];
  savePortrait: (portrait: Omit<SavedPortrait, 'id' | 'createdAt'>) => SavedPortrait;
  deletePortrait: (id: string) => void;
  clearHistory: () => void;
} 
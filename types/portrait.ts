import { ArtStyle } from './styles';
import { BirthData } from '@/lib/validations';

export interface SpiritAnimal {
  name: string;
  description: string;
}

export interface NumerologicalData {
  name: string;
  birthDate: string;
  birthPlace: string;
}

export interface GuardianAngel {
  name: string;
  description?: string;
}

export interface KabalisticInterpretation {
  treeOfLife?: {
    sefira: string;
    description: string;
    attributes: string[];
    challenges: string[];
  };
  lifeNumber?: {
    number: number;
    meaning: string;
    strengths: string[];
    weaknesses: string[];
  };
  passionPath?: {
    name: string;
    description: string;
    spiritualGifts: string[];
    mission: string;
  };
  painPath?: {
    name: string;
    description: string;
    lessons: string[];
    healing: string;
  };
  soulPurpose: string;
  spiritualGifts: string[];
  karmicLessons: string[];
  divineProtection: string;
  spiritAnimal: {
    name: string;
    description: string;
    symbolism: string[];
    guidance: string;
  };
  guardianAngel: GuardianAngel;
}

export interface SavedPortrait {
  id: string;
  createdAt: string;
  birthData: BirthData;
  analysis: KabalisticInterpretation;
  imageUrl?: string;
}

export interface PortraitHistoryHook {
  portraits: SavedPortrait[];
  savePortrait: (portrait: Omit<SavedPortrait, 'id' | 'createdAt'>) => SavedPortrait;
  deletePortrait: (id: string) => void;
  clearHistory: () => void;
} 
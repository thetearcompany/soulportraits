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
    healing: {
      methods: string[];
      mantra: string;
    };
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
  imageUrl?: string;
}

export interface SpiritAnimalImage {
  url: string;
  photographer: {
    name: string;
    username: string;
  };
  unsplashUrl: string;
}

export interface SavedPortrait {
  id: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  spiritAnimal: {
    name: string;
    description: string;
    traits: string[];
    image: SpiritAnimalImage;
    symbolism: string[];
    guidance: string;
  };
  numerology: {
    lifePathNumber: number;
    description: string;
  };
  chakras: {
    dominant: string;
    description: string;
  };
  advice: string;
  analysis: KabalisticInterpretation;
  generatedImage?: string;
}

export interface PortraitHistoryHook {
  portraits: SavedPortrait[];
  savePortrait: (portrait: Omit<SavedPortrait, 'id' | 'createdAt'>) => SavedPortrait;
  deletePortrait: (id: string) => void;
  clearHistory: () => void;
} 
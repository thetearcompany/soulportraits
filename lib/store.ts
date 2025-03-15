import { create } from 'zustand'
import { SavedPortrait } from '@/types/portrait'
import { PortraitDatabase } from './db'

interface Store {
  portrait: SavedPortrait | null
  portraits: SavedPortrait[]
  setPortrait: (portrait: SavedPortrait | null) => void
  savePortrait: (portrait: SavedPortrait) => Promise<void>
  loadPortraits: () => Promise<void>
  deletePortrait: (id: number) => Promise<void>
}

const db = new PortraitDatabase()

const isPortraitUnique = (portrait: SavedPortrait, existingPortraits: SavedPortrait[]): boolean => {
  return !existingPortraits.some(existing => 
    existing.birthData.firstName === portrait.birthData.firstName &&
    existing.birthData.lastName === portrait.birthData.lastName &&
    existing.birthData.birthDate === portrait.birthData.birthDate &&
    existing.birthData.birthTime === portrait.birthData.birthTime &&
    existing.birthData.birthPlace === portrait.birthData.birthPlace
  )
}

const validatePortrait = (portrait: SavedPortrait): SavedPortrait => {
  return {
    ...portrait,
    analysis: {
      ...portrait.analysis,
      spiritAnimal: {
        name: portrait.analysis.spiritAnimal?.name || 'Nie określono',
        description: portrait.analysis.spiritAnimal?.description || '',
        symbolism: portrait.analysis.spiritAnimal?.symbolism || [],
        guidance: portrait.analysis.spiritAnimal?.guidance || ''
      },
      guardianAngel: {
        name: portrait.analysis.guardianAngel?.name || 'Nie określono',
        description: portrait.analysis.guardianAngel?.description || ''
      },
      soulPurpose: portrait.analysis.soulPurpose || 'Brak opisu celu duszy',
      treeOfLife: portrait.analysis.treeOfLife || undefined,
      lifeNumber: portrait.analysis.lifeNumber || undefined,
      passionPath: portrait.analysis.passionPath || undefined,
      painPath: portrait.analysis.painPath || undefined,
      spiritualGifts: portrait.analysis.spiritualGifts || [],
      karmicLessons: portrait.analysis.karmicLessons || [],
      divineProtection: portrait.analysis.divineProtection || ''
    }
  }
}

export const useStore = create<Store>((set) => ({
  portrait: null,
  portraits: [],
  setPortrait: (portrait) => set({ portrait: portrait ? validatePortrait(portrait) : null }),
  savePortrait: async (portrait) => {
    const validatedPortrait = validatePortrait(portrait)
    const existingPortraits = await db.portraits.toArray()
    
    if (isPortraitUnique(validatedPortrait, existingPortraits)) {
      await db.portraits.add(validatedPortrait)
      const portraits = await db.portraits.toArray()
      set({ portraits: portraits.map(validatePortrait) })
    } else {
      console.log('Portret już istnieje w bazie danych')
    }
  },
  loadPortraits: async () => {
    const portraits = await db.portraits.toArray()
    set({ portraits: portraits.map(validatePortrait) })
  },
  deletePortrait: async (id) => {
    await db.portraits.delete(id)
    const portraits = await db.portraits.toArray()
    set({ portraits: portraits.map(validatePortrait) })
  }
}))

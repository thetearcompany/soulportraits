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
      soulPurpose: portrait.analysis.soulPurpose || 'Brak opisu celu duszy',
      treeOfLife: portrait.analysis.treeOfLife || null,
      lifeNumber: portrait.analysis.lifeNumber || null,
      passionPath: portrait.analysis.passionPath || null,
      painPath: portrait.analysis.painPath || null,
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
    await db.portraits.add(validatedPortrait)
    const portraits = await db.portraits.toArray()
    set({ portraits: portraits.map(validatePortrait) })
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

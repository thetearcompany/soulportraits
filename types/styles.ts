export interface ArtStyle {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const artStyles: ArtStyle[] = [
  {
    id: 'ethereal',
    name: 'Eteryczny',
    description: 'Delikatny, mistyczny styl z płynnymi formami i świetlistymi elementami',
    prompt: 'ethereal, spiritual, flowing forms with luminous elements, soft light'
  },
  {
    id: 'cosmic',
    name: 'Kosmiczny',
    description: 'Głęboka przestrzeń kosmiczna z galaktykami i mgławicami',
    prompt: 'cosmic, deep space, galaxies, nebulae, star clusters, celestial energy'
  },
  {
    id: 'nature',
    name: 'Naturalny',
    description: 'Inspirowany żywiołami natury i organicznymi formami',
    prompt: 'organic forms, natural elements, flowing water, growing plants, earth tones'
  },
  {
    id: 'geometric',
    name: 'Geometryczny',
    description: 'Abstrakcyjne formy geometryczne w harmonijnej kompozycji',
    prompt: 'geometric abstract, sacred geometry, mathematical harmony, clean lines'
  },
  {
    id: 'emotional',
    name: 'Emocjonalny',
    description: 'Ekspresyjny styl z intensywnymi kolorami i dynamicznymi pociągnięciami',
    prompt: 'emotional expressionism, intense colors, dynamic brushstrokes, raw energy'
  },
  {
    id: 'mystical',
    name: 'Mistyczny',
    description: 'Tajemniczy i duchowy styl z symbolicznymi elementami',
    prompt: 'mystical, spiritual symbols, sacred art, divine light, ethereal atmosphere'
  }
]; 
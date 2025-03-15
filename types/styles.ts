export interface ArtStyle {
  id: string;
  name: string;
  prompt: string;
  description: string;
}

export const artStyles: ArtStyle[] = [
  {
    id: 'oil',
    name: 'Obraz olejny',
    prompt: 'oil painting style, rich textures, vibrant colors',
    description: 'Klasyczny styl malarski z bogatymi teksturami i żywymi kolorami'
  },
  {
    id: 'watercolor',
    name: 'Akwarela',
    prompt: 'watercolor style, soft edges, flowing colors',
    description: 'Delikatny i płynny styl z przenikającymi się kolorami'
  },
  {
    id: 'digital',
    name: 'Sztuka cyfrowa',
    prompt: 'digital art style, modern, clean lines',
    description: 'Nowoczesny styl cyfrowy z czystymi liniami'
  }
]; 
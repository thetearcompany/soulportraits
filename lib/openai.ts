import OpenAI from 'openai';
import { ArtStyle } from '@/types/styles';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface SoulPortraitResponse {
  description: string;
  imagePrompt: string;
  spiritAnimal: {
    name: string;
    description: string;
  };
}

export async function generateSoulPortrait(userDescription: string): Promise<SoulPortraitResponse> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `Jesteś duchowym przewodnikiem, który potrafi odczytać esencję duszy człowieka.
        Na podstawie opisu osoby, stwórz głęboki, poetycki i metaforyczny opis jej duszy,
        a także wskaż jej duchowe zwierzę opiekuńcze.
        
        Format odpowiedzi:
        OPIS: [tutaj poetycki opis duszy]
        ZWIERZĘ: [nazwa zwierzęcia]
        OPIS ZWIERZĘCIA: [krótki, poetycki opis dlaczego to zwierzę jest duchowym opiekunem tej duszy]
        PROMPT: [tutaj prompt do DALL-E w języku angielskim]`
      },
      {
        role: "user",
        content: userDescription
      }
    ],
    temperature: 0.9,
  });

  const response = completion.choices[0].message.content;
  if (!response) throw new Error('No response from OpenAI');

  const sections = response.split('\n').reduce((acc, line) => {
    if (line.startsWith('OPIS:')) acc.description = line.replace('OPIS:', '').trim();
    if (line.startsWith('ZWIERZĘ:')) acc.animalName = line.replace('ZWIERZĘ:', '').trim();
    if (line.startsWith('OPIS ZWIERZĘCIA:')) acc.animalDescription = line.replace('OPIS ZWIERZĘCIA:', '').trim();
    if (line.startsWith('PROMPT:')) acc.imagePrompt = line.replace('PROMPT:', '').trim();
    return acc;
  }, {
    description: '',
    animalName: '',
    animalDescription: '',
    imagePrompt: ''
  });

  return {
    description: sections.description,
    imagePrompt: sections.imagePrompt,
    spiritAnimal: {
      name: sections.animalName,
      description: sections.animalDescription
    }
  };
}

export async function generateSoulImage(imagePrompt: string, style: ArtStyle): Promise<string> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `Create an artistic, abstract soul portrait that combines the essence of a human soul with their spirit animal. ${imagePrompt}. 
    The image should subtly incorporate spirit animal elements in an ethereal and mystical way.
    Style: ${style.prompt}, high quality art, professional composition, spiritual and mystical atmosphere`,
    size: "1024x1024",
    quality: "standard",
    n: 1,
  });

  if (!response.data[0].url) {
    throw new Error('No image generated');
  }

  return response.data[0].url;
} 
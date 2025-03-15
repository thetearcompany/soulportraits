import OpenAI from 'openai';
import { ArtStyle } from '@/types/styles';

export async function generatePortrait(description: string, styleId: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY nie jest skonfigurowany');
  }

  const openai = new OpenAI({ apiKey });

  try {
    // Generowanie opisu duszy
    const soulResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Jesteś duchowym przewodnikiem, który potrafi zajrzeć w głąb duszy człowieka i opisać jej istotę w poetycki sposób."
        },
        {
          role: "user",
          content: `Na podstawie tego opisu osoby, stwórz poetycki opis jej duszy (max 100 słów): ${description}`
        }
      ]
    });

    const soulDescription = soulResponse.choices[0]?.message?.content || '';

    // Generowanie zwierzęcia duchowego
    const animalResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Jesteś mistycznym przewodnikiem, który potrafi określić duchowe zwierzę danej osoby i wyjaśnić jego znaczenie."
        },
        {
          role: "user",
          content: `Na podstawie tego opisu osoby, określ jej duchowe zwierzę i wyjaśnij dlaczego (max 50 słów): ${description}`
        }
      ]
    });

    const animalText = animalResponse.choices[0]?.message?.content || '';
    
    // Parsowanie odpowiedzi o zwierzęciu
    const animalMatch = animalText.match(/^([^:.]+)[:.]\s*(.+)$/);
    const spiritAnimal = {
      name: animalMatch ? animalMatch[1].trim() : 'Nieznane zwierzę',
      description: animalMatch ? animalMatch[2].trim() : animalText.trim()
    };

    // Generowanie obrazu
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Stwórz artystyczny portret duszy tej osoby, wykorzystując symbolikę ${spiritAnimal.name}. Opis osoby: ${description}. Styl: ${styleId}. Obraz powinien być subtelny, symboliczny i artystyczny.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid"
    });

    const imageUrl = imageResponse.data[0]?.url;

    if (!imageUrl) {
      throw new Error('Nie udało się wygenerować obrazu');
    }

    return {
      description: soulDescription,
      imageUrl,
      spiritAnimal,
      style: styleId
    };
  } catch (error) {
    console.error('Błąd podczas generowania portretu:', error);
    throw error;
  }
}

export async function generateSoulImage(imagePrompt: string, style: ArtStyle): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY nie jest skonfigurowany');
  }

  const openai = new OpenAI({ apiKey });
  
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
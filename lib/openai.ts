import OpenAI from 'openai';
import { BirthData } from './validations';
import { OPENAI_ASSISTANT_ID, ERROR_MESSAGES } from './constants';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePortrait(birthData: BirthData) {
  try {
    // Tworzymy nowy wątek
    const thread = await openai.beta.threads.create();

    // Dodajemy wiadomość do wątku z danymi urodzenia
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: `Proszę o głęboką analizę kabalistyczną i numerologiczną, która ujawni prawdziwą esencję duszy. Odpowiedź powinna być w formacie JSON z następującymi sekcjami:

{
  "treeOfLife": {
    "sefira": "nazwa sefiry",
    "description": "szczegółowy opis pozycji na Drzewie Życia",
    "attributes": ["lista atrybutów"],
    "challenges": ["lista wyzwań"]
  },
  "lifeNumber": {
    "number": liczba,
    "meaning": "znaczenie liczby życia",
    "strengths": ["lista mocnych stron"],
    "weaknesses": ["lista obszarów do rozwoju"]
  },
  "passionPath": {
    "name": "nazwa ścieżki",
    "description": "opis ścieżki pasji",
    "spiritualGifts": ["lista darów duchowych"],
    "mission": "misja życiowa"
  },
  "painPath": {
    "name": "nazwa ścieżki",
    "description": "opis ścieżki bólu",
    "lessons": ["lista lekcji"],
    "healing": "proces uzdrawiania"
  },
  "soulPurpose": "główny cel duszy",
  "spiritualGifts": ["lista darów duchowych"],
  "karmicLessons": ["lista lekcji karmicznych"],
  "divineProtection": "opis boskiej ochrony",
  "spiritAnimal": {
    "name": "nazwa zwierzęcia duchowego",
    "description": "szczegółowy opis zwierzęcia i jego znaczenia",
    "symbolism": ["lista symboli i znaczeń"],
    "guidance": "przewodnictwo i wskazówki od zwierzęcia"
  }
}

Dane do analizy:
Imię: ${birthData.firstName}
Nazwisko: ${birthData.lastName}
Data urodzenia: ${birthData.birthDate}
Godzina urodzenia: ${birthData.birthTime}
Miejsce urodzenia: ${birthData.birthPlace}

Proszę o interpretację, która:
1. Ujawni głęboką mądrość kabalistyczną
2. Pomoże zrozumieć duchową ścieżkę
3. Wskaże potencjał i wyzwania
4. Oferuje praktyczne wskazówki do rozwoju
5. Ujawni boską ochronę i wsparcie
6. Zidentyfikuje i opisze zwierzę duchowe, które towarzyszy tej duszy`
    });

    // Uruchamiamy asystenta
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: OPENAI_ASSISTANT_ID,
    });

    // Czekamy na zakończenie analizy
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    let retryCount = 0;
    const maxRetries = 3;
    
    while (true) {
      if (runStatus.status === 'completed') {
        break;
      }
      
      if (runStatus.status === 'failed') {
        console.log('Szczegóły błędu asystenta:', {
          status: runStatus.status,
          error: runStatus.last_error,
          threadId: thread.id,
          runId: run.id
        });
        
        if (retryCount < maxRetries) {
          console.log(`Próba ponownego uruchomienia (${retryCount + 1}/${maxRetries})...`);
          retryCount++;
          // Czekamy 2 sekundy przed ponowną próbą
          await new Promise(resolve => setTimeout(resolve, 2000));
          // Tworzymy nowy run
          const newRun = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: OPENAI_ASSISTANT_ID,
          });
          run.id = newRun.id;
          runStatus = newRun;
          continue;
        }
        
        throw new Error(ERROR_MESSAGES.UNEXPECTED);
      }
      
      if (runStatus.status === 'expired') {
        throw new Error(ERROR_MESSAGES.RATE_LIMIT);
      }
      
      if (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        console.log('Status asystenta:', runStatus.status);
        continue;
      }
      
      // Dla innych statusów
      console.log('Nieoczekiwany status asystenta:', {
        status: runStatus.status,
        threadId: thread.id,
        runId: run.id
      });
      throw new Error(ERROR_MESSAGES.GENERIC);
    }

    // Pobieramy wyniki
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];

    if (!lastMessage || !lastMessage.content[0]) {
      throw new Error(ERROR_MESSAGES.UNEXPECTED);
    }

    // Sprawdzamy, czy zawartość to tekst
    const content = lastMessage.content[0];
    if (content.type !== 'text') {
      throw new Error(ERROR_MESSAGES.UNEXPECTED);
    }

    const analysis = content.text.value;

    // Parsujemy odpowiedź asystenta z formatu JSON
    let kabalisticInterpretation;
    try {
      kabalisticInterpretation = JSON.parse(analysis);
    } catch (error) {
      console.error('Błąd parsowania JSON:', error);
      throw new Error(ERROR_MESSAGES.UNEXPECTED);
    }

    // Generujemy obraz na podstawie analizy
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a mystical portrait inspired by Kabbalah and sacred geometry. The image should feature flowing light patterns, geometric shapes, and ethereal colors. Use deep purples, rich blues, and golden accents. The composition should be abstract and artistic, with a focus on spiritual symbolism. The overall mood should be mystical and contemplative.`,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    });

    const imageUrl = imageResponse.data[0]?.url;
    if (!imageUrl) {
      throw new Error(ERROR_MESSAGES.GENERIC);
    }

    return {
      analysis: kabalisticInterpretation,
      imageUrl,
      birthData,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Zakłócenie energii:', error);
    
    // Sprawdzamy, czy błąd jest związany z brakiem środków
    if (error instanceof Error && 
        (error.message.includes('insufficient_quota') || 
         error.message.includes('billing_hard_limit_reached') ||
         error.message.includes('access_terminated'))) {
      throw new Error(ERROR_MESSAGES.INSUFFICIENT_FUNDS);
    }
    
    // Jeśli to jeden z naszych komunikatów, przekazujemy go dalej
    if (error instanceof Error && Object.values(ERROR_MESSAGES).includes(error.message)) {
      throw error;
    }
    
    // Dla wszystkich innych błędów zwracamy ogólny komunikat
    throw new Error(ERROR_MESSAGES.GENERIC);
  }
} 
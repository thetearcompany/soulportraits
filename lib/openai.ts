import OpenAI from 'openai';
import { BirthData } from './validations';
import { OPENAI_ASSISTANT_ID, ERROR_MESSAGES } from './constants';
import { SavedPortrait } from '@/types/portrait';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SPIRIT_ANIMALS = [
  { pl: 'Wilk', en: 'Wolf' },
  { pl: 'Orzeł', en: 'Eagle' },
  { pl: 'Niedźwiedź', en: 'Bear' },
  { pl: 'Sowa', en: 'Owl' },
  { pl: 'Jeleń', en: 'Deer' },
  { pl: 'Lis', en: 'Fox' },
  { pl: 'Tygrys', en: 'Tiger' },
  { pl: 'Puma', en: 'Puma' },
  { pl: 'Sokół', en: 'Falcon' },
  { pl: 'Delfin', en: 'Dolphin' },
  { pl: 'Żuraw', en: 'Crane' },
  { pl: 'Wąż', en: 'Snake' },
  { pl: 'Bóbr', en: 'Beaver' },
  { pl: 'Kruk', en: 'Raven' },
  { pl: 'Motyl', en: 'Butterfly' },
  { pl: 'Wiewiórka', en: 'Squirrel' },
  { pl: 'Lew', en: 'Lion' },
  { pl: 'Słoń', en: 'Elephant' },
  { pl: 'Koń', en: 'Horse' },
  { pl: 'Żółw', en: 'Turtle' }
];

export async function generatePortrait(birthData: BirthData): Promise<Omit<SavedPortrait, 'id' | 'createdAt'>> {
  const spiritAnimal = SPIRIT_ANIMALS[Math.floor(Math.random() * SPIRIT_ANIMALS.length)];
  
  return {
    firstName: birthData.firstName,
    lastName: birthData.lastName,
    birthDate: birthData.birthDate,
    birthPlace: birthData.birthPlace,
    spiritAnimal: {
      name: spiritAnimal.pl,
      description: `${spiritAnimal.pl} jest twoim duchowym przewodnikiem. To potężne zwierzę symbolizuje mądrość, siłę i intuicję.`,
      traits: ['Mądrość', 'Siła', 'Intuicja', 'Odwaga'],
      image: {
        url: '',  // To zostanie uzupełnione przez API endpoint
        photographer: {
          name: '',
          username: ''
        },
        unsplashUrl: ''
      },
      symbolism: ['Symbol 1', 'Symbol 2'],
      guidance: 'Przewodnictwo i wskazówki od zwierzęcia'
    },
    numerology: {
      lifePathNumber: Math.floor(Math.random() * 9) + 1,
      description: 'Twoja liczba życia wskazuje na silne połączenie z duchowym przewodnictwem.'
    },
    chakras: {
      dominant: 'Ajna (Trzecie Oko)',
      description: 'Twoja dominująca czakra wskazuje na silną intuicję i zdolności percepcyjne.'
    },
    advice: 'Podążaj za głosem swojego serca i ufaj swojej intuicji. Twoje duchowe przewodnictwo jest zawsze z tobą.',
    analysis: {
      treeOfLife: {
        sefira: 'Keter',
        description: 'Opis pozycji na Drzewie Życia',
        attributes: ['Atrybut 1', 'Atrybut 2'],
        challenges: ['Wyzwanie 1', 'Wyzwanie 2']
      },
      lifeNumber: {
        number: 7,
        meaning: 'Znaczenie liczby życia',
        strengths: ['Mocna Strona 1', 'Mocna Strona 2'],
        weaknesses: ['Obszar Rozwoju 1', 'Obszar Rozwoju 2']
      },
      passionPath: {
        name: 'Ścieżka Pasji',
        description: 'Opis ścieżki pasji',
        spiritualGifts: ['Dar Duchowy 1', 'Dar Duchowy 2'],
        mission: 'Misja życiowa'
      },
      painPath: {
        name: 'Ścieżka Bólu',
        description: 'Opis ścieżki bólu',
        lessons: ['Lekcja 1', 'Lekcja 2'],
        healing: {
          methods: ['Metoda 1', 'Metoda 2'],
          mantra: 'Mantra uzdrawiająca'
        }
      },
      soulPurpose: 'Główny cel duszy',
      spiritualGifts: ['Dar Duchowy 1', 'Dar Duchowy 2'],
      karmicLessons: ['Lekcja Karmiczna 1', 'Lekcja Karmiczna 2'],
      divineProtection: 'Opis boskiej ochrony',
      spiritAnimal: {
        name: spiritAnimal.pl,
        description: `${spiritAnimal.pl} jest twoim duchowym przewodnikiem.`,
        symbolism: ['Symbol 1', 'Symbol 2'],
        guidance: 'Przewodnictwo i wskazówki od zwierzęcia'
      },
      guardianAngel: {
        name: 'Anioł Stróż',
        description: 'Opis Anioła Stróża'
      }
    }
  };
}

export async function generatePortraitFromOpenAI(birthData: BirthData) {
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

    // Logowanie odpowiedzi
    console.log('Odpowiedź OpenAI:', kabalisticInterpretation);

    // Walidacja obecności zwierzęcia duchowego
    if (!kabalisticInterpretation.spiritAnimal || !kabalisticInterpretation.spiritAnimal.name) {
      throw new Error('Brak zwierzęcia duchowego w odpowiedzi');
    }

    // Pobieranie obrazu z Unsplash
    const spiritAnimalName = kabalisticInterpretation.spiritAnimal.name;
    const unsplashResponse = await fetch(`https://api.unsplash.com/photos/random?query=${spiritAnimalName}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`);
    const unsplashData = await unsplashResponse.json();

    if (!unsplashData || !unsplashData.urls || !unsplashData.urls.regular) {
      throw new Error('Nie udało się pobrać obrazu z Unsplash');
    }

    const imageUrl = unsplashData.urls.regular;

    // Dodanie obrazu do zwierzęcia duchowego
    kabalisticInterpretation.spiritAnimal.image = {
      url: imageUrl,
      photographer: {
        name: unsplashData.user.name,
        username: unsplashData.user.username,
      },
      unsplashUrl: unsplashData.links.html,
    };

    return {
      analysis: kabalisticInterpretation,
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
import { NextResponse } from 'next/server';
import { generatePortraitFromOpenAI } from '@/lib/openai';
import { birthDataSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import { SavedPortrait } from '@/types/portrait';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Walidacja danych wejściowych
    const validatedData = birthDataSchema.parse(body);

    // Generowanie portretu z OpenAI
    const portrait = await generatePortraitFromOpenAI(validatedData);

    // Dodanie informacji o zdjęciu do portretu
    const portraitWithImage: SavedPortrait = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      firstName: portrait.birthData.firstName,
      lastName: portrait.birthData.lastName,
      birthDate: portrait.birthData.birthDate,
      birthPlace: portrait.birthData.birthPlace,
      spiritAnimal: portrait.analysis.spiritAnimal,
      numerology: portrait.analysis.numerology,
      chakras: portrait.analysis.chakras,
      advice: portrait.analysis.advice,
      analysis: portrait.analysis
    };

    return NextResponse.json(portraitWithImage);
  } catch (error) {
    console.error('Błąd API:', error);

    if (error instanceof ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      return NextResponse.json(
        { error: 'Nieprawidłowe dane', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Wystąpił błąd podczas generowania portretu' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import { generatePortrait } from '@/lib/openai';
import { birthDataSchema } from '@/lib/validations';
import { ZodError } from 'zod';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Walidacja danych wejściowych
    const validatedData = birthDataSchema.parse(body);

    const result = await generatePortrait(validatedData);

    return NextResponse.json(result);
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
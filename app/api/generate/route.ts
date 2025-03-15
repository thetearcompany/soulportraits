import { NextResponse } from 'next/server';
import { generatePortrait } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { description, style } = await request.json();

    if (!description || !style) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych' },
        { status: 400 }
      );
    }

    const result = await generatePortrait(description, style);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Błąd API:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas generowania portretu' },
      { status: 500 }
    );
  }
} 
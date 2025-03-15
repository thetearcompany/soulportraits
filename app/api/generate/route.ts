import { NextResponse } from 'next/server';
import { generateSoulPortrait, generateSoulImage } from '@/lib/openai';
import { artStyles } from '@/types/styles';

export async function POST(request: Request) {
  try {
    const { description, style } = await request.json();
    const selectedStyle = artStyles.find(s => s.id === style) || artStyles[0];
    
    const soulPortrait = await generateSoulPortrait(description);
    const imageUrl = await generateSoulImage(soulPortrait.imagePrompt, selectedStyle);

    return NextResponse.json({
      description: soulPortrait.description,
      imageUrl,
      style: selectedStyle,
      spiritAnimal: soulPortrait.spiritAnimal
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
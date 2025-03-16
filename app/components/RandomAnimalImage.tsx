'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface UnsplashImage {
  urls: {
    regular: string;
  };
  user: {
    name: string;
    username: string;
  };
}

export function RandomAnimalImage() {
  const [imageData, setImageData] = useState<UnsplashImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomAnimalImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=spiritual+animal&orientation=landscape&content_filter=high`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Nie udało się pobrać obrazka');
      }

      const data = await response.json();
      setImageData(data);
      setError(null);
    } catch (err) {
      console.error('Błąd podczas pobierania obrazka:', err);
      setError('Nie udało się załadować obrazka');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomAnimalImage();
  }, []);

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-destructive mb-2">{error}</p>
        <button
          onClick={fetchRandomAnimalImage}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Spróbuj ponownie
        </button>
      </div>
    );
  }

  if (isLoading || !imageData) {
    return (
      <div className="w-full aspect-[16/9] bg-muted animate-pulse rounded-lg" />
    );
  }

  return (
    <div className="relative group">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-lg">
        <Image
          src={imageData.urls.regular}
          alt="Duchowy przewodnik"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/40 to-transparent" />
        
        {/* Przycisk odświeżania */}
        <button
          onClick={fetchRandomAnimalImage}
          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
          title="Pokaż inne zdjęcie"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin-slow"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>
      
      {/* Informacja o autorze */}
      <div className="absolute bottom-2 right-2 text-xs text-primary-foreground opacity-75 hover:opacity-100 transition-opacity">
        <a
          href={`https://unsplash.com/@${imageData.user.username}?utm_source=soul_portrait&utm_medium=referral`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Foto: {imageData.user.name}
        </a>
      </div>
    </div>
  );
} 
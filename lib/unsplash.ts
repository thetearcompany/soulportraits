export interface UnsplashImage {
  urls: {
    regular: string;
  };
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

export async function getAnimalImage(animalType: string): Promise<UnsplashImage> {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?query=${encodeURIComponent(animalType)}&orientation=landscape&content_filter=high`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Nie udało się pobrać zdjęcia zwierzęcia duchowego');
  }

  return response.json();
} 
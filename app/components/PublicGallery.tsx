import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SavedPortrait } from '@/types/portrait';
import { ArtStyle } from '@/types/styles';

interface PublicGalleryProps {
  artStyles: ArtStyle[];
  onSelect?: (portrait: SavedPortrait) => void;
}

export const PublicGallery: React.FC<PublicGalleryProps> = ({ artStyles, onSelect }) => {
  const [portraits, setPortraits] = useState<SavedPortrait[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<string>('all');

  useEffect(() => {
    const fetchPortraits = async () => {
      setLoading(true);
      try {
        // Symulacja opóźnienia API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Tutaj będzie prawdziwe wywołanie API
        const mockPortraits: SavedPortrait[] = [
          // Przykładowe dane...
        ];
        
        setPortraits(mockPortraits);
      } catch (error) {
        console.error('Błąd podczas pobierania portretów:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortraits();
  }, []);

  const filteredPortraits = selectedStyle === 'all'
    ? portraits
    : portraits.filter(portrait => portrait.style.id === selectedStyle);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Galeria Publiczna</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStyle('all')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedStyle === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Wszystkie
          </button>
          {artStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                selectedStyle === style.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {filteredPortraits.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500">
            Brak portretów w wybranej kategorii.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortraits.map((portrait) => (
            <div
              key={portrait.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              onClick={() => onSelect?.(portrait)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={portrait.imageUrl}
                  alt={`Portret w stylu ${portrait.style.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{portrait.style.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {portrait.description}
                </p>
                <div className="bg-indigo-50 p-2 rounded">
                  <p className="text-sm text-indigo-800 font-medium">
                    Duchowe Zwierzę: {portrait.spiritAnimal.name}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(portrait.createdAt).toLocaleDateString('pl-PL')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 
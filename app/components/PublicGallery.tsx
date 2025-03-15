import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SavedPortrait } from '@/types/portrait';

interface PublicGalleryProps {
  onSelect?: (portrait: SavedPortrait) => void;
}

export const PublicGallery: React.FC<PublicGalleryProps> = ({ onSelect }) => {
  const [portraits, setPortraits] = useState<SavedPortrait[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortraits = async () => {
      setLoading(true);
      try {
        // Symulacja opóźnienia API
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Tutaj będzie prawdziwe wywołanie API
        const mockPortraits: SavedPortrait[] = [
          // Przykładowe dane będą dodane później
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
      </div>

      {portraits.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500">
            Brak portretów w galerii.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portraits.map((portrait) => (
            <div
              key={portrait.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              onClick={() => onSelect?.(portrait)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={portrait.imageUrl || 'https://api.dicebear.com/7.x/3d-avatars/svg?seed=' + portrait.id}
                  alt={`Portret duszy dla ${portrait.birthData.firstName} ${portrait.birthData.lastName}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  {portrait.birthData.firstName} {portrait.birthData.lastName}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {portrait.analysis.soulPurpose}
                </p>
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
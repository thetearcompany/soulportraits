import { useState, useEffect } from 'react';
import { SavedPortrait } from '@/types/portrait';
import { artStyles } from '@/types/styles';

interface PublicGalleryProps {
  onSelect: (portrait: SavedPortrait) => void;
}

export const PublicGallery: React.FC<PublicGalleryProps> = ({ onSelect }) => {
  const [portraits, setPortraits] = useState<SavedPortrait[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortraits = async () => {
      setIsLoading(true);
      try {
        // TODO: Zastąpić prawdziwym wywołaniem API
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Przykładowe dane
        setPortraits([]);
      } catch (error) {
        console.error('Błąd podczas ładowania galerii:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortraits();
  }, []);

  const filteredPortraits = selectedStyle
    ? portraits.filter(p => p.style.id === selectedStyle)
    : portraits;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStyle(null)}
          className={`px-3 py-1 rounded-full text-sm ${
            selectedStyle === null
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Wszystkie
        </button>
        {artStyles.map(style => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedStyle === style.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {style.name}
          </button>
        ))}
      </div>

      {filteredPortraits.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>Brak portretów w wybranej kategorii.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortraits.map((portrait) => (
            <div
              key={portrait.id}
              onClick={() => onSelect(portrait)}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 cursor-pointer"
            >
              <img
                src={portrait.imageUrl}
                alt="Portret Duszy"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full mb-2">
                  {portrait.style.name}
                </span>
                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {portrait.description}
                </p>
                <div className="bg-indigo-50 p-2 rounded mb-2">
                  <p className="text-indigo-800 text-sm font-medium">
                    Duchowe zwierzę: {portrait.spiritAnimal.name}
                  </p>
                </div>
                <p className="text-gray-500 text-xs">
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
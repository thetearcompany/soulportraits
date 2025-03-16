import Image from 'next/image';
import { SavedPortrait } from '@/types/portrait';

interface PortraitHistoryProps {
  portraits: SavedPortrait[];
  onDelete: (id: string) => void;
  onClearAll: () => void;
  onSelect: (portrait: SavedPortrait) => void;
}

export const PortraitHistory: React.FC<PortraitHistoryProps> = ({
  portraits,
  onDelete,
  onClearAll,
  onSelect,
}) => {
  if (portraits.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Twoja historia portretów jest pusta.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Historia Portretów</h2>
        <button
          onClick={onClearAll}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Wyczyść historię
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portraits.map((portrait) => (
          <div
            key={portrait.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
          >
            <div className="relative aspect-square w-full">
              {portrait.spiritAnimal?.image?.url && (
                <Image
                  src={portrait.spiritAnimal.image.url}
                  alt={`Portret duszy i duchowego zwierzęcia`}
                  fill
                  className="object-cover cursor-pointer"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  onClick={() => onSelect(portrait)}
                />
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(portrait.createdAt).toLocaleDateString('pl-PL')}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(portrait.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {portrait.analysis?.soulPurpose || 'Brak opisu celu duszy'}
                </p>
              </div>
              {portrait.analysis?.spiritAnimal && (
                <div className="mt-2 p-2 bg-purple-50 rounded">
                  <p className="text-sm text-purple-800 font-medium">
                    🦊 {portrait.analysis.spiritAnimal.name || 'Nie określono'}
                  </p>
                </div>
              )}
              <div className="mt-2 p-2 bg-indigo-50 rounded">
                <p className="text-sm text-indigo-800 font-medium">
                  {portrait.firstName || 'Nieznane imię'} {portrait.lastName || 'Nieznane nazwisko'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 
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
      <div className="text-center text-gray-500 py-8">
        <p>Twoja historia portretów jest pusta.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Historia Portretów</h2>
        <button
          onClick={onClearAll}
          className="text-red-600 hover:text-red-700 transition-colors duration-200"
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
            <img
              src={portrait.imageUrl}
              alt="Portret Duszy"
              className="w-full h-48 object-cover cursor-pointer"
              onClick={() => onSelect(portrait)}
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                  {portrait.style.name}
                </span>
                <button
                  onClick={() => onDelete(portrait.id)}
                  className="text-red-500 hover:text-red-600"
                  aria-label="Usuń portret"
                >
                  ✕
                </button>
              </div>
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
    </div>
  );
}; 
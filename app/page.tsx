'use client';

import { useState } from 'react';
import { usePortraitHistory } from '@/lib/hooks/usePortraitHistory';
import { PortraitHistory } from '@/app/components/PortraitHistory';
import { PublicGallery } from '@/app/components/PublicGallery';
import { SoulPortraitResult } from '@/app/components/SoulPortraitResult';
import { SavedPortrait } from '@/types/portrait';
import { artStyles } from '@/types/styles';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState(artStyles[0]);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<SavedPortrait | null>(null);
  const [view, setView] = useState<'create' | 'history' | 'gallery'>('create');
  const { portraits, savePortrait, deletePortrait, clearHistory } = usePortraitHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, style: selectedStyle.id }),
      });

      if (!response.ok) throw new Error('Błąd generowania portretu');

      const data = await response.json();
      const savedPortrait = savePortrait({
        description: data.description,
        imageUrl: data.imageUrl,
        style: data.style,
        spiritAnimal: data.spiritAnimal
      });

      setResult(savedPortrait);
    } catch (error) {
      console.error('Błąd:', error);
      alert('Wystąpił błąd podczas generowania portretu. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setDescription('');
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">
            Portret Twojej Duszy
          </h1>
          <p className="text-xl text-gray-600">
            Odkryj głębię swojej duszy i poznaj swoje duchowe zwierzę
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setView('create')}
            className={`px-4 py-2 rounded-lg ${
              view === 'create'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Stwórz Nowy
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 rounded-lg ${
              view === 'history'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Historia
          </button>
          <button
            onClick={() => setView('gallery')}
            className={`px-4 py-2 rounded-lg ${
              view === 'gallery'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Galeria
          </button>
        </div>

        {view === 'create' && !result && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
                  Wybierz styl portretu
                </label>
                <select
                  id="style"
                  value={selectedStyle.id}
                  onChange={(e) => setSelectedStyle(artStyles.find(s => s.id === e.target.value) || artStyles[0])}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {artStyles.map(style => (
                    <option key={style.id} value={style.id}>
                      {style.name} - {style.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Opisz siebie lub osobę, której portret chcesz stworzyć
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Opisz charakter, zainteresowania, marzenia, emocje..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-lg text-white transition-colors duration-200 ${
                  isLoading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isLoading ? 'Generowanie...' : 'Stwórz Portret Duszy'}
              </button>
            </form>
          </div>
        )}

        {view === 'create' && result && (
          <SoulPortraitResult portrait={result} onReset={resetForm} />
        )}

        {view === 'history' && (
          <PortraitHistory
            portraits={portraits}
            onDelete={deletePortrait}
            onClearAll={clearHistory}
            onSelect={setResult}
          />
        )}

        {view === 'gallery' && (
          <PublicGallery onSelect={setResult} />
        )}
      </div>
    </main>
  );
}

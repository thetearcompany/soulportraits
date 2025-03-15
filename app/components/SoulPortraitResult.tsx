import { useRef } from 'react';
import Image from 'next/image';
import { generatePortraitPDF } from '@/lib/pdf';
import { SavedPortrait } from '@/types/portrait';

interface SoulPortraitResultProps {
  portrait: SavedPortrait;
  onReset: () => void;
}

export const SoulPortraitResult: React.FC<SoulPortraitResultProps> = ({ portrait, onReset }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleShare = async (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const text = encodeURIComponent('Odkryj swój Kabalistyczny Portret Duszy! 🔯✨');
    const url = encodeURIComponent(window.location.href);
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const handleDownload = async () => {
    if (!portrait.imageUrl) return;
    
    try {
      const response = await fetch(portrait.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portret-duszy.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Błąd podczas pobierania obrazu:', error);
    }
  };

  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    try {
      await generatePortraitPDF(portrait, contentRef.current);
    } catch (error) {
      console.error('Błąd podczas generowania PDF:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-600 mb-2">Twój Kabalistyczny Portret Duszy</h2>
        <p className="text-gray-600">
          {portrait.birthData.firstName} {portrait.birthData.lastName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="relative aspect-square w-full">
          <Image
            src={portrait.imageUrl}
            alt="Kabalistyczny Portret Duszy"
            fill
            className="rounded-lg shadow-lg object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-indigo-800 mb-2">
              Dane Numerologiczne
            </h3>
            <div className="space-y-2 text-indigo-700">
              <p>Data urodzenia: {new Date(portrait.birthData.birthDate).toLocaleDateString('pl-PL')}</p>
              <p>Godzina urodzenia: {portrait.birthData.birthTime}</p>
              <p>Miejsce urodzenia: {portrait.birthData.birthPlace}</p>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-2xl font-semibold text-purple-800 mb-4 text-center">
              Portret Twojej Duszy
            </h3>
            
            <div className="space-y-6 text-purple-700">
              {/* Cel Duszy */}
              <div className="text-center mb-6">
                <h4 className="text-xl font-medium mb-2">Cel Twojej Duszy</h4>
                <p className="italic">{portrait.analysis.soulPurpose}</p>
              </div>

              {/* Drzewo Życia */}
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Drzewo Życia - Sefira {portrait.analysis.treeOfLife.sefira}</h4>
                <p className="mb-3">{portrait.analysis.treeOfLife.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Atrybuty</h5>
                    <ul className="list-disc list-inside">
                      {portrait.analysis.treeOfLife.attributes.map((attr, i) => (
                        <li key={i}>{attr}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Wyzwania</h5>
                    <ul className="list-disc list-inside">
                      {portrait.analysis.treeOfLife.challenges.map((challenge, i) => (
                        <li key={i}>{challenge}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Liczba Życia */}
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Liczba Życia: {portrait.analysis.lifeNumber.number}</h4>
                <p className="mb-3">{portrait.analysis.lifeNumber.meaning}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium mb-2">Mocne Strony</h5>
                    <ul className="list-disc list-inside">
                      {portrait.analysis.lifeNumber.strengths.map((strength, i) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Obszary Rozwoju</h5>
                    <ul className="list-disc list-inside">
                      {portrait.analysis.lifeNumber.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ścieżka Pasji */}
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Ścieżka Pasji: {portrait.analysis.passionPath.name}</h4>
                <p className="mb-3">{portrait.analysis.passionPath.description}</p>
                <div>
                  <h5 className="font-medium mb-2">Dary Duchowe</h5>
                  <ul className="list-disc list-inside">
                    {portrait.analysis.passionPath.spiritualGifts.map((gift, i) => (
                      <li key={i}>{gift}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <h5 className="font-medium mb-2">Misja</h5>
                  <p className="italic">{portrait.analysis.passionPath.mission}</p>
                </div>
              </div>

              {/* Ścieżka Bólu */}
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Ścieżka Bólu: {portrait.analysis.painPath.name}</h4>
                <p className="mb-3">{portrait.analysis.painPath.description}</p>
                <div>
                  <h5 className="font-medium mb-2">Lekcje</h5>
                  <ul className="list-disc list-inside">
                    {portrait.analysis.painPath.lessons.map((lesson, i) => (
                      <li key={i}>{lesson}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <h5 className="font-medium mb-2">Uzdrawianie</h5>
                  <p className="italic">{portrait.analysis.painPath.healing}</p>
                </div>
              </div>

              {/* Dary Duchowe */}
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Dary Duchowe</h4>
                <ul className="list-disc list-inside">
                  {portrait.analysis.spiritualGifts.map((gift, i) => (
                    <li key={i}>{gift}</li>
                  ))}
                </ul>
              </div>

              {/* Lekcje Karmiczne */}
              <div className="bg-white/50 p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-3">Lekcje Karmiczne</h4>
                <ul className="list-disc list-inside">
                  {portrait.analysis.karmicLessons.map((lesson, i) => (
                    <li key={i}>{lesson}</li>
                  ))}
                </ul>
              </div>

              {/* Boska Ochrona */}
              <div className="text-center mt-6">
                <h4 className="text-lg font-medium mb-2">Boska Ochrona</h4>
                <p className="italic">{portrait.analysis.divineProtection}</p>
              </div>

              {/* Zwierzę Duchowe */}
              <div className="bg-white/50 p-4 rounded-lg mt-6">
                <h4 className="text-lg font-medium mb-3 text-center">
                  Twoje Zwierzę Duchowe: {portrait.analysis.spiritAnimal.name}
                </h4>
                <p className="mb-3 text-center italic">{portrait.analysis.spiritAnimal.description}</p>
                <div>
                  <h5 className="font-medium mb-2">Symbolika</h5>
                  <ul className="list-disc list-inside">
                    {portrait.analysis.spiritAnimal.symbolism.map((symbol, i) => (
                      <li key={i}>{symbol}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3">
                  <h5 className="font-medium mb-2">Przewodnictwo</h5>
                  <p className="italic">{portrait.analysis.spiritAnimal.guidance}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Pobierz Obraz
          </button>
          <button
            onClick={handleExportPDF}
            className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Eksportuj PDF
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleShare('facebook')}
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Facebook
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className="py-2 px-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors duration-200"
          >
            Twitter
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className="py-2 px-4 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200"
          >
            LinkedIn
          </button>
        </div>
      </div>

      <button
        onClick={onReset}
        className="mt-6 w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        Stwórz nowy portret
      </button>
    </div>
  );
}; 
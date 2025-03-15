import { useRef } from 'react';
import Image from 'next/image';
import { generatePortraitPDF } from '@/lib/pdf';

interface SoulPortraitResultProps {
  portrait: {
    description: string;
    imageUrl: string;
    style: {
      name: string;
    };
    spiritAnimal: {
      name: string;
      description: string;
    };
    createdAt: string;
  };
  onReset: () => void;
}

export const SoulPortraitResult: React.FC<SoulPortraitResultProps> = ({ portrait, onReset }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleShare = async (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const text = encodeURIComponent('Odkryj swój Portret Duszy i poznaj swoje duchowe zwierzę! 🎨✨🦋');
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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" ref={contentRef}>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Twój Portret Duszy</h1>
        <p className="text-gray-600">Styl: {portrait.style.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="relative aspect-square w-full">
          <Image
            src={portrait.imageUrl}
            alt="Portret Duszy"
            fill
            className="rounded-lg shadow-lg object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Opis Twojej Duszy</h2>
            <p className="text-gray-600 whitespace-pre-wrap mb-6">{portrait.description}</p>
            
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                Twoje Duchowe Zwierzę: {portrait.spiritAnimal.name}
              </h3>
              <p className="text-indigo-600">{portrait.spiritAnimal.description}</p>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Wygenerowano: {new Date(portrait.createdAt).toLocaleDateString('pl-PL')}
            </p>
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
        className="mt-4 w-full py-2 px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200"
      >
        Stwórz nowy portret
      </button>
    </div>
  );
}; 
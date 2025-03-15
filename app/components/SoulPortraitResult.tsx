import { useEffect, useState } from 'react';
import Image from 'next/image';
import { SavedPortrait } from '@/types/portrait';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';

interface SoulPortraitResultProps {
  portrait: SavedPortrait;
  onReset: () => void;
}

export const SoulPortraitResult: React.FC<SoulPortraitResultProps> = ({ portrait, onReset }) => {
  const { savePortrait } = useStore();
  const [isDuplicate, setIsDuplicate] = useState(false);

  useEffect(() => {
    const savePortraitWithCheck = async () => {
      try {
        await savePortrait(portrait);
      } catch (error) {
        if (error instanceof Error && error.message.includes('Portret już istnieje')) {
          setIsDuplicate(true);
        }
      }
    };
    savePortraitWithCheck();
  }, [portrait, savePortrait]);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20"
    >
      <AnimatePresence>
        {isDuplicate && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-yellow-50/80 backdrop-blur-sm border border-yellow-200/50 rounded-xl"
          >
            <p className="text-yellow-800">
              Ten portret już istnieje w Twojej historii. Możesz go znaleźć w sekcji &ldquo;Historia Portretów&rdquo;.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold text-indigo-600 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Twój Kabalistyczny Portret Duszy
        </h2>
        <p className="text-gray-600 text-lg">
          {portrait.birthData.firstName} {portrait.birthData.lastName}
        </p>
      </motion.div>

      <div className="flex flex-col gap-6">
        {portrait.imageUrl && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src={portrait.imageUrl}
              alt="Kabalistyczny Portret Duszy"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        )}

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-indigo-50/80 backdrop-blur-sm p-6 rounded-xl border border-indigo-100/50"
          >
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">
              Dane Numerologiczne
            </h3>
            <div className="space-y-3 text-indigo-700">
              <p className="flex items-center gap-2">
                <span className="text-indigo-500">📅</span>
                Data urodzenia: {new Date(portrait.birthData.birthDate).toLocaleDateString('pl-PL')}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-indigo-500">📍</span>
                Miejsce urodzenia: {portrait.birthData.birthPlace}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-purple-50/80 backdrop-blur-sm p-8 rounded-xl border border-purple-100/50"
          >
            <h3 className="text-3xl font-semibold text-purple-800 mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Portret Twojej Duszy
            </h3>
            
            <div className="space-y-8 text-purple-700">
              {/* Cel Duszy */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center mb-8"
              >
                <h4 className="text-2xl font-medium mb-3">Cel Twojej Duszy</h4>
                <p className="italic text-lg">{portrait.analysis.soulPurpose}</p>
              </motion.div>

              {/* Drzewo Życia */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-white/50"
              >
                <h4 className="text-xl font-medium mb-4">Drzewo Życia - Sefira {portrait.analysis.treeOfLife?.sefira}</h4>
                <p className="mb-4">{portrait.analysis.treeOfLife?.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3">Atrybuty</h5>
                    <ul className="space-y-2">
                      {portrait.analysis.treeOfLife?.attributes?.map((attr, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-purple-500">✨</span>
                          {attr}
                        </li>
                      )) || <li>Brak atrybutów</li>}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-3">Wyzwania</h5>
                    <ul className="space-y-2">
                      {portrait.analysis.treeOfLife?.challenges?.map((challenge, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-purple-500">🎯</span>
                          {challenge}
                        </li>
                      )) || <li>Brak wyzwań</li>}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Liczba Życia */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-white/50"
              >
                <h4 className="text-xl font-medium mb-3">Liczba Życia: {portrait.analysis.lifeNumber?.number}</h4>
                <p className="mb-3">{portrait.analysis.lifeNumber?.meaning}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3">Mocne Strony</h5>
                    <ul className="space-y-2">
                      {portrait.analysis.lifeNumber?.strengths?.map((strength, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-purple-500">💪</span>
                          {strength}
                        </li>
                      )) || <li>Brak mocnych stron</li>}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium mb-2">Obszary Rozwoju</h5>
                    <ul className="list-disc list-inside">
                      {portrait.analysis.lifeNumber?.weaknesses?.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      )) || <li>Brak obszarów rozwoju</li>}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Ścieżka Pasji */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white/50 p-4 rounded-lg"
              >
                <h4 className="text-lg font-medium mb-3">Ścieżka Pasji: {portrait.analysis.passionPath?.name}</h4>
                <p className="mb-3">{portrait.analysis.passionPath?.description}</p>
                <div>
                  <h5 className="font-medium mb-2">Dary Duchowe</h5>
                  <ul className="list-disc list-inside">
                    {portrait.analysis.passionPath?.spiritualGifts?.map((gift, i) => (
                      <li key={i}>{gift}</li>
                    )) || <li>Brak darów duchowych</li>}
                  </ul>
                </div>
                <div className="mt-3">
                  <h5 className="font-medium mb-2">Misja</h5>
                  <p className="italic">{portrait.analysis.passionPath?.mission}</p>
                </div>
              </motion.div>

              {/* Ścieżka Bólu */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white/50 p-4 rounded-lg"
              >
                <h4 className="text-lg font-medium mb-3">Ścieżka Bólu: {portrait.analysis.painPath?.name}</h4>
                <p className="mb-3">{portrait.analysis.painPath?.description}</p>
                <div>
                  <h5 className="font-medium mb-2">Lekcje</h5>
                  <ul className="list-disc list-inside">
                    {portrait.analysis.painPath?.lessons?.map((lesson, i) => (
                      <li key={i}>{lesson}</li>
                    )) || <li>Brak lekcji</li>}
                  </ul>
                </div>
                <div className="mt-3">
                  <h5 className="font-medium mb-2">Uzdrawianie</h5>
                  <p className="italic">{portrait.analysis.painPath?.healing}</p>
                </div>
              </motion.div>

              {/* Dary Duchowe */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-white/50 p-4 rounded-lg"
              >
                <h4 className="text-lg font-medium mb-3">Dary Duchowe</h4>
                <ul className="list-disc list-inside">
                  {portrait.analysis.spiritualGifts?.map((gift, i) => (
                    <li key={i}>{gift}</li>
                  )) || <li>Brak darów duchowych</li>}
                </ul>
              </motion.div>

              {/* Lekcje Karmiczne */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-white/50 p-4 rounded-lg"
              >
                <h4 className="text-lg font-medium mb-3">Lekcje Karmiczne</h4>
                <ul className="list-disc list-inside">
                  {portrait.analysis.karmicLessons?.map((lesson, i) => (
                    <li key={i}>{lesson}</li>
                  )) || <li>Brak lekcji karmicznych</li>}
                </ul>
              </motion.div>

              {/* Boska Ochrona */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="text-center mt-8"
              >
                <h4 className="text-2xl font-medium mb-4">Boska Ochrona</h4>
                <p className="italic text-lg mb-6">{portrait.analysis.divineProtection}</p>
                
                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-white/50">
                  <h5 className="text-xl font-medium mb-3 text-purple-800">Twój Anioł Stróż</h5>
                  <p className="text-2xl font-bold text-indigo-600 mb-2">
                    {portrait.analysis.guardianAngel?.name || 'Nie określono'}
                  </p>
                  {portrait.analysis.guardianAngel?.description && (
                    <p className="text-purple-700 italic">
                      {portrait.analysis.guardianAngel.description}
                    </p>
                  )}
                </div>
              </motion.div>

              {/* Zwierzę Duchowe */}
              {portrait.analysis.spiritAnimal && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="bg-white/50 p-4 rounded-lg mt-6"
                >
                  <h4 className="text-lg font-medium mb-3 text-center">
                    Twoje Zwierzę Duchowe: {portrait.analysis.spiritAnimal.name || 'Nie określono'}
                  </h4>
                  {portrait.analysis.spiritAnimal.description && (
                    <p className="mb-3 text-center italic">{portrait.analysis.spiritAnimal.description}</p>
                  )}
                  {portrait.analysis.spiritAnimal.symbolism && portrait.analysis.spiritAnimal.symbolism.length > 0 && (
                    <div>
                      <h5 className="font-medium mb-2">Symbolika</h5>
                      <ul className="list-disc list-inside">
                        {portrait.analysis.spiritAnimal.symbolism.map((symbol, i) => (
                          <li key={i}>{symbol}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {portrait.analysis.spiritAnimal.guidance && (
                    <div className="mt-3">
                      <h5 className="font-medium mb-2">Przewodnictwo</h5>
                      <p className="italic">{portrait.analysis.spiritAnimal.guidance}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <div className="grid grid-cols-2 gap-2">
          {portrait.imageUrl && (
            <button
              onClick={handleDownload}
              className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Pobierz Obraz
            </button>
          )}
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
    </motion.div>
  );
}; 
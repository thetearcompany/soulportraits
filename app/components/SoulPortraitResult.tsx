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

  return (
    <motion.div 
      id="portrait-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-amber-500/20"
    >
      <div className="absolute inset-0 -z-10 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-amber-700/20" />
        <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-amber-400/10 via-transparent to-amber-500/10" />
      </div>

      <AnimatePresence>
        {isDuplicate && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-amber-100/20 backdrop-blur-sm border border-amber-200/50 rounded-xl"
          >
            <p className="text-amber-900/80">
              Ten portret już istnieje w Twojej historii. Możesz go znaleźć w sekcji &ldquo;Historia Portretów&rdquo;.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400">
          {portrait.firstName} {portrait.lastName}
        </h2>
        <p className="text-amber-600/80 text-lg">Kabalistyczny Portret Duszy</p>
      </motion.div>

      <div className="justify-center mb-12">
        {portrait.generatedImage ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent z-10" />
            <Image
              src={portrait.generatedImage}
              alt="Kabalistyczny Portret Duszy"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
              <p className="text-sm font-medium">Portret Duszy</p>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-amber-500">Generowanie portretu...</p>
          </div>
        )}

        {/* {portrait.spiritAnimal?.image?.url && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-transparent to-transparent z-10" />
            <Image
              src={portrait.spiritAnimal.image.url}
              alt={`Zwierzę Duchowe - ${portrait.spiritAnimal.name}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
              <p className="text-sm font-medium">
                Zwierzę Duchowe: {portrait.spiritAnimal.name}
              </p>
            </div>
          </motion.div>
        )} */}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-8"
      >
        {/* Sekcja Numerologiczna */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-amber-500/20">
          <h3 className="text-3xl font-semibold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
            Twoja Liczba Życia: {portrait.analysis.lifeNumber?.number}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-medium text-amber-400">Znaczenie</h4>
              <p className="text-amber-100/90 leading-relaxed">
                {portrait.analysis.lifeNumber?.meaning}
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-medium text-amber-400 mb-3">Mocne Strony</h4>
                <ul className="space-y-2">
                  {portrait.analysis.lifeNumber?.strengths?.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-amber-100/90">
                      <span className="text-amber-400">✧</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-xl font-medium text-amber-400 mb-3">Wyzwania</h4>
                <ul className="space-y-2">
                  {portrait.analysis.lifeNumber?.weaknesses?.map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2 text-amber-100/90">
                      <span className="text-amber-400">✦</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sekcja Duchowa */}
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-amber-500/20">
          <h3 className="text-3xl font-semibold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600">
            Portret Twojej Duszy
          </h3>
          
          {/* Cel Duszy */}
          <div className="mb-8">
            <h4 className="text-2xl font-medium text-amber-400 mb-4">Cel Duszy</h4>
            <p className="text-amber-100/90 leading-relaxed text-lg">
              {portrait.analysis.soulPurpose}
            </p>
          </div>

          {/* Drzewo Życia */}
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-amber-500/10 mb-8">
            <h4 className="text-2xl font-medium text-amber-400 mb-4">
              Drzewo Życia - Sefira {portrait.analysis.treeOfLife?.sefira}
            </h4>
            <p className="text-amber-100/90 mb-6 leading-relaxed">
              {portrait.analysis.treeOfLife?.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-xl font-medium text-amber-400 mb-3">Atrybuty</h5>
                <ul className="space-y-2">
                  {portrait.analysis.treeOfLife?.attributes?.map((attr, i) => (
                    <li key={i} className="flex items-start gap-2 text-amber-100/90">
                      <span className="text-amber-400">✧</span>
                      {attr}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-xl font-medium text-amber-400 mb-3">Wyzwania</h5>
                <ul className="space-y-2">
                  {portrait.analysis.treeOfLife?.challenges?.map((challenge, i) => (
                    <li key={i} className="flex items-start gap-2 text-amber-100/90">
                      <span className="text-amber-400">✦</span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Ścieżki */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ścieżka Pasji */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-medium text-amber-400 mb-4">
                Ścieżka Pasji
              </h4>
              <p className="text-amber-100/90 mb-4 leading-relaxed">
                {portrait.analysis.passionPath?.description}
              </p>
              <div className="space-y-4">
                <div>
                  <h5 className="text-lg font-medium text-amber-400 mb-2">Dary Duchowe</h5>
                  <ul className="space-y-2">
                    {portrait.analysis.passionPath?.spiritualGifts?.map((gift, i) => (
                      <li key={i} className="flex items-start gap-2 text-amber-100/90">
                        <span className="text-amber-400">✧</span>
                        {gift}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Ścieżka Bólu */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-amber-500/10">
              <h4 className="text-xl font-medium text-amber-400 mb-4">
                Ścieżka Bólu
              </h4>
              <p className="text-amber-100/90 mb-4 leading-relaxed">
                {portrait.analysis.painPath?.description}
              </p>
              <div className="space-y-4">
                <div>
                  <h5 className="text-lg font-medium text-amber-400 mb-2">Lekcje</h5>
                  <ul className="space-y-2">
                    {portrait.analysis.painPath?.lessons?.map((lesson, i) => (
                      <li key={i} className="flex items-start gap-2 text-amber-100/90">
                        <span className="text-amber-400">✧</span>
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 
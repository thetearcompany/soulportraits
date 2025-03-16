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
      className="max-w-4xl mx-auto bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-card-foreground/20"
    >
      <AnimatePresence>
        {isDuplicate && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-secondary/80 backdrop-blur-sm border border-secondary-foreground/50 rounded-xl"
          >
            <p className="text-secondary-foreground">
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
        <h2 className="text-4xl font-bold text-primary mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-800 to-amber-600">
        {portrait.firstName} {portrait.lastName}
        </h2>
      </motion.div>

      <div className="flex flex-col gap-6">
        {portrait.generatedImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src={portrait.generatedImage}
              alt="Kabalistyczny Portret Duszy"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>
        )}

        {portrait.spiritAnimal.image.url && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src={portrait.spiritAnimal.image.url}
              alt="Zwierzę Duchowe"
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
            className="bg-muted/80 backdrop-blur-sm p-6 rounded-xl border border-muted-foreground/50"
          >
            <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
              Dane Numerologiczne
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">📅</span>
                Data urodzenia: {new Date(portrait.birthDate).toLocaleDateString('pl-PL')}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">📍</span>
                Miejsce urodzenia: {portrait.birthPlace}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-accent/80 backdrop-blur-sm p-8 rounded-xl border border-accent-foreground/50"
          >
            <h3 className="text-3xl font-semibold text-accent-foreground mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">
              Portret Twojej Duszy
            </h3>
            
            <div className="space-y-8 text-accent-foreground">
              {/* Cel Duszy */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center mb-8"
              >
                <h4 className="text-2xl font-medium mb-3">Cel Twojej Duszy</h4>
                <p className="italic text-lg">{portrait.numerology?.description || 'Brak opisu numerologii'}</p>
              </motion.div>

              {/* Drzewo Życia */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-card-foreground/50"
              >
                <h4 className="text-xl font-medium mb-4">Drzewo Życia - Sefira {portrait.analysis.treeOfLife?.sefira}</h4>
                <p className="mb-4">{portrait.analysis.treeOfLife?.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3">Atrybuty</h5>
                    <ul className="space-y-2">
                      {portrait.analysis.treeOfLife?.attributes?.map((attr, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-accent-foreground">✨</span>
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
                          <span className="text-accent-foreground">🎯</span>
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
                className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-card-foreground/50"
              >
                <h4 className="text-xl font-medium mb-3">Liczba Życia: {portrait.analysis.lifeNumber?.number}</h4>
                <p className="mb-3">{portrait.analysis.lifeNumber?.meaning}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3">Mocne Strony</h5>
                    <ul className="space-y-2">
                      {portrait.analysis.lifeNumber?.strengths?.map((strength, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-accent-foreground">💪</span>
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
                className="bg-card/50 p-4 rounded-lg"
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
                className="bg-card/50 p-4 rounded-lg"
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
                  <ul className="list-disc list-inside">
                    {portrait.analysis.painPath?.healing.methods?.map((method, i) => (
                      <li key={i}>{method}</li>
                    )) || <li>Brak metod uzdrawiania</li>}
                  </ul>
                  {portrait.analysis.painPath?.healing.mantra && (
                    <div className="mt-2">
                      <h6 className="font-medium mb-1">Mantra:</h6>
                      <p className="italic">{portrait.analysis.painPath.healing.mantra}</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Dary Duchowe */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-card/50 p-4 rounded-lg"
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
                className="bg-card/50 p-4 rounded-lg"
              >
                <h4 className="text-lg font-medium mb-3">Lekcje Karmiczne</h4>
                <ul className="list-disc list-inside">
                  {portrait.analysis.karmicLessons?.map((lesson, i) => (
                    <li key={i}>{lesson}</li>
                  )) || <li>Brak lekcji karmicznych</li>}
                </ul>
              </motion.div>

              {/* Zwierzę Duchowe */}
              {portrait.spiritAnimal && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="bg-card/50 p-6 rounded-lg mt-6"
                >
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-1/3">
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg">
                        <Image
                          src={portrait.spiritAnimal.image.url}
                          alt={`Zwierzę Duchowe - ${portrait.spiritAnimal.name}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = '/spirit-animals/default.jpg';
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <h4 className="text-2xl font-medium mb-3 text-center md:text-left">
                        Twoje Zwierzę Duchowe: {portrait.spiritAnimal.name || 'Nie określono'}
                      </h4>
                      <p className="mb-4 italic">{portrait.spiritAnimal.description}</p>
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Symbolika</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {portrait.spiritAnimal.symbolism?.map((symbol, i) => (
                            <li key={i}>{symbol}</li>
                          )) || <li>Brak symboliki</li>}
                        </ul>
                      </div>
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Przewodnictwo</h5>
                        <p className="italic">{portrait.spiritAnimal.guidance}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Metody Uzdrawiania */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="bg-card/50 p-4 rounded-lg"
              >
                <h4 className="text-lg font-medium mb-3">Metody Uzdrawiania</h4>
                <div>
                  <h5 className="font-medium mb-2">Metody Uzdrawiania</h5>
                  <ul className="list-disc list-inside">
                    {portrait.analysis.painPath?.healing?.methods?.map((method, i) => (
                      <li key={i}>{method}</li>
                    )) || <li>Brak metod uzdrawiania</li>}
                  </ul>
                  <div className="mt-3">
                    <h5 className="font-medium mb-2">Mantra Uzdrawiająca</h5>
                    <p className="italic">{portrait.analysis.painPath?.healing?.mantra || 'Brak mantry uzdrawiającej'}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onReset}
          className="w-full py-3 px-4 bg-gradient-to-r from-amber-800 to-amber-600 text-primary-foreground rounded-lg hover:from-amber-800/90 hover:to-amber-600/90 transition-colors duration-200 font-medium"
        >
          Stwórz nowy portret
        </button>
      </div>
    </motion.div>
  );
}; 
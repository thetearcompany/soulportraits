'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePortraitHistory } from '@/lib/hooks/usePortraitHistory';
import { PortraitHistory } from '@/app/components/PortraitHistory';
import { SoulPortraitResult } from '@/app/components/SoulPortraitResult';
import { SavedPortrait } from '@/types/portrait';
import { birthDataSchema, type BirthData } from '@/lib/validations';
import { ERROR_MESSAGES } from '@/lib/constants';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SavedPortrait | null>(null);
  const [view, setView] = useState<'create' | 'history'>('create');
  const { portraits, savePortrait, deletePortrait, clearHistory } = usePortraitHistory();
  
  const { register, handleSubmit: hookHandleSubmit, formState: { isValid, isDirty }, reset } = useForm<BirthData>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      birthDate: '',
      birthPlace: ''
    }
  });

  const onSubmit = async (formData: BirthData) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setFieldErrors({});
    
    try {
      // Walidacja po stronie klienta
      birthDataSchema.parse(formData);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          setError(ERROR_MESSAGES.RATE_LIMIT);
          return;
        }
        if (response.status === 400 && data.details) {
          const errors: Record<string, string> = {};
          data.details.forEach((err: { field: string; message: string }) => {
            errors[err.field] = err.message;
          });
          setFieldErrors(errors);
          setError(ERROR_MESSAGES.VALIDATION);
          return;
        }
        setError(ERROR_MESSAGES.GENERIC);
        return;
      }

      const savedPortrait = savePortrait(data);
      setResult(savedPortrait);
    } catch (error) {
      console.error('Zakłócenie energii:', error);
      if (error instanceof Error) {
        const isKnownMessage = Object.values(ERROR_MESSAGES).includes(error.message);
        setError(isKnownMessage ? error.message : ERROR_MESSAGES.UNEXPECTED);
      } else {
        setError(ERROR_MESSAGES.UNEXPECTED);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setResult(null);
    setError(null);
    setFieldErrors({});
  };

  return (
    <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Tło z gradientami */}
      <div className="fixed inset-0">
        <div className="absolute top-0 layout-background" />
        <div className="absolute bottom-0 layout-background-bottom" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-400">
            Portret Twojej Duszy
          </h1>
          <p className="text-xl text-amber-200/90 mb-8">
            Odkryj swoją duchową esencję poprzez starożytną mądrość
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={() => setView('create')}
            className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
              view === 'create'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white/10 text-amber-200 hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            Stwórz Portret
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-6 py-3 rounded-xl text-lg font-medium transition-all duration-300 ${
              view === 'history'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                : 'bg-white/10 text-amber-200 hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            Historia
          </button>
        </div>

        {view === 'create' && !result && (
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-amber-500/20">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm">
                <p className="text-red-300">{error}</p>
              </div>
            )}
            
            <form onSubmit={hookHandleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-lg font-medium text-amber-200 mb-2">
                    Imię
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register('firstName', { required: true })}
                    className={`w-full p-3 rounded-xl bg-white/5 border transition-all duration-300 backdrop-blur-sm
                      ${fieldErrors.firstName 
                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' 
                        : 'border-amber-500/20 focus:border-amber-500/50 focus:ring-amber-500/20'
                      } text-amber-50 placeholder-amber-200/50`}
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-2 text-sm text-red-300">{fieldErrors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-lg font-medium text-amber-200 mb-2">
                    Nazwisko
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register('lastName', { required: true })}
                    className={`w-full p-3 rounded-xl bg-white/5 border transition-all duration-300 backdrop-blur-sm
                      ${fieldErrors.lastName 
                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' 
                        : 'border-amber-500/20 focus:border-amber-500/50 focus:ring-amber-500/20'
                      } text-amber-50 placeholder-amber-200/50`}
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-2 text-sm text-red-300">{fieldErrors.lastName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-lg font-medium text-amber-200 mb-2">
                    Data Urodzenia
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    {...register('birthDate', { required: true })}
                    className={`w-full p-3 rounded-xl bg-white/5 border transition-all duration-300 backdrop-blur-sm
                      ${fieldErrors.birthDate 
                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' 
                        : 'border-amber-500/20 focus:border-amber-500/50 focus:ring-amber-500/20'
                      } text-amber-50`}
                  />
                  {fieldErrors.birthDate && (
                    <p className="mt-2 text-sm text-red-300">{fieldErrors.birthDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="birthPlace" className="block text-lg font-medium text-amber-200 mb-2">
                    Miejsce Urodzenia
                  </label>
                  <input
                    type="text"
                    id="birthPlace"
                    {...register('birthPlace', { required: true })}
                    className={`w-full p-3 rounded-xl bg-white/5 border transition-all duration-300 backdrop-blur-sm
                      ${fieldErrors.birthPlace 
                        ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' 
                        : 'border-amber-500/20 focus:border-amber-500/50 focus:ring-amber-500/20'
                      } text-amber-50 placeholder-amber-200/50`}
                    placeholder="np. Warszawa, Polska"
                  />
                  {fieldErrors.birthPlace && (
                    <p className="mt-2 text-sm text-red-300">{fieldErrors.birthPlace}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isValid || !isDirty}
                className={`w-full py-4 px-6 rounded-xl text-lg font-medium transition-all duration-500
                  ${isLoading || !isValid || !isDirty
                    ? 'bg-amber-500/30 cursor-not-allowed text-amber-200/50'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30'
                  } relative group overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200/0 via-amber-200/30 to-amber-200/0 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-700 
                              animate-shine" />
                {isLoading ? 'Trwa proces tworzenia portretu...' : 'Stwórz Portret Duszy'}
              </button>
            </form>
          </div>
        )}

        {view === 'create' && result && (
          <div className="max-w-4xl mx-auto mt-8">
            <SoulPortraitResult 
              portrait={result} 
              onReset={resetForm} 
            />
          </div>
        )}

        {view === 'history' && (
          <div className="max-w-7xl mx-auto">
            <PortraitHistory
              portraits={portraits}
              onDelete={deletePortrait}
              onClearAll={clearHistory}
              onSelect={(portrait) => {
                setResult(portrait);
                setView('create');
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
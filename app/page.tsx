'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { usePortraitHistory } from '@/lib/hooks/usePortraitHistory';
import { PortraitHistory } from '@/app/components/PortraitHistory';
import { SoulPortraitResult } from '@/app/components/SoulPortraitResult';
import { SavedPortrait } from '@/types/portrait';
import { birthDataSchema, type BirthData } from '@/lib/validations';
import { ERROR_MESSAGES } from '@/lib/constants';
import { RandomAnimalImage } from '@/app/components/RandomAnimalImage';

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
    <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Twój Portret Duszy
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Odkryj swoją duchową esencję poprzez starożytną mądrość
          </p>
          <div className="max-w-2xl mx-auto">
            <RandomAnimalImage />
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setView('create')}
            className={`px-4 py-2 rounded-lg ${
              view === 'create'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-secondary'
            }`}
          >
            Stwórz Portret
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-4 py-2 rounded-lg ${
              view === 'history'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-secondary'
            }`}
          >
            Historia
          </button>
        </div>

        {view === 'create' && !result && (
          <div className="max-w-2xl mx-auto bg-card/30 p-6 rounded-lg shadow-lg">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive">{error}</p>
              </div>
            )}
            
            <form onSubmit={hookHandleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                    Imię
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register('firstName', { required: true })}
                    className={`w-full p-2 border rounded-lg bg-background transition-colors ${
                      fieldErrors.firstName 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/30' 
                        : 'border-input focus:border-input focus:ring-ring/20'
                    }`}
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-sm text-destructive">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                    Nazwisko
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register('lastName', { required: true })}
                    className={`w-full p-2 border rounded-lg bg-background transition-colors ${
                      fieldErrors.lastName 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/30' 
                        : 'border-input focus:border-input focus:ring-ring/20'
                    }`}
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-sm text-destructive">{fieldErrors.lastName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-foreground mb-2">
                    Data Urodzenia
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    {...register('birthDate', { required: true })}
                    className={`w-full p-2 border rounded-lg bg-background/60 transition-colors ${
                      fieldErrors.birthDate 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/30' 
                        : 'border-input focus:border-input focus:ring-ring/20'
                    }`}
                  />
                  {fieldErrors.birthDate && (
                    <p className="mt-1 text-sm text-destructive">{fieldErrors.birthDate}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="birthPlace" className="block text-sm font-medium text-foreground mb-2">
                    Miejsce Urodzenia
                  </label>
                  <input
                    type="text"
                    id="birthPlace"
                    {...register('birthPlace', { required: true })}
                    className={`w-full p-2 border rounded-lg bg-background transition-colors ${
                      fieldErrors.birthPlace 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive/30' 
                        : 'border-input focus:border-input focus:ring-ring/20'
                    }`}
                    placeholder="np. Warszawa, Polska"
                  />
                  {fieldErrors.birthPlace && (
                    <p className="mt-1 text-sm text-destructive">{fieldErrors.birthPlace}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !isValid || !isDirty}
                className={`w-full py-3 px-6 rounded-lg text-primary-foreground transition-colors duration-200 ${
                  isLoading || !isValid || !isDirty
                    ? 'bg-primary/50 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isLoading ? 'Trwa proces tworzenia portretu...' : 'Stwórz Portret Duszy'}
              </button>
            </form>
          </div>
        )}

        {view === 'create' && result && (
          <div className="max-w-2xl mx-auto mt-8">
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
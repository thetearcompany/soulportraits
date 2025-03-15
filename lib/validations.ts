import { z } from 'zod';

export const birthDataSchema = z.object({
  firstName: z.string()
    .min(2, 'Imię musi mieć co najmniej 2 znaki')
    .max(50, 'Imię nie może być dłuższe niż 50 znaków')
    .regex(/^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s-]+$/, 'Imię może zawierać tylko litery, spacje i myślniki'),

  lastName: z.string()
    .min(2, 'Nazwisko musi mieć co najmniej 2 znaki')
    .max(50, 'Nazwisko nie może być dłuższe niż 50 znaków')
    .regex(/^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s-]+$/, 'Nazwisko może zawierać tylko litery, spacje i myślniki'),

  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Nieprawidłowy format daty')
    .refine((date) => {
      const d = new Date(date);
      const now = new Date();
      return d <= now && d >= new Date('1900-01-01');
    }, 'Data urodzenia musi być między 1900-01-01 a dniem dzisiejszym'),

  birthTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Nieprawidłowy format godziny (HH:mm)'),

  birthPlace: z.string()
    .min(2, 'Miejsce urodzenia musi mieć co najmniej 2 znaki')
    .max(100, 'Miejsce urodzenia nie może być dłuższe niż 100 znaków')
    .regex(/^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s,.-]+$/, 'Miejsce urodzenia może zawierać tylko litery, spacje, przecinki, kropki i myślniki')
});

export type BirthData = z.infer<typeof birthDataSchema>; 
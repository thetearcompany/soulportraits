import { z } from 'zod';

export const birthDataSchema = z.object({
  firstName: z.string()
    .min(2, 'Imię musi mieć co najmniej 2 znaki')
    .max(50, 'Imię nie może przekraczać 50 znaków')
    .regex(/^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s-]+$/, 'Imię może zawierać tylko litery, spacje i myślniki'),

  lastName: z.string()
    .min(2, 'Nazwisko musi mieć minimum 2 znaki')
    .max(50, 'Nazwisko nie może przekraczać 50 znaków'),

  birthDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data musi być w formacie YYYY-MM-DD'),

  birthPlace: z.string()
    .min(2, 'Miejsce urodzenia musi mieć co najmniej 2 znaki')
    .max(100, 'Miejsce urodzenia nie może przekraczać 100 znaków')
    .regex(/^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s,.-]+$/, 'Miejsce urodzenia może zawierać tylko litery, spacje, przecinki, kropki i myślniki')
});

export type BirthData = z.infer<typeof birthDataSchema>; 
import { type ClassValue, clsx } from 'clsx';
import { Locale } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import * as Locales from 'date-fns/locale';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const appURL =
  typeof window !== 'undefined' && window.location.hostname
    ? `${window.location.protocol}//${window.location.host}`
    : '';

let allLocales: Record<string, Locales.Locale | typeof Locales>;

import('date-fns/locale').then((locales) => {
  allLocales = locales;
});

export const getUserLocale = () => {
  const locale = navigator.language.replace('-', '');
  const rootLocale = locale.substring(0, 2);

  return (allLocales[locale] || allLocales[rootLocale]) as Locale;
};

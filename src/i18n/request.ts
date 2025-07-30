// Configuration pour Server Components.

import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

// Fournit locale + messages en fonction de la requête
// 'getRequestConfig' alimente les Server Components en contenu localisé.
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  // si la locale n'est pas suportée, on retombe sur celle par défaut:
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

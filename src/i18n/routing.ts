/**
 * Centralise la configuration i18n:
 * - locales disponibles
 * - locale par défaut
 * - préfixe d'URL pour la locale par défaut
 */

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
});

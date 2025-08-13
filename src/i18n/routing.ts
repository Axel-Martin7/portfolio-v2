/**
 * Centralise la configuration i18n:
 * - locales disponibles
 * - locale par défaut
 * - stratégie de préfixe
 * - pathname localisés (SEO + UX)
 */

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'] as const,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',

  /*-------------------------------------------------*
  //* Localisation des chemins (source de vérité)
  - On écrit des href "invariants" dans le code (ex: '/about')
  - next-intl génère les slugs localisés selon la locale ciblée
  /*-------------------------------------------------*/
  pathnames: {
    '/': { fr: '/', en: '/' },
    '/about': { fr: '/a-propos', en: '/about' },
    '/link3': { fr: '/lien3', en: '/link3' },
    '/link4': { fr: '/lien4', en: '/link4' },
  },
});

// Partage la liste des locales et la locale par défaut.

import { defineRouting } from 'next-intl/routing';

/*-------------------------------------------------*
// * Définition des locales et de la locale par défaut :
// - 'DefineRouting' centralise la config pour middleware et navigation
*--------------------------------------------------*/
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
});

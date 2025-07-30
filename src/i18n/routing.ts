import { defineRouting } from 'next-intl/routing';

/*-------------------------------------------------*
//* Définition des locales et de la locale par défaut :
*--------------------------------------------------*/
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
});

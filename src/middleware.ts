// Négocie la locale, fait les redirections/réécritures automatiques.

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/*-------------------------------------------------*
// * Middlware principal de next-intl
// - Le middleware lit l'en-tête HTTP ou la langue dans l'URL pour choisir la bonne locale.
*--------------------------------------------------*/
export default createMiddleware(routing);

/*-------------------------------------------------*
// * Paths à excluse (API, fichiers _next, etc.)
*--------------------------------------------------*/
export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

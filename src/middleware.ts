/**
 * Objectif : Intercepter chaque requête pour déterminer la locale via l'URL ou les headers, et rediriger si nécessaire.
 * Fonctionnement:
 * - 'createMiddleware(routing) gère les rewrites/redirections.
 * - matcher exclut API, fichiers _next, trpc, Vercel, ressources.
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

/**
 * Objectif : Exposer <Link>, useRouter, etc. adaptés à l'i18n,
 * et un type "Href" unique pour tous les href internes.
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/*-------------------------------------------------*
// * Exporte 'Link', 'redirect', 'useRouter', etc., configurés avec nos locales
// - Ces fonctions s'assurent que 'href="/about"' devient '/fr/about' ou '/en/about' selon la locale.
*--------------------------------------------------*/
export const { Link, redirect, useRouter, usePathname, getPathname } =
  createNavigation(routing);

/*-------------------------------------------------*
 //* Type utilitaire "Href" (source de vérité unique)
 - Toujours importer ce type pour les props 'href'
 - Evite toute divergence entre Link et getPathname
/*-------------------------------------------------*/
export type Href = Parameters<typeof getPathname>[0]['href'];

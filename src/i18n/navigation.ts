// Wrappers autour de Next.js Link/Router pour gérer automatiquement les préfixes de langue.

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/*-------------------------------------------------*
// * Exporte 'Link', 'redirect', 'useRouter', etc., configurés avec nos locales
// - Ces fonctions s'assurent que 'href="/about"' devient '/fr/about' ou '/en/about' selon la locale.
*--------------------------------------------------*/
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

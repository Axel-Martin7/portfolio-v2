/**
 * Objectif : Fournir des wrappers (<Link>, userouter ...) configurés pour gérer automatiquement les préfixes de locale.
 * Fonctionnement : 'createNavigation(routing)' génère ces APIs adaptées.
 */

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/*-------------------------------------------------*
// * Exporte 'Link', 'redirect', 'useRouter', etc., configurés avec nos locales
// - Ces fonctions s'assurent que 'href="/about"' devient '/fr/about' ou '/en/about' selon la locale.
*--------------------------------------------------*/
export const { Link, redirect, useRouter, usePathname, getPathname } =
  createNavigation(routing);

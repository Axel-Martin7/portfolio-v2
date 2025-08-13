'use client';

/*-------------------------------------------------*
//* NavItem (Client):
- Calcule aria-current='page' via usePathname()
- Utilise getPathname() pour construire l'URL localisée de comparaison
*--------------------------------------------------*/

import React from 'react';
import { getPathname, Link, usePathname, type Href } from '@/i18n/navigation';

interface NavItemProps {
  href: Href; // href invariant (typé)
  locale: string; // locale courante (transmise par le parent serveur)
  className?: string;
  children: React.ReactNode; // libellé déjà traduit (SSR)
}

export default function NavItem({
  href,
  locale,
  className,
  children,
}: NavItemProps) {
  // 1) Pathname actuel (inclut la locale dans l'App Router):
  const pathname = usePathname();

  // 2) URL localisée de la cible (respect pathnames + localePrefix)
  const localizedHref = getPathname({ href, locale });

  // 3) Comparaison simple (exact match)
  const isCurrent = pathname === localizedHref;

  // 4) <Link> next-intl : applique aria-current si actif
  return (
    <Link
      href={href}
      className={className}
      aria-current={isCurrent ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}

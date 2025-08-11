'use client';

/*-------------------------------------------------*
//* NavItem (Client):
- Calcule aria-current='page' via usePathname()
- Utilise getPathname() pour construire l'URL localisée de comparaison
*--------------------------------------------------*/

import React from 'react';
import { getPathname, Link, usePathname } from '@/i18n/navigation';

interface NavItemProps {
  href: string; // ex: '/about'
  locale: string; // locale courante
  className?: string;
  children: React.ReactNode; // libellé déjà traduit (SSR)
}

export default function NavItem({
  href,
  locale,
  className,
  children,
}: NavItemProps) {
  const pathname = usePathname();
  const localizedHref = getPathname({ href, locale });

  const isCurrent = pathname === localizedHref;

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

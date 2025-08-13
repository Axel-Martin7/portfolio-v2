'use client';

import { getPathname, Link, usePathname, type Href } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { ReactNode } from 'react';

/*-------------------------------------------------*\
 //* ActiveLink (Client)
  Objectif :
  - Rendre un <Link> i18n-safe
  - Marquer le lien actif (aria-current + data-active)
  - Offrir plusieurs stratégies de matching (exact / startsWith)
  
  Pourquoi pas de prop "locale" ?
  - On lit la locale courante via useLocale() (fourni par NextIntlClientProvider)
  - Moins d'API, moins d'oublis
\*--------------------------------------------------*/

type MatchMode = 'exact' | 'startsWith';

interface ActiveLinkProps {
  href: Href; // href invariant (typé par next-intl)
  children: ReactNode; // libellé déjà traduit (SSR-friendly)
  className?: string; // classe(s) de base
  activeClassName?: string; // classe à ajouter si actif (optionnel)
  match?: MatchMode; // stratégie de détection (par defaut: 'exact')
  prefetch?: boolean; // délègue à next/link (optionnel)
  ariaLabel?: string; // accessibilité
}

/*-------------------------------------------------*\
 //* Normalisation légère :
  - supprime les trailing slashes pour comparer proprement
\*--------------------------------------------------*/
function normalize(path: string) {
  const out = path.replace(/\/+$/, '');
  return out === '' ? '/' : out;
}

export default function ActiveLink({
  href,
  children,
  className,
  activeClassName,
  match = 'exact',
  prefetch,
  ariaLabel,
}: ActiveLinkProps) {
  // 1) URL Courante (inclut la locale dans l'App Router)
  const pathname = usePathname();

  // 1) Locale courante (client) + URL localisée de la cible
  const locale = useLocale();
  const localizedHref = getPathname({ href, locale });

  // 3) Détection de l'état "actif" :
  const current = normalize(pathname ?? '/');
  const target = normalize(localizedHref);

  const isActive =
    match === 'exact'
      ? current === target
      : current === target || current.startsWith(`${target}`);

  // 4) Classe finale & attributs d'état :
  const finalClassName =
    activeClassName && isActive
      ? `${className ?? ''} ${activeClassName}`.trim()
      : className;

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={finalClassName}
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive ? 'true' : undefined}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}

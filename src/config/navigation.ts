// Liste unique et partagée de tous les liens de navigation

import type { Href } from '@/i18n/navigation';

export interface NavItemConfig {
  href: Href; // href invariant (ex: '/about), typé par next-intl
  translationKey: keyof typeof import('@/../messages/fr.json')['common']['navigation'];
}

/*-------------------------------------------------*
 //* IMPORTANT :
  - On référence des chemins *invariants* (non localisés ici)
  - Les slugs FR/EN seront résolus par getPathname()/Link()
/*-------------------------------------------------*/
export const NavItemConfig: NavItemConfig[] = [
  { href: '/', translationKey: 'home' },
  { href: '/about', translationKey: 'about' },
  { href: '/lien3', translationKey: 'lien3' },
  { href: '/lien4', translationKey: 'lien4' },
];

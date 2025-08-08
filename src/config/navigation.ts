// Liste unique et partagée de tous les liens de navigation

export interface NavItemConfig {
  href: string;
  translationKey: keyof typeof import('@/../messages/fr.json')['common']['navigation'];
}

export const NavItemConfig: NavItemConfig[] = [
  { href: '/', translationKey: 'home' },
  { href: '/about', translationKey: 'about' },
  { href: '/lien3', translationKey: 'lien3' },
  { href: '/lien4', translationKey: 'lien4' },
];

import { getTranslations } from 'next-intl/server';
import styles from './Navigation.module.scss';
import { Link } from '@/i18n/navigation';

interface NavItem {
  href: string;
  translationKey: keyof typeof import('@/../messages/fr.json')['common']['navigation'];
}

interface NavigationProps {
  locale: string;
}

/*-------------------------------------------------*
//* Navigation:
- Server Component SSR-friendly
- Charge les traductions avant rendu (async/await)
- Rendu d'une <nav> indexable et accessible
*--------------------------------------------------*/
export default async function Navigation({ locale }: NavigationProps) {
  const t = await getTranslations({ locale, namespace: 'common.navigation' });

  // Définition de la liste des liens avec leurs clés :
  const item: NavItem[] = [
    { href: '/', translationKey: 'home' },
    { href: '/about', translationKey: 'about' },
    { href: '/', translationKey: 'lien3' },
    { href: '/', translationKey: 'lien4' },
  ];

  return (
    <nav
      className={styles.navigation}
      role="navigation"
      aria-label={t('ariaLabel')}
    >
      <ul className={styles.navList}>
        {item.map(({ href, translationKey }) => (
          <li key={translationKey} className={styles.mavItem}>
            <Link
              href={href}
              className={styles.navLink}
              aria-current={
                typeof window !== 'undefined' &&
                window.location.pathname === href
                  ? 'page'
                  : undefined
              }
            >
              {t(translationKey)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import { getTranslations } from 'next-intl/server';
import styles from './DesktopNavigation.module.scss';
import { NavItemConfig } from '@/config/navigation';
import ActiveLink from '@/components/common/ActiveLink';

interface DesktopNavigationProps {
  locale: string;
}

/*-------------------------------------------------*
//* DesktopNavigation (Server)
- Texte des liens rendu SSR (SEO-friendly)
- État actif (aria-current + data-active) appliqué côté client via <ActiveLink>
*--------------------------------------------------*/
export default async function DesktopNavigation({
  locale,
}: DesktopNavigationProps) {
  const t = await getTranslations({ locale, namespace: 'common.navigation' });

  return (
    <nav
      className={styles.navigation}
      role="navigation"
      aria-label={t('ariaLabel')}
    >
      <ul className={styles.navList}>
        {NavItemConfig.map(({ href, translationKey }) => (
          <li key={translationKey} className={styles.navItem}>
            <ActiveLink
              href={href}
              className={styles.navLink}
              match="exact" // ou "startWith" pour un item parent
              ariaLabel={t(translationKey)}
            >
              {t(translationKey)}
            </ActiveLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

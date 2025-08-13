import { getTranslations } from 'next-intl/server';
import styles from './DesktopNavigation.module.scss';
import { NavItemConfig } from '@/config/navigation';
import ActiveLink from '@/components/common/ActivLink';

interface DesktopNavigationProps {
  locale: string;
}

/*-------------------------------------------------*
//* DesktopNavigation (Server)
- Texte des liens rendu SSR (SEO-friendly)
- aria-current appliqué côté client via <NavItem>
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
              className={styles.active} // optionnel si on as une classe dédiée
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

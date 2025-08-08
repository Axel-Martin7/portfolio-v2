import { getTranslations } from 'next-intl/server';
import styles from './DesktopNavigation.module.scss';
import { Link } from '@/i18n/navigation';
import { NavItemConfig } from '@/config/navigation';

interface DesktopNavigationProps {
  locale: string;
}

/*-------------------------------------------------*
//* DesktopNavigation:
- 100% HTML statique (SEO-friendly)
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

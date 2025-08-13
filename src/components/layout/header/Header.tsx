import { Link } from '@/i18n/navigation';
import styles from './Header.module.scss';
import BurgerMenu from '../BurgerMenu';
import logo from '@/../public/logo-am.svg';
import Image from 'next/image';
import Button from '@/components/common/Button';
import DesktopNavigation from './DesktopNavigation';
import LocaleSwitcher from '../LocaleSwitcher';
import { getTranslations } from 'next-intl/server';

/*-------------------------------------------------*
//* Header :
- Landmark <header> (banner)
  - Skip link pour accès clavier direct au contenu principal
  - Logo (Image optimisée Next) + alt/aria localisés
  - Navigation SSR + CTA + Locale Switcher
*--------------------------------------------------*/
export default async function Header({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common.header' });

  return (
    <header className={styles.headerRibbon}>
      {/* Skip link (a11y): visible au focus clavier */}
      <a href="#main" className={styles.skipLink}>
        {t('skipToContent')}
      </a>

      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label={t('logoAriaLabel')}
          >
            <Image
              className={styles.logo}
              src={logo}
              alt={t('logoAlt')}
              width={48}
              height={48}
              sizes="(min-width: 768px) 48px, 32px" // ✅ sert le bon fichier selon le breakpoint
            />
          </Link>
        </div>

        <BurgerMenu />

        <div className={styles.navContainer}>
          <DesktopNavigation locale={locale} />
        </div>

        <div className={styles.optionsContainer}>
          <Button
            className={styles.ctaBtn}
            as="link"
            href="/"
            variant="header"
            ariaLabel={t('ctaBtnArialabel')}
          >
            {t('ctaBtnLabel')}
          </Button>
          <LocaleSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}

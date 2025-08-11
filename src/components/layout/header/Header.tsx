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
- Logo, BurgerMenu, DesktopNavigation, CTA button et localeSwitcher
- Gère l'affichage via media queries dans fichier de style
*--------------------------------------------------*/
export default async function Header({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'common.header' });

  return (
    <header className={styles.headerRibbon}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <Link
            href="/"
            className={styles.logoLink}
            aria-label="go to homepage"
          >
            <Image
              src={logo}
              alt="Logo Archimedes"
              width={32}
              height={32}
              priority
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
            variant="primary"
            size="md"
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

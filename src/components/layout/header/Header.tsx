import { Link } from '@/i18n/navigation';
import styles from './Header.module.scss';
import BurgerMenu from '../BurgerMenu';
import logo from '@/../public/logo-am.svg';
import Image from 'next/image';
import Button from '@/components/common/Button';
import DesktopNavigation from './DesktopNavigation';
import LocaleSwitcher from '../LocaleSwitcher';

/*-------------------------------------------------*
//* Header :
- Logo, BurgerMenu, DesktopNavigation, CTA button et localeSwitcher
- Gère l'affichage via media queries dans fichier de style
*--------------------------------------------------*/
export default function Header({ locale }: { locale: string }) {
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
          <Button variant="primary" size="md" className={styles.ctaBtn}>
            Rencontrons-nous
          </Button>
          <LocaleSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}

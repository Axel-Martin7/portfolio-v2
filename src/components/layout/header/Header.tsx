import { Link } from '@/i18n/navigation';
import styles from './Header.module.scss';
import BurgerMenu from '../BurgerMenu';
import logo from '@/../public/logo-am.svg';
import Image from 'next/image';
import Button from '@/components/common/Button';
import DesktopNavigation from './DesktopNavigation';

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

        {/* <div className={styles.navContainer}>
          <div className={styles.navBar}>
            <div className={styles.link}>Lien 1</div>
            <div className={styles.link}>Accueil</div>
            <div className={styles.link}>FAQ</div>
            <div className={styles.link}>Lien 1</div>
          </div>
        </div> */}

        <div className={styles.optionsContainer}>
          <Button variant="primary" size="md" className={styles.ctaBtn}>
            Rencontrons-nous
          </Button>
          <div className={styles.localeSwitcherContainer}>
            <div className={styles.localeSwitcher}></div>
          </div>
        </div>
      </div>
    </header>
  );
}

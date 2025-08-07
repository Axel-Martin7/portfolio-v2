import { Link } from '@/i18n/navigation';
import styles from './Header.module.scss';
import BurgerMenu from '../BurgerMenu';
import logo from '@/../public/logo-am.svg';
import Image from 'next/image';

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

        {/* <div className={styles.burgerMenu}></div> */}
        <BurgerMenu />

        <div className={styles.navContainer}>
          <div className={styles.navBar}>
            <div className={styles.link}>Lien 1</div>
            <div className={styles.link}>Accueil</div>
            <div className={styles.link}>FAQ</div>
            <div className={styles.link}>Lien 1</div>
          </div>
        </div>

        <div className={styles.optionsContainer}>
          <div className={styles.ctaBtn}>Rencontrons-nous</div>
          <div className={styles.localeSwitcherContainer}>
            <div className={styles.localeSwitcher}></div>
          </div>
        </div>
      </div>
    </header>
  );
}

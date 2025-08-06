import { Link } from '@/i18n/navigation';
import styles from './Header.module.scss';

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
            <div className={styles.logo}></div>
          </Link>
        </div>

        <div className={styles.burgerMenu}></div>

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

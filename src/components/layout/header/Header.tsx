import { Link } from '@/i18n/navigation';
import styles from './Header.module.scss';

export default function Header({ locale }: { locale: string }) {
  return (
    // <header className={styles.headerRibbon}>
    //   <div className={styles.header}>
    //     <div className={styles.logoContainer}>
    //       <Link
    //         href="/"
    //         className={styles.logoLink}
    //         aria-label="go to homepage"
    //       >
    //         <div className={styles.logo}></div>
    //       </Link>
    //     </div>

    //     <div className={styles.burgerMenu}></div>
    //   </div>
    // </header>

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

        <div className={styles.optionsContainer}>
          <div className={styles.localeSwitcherContainer}>
            <div className={styles.localeSwitcher}></div>
          </div>
        </div>
      </div>
    </header>
  );
}

import React from 'react';
import styles from './Header.module.scss';
import LocaleSwitcher from './LocaleSwitcher';
import { Link } from '@/i18n/navigation';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  return (
    <header className={styles.headerRibbon}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>LOGO AM</div>

        <div className={styles.optionsContainer}>
          <div className={styles.localeContainer}>
            <LocaleSwitcher currentLocale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}

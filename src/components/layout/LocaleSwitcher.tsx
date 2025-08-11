'use client';

import React, { useEffect, useState, useTransition } from 'react';
import styles from './LocaleSwitcher.module.scss';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

/*-------------------------------------------------*
//* LocaleSwitcher (Client component)
- Switch acccessible pour changer la langue
- role="group" pour le container global
- <button role="switch"> focusable, gère aria-checked + clavier
- Fallback <noscrip> SEO-friendly en absence de JS
*--------------------------------------------------*/
export default function LocaleSwitcher({
  currentLocale,
}: {
  currentLocale: string;
}) {
  // 1) Hook i18n et navigation :
  const t = useTranslations('common.localeSwitcher');
  const pathname = usePathname() || '/';
  const router = useRouter();
  // 2) Etat local du switch (checked = 'en'):
  const [isChecked, setIsChecked] = useState(currentLocale === 'en');
  const [isPending, startTransition] = useTransition();

  // 3) Syncrhonisation SSR -> Client pour éviter mismatch
  useEffect(() => {
    setIsChecked(currentLocale === 'en');
  }, [currentLocale]);

  /*-------------------------------------------------*
  //* toggleLocale : 
  - Inverse l'état du switch
  - Déclenche une navigation en conservant le pathname
  *--------------------------------------------------*/
  function toggleLocale() {
    const nextLocale = isChecked ? 'fr' : 'en';
    setIsChecked(!isChecked);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  /*-------------------------------------------------*
  //* onkeyDown : Support clavier 
  - Espace / Entrée = toggle (conforme aux patterns ARIA)
  *--------------------------------------------------*/
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleLocale();
    }
  }

  // Nom accessible dynamique ("Langue : Anglais" ou "Langue : Français")
  const accessibleName = `${t('label')}: ${
    isChecked ? t('english') : t('french')
  }`;

  return (
    <div
      className={styles.switcherContainer}
      role="group"
      aria-label={t('label')}
    >
      <span className={styles.label} aria-hidden="true">
        FR
      </span>

      {/* Interrupteur accessible */}
      <button
        className={`${styles.switch} ${isChecked ? styles.checked : ''}`}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-label={accessibleName}
        onClick={toggleLocale}
        onKeyDown={onKeyDown}
      >
        {/* Boule glissant */}
        <span className={styles.slider} aria-hidden="true" />
      </button>

      <span className={styles.label} aria-hidden="true">
        EN
      </span>

      {/* Annonce discrète du changement pour lecteurs d'écran */}
      <span className={styles.srOnly} aria-live="polite">
        {isChecked ? t('english') : t('french')}
      </span>

      {/* Fallback pour navigateurs sans JS */}
      <noscript>
        <a
          href={
            currentLocale === 'en'
              ? '/'
              : `/en${pathname === '/' ? '' : pathname}`
          }
        >
          {currentLocale === 'en' ? 'FR' : 'EN'}
        </a>
      </noscript>
    </div>
  );
}

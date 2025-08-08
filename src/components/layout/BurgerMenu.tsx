'use client';

import React, { useEffect, useState } from 'react';
import styles from './BurgerMenu.module.scss';
import { useTranslations } from 'next-intl';

/*-------------------------------------------------*
//* BurgerMenu :
- Client component qui gère l'etat ouvert/fermé du menu mobile
- Conserve la nav mobile dans le DOM (SEO-friendly)
- Bloque le scroll du body lorsque le menu est ouvert
- Ferme automatiquement le panneau au clic sur un lien
*--------------------------------------------------*/
export default function BurgerMenu() {
  const t = useTranslations('common.burgerMenu');
  const [isOpen, setIsOpen] = useState(false);
  // label accessibles :
  const buttonLabel = isOpen ? t('closeLabel') : t('openLabel');
  const panelLabel = t('panelLabel');

  /*-------------------------------------------------*
  //* toggleMenu :
  - Inverse la valeur de l'état 'isOpen'.
  - Déclenche l'animation et met à jour aria-expanded
  *--------------------------------------------------*/
  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  /*-------------------------------------------------*
  //* closeMenu :
  - Ferme le menu (utilisé sur chaque lien de nav)
  *--------------------------------------------------*/
  function closeMenu() {
    setIsOpen(false);
  }

  /*-------------------------------------------------*
  - Bloque/Débloque le scroll du body selon 'isOpen'
  *--------------------------------------------------*/
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Bouton burger */}
      <button
        className={`${styles.burgerMenuContainer} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
        aria-label={buttonLabel}
        aria-expanded={isOpen}
      >
        <div className={styles.burgerMenu}>
          <div className={styles.burgerLinesContainer}>
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </div>
        </div>
      </button>

      {/* Navigation mobile (toujours dans le DOM pour le SEO) */}
      <nav
        className={`${styles.mobileNavPanel} ${isOpen ? styles.open : ''}`}
        role="navigation"
        aria-hidden={!isOpen}
        aria-label={panelLabel}
      >
        <div className={styles.mobileNavContent}></div>
      </nav>
    </>
  );
}

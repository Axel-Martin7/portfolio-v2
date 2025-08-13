'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './BurgerMenu.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { NavItemConfig } from '@/config/navigation';
import Button from '../common/Button';
import { getPathname } from '@/i18n/navigation';

/*-------------------------------------------------*
//* BurgerMenu :
- Client component qui gère l'etat ouvert/fermé du menu mobile
- Conserve la nav mobile dans le DOM (SEO-friendly)
- Bloque le scroll du body lorsque le menu est ouvert
- Ferme automatiquement le panneau au clic sur un lien
- i18n-safe : calcule l'URL localisée avant de la passer au <Button>
*--------------------------------------------------*/
export default function BurgerMenu() {
  const tMenu = useTranslations('common.burgerMenu');
  const tNav = useTranslations('common.navigation');
  const currentLocale = useLocale(); // locale active
  const [isOpen, setIsOpen] = useState(false);

  // ID unique pour relier le bouton et le panneau (aria-controls)
  const panelId = useId();

  // Refs pour la gestion d'accessibilité/focus:
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  // label accessibles :
  const buttonLabel = isOpen ? tMenu('closeLabel') : tMenu('openLabel');
  const panelLabel = tMenu('panelLabel');

  /*-------------------------------------------------*
  //* toggleMenu :
  - Inverse la valeur de l'état 'isOpen'.
  - Déclenche l'animation et met à jour aria-expanded
  *--------------------------------------------------*/
  function toggleMenu() {
    setIsOpen((prev) => !prev);
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

  /*-------------------------------------------------*
  - Ally avancée : inert + focus + escape
  *--------------------------------------------------*/
  useEffect(() => {
    const panelEl = panelRef.current;
    if (!panelEl) return;

    // Applique/retire l'attribut inert (bloque le focus hors panneau quand fermé)
    if (isOpen) {
      panelEl.removeAttribute('inert');
    } else {
      panelEl.setAttribute('inert', '');
    }

    // Helpers focusables dans le panneau
    const getFocusables = () =>
      Array.from(
        panelEl.querySelectorAll<HTMLElement>(
          "a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])"
        )
      ).filter(
        (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
      );

    if (isOpen) {
      // Focus initial :
      const firstFocusable = getFocusables()[0] ?? panelEl;
      firstFocusable.focus();

      // Fermeture par Escape:
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }

        // Focus trap Tab/Shift+Tab
        if (e.key === 'Tab') {
          const focusables = getFocusables();
          if (focusables.length === 0) return;

          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          // Tab depuis le dernier -> revient au premier
          if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
          // Shift+Tab depuis le premier -> revient au dernier
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };

      document.addEventListener('keydown', onKeyDown);
      return () => document.removeEventListener('keydown', onKeyDown);
    } else {
      // Restitue le focus au bouton burger
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Bouton burger */}
      <button
        ref={buttonRef}
        className={`${styles.burgerMenuContainer} ${isOpen ? styles.open : ''}`}
        onClick={toggleMenu}
        aria-label={buttonLabel}
        aria-expanded={isOpen}
        aria-controls={panelId} // on relie le bouton au panneau
        aria-haspopup="menu" // indique un panneau de navigation
        data-state={isOpen ? 'open' : 'closed'}
        type="button"
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
        ref={panelRef}
        id={panelId} // ID que le bouton référence
        className={`${styles.mobileNavPanel} ${isOpen ? styles.open : ''}`}
        role="navigation"
        aria-hidden={!isOpen}
        aria-label={panelLabel}
        tabIndex={-1} // permet de focus le conteneur si besoin
        data-state={isOpen ? 'open' : 'closed'}
      >
        <div className={styles.mobileNavContent}>
          {/* Liens internes (colonne de boutons) */}
          <div className={styles.navGroup}>
            {NavItemConfig.map(({ href, translationKey }) => {
              // ✅ calcule la cible localisée pour la locale courante
              const localizedHref = getPathname({
                href,
                locale: currentLocale,
              });
              return (
                <Button
                  key={translationKey}
                  className={styles.button}
                  as="link"
                  href={localizedHref} // string localisé pour le <Button>
                  variant="nav"
                  onClick={() => setIsOpen(false)}
                  ariaLabel={tNav(translationKey)}
                >
                  {tNav(translationKey)}
                </Button>
              );
            })}
          </div>

          {/* Réseaux sociaux */}
          <div
            className={styles.socialGroup}
            role="group"
            aria-label={tMenu('socials.ariaLabel')}
          >
            <ul className={styles.socialList}>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://github.com/ton-compte"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tMenu('socials.github')}
                  title={tMenu('socials.github')}
                ></a>
              </li>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://github.com/ton-compte"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tMenu('socials.github')}
                  title={tMenu('socials.github')}
                ></a>
              </li>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://github.com/ton-compte"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tMenu('socials.github')}
                  title={tMenu('socials.github')}
                ></a>
              </li>
              <li>
                <a
                  className={styles.socialLink}
                  href="https://github.com/ton-compte"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tMenu('socials.github')}
                  title={tMenu('socials.github')}
                ></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import styles from './LocaleSwitcher.module.scss';

interface LocaleSwitcherProps {
  currentLocale: string;
}

/*-------------------------------------------------*
//* LocaleSwitcher :
* Objectf :
* - Permettre à l'utilisateur de changer de langue sans recharger entièrement la page.
* - Utiliser Next.js router pour gérer le préfixe de locale de manière transparente et SEO-friendly
* Fonctionnement: 
* - 'usePathname()' renvoie le chemin actuel sans redéclaration manuelle.
* - 'router.replace(pathname, {locale}) retire automatiquement l'ancien préfixe et ajoute le nouveau
* - rendu en Client component pour intéractivité.
/*-------------------------------------------------*/
export default function LocaleSwitcher({ currentLocale }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname() || '/';

  /*-------------------------*
Change la locale dans l'URL en conservant le reste du chemin et sans préfixe dupliqué :
/*-------------------------*/
  function onSwitch(locale: string) {
    if (locale === currentLocale) return;
    router.replace(pathname, { locale });
  }

  return (
    <details className={styles.switcher}>
      <summary className={styles.summary}>
        {currentLocale.toUpperCase()}
      </summary>
      <ul className={styles.list}>
        {routing.locales
          .filter((loc) => loc !== currentLocale)
          .map((loc) => (
            <li key={loc}>
              <button
                type="button"
                onClick={() => onSwitch(loc)}
                className={styles.link}
              >
                {loc.toUpperCase()}
              </button>
            </li>
          ))}
      </ul>
    </details>
  );
}

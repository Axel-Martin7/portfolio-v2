// import { getTranslations } from 'next-intl/server';
import styles from './page.module.scss';

/*-------------------------------------------------*\
 //* Home (Server Component)
  - id="main" : cible du skip link du header
  - tabIndex={-1} : permet de recevoir le focus quand on saute à l’ancre
\*--------------------------------------------------*/
export default function Home() {
  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <div className={styles.heroSectionWrapper}>
        <div className={styles.heroSection}></div>
      </div>
    </main>
  );
}

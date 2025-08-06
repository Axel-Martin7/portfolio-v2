// import { getTranslations } from 'next-intl/server';
import styles from './page.module.scss';

// Si besoin de traduction sur un serveur component :
// interface HomePageProps {
//   params: Promise<{ locale: string }>;
// }

// export default async function Home({ params }: HomePageProps) {
//   const { locale } = await params;
//   const t = await getTranslations({
//     locale,
//     namespace: 'page.home',
//   });

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.heroSectionWrapper}>
        <div className={styles.heroSection}></div>
      </div>
    </main>
  );
}

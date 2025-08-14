// import { getTranslations } from 'next-intl/server';
import { makePageSeo } from '@/lib/makePageSeo';
import styles from './page.module.scss';
import { getTranslations, setRequestLocale } from 'next-intl/server';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

/*-------------------------------------------------*\
 //* SEO Home (canonical exact) via src/lib/makePageSeo
  - Namespace dédié => textes OG spécifiques à la Home
\*--------------------------------------------------*/
export const generateMetadata = makePageSeo('/', {
  htmlAlternates: false, // le Link header hreflang suffit
  namespace: 'pages.home',
});

/*-------------------------------------------------*\
 //* Home (Server Component)
  - Première balise = <main id="main" tabIndex={-1}> (skip link)
  - setRequestLocale AVANT getTranslations (SSR i18n)
\*--------------------------------------------------*/
export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'pages.home' });

  return (
    <main id="main" tabIndex={-1} className={styles.main}>
      <h1 className="sr-only">{t('title')}</h1>
      <div className={styles.heroSectionWrapper}>
        <div className={styles.heroSection}></div>
      </div>
    </main>
  );
}

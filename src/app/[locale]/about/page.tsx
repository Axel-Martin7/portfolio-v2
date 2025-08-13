import styles from './page.module.scss';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { makePageSeo } from '@/lib/makePageSeo';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

/*-------------------------------------------------*\
 //* SEO par page :
  - Canonical exact + OG cohérent via makePageSeo
  - Le Link header hreflang est déjà géré par next-intl middleware
    (suffisant dans la majorité des cas)
\*-------------------------------------------------*/
export const generateMetadata = makePageSeo('/about', {
  htmlAlternates: false, // Link header hreflang suffit dans la majorité des cas
});

export default async function About({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'pages.about',
  });

  return <div className={styles.about}>{t('title')}</div>;
}

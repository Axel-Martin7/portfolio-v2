import React from 'react';
import styles from './page.module.scss';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { makePageSeo } from '@/lib/makePageSeo';

/*-------------------------------------------------*
//* SEO par page (canonical exact) via src/lib/makePageSeo
/*-------------------------------------------------*/
export const generateMetadata = makePageSeo('/about', {
  htmlAlternates: false, // Link header hreflang suffit dans la majorité des cas
});

export default async function About({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale); // Rendu statique i18n: appeler dans chaque page server qui consomme next-intl

  const t = await getTranslations({ locale, namespace: 'pages.about' });
  return <div className={styles.about}>{t('title')}</div>;
}

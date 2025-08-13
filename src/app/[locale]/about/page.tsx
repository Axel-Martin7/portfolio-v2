import React from 'react';
import styles from './page.module.scss';
import { getTranslations, setRequestLocale } from 'next-intl/server';

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

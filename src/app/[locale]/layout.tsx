/*
 *  Locale layout : 
- Détecte et valide la locale depuis l'URL.
- Configure next-intl pour la locale courante.
- Génère des métadonnées SEO adaptées (titres traduits, descriptions, alternate, openGraph) via generateMetadata().
- Fourni le contexte de traduction à l'application.
 */

import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Header from '@/components/layout/header/Header';

//*---------------- Types des props de notre layout enfant :
interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

//*---------------- 1) Pré-génère les routes locales statiques (/fr,/en ...) :
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

//*---------------- 2) Génère les metadatas globales pour CHAQUE locale :
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' }); // Charge le namespace "metadata" dans le bon fichier JSON
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'; //! REMPLACER PAR LE NOM DE DOMAINE   // Récupère le domaine depuis l'env ou fallback en dev :

  return {
    // Titres et descriptions traduits
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    // <link rel="alternate"> pour chaque langue (SEO multilingue)
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${baseUrl}/${l}`])
      ),
    },

    // Configuration Open Graph de base :
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: `${baseUrl}/${locale}`,
      siteName: t('siteName'),
      type: 'website',
      locale,
      // pas d'alternateLocales ici, Next.js n'expose pas cette prop
    },
  };
}

//*---------------- 3) Layout imbriqué spécifique à la locale :
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  // 1) Attendre params
  const { locale } = await params;

  // 2) 404 si locale invalide
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // 3) Configurer next-intl pour cette locale
  setRequestLocale(locale);

  return (
    // Fournit le contexte de traductions à tous les enfants
    // <html lang={locale}>
    //   <body>
    //     <NextIntlClientProvider>
    //       <Header locale={locale} />
    //       {children}
    //     </NextIntlClientProvider>
    //   </body>
    // </html>
    <NextIntlClientProvider>
      <Header locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}

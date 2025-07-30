/*
 *  Locale layout : 
- Pré-fénère les routes pour chaque locale
- Produit un SEO multilingue (titres, descriptions, alternates, Open Graph)
- Déclare UNE SEULE FOIS <html lang={locale}> et <body>
- Wrappe les enfants dans NextIntlClientProvider
 */

import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

//*---------------- Types des props de notre layout enfant :
interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

//*---------------- 1) Pré-génère les routes locales statiques (/fr,/en) :
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
  // Charge le namespace "metadata" dans le bon fichier JSON
  const t = await getTranslations({ locale, namespace: 'metadata' });
  // Récupère le domaine depuis l'env ou fallback en dev :
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'; //! REMPLACER PAR LE NOM DE DOMAINE

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
  const { locale } = await params;

  // Si la locale n'est pas dans notre config -> page 404
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Informe next.intl de la locale avant le rendu statique
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        {/* Fournit le contexte de traductions à tous les enfants */}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

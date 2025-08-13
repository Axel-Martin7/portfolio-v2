/*-------------------------------------------------*\
 //* Locale layout (Root) :
  - unique root layout de l'app (rend <html> et <body>)
  - i18n : setRequestLocale + NextIntlClientProvider
  - SEO : metadata par locale (canonical/alternates, OG)
  - Styles globaux importés ici
\*--------------------------------------------------*/

import '@/styles/globals.scss';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import Header from '@/components/layout/header/Header';

//*---------------- Chargement de la police d'écriture :
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
});

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

/*-------------------------------------------------*
//*  generateStaticParams:
* - Génère statiquement les segments de locale pour le SSG 
/*-------------------------------------------------*/
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/*-------------------------------------------------*
//* Viewport meta (API officielle Next.js) :
*--------------------------------------------------*/
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

/*-------------------------------------------------*
//* generateMetadata : metadonnées globales par locale
- On définit metadataBase + titres/desc par défaut + OG de base
- Les canoniques/alternates précis se font PAR PAGE (makePageSeo)
*--------------------------------------------------*/
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  //---------------- 1) Récupère la locale :
  const { locale } = await params;
  //---------------- 2) Charge les traductions du namespae "metadata" :
  const t = await getTranslations({ locale, namespace: 'metadata' });

  //---------------- 3) Base absolue pour URLs (utilisée par Next pour résoudre 'alternate', OG, etc.)
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '');

  return {
    metadataBase: new URL(baseUrl),
    // Titres et descriptions traduits
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    // Configuration Open Graph de base :
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: baseUrl,
      siteName: t('siteName'),
      type: 'website',
      locale,
      // pas d'alternateLocales ici, Next.js n'expose pas cette prop
    },
  };
}

/*-------------------------------------------------*\
 //* Root Layout i18n :
  - valide la locale
  - setRequestLocale pour SSG/SSR
  - NextIntlClientProvider
  - rend l'en-tête + contenu
\*--------------------------------------------------*/
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

  // 3) On informe next-intl de la locale active:
  setRequestLocale(locale);

  return (
    // 5) Rend le provider i18n, l'en-tête et le contenu enfant
    <html lang={locale} className={montserrat.className}>
      <body>
        <NextIntlClientProvider>
          <Header locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

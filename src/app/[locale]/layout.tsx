/*-------------------------------------------------*\
 //* Locale layout (Root) :
  - unique root layout de l'app (rend <html> et <body>)
  - i18n : setRequestLocale + NextIntlClientProvider
  - SEO : metadata par locale (canonical/alternates, OG)
  - Styles globaux importés ici
\*--------------------------------------------------*/

import '@/styles/globals.scss';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import Header from '@/components/layout/header/Header';

//*---------------- Chargement de la police d'écriture :
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
});

//*---------------- Types des props de notre layout enfant :
interface LocaleLayoutProps {
  children: React.ReactNode;
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
//*  generateMetadata:
* - Génération des Metadata pour chaque locale via App Router
/*-------------------------------------------------*/
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  //---------------- 1) Récupère la locale :
  const { locale } = await params;
  //---------------- 2) Charge les traductions du namespae "metadata" :
  const t = await getTranslations({ locale, namespace: 'metadata' });

  //---------------- 3) Base URL (sans slash final) :
  const baseUrl = (
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '');

  //---------------- 4) Canonical racine par locale (respecte 'as-needed):
  const canonicalUrl =
    locale === routing.defaultLocale && routing.localePrefix === 'as-needed'
      ? baseUrl
      : `${baseUrl}/${locale}`;

  //---------------- 5) Construit la map hreflang (languages) :
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [
      l,
      l === routing.defaultLocale && routing.localePrefix === 'as-needed'
        ? baseUrl
        : `${baseUrl}/${l}`,
    ])
  );
  // Ajout de x-default pour les moteurs:
  languages['x-default'] = baseUrl;

  return {
    metadataBase: new URL(baseUrl),
    // Titres et descriptions traduits
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    // Balises <link rel="canonical"> et <link rel="alternate hreflang">
    alternates: {
      canonical: canonicalUrl,
      languages,
    },

    // Configuration Open Graph de base :
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      url: canonicalUrl,
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
  - NextIntlClientProvider avec messages
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

  // 4) On passe explicitement les messages au provider (client components):
  const messages = await getMessages();

  return (
    // 5) Rend le provider i18n, l'en-tête et le contenu enfant
    <html lang={locale} className={montserrat.className}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {/* HTML/body are handled by RootLayout */}
          <Header locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

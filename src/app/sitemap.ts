/*-------------------------------------------------*\
 //* sitemap.ts (App Router)
  Objectif :
  - Exposer automatiquement /sitemap.xml (format XML standard Sitemaps)
  - Aider les moteurs (Google, Bing…) à DÉCOUVRIR et explorer toutes tes URLs
  - Déclarer les ALTERNATES multilingues (hreflang) dans le XML

  Fonctionnement Next.js :
  - Fichier "spécial" : Next.js convertit le retour TS -> XML
  - Mis en cache par défaut (statique) tant que pas d'accès dynamique
  - Devient "dynamique" si tu fais du fetch/headers ou utilises "dynamic"
\*-------------------------------------------------*/

import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  //*-------------------- 1) Base absolue (utilisée dans <loc> et alternates):
  const base = (
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '');

  //*-------------------- 2) Routes "stables" du site (href invariants):
  const hrefs = ['/', '/about', '/link3', '/link4'] as const;

  //*-------------------- 3) Génération des entrées (canonique + alternates):
  const now = new Date();

  return hrefs.map((href) => {
    // Canonique pour la defaultLocale (respect 'as-needed'):
    const canonical = `${base}${getPathname({
      locale: routing.defaultLocale,
      href,
    })}`;

    // Alternates pour toutes les locales supportées:
    const languages = Object.fromEntries(
      routing.locales.map((l) => [
        l,
        `${base}${getPathname({ locale: l, href })}`,
      ])
    );

    return {
      url: canonical,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: href === '/' ? 1 : 0.7,
      alternates: { languages },
    };
  });
}

/*-------------------------------------------------*\
 * Notes d’évolution :
  - Contenu dynamique (ex: /blog/[slug]) :
    -> fetch depuis ton CMS/BDD, boucler et pousser chaque URL
    -> si > 50k URLs, utilise generateSitemaps() pour sharder
  - i18n :
    -> ce XML complète le Link header hreflang du middleware next-intl
\*-------------------------------------------------*/

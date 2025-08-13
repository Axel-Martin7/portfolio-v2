/*-------------------------------------------------*\
 //* robots.ts (App Router)
  Objectif :
  - Exposer /robots.txt
  - Indiquer CE QUI EST CRAWLABLE (allow/disallow)
  - Pointer vers le sitemap pour accélérer la découverte des pages

  Fonctionnement Next.js :
  - Fichier "spécial" : Next.js convertit le retour TS -> robots.txt
  - Mis en cache par défaut tant que pas d'accès dynamique
\*-------------------------------------------------*/

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  //*-------------------- 1) Base absolue pour l'URL du sitemap:
  const base = (
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '');

  //*-------------------- 2) Règles du crawl:
  /*
   - En prod : on autorise tout
   - En preview/staging (optionnel) : interdire l'indexation
  */
  const isProd = process.env.NODE_ENV === 'production';
  const defaultRules = isProd
    ? { userAgent: '*', allow: '/' }
    : { userAgent: '*', disallow: '/' };

  //*-------------------- 3) Retour "Robots object" -> Next.js sort un robots.txt valide:
  /* 
  - "rules" accepte un objet OU un tableau (pour cibler des bots spécifiques)
  - "sitemap" accepte une string OU un tableau (si sitemaps multiple)
  */
  return {
    rules: defaultRules,
    sitemap: `${base}/sitemap.xml`,
    // host: base, // (optionnel) pour certains crawlers auto-hébergés
  };
}

/*-------------------------------------------------*\
 * Exemples :
  - Règles spécifiques :
    rules: [
      { userAgent: 'Googlebot', allow: ['/', '/a-propos'], disallow: ['/private'] },
      { userAgent: ['Applebot', 'Bingbot'], disallow: '/' }
    ]
  - Sitemaps multiples :
    sitemap: [`${base}/sitemap.xml`, `${base}/sitemap-blog.xml`]
\*-------------------------------------------------*/

/*-------------------------------------------------*\
 //* makePageSeo : fabrique un generateMetadata concis et typé
  - DRY : factorise canonical/alternates (hreflang)
  - Typage robuste : on dérive le type de `href` depuis getPathname
  - i18n aware : respecte `localePrefix` + `pathnames`

  SEO notes :
  - Le middleware next-intl envoie déjà un "Link" header hreflang.
    => Dans la majorité des cas, ça suffit (plus léger côté HTML).
  - Si vos outils SEO exigent des <link rel="alternate"> dans le <head>,
    passez { htmlAlternates: true }.
\*-------------------------------------------------*/

import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/*-------------------------------------------------*
// Types utilitaires
/*-------------------------------------------------*/
type PathHref = Parameters<typeof getPathname>[0]['href'];
type ParamsObject = Record<string, unknown>;

/*-------------------------------------------------*\
 //* makePageSeo :
  - href : PathHref OU resolver ({ locale, params }) => PathHref
  - options.htmlAlternates : si true, ajoute <link rel="alternate"> dans le head
    (sinon, on s'appuie sur le Link header hreflang du middleware)
  - options.namespace : namespace i18n de la page
    (par défaut "metadata" — utile si vous avez une page très simple)
  - ✅ siteName : toujours lu dans le namespace global "metadata" (pas de duplication)
\*-------------------------------------------------*/
export function makePageSeo(
  href:
    | PathHref
    | ((args: { locale: string; params: ParamsObject }) => PathHref),
  options?: { htmlAlternates?: boolean; namespace?: string }
) {
  const { htmlAlternates = false, namespace = 'metadata' } = options ?? {};

  /*-------------------------------------------------*\
  //* generateMetadata (retourné par la factory)
    - params: { locale } + autres params
    - calcule le canonical via getPathname (locale + pathname OK)
    - ajoute alternates.languages si demandé (sinon le middleware suffit)
  \*-------------------------------------------------*/
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string } & ParamsObject>;
  }): Promise<Metadata> {
    const all = await params;
    const { locale, ...restRaw } = all;
    const rest = restRaw as ParamsObject;

    // i18n : textes spécifiques à la page + textes globaux (siteName)
    const t = await getTranslations({ locale, namespace });
    const tMeta = await getTranslations({ locale, namespace: 'metadata' });

    // Base absolue (sans slash final) pour construire canonical/OG
    const baseUrl = (
      process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    ).replace(/\/$/, '');

    // 1) Résolution du href final (statique ou dynamique)
    const resolvedHref: PathHref =
      typeof href === 'function' ? href({ locale, params: rest }) : href;

    // 2) Canonical exact (respect 'as-needed' + pathnames localisés)
    const canonicalPath = getPathname({ locale, href: resolvedHref });
    const canonical = `${baseUrl}${canonicalPath}`;

    // 3) (Optionnel) Alternates HTML (hreflang)
    // - Utile si vos outils veulent "voir" les balises dans le head
    // - Sinon s'appuyer sur le Link header du middleware
    const languages = htmlAlternates
      ? Object.fromEntries(
          routing.locales.map((l) => [
            l,
            `${baseUrl}${getPathname({ locale: l, href: resolvedHref })}`,
          ])
        )
      : undefined;

    // 4) Métadonnées localisées + OG minimal cohérent
    return {
      title: t('ogTitle'),
      description: t('ogDescription'),
      alternates: {
        canonical,
        ...(languages ? { languages } : {}),
      },
      openGraph: {
        url: canonical,
        title: t('ogTitle'),
        description: t('ogDescription'),
        siteName: tMeta('siteName'), // lu dans "metadata" (global)
        type: 'website',
        locale,
      },
    };
  };
}

/*-------------------------------------------------*\
 * Exemples d'utilisation :
 * 1) Page statique :
 *    export const generateMetadata = makePageSeo('/about', {
 *      namespace: 'pages.about'
 *    });
 *
 * 2) Page dynamique (ex: /blog/[slug]) :
 *    export const generateMetadata = makePageSeo(({ params }) => ({
 *      pathname: '/blog/[slug]',
 *      params: { slug: String(params.slug) }
 *    }), { namespace: 'pages.blog' });
\*-------------------------------------------------*/

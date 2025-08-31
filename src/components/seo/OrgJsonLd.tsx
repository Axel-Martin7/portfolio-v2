/*-------------------------------------------------*
//* OrgJsonLd (Server)
 - Emet un JSON-LD Organization global
 - SEO: aide les moteurs à identifier la marque (logo, URL)
 - Place ce composant dans le layout (global)
*--------------------------------------------------*/

import { getTranslations } from 'next-intl/server';

export default async function OrgJsonLd({ locale }: { locale: string }) {
  const base = (
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  ).replace(/\/$/, '');
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}#organization`,
    name: tMeta('siteName'),
    url: base,
    logo: `${base}/logo-am.svg`,
    // "sameAs": ["https://github.com/...", "https://www.linkedin.com/in/..."]
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify sans indent pour payload minimal
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

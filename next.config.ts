import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/*-------------------------------------------------*
//* Configuration personnalisée de Next.js
*--------------------------------------------------*/
const nextConfig: NextConfig = {
  // Otionnel : pour utiliser aussi le support i18n natif de Next.js :
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
  },
};

/*-------------------------------------------------*
// * On enveloppe la config avec le plugin next-intl :
// - Le plugin génère les alias nécessaires et actie le chargement des messages selon la locale
*--------------------------------------------------*/
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

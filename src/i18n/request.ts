/**
 * Fournit la config i18n côté serveur.
 * - Détermine la locale demandée puis fallback si non supportée.
 * - Importe dynamiquement le fichier JSON correspondant.
 */

import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // 1) Récupère la locale du header ou de l'URL:
  const requested = await requestLocale;

  // 2) Vérifie si la locale est supportée, sinon fallback sur defaultLocale:
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // 3) Import dynamique du fichier JSON de messages pour la locale
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});

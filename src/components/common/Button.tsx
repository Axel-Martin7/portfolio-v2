'use client';

import React from 'react';
import styles from './Button.module.scss';
import { Link as I18nLink } from '@/i18n/navigation';
import type { UrlObject } from 'url';

/* Composant <Button> polymorphe et accessible
- Rend sémantiquement: <button> (action), <a> (lien externe), ou <Link> i18n (lien interne localisé)
- Variants + sizes cohérents (CTA primaire/secondaire, ghost, nav)
- SEO/Perf : <Link> de Next.js => navigation client + prefecth intelligent
- Ally: type par défaut "button", gestion disables/loading, rel sécurisé
*/

type Variant = 'primary' | 'secondary' | 'ghost' | 'nav';
type Size = 'sm' | 'md' | 'lg' | 'xl';

/*-------------------------------------------------*
 //* Utils: 
 - classnames & détection lien externe
 *-------------------------------------------------*/
function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}
function isExternalHref(href: string) {
  return /^(https?:)?\/\//.test(href) || /^mailto:|^tel:/.test(href);
}

/*-------------------------------------------------*
 //* Props communes:
 *-------------------------------------------------*/
interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  loading?: boolean; // désactive + aria-busy
  children: React.ReactNode; // ⚠️ Texte visible à traduire AVANT (t('...'))
  ariaLabel?: string; // passe automatiquement sur l'élément rendu
}

/*-------------------------------------------------*
 //* Variantes polymorphes de rendu (discriminées par 'as')
 *-------------------------------------------------*/
type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    as?: 'button'; // undefined => 'button' par defaut
    type?: 'button' | 'submit' | 'reset';
  };

type ButtonAsAnchor = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
    href: string;
  };

type ButtonAsLink = CommonProps & {
  as: 'link';
  href: string | UrlObject; // ex: '/about' => '/fr/about' ou '/en/about'
  prefetch?: true | false | null; // laisser nul => comportement Next.js par défaut
  locale?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  replace?: boolean;
  scroll?: boolean;
};

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink;

/*-------------------------------------------------*
 //* Tpye guards explicites (fiabilise le narrowing TS)
 *-------------------------------------------------*/
function isButtonProps(p: ButtonProps): p is ButtonAsButton {
  return p.as === undefined || p.as === 'button';
}
function isAnchorProps(p: ButtonProps): p is ButtonAsAnchor {
  return p.as === 'a';
}
function isLinkProps(p: ButtonProps): p is ButtonAsLink {
  return p.as === 'link';
}

/*-------------------------------------------------*
 //* Construction des classes CSS à partir des props
 *-------------------------------------------------*/
function classes({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: Pick<ButtonProps, 'variant' | 'size' | 'fullWidth' | 'className'>) {
  return cx(
    styles.button,
    styles[`v_${variant}`],
    styles[`s_${size}`],
    fullWidth && styles.fullWidth,
    className
  );
}

/*-------------------------------------------------*
 //* Composant exporté
 - conserve l'API polymorphe (as='button' | 'a' | 'link')
 - pas de cast risqué: branches avec type guards
 *-------------------------------------------------*/
export default function Button(props: ButtonProps) {
  const { variant, size, fullWidth, className, loading, children, ariaLabel } =
    props;
  const cls = classes({ variant, size, fullWidth, className });

  //-------------------- 1) Bouton d'action: <button>
  if (isButtonProps(props)) {
    const { type = 'button', disabled, ...btnRest } = props;
    return (
      <button
        className={cls}
        type={type} // 'button' par defaut pour éviter les submits involontaires
        disabled={disabled || !!loading}
        aria-busy={loading || undefined}
        aria-label={ariaLabel}
        {...btnRest}
      >
        <span className={styles.content}>{children}</span>
      </button>
    );
  }

  //-------------------- 2) Lien externe / besoin explicite d'un <a> : <a>
  if (isAnchorProps(props)) {
    const { href, target, rel, ...aRest } = props;
    const safeRel = target === '_blank' && !rel ? 'noopener noreferrer' : rel;

    return (
      <a
        className={cls}
        href={href}
        target={target}
        rel={safeRel}
        aria-disabled={loading || undefined}
        aria-label={ariaLabel}
        {...aRest}
      >
        <span className={styles.content}>{children}</span>
      </a>
    );
  }

  //-------------------- 3) Lien interne localisé: <Link> de next-intl/navigation

  if (isLinkProps(props)) {
    const { href, prefetch = null, locale, onClick, replace, scroll } = props;

    // Sécurité: si href est absolu par erreur => fallback <a>
    if (typeof href === 'string' && isExternalHref(href)) {
      return (
        <a className={cls} href={href} aria-label={ariaLabel}>
          <span className={styles.content}>{children}</span>
        </a>
      );
    }

    // On passe uniquement les props acceptées par <Link> pour éviter les conflits de types
    return (
      <I18nLink
        href={href}
        prefetch={prefetch}
        locale={locale}
        replace={replace}
        scroll={scroll}
        className={cls}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </I18nLink>
    );
  }

  // Fallback impossible normalement (toutes branches couvertes)
  return null;
}

'use client';

import type React from 'react';
import styles from './Button.module.scss';
import { Link as I18nLink } from '@/i18n/navigation';
import type { Href } from '@/i18n/navigation';

/* Composant <Button> polymorphe et accessible
- Rend sémantiquement: <button> (action), <a> (lien externe), ou <Link> i18n (lien interne localisé)
- SEO/Perf : <Link> de Next.js => navigation client + prefetch intelligent
- a11y: type par défaut "button", gestion disabled/loading, rel sécurisé
*/

type Variant = 'header' | 'primary' | 'secondary' | 'ghost' | 'nav';

/*-------------------------------------------------*
 //* Utils: 
 - classnames & détection lien externe
 *-------------------------------------------------*/
function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/*-------------------------------------------------*
 //* Props communes:
 *-------------------------------------------------*/
interface CommonProps {
  variant?: Variant;
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
  href: Href;
  prefetch?: boolean;
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
  variant = 'header',
  fullWidth,
  className,
}: Pick<ButtonProps, 'variant' | 'fullWidth' | 'className'>) {
  return cx(
    styles.button,
    styles[`v_${variant}`],
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
  const { variant, fullWidth, className, loading, children, ariaLabel } = props;
  const cls = classes({ variant, fullWidth, className });

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

  //-------------------- 3) <Link> i18n (interne, invariant)
  if (isLinkProps(props)) {
    const { href, prefetch, locale, onClick, replace, scroll } = props;

    // Ici 'href' est garanti interne & invariant (type Href), On transmet seulement les props définies
    return (
      <I18nLink
        href={href}
        {...(prefetch !== undefined ? { prefetch } : {})}
        {...(locale ? { locale } : {})}
        {...(replace !== undefined ? { replace } : {})}
        {...(scroll !== undefined ? { scroll } : {})}
        className={cls}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        <span className={styles.content}>{children}</span>
      </I18nLink>
    );
  }

  // Fallback impossible normalement (toutes branches couvertes)
  return null;
}

'use client';

import React, { ReactNode } from 'react';
import { Link as I18nLink } from '@/i18n/navigation';
import styles from './Button.module.scss';

//*-------------------- 1) Props communes à tous les boutons
interface BaseButtonProps {
  children: ReactNode; // Contenu (texte, icones...)
  variant?: 'primary' | 'secondary' | 'link'; // variante visuelle
  size?: 'sm' | 'md' | 'lg'; // taille padding + typo
  className?: string; // classe CSS additionnelle
}

//*-------------------- 2) Variante <button> :
/*
- as: 'button' ou non précisé
- tous les props natifs de <button>
*/
type ButtonAsButton = BaseButtonProps & {
  as?: 'button'; // rend un <bouton>
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

//*-------------------- 3) Variante <lien> :
/*
- as: 'a'
- href requis
- tous les props natifs de <a>
*/
type ButtonAsLink = BaseButtonProps & {
  as: 'a'; // rend un <a>
  href: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

//*-------------------- 4) On combine en union discriminée: TS saura selon "as", quel set de props utiliser:
export type ButtonProps = ButtonAsButton | ButtonAsLink;

/*-------------------------------------------------*
//* Button (Client Component)
- Génère un <button> natif pour les actions
- Génère un <a> via I18nLink pour la navigation (HTML buildé pour le SEO)
- Hydrate ensuite pour l'interactività (onClick, hooks...)
*--------------------------------------------------*/
export default function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    as = 'button', // on extrait as et href de props pour la logique
    ...rest
  } = props;

  // 1) Assemblage des classes :
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  // 2) Cas lien i18n-aware:
  if (as === 'a') {
    const { href, ...anchorProps } =
      rest as React.AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <I18nLink
        href={href!} // TS sait que href existe si as==='a'
        className={classes}
        {...anchorProps}
      >
        {children}
      </I18nLink>
    );
  }

  // 3) Cas bouton natif:
  const buttonProps = rest as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

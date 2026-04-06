import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

/** hero = pages publiques ; dashboard = barres équipe / admin (48px, comme les avatars). */
type LogoSize = 'hero' | 'dashboard';

type Props = {
  to?: string;
  className?: string;
  variant?: 'light' | 'vibrant';
  /** @deprecated utiliser size="dashboard" */
  compact?: boolean;
  size?: LogoSize;
  /** Skeleton + chargement prioritaire (hero / LCP). défaut : true si hero. */
  priorityLoad?: boolean;
};
const CUSTOM_LOGO_CANDIDATES = [
  '/branding/logo.png',
  '/branding/logo.webp',
  '/branding/logo.jpg',
  '/branding/logo.jpeg',
];

function CrownIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} text-vibe-yellow`} fill="currentColor" aria-hidden>
      <path d="M5 16L3 7l5.5 3L12 4l3.5 6L21 7l-2 9H5zm2.7-2h8.6l.9-4.1-2.7 1.5L12 8.5 8.1 11.4 6.8 9.9 7.7 14z" />
    </svg>
  );
}

export function BrandLogo({
  to = '/',
  className = '',
  variant = 'light',
  compact = false,
  size,
  priorityLoad,
}: Props) {
  const vibrant = variant === 'vibrant';
  const [logoIndex, setLogoIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const resolvedSize: LogoSize = size ?? (compact ? 'dashboard' : 'hero');
  const imgSize = resolvedSize === 'dashboard' ? 48 : 150;
  const iconSize = resolvedSize === 'dashboard' ? 'h-12 w-12 max-h-12 max-w-12' : 'h-[150px] w-[150px]';
  const hasCustomLogo = logoIndex < CUSTOM_LOGO_CANDIDATES.length;
  /** Pas de query anti-cache : le fichier `public/branding/logo.*` peut être mis en cache navigateur. */
  const customLogoSrc = hasCustomLogo ? CUSTOM_LOGO_CANDIDATES[logoIndex] : '';

  useEffect(() => {
    setImgLoaded(false);
  }, [logoIndex, customLogoSrc]);
  const usePriority = priorityLoad ?? resolvedSize === 'hero';
  const showImgSkeleton = hasCustomLogo && resolvedSize === 'hero' && usePriority && !imgLoaded;

  const customLogoNode = hasCustomLogo ? (
    <span className={`relative inline-flex shrink-0 ${iconSize}`}>
      {showImgSkeleton ? (
        <span
          className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-white/25 via-fuchsia-200/20 to-cyan-200/15 ring-1 ring-white/30"
          aria-hidden
        />
      ) : null}
      <img
        src={customLogoSrc}
        alt="Logo Fair Play"
        width={imgSize}
        height={imgSize}
        loading={usePriority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={usePriority ? 'high' : 'low'}
        onLoad={() => setImgLoaded(true)}
        onError={() => {
          setImgLoaded(false);
          setLogoIndex((i) => i + 1);
        }}
        className={`relative z-[1] ${iconSize} object-contain transition-opacity duration-500 ease-out ${
          showImgSkeleton ? 'opacity-0' : 'opacity-100'
        } ${resolvedSize === 'dashboard' ? 'drop-shadow-md' : 'drop-shadow-[0_10px_28px_rgba(0,0,0,0.28)]'}`}
      />
    </span>
  ) : null;

  const inner = vibrant ? (
    <span className={`inline-flex items-center ${className}`}>
      {customLogoNode ?? (
        <span className={`flex shrink-0 items-center justify-center ${iconSize}`}>
          <CrownIcon className={resolvedSize === 'dashboard' ? 'h-7 w-7' : 'h-20 w-20'} />
        </span>
      )}
    </span>
  ) : (
    <span className={`inline-flex items-center ${className}`}>
      {customLogoNode ?? (
        <svg
          width={imgSize}
          height={imgSize}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
          aria-hidden
        >
          <rect width="36" height="36" rx="8" fill="#1b4332" />
          <path d="M8 26V14l5-3 5 3v12" stroke="#fbbf24" strokeWidth="1.5" fill="none" />
          <path d="M18 26V14l5-3 5 3v12" stroke="#93c5fd" strokeWidth="1.5" fill="none" />
          <circle cx="18" cy="11" r="2.5" fill="#fff" />
        </svg>
      )}
    </span>
  );

  const focus = vibrant
    ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60'
    : 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fp-brand';

  if (to) {
    return (
      <Link to={to} className={focus}>
        {inner}
      </Link>
    );
  }
  return inner;
}

import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';

type LogoSize = 'hero' | 'dashboard';

type Props = {
  to?: string;
  className?: string;
  variant?: 'light' | 'vibrant';
  /** @deprecated utiliser size="dashboard" */
  compact?: boolean;
  /** hero = pages publiques (~150px), dashboard = moitié (~75px) */
  size?: LogoSize;
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

export function BrandLogo({ to = '/', className = '', variant = 'light', compact = false, size }: Props) {
  const vibrant = variant === 'vibrant';
  const [logoIndex, setLogoIndex] = useState(0);
  const resolvedSize: LogoSize = size ?? (compact ? 'dashboard' : 'hero');
  const imgSize = resolvedSize === 'dashboard' ? 75 : 150;
  const iconSize = resolvedSize === 'dashboard' ? 'h-[75px] w-[75px]' : 'h-[150px] w-[150px]';
  const hasCustomLogo = logoIndex < CUSTOM_LOGO_CANDIDATES.length;
  const cacheBuster = useMemo(() => Date.now(), []);
  const customLogoSrc = hasCustomLogo ? `${CUSTOM_LOGO_CANDIDATES[logoIndex]}?v=${cacheBuster}` : '';

  const customLogoNode = hasCustomLogo ? (
    <img
      src={customLogoSrc}
      alt="Logo Fair Play"
      width={imgSize}
      height={imgSize}
      onError={() => setLogoIndex((i) => i + 1)}
      className={`${iconSize} shrink-0 object-contain drop-shadow-[0_10px_28px_rgba(0,0,0,0.28)]`}
    />
  ) : null;

  const inner = vibrant ? (
    <span className={`inline-flex items-center ${className}`}>
      {customLogoNode ?? (
        <span className={`flex shrink-0 items-center justify-center ${iconSize}`}>
          <CrownIcon className={resolvedSize === 'dashboard' ? 'h-10 w-10' : 'h-20 w-20'} />
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

import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { HeroLottie } from './HeroLottie';
import { VibeBackdrop } from './VibeBackdrop';

type NavItem = { to: string; label: string };

const defaultNav: NavItem[] = [
  { to: '/connexion', label: 'Connexion' },
  { to: '/inscription', label: 'Inscription' },
  { to: '/accueil', label: 'Accueil' },
];

type Props = {
  children: ReactNode;
  titleBefore: string;
  titleAccent: string;
  subtitle: string;
  /** Bouton pill en haut à droite (ex. S'inscrire) */
  topAction?: { to: string; label: string };
  topLink?: { to: string; label: string };
  showArt?: boolean;
  footerNote?: string;
  navItems?: NavItem[];
};

export function SplitLayout({
  children,
  titleBefore,
  titleAccent,
  subtitle,
  topAction,
  topLink,
  showArt = true,
  footerNote,
  navItems = defaultNav,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden text-white">
      <VibeBackdrop />

      <header className="relative z-30 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <BrandLogo to="/" variant="vibrant" />
        </div>

        <div className="hidden items-center gap-3 rounded-pill border border-white/20 bg-white/[0.08] px-3 py-2 shadow-[0_16px_44px_rgba(15,4,30,0.42),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl md:flex">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-pill px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/12 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            {topLink ? (
              <Link
                to={topLink.to}
                className="rounded-pill px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {topLink.label}
              </Link>
            ) : null}
          </nav>
          {topAction ? (
            <Link
              to={topAction.to}
              className="rounded-pill border border-vibe-cyan/40 bg-gradient-to-r from-[#2E0854] via-[#5b0d6f] to-[#8B008B] px-5 py-2 text-sm font-bold text-white shadow-[0_10px_26px_rgba(46,8,84,0.45)] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              {topAction.label}
            </Link>
          ) : null}
        </div>

        <div className="flex items-center gap-3 sm:gap-4 md:hidden">
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-white/5 md:hidden"
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="h-0.5 w-5 rounded-full bg-white" />
            <span className="h-0.5 w-5 rounded-full bg-white" />
          </button>
          <div className="hidden flex-col gap-1.5 md:flex" aria-hidden>
            <span className="h-0.5 w-7 rounded-full bg-white" />
            <span className="h-0.5 w-7 rounded-full bg-white" />
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="relative z-30 border-y border-white/10 bg-black/30 px-5 py-4 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="py-1 text-white"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {topLink ? (
              <Link to={topLink.to} className="py-1 text-white/75" onClick={() => setMenuOpen(false)}>
                {topLink.label}
              </Link>
            ) : null}
            {topAction ? (
              <Link
                to={topAction.to}
                className="mt-1 rounded-pill border border-white/40 py-2 text-center text-white"
                onClick={() => setMenuOpen(false)}
              >
                {topAction.label}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-12 px-5 pb-16 pt-4 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-20">
        <div className="order-2 flex flex-col justify-center lg:order-1 lg:pr-4">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[2.35rem] lg:leading-[1.2]">
            <span className="text-white">{titleBefore}</span>{' '}
            <span className="bg-gradient-to-r from-vibe-cyan via-vibe-pink to-vibe-yellow bg-clip-text text-transparent">
              {titleAccent}
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">{subtitle}</p>
          <div className="mt-8 w-full max-w-md">{children}</div>
        </div>

        {showArt ? (
          <div className="order-1 flex min-h-[240px] items-center justify-center py-4 lg:order-2 lg:min-h-[min(560px,72vh)] lg:py-6 xl:min-h-[min(640px,78vh)]">
            <HeroLottie />
          </div>
        ) : null}
      </div>

      <footer className="relative z-10 px-5 py-8 text-center text-xs text-white/45 sm:px-8">
        {footerNote ?? `Fair Play © ${new Date().getFullYear()} · Plateforme de challenges étudiants`}
      </footer>
    </div>
  );
}

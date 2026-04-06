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

      <header className="relative z-30 flex w-full justify-center px-4 pt-6 pb-2 sm:px-6 sm:pt-8">
        <div
          className={`flex w-full max-w-3xl flex-col items-center gap-3 rounded-[1.75rem] border border-white/22 bg-white/[0.09] px-4 py-3 shadow-[0_20px_50px_rgba(15,4,30,0.38),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl sm:max-w-4xl sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4 sm:px-5 sm:py-3.5`}
        >
          <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-center">
            <div className="flex flex-1 justify-center sm:flex-none">
              <div className="rounded-2xl border border-white/30 bg-gradient-to-br from-white/20 to-white/[0.06] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_24px_rgba(0,0,0,0.15)] ring-1 ring-white/15">
                <BrandLogo to="/accueil" variant="vibrant" size="hero" priorityLoad />
              </div>
            </div>
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 shadow-inner backdrop-blur-md sm:hidden"
              aria-expanded={menuOpen}
              aria-label="Menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="h-0.5 w-5 rounded-full bg-white" />
              <span className="h-0.5 w-5 rounded-full bg-white" />
            </button>
          </div>

          <nav className="hidden w-full flex-wrap items-center justify-center gap-1 sm:flex sm:w-auto sm:max-w-none">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-pill px-3.5 py-2 text-sm font-semibold text-white/88 transition hover:bg-white/14 hover:text-white sm:px-4"
              >
                {item.label}
              </Link>
            ))}
            {topLink ? (
              <Link
                to={topLink.to}
                className="rounded-pill px-3.5 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white sm:px-4"
              >
                {topLink.label}
              </Link>
            ) : null}
          </nav>

          {topAction ? (
            <Link
              to={topAction.to}
              className="w-full rounded-pill border border-vibe-cyan/45 bg-gradient-to-r from-[#2E0854] via-[#5b0d6f] to-[#8B008B] px-5 py-2.5 text-center text-sm font-bold text-white shadow-[0_10px_28px_rgba(46,8,84,0.5)] transition hover:-translate-y-0.5 hover:brightness-110 sm:inline-flex sm:w-auto"
            >
              {topAction.label}
            </Link>
          ) : null}
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

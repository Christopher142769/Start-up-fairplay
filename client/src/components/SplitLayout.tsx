import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';
import { HeroLottie } from './HeroLottie';
import { VibeBackdrop } from './VibeBackdrop';

const navItems = [
  { to: '/inscription', label: 'Inscription' },
  { to: '/connexion', label: 'Connexion' },
] as const;

type Props = {
  children: ReactNode;
  titleBefore: string;
  titleAccent: string;
  subtitle: string;
  /** CTA droite type « Get started » (pilule plus opaque) */
  topAction?: { to: string; label: string };
  showArt?: boolean;
  footerNote?: string;
};

const navBarShell =
  'rounded-pill border border-white/18 bg-[#1a0a2e]/45 shadow-[0_20px_50px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-2xl';

const ctaPill =
  'inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-pill bg-gradient-to-r from-vibe-coral to-[#e63e5c] px-4 py-2 text-[13px] font-semibold tracking-wide text-white shadow-[0_6px_24px_rgba(255,77,109,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] transition hover:brightness-105 hover:shadow-[0_10px_32px_rgba(255,77,109,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vibe-coral/80';

export function SplitLayout({
  children,
  titleBefore,
  titleAccent,
  subtitle,
  topAction,
  showArt = true,
  footerNote,
}: Props) {
  const { pathname } = useLocation();

  const navLinkClass = (to: string) =>
    `rounded-pill px-3 py-1.5 text-[12px] font-medium tracking-wide transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 ${
      pathname === to
        ? 'bg-white/14 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
        : 'text-white/72 hover:bg-white/[0.09] hover:text-white'
    }`;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden text-white">
      <VibeBackdrop />

      {/* ——— Navbar web (≥ lg) : une seule pilule glass, grille logo | liens | CTA ——— */}
      <header className="sticky top-4 z-50 hidden w-full px-5 pt-1.5 lg:block xl:px-8">
        <div
          className={`relative mx-auto max-w-5xl pl-3 pr-2.5 py-1.5 sm:pl-4 sm:pr-3 ${navBarShell}`}
          style={{ WebkitBackdropFilter: 'blur(22px)', backdropFilter: 'blur(22px)' }}
        >
          <div
            className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
            aria-hidden
          />
          <div className="relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 lg:gap-4">
            <div className="flex shrink-0 items-center pl-0.5">
              <BrandLogo
                to="/accueil"
                variant="vibrant"
                size="bar"
                priorityLoad
                className="opacity-[0.98]"
              />
            </div>

            <nav
              className="flex min-w-0 flex-wrap items-center justify-center gap-0.5 sm:gap-1"
              aria-label="Navigation principale"
            >
              {navItems.map((item) => (
                <Link key={item.to} to={item.to} className={navLinkClass(item.to)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 justify-end pr-0.5">
              <Link to={topAction?.to ?? '/inscription'} className={ctaPill}>
                {topAction?.label ?? "S'inscrire"}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-col">
        {/* Logo centré — mobile / tablette uniquement */}
        <div className="flex justify-center overflow-x-visible px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pb-5 lg:hidden">
          <span className="inline-flex origin-top max-lg:scale-[1.62] max-lg:drop-shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
            <BrandLogo
              to="/accueil"
              variant="vibrant"
              size="bar"
              priorityLoad
              className="drop-shadow-[0_10px_28px_rgba(0,0,0,0.25)]"
            />
          </span>
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 px-5 pb-16 pt-2 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-20 lg:pt-6">
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
            <div className="order-1 flex min-h-[220px] items-center justify-center py-3 lg:order-2 lg:min-h-[min(560px,72vh)] lg:py-6 xl:min-h-[min(640px,78vh)]">
              <HeroLottie />
            </div>
          ) : null}
        </div>

        <footer className="relative z-10 px-5 py-8 text-center text-xs text-white/45 sm:px-8">
          {footerNote ?? `Fair Play © ${new Date().getFullYear()} · Plateforme de challenges étudiants`}
        </footer>
      </div>
    </div>
  );
}

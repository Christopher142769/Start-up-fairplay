import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../BrandLogo';
import { glassSidebarCard, teamShell } from '../team/TeamDashboardLayout';

const homeVibeHeader = 'bg-gradient-to-b from-[#2E0854] via-[#5b0d6f] to-[#721c70]';

function MobileWave({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`block w-full text-[#e6e2f5] ${className}`}
      viewBox="0 0 390 56"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M0 28C48 8 96 4 146 18c58 18 116 18 174 0 50-14 98-10 146 10 42 16 84 20 124 8v20H0V28z"
      />
    </svg>
  );
}

type Props = {
  children: ReactNode;
  onLogout: () => void;
};

export function AdminDashboardLayout({ children, onLogout }: Props) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className={`relative flex min-h-screen ${teamShell}`}>
      {mobileNav ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/55 lg:hidden"
          aria-label="Fermer le menu"
          onClick={() => setMobileNav(false)}
        />
      ) : null}

      <div className="relative z-10 flex min-h-screen w-full">
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[min(100%,300px)] flex-col border-r border-white/15 bg-gradient-to-b from-[#2E0854] via-[#5b0d6f] to-[#4a0d55] px-4 py-6 shadow-2xl transition-[transform] duration-200 ease-out will-change-transform lg:static lg:z-20 lg:min-h-screen lg:w-72 lg:shrink-0 lg:bg-gradient-to-b lg:from-[#2E0854] lg:via-[#5b0d6f] lg:to-[#6b0a6b] lg:shadow-xl lg:transition-none lg:will-change-auto lg:border-white/10 ${
            mobileNav ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between gap-2 lg:block">
            <BrandLogo to="/accueil" variant="vibrant" size="dashboard" />
            <button
              type="button"
              className="rounded-lg border border-white/15 bg-white/5 p-2 lg:hidden"
              aria-label="Fermer"
              onClick={() => setMobileNav(false)}
            >
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className={`mt-6 ${glassSidebarCard} p-4`}>
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-vibe-coral/90 via-vibe-cyan/50 to-[#5b0d6f] text-sm font-bold uppercase tracking-wide text-white shadow-lg ring-2 ring-vibe-cyan/40">
                AD
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold leading-snug text-white">Organisation</p>
                <p className="mt-1 text-xs text-white/55">Fair Play — espace admin</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            <p className="mb-1 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Menu</p>
            <span className="rounded-xl bg-gradient-to-r from-vibe-coral/20 to-vibe-cyan/15 px-3 py-3 text-sm font-semibold text-white shadow-md ring-1 ring-vibe-cyan/35">
              Groupes &amp; messages
            </span>
          </nav>

          <div className="mt-auto space-y-2 border-t border-white/10 pt-6">
            <Link
              to="/connexion"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              onClick={() => setMobileNav(false)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Espace groupes
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="w-full rounded-xl border border-red-400/30 bg-red-500/10 py-2.5 text-sm font-semibold text-red-200/95 transition hover:bg-red-500/18"
            >
              Déconnexion
            </button>
          </div>
        </aside>

        <div className={`flex min-w-0 flex-1 flex-col ${teamShell}`}>
          <div className="relative z-20 shrink-0 overflow-hidden">
            <div
              className={`relative ${homeVibeHeader} px-4 pb-14 pt-[max(0.65rem,env(safe-area-inset-top))] shadow-[0_20px_50px_rgba(46,8,84,0.45)] lg:px-8 lg:pb-8 lg:pt-6`}
            >
              <div className="flex items-center justify-between gap-3">
                <BrandLogo to="/accueil" variant="vibrant" size="dashboard" />
                <div className="flex items-center gap-2">
                  <span
                    className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-vibe-coral via-vibe-cyan/80 to-[#5b0d6f] text-sm font-bold uppercase tracking-wide text-white shadow-[0_10px_28px_rgba(34,211,238,0.35),inset_0_2px_0_rgba(255,255,255,0.22)] ring-2 ring-vibe-cyan/50 lg:inline-flex"
                    aria-hidden
                  >
                    AD
                  </span>
                  <button
                    type="button"
                    className="flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md lg:hidden"
                    aria-label="Ouvrir le menu"
                    onClick={() => setMobileNav(true)}
                  >
                    <span className="h-0.5 w-[20px] rounded-full bg-white/90" />
                    <span className="h-0.5 w-[20px] rounded-full bg-white/90" />
                    <span className="h-0.5 w-[12px] self-end rounded-full bg-white/70" />
                  </button>
                </div>
              </div>

              <div className="mt-4 w-full rounded-[1.35rem] border border-white/18 bg-white/[0.07] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl lg:mt-5 lg:max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white/90 shadow-[inset_0_-2px_6px_rgba(0,0,0,0.15)]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Espace organisation</p>
                    <p className="truncate font-display text-sm font-semibold text-white">Groupes inscrits</p>
                    <p className="truncate text-xs text-white/50">Écoles, groupes, suppression</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileNav(true)}
                className="absolute bottom-0 left-1/2 z-10 flex h-[4.25rem] w-[4.25rem] -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-vibe-coral via-vibe-cyan to-[#5b0d6f] text-base font-bold uppercase tracking-wide text-white shadow-[0_14px_40px_rgba(34,211,238,0.4),inset_0_2px_0_rgba(255,255,255,0.22)] ring-[5px] ring-[#e6e2f5] lg:hidden"
                aria-label="Ouvrir le menu"
              >
                AD
              </button>
            </div>
            <MobileWave className="relative z-[1] h-12 w-full lg:h-10" />
          </div>

          <main className="relative z-10 flex min-h-0 flex-1 flex-col px-3 pt-2 pb-10 sm:px-6 max-lg:pt-3 lg:px-8 lg:pt-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

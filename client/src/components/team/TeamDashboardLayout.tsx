import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../BrandLogo';

export type TeamTab = 'home' | 'files' | 'msg';

type Props = {
  groupName: string;
  schoolName: string;
  leaderEmail: string;
  initials: string;
  activeTab: TeamTab;
  onTab: (t: TeamTab) => void;
  unreadMessages: number;
  onLogout: () => void;
  onMobileFab?: () => void;
  children: ReactNode;
};

/** @deprecated Préférer teamShell — conservé pour imports existants */
export const teamCream = 'bg-[#e6e2f5]';
/** Fond unique dashboard équipe (accueil / nav / web) */
export const teamShell = 'bg-[#e6e2f5]';
/** Alias lavande = coquille dashboard */
export const teamMobileLavender = 'bg-[#e6e2f5]';
/** Panneau sombre type liste / chat */
export const teamInk = 'bg-[#16101f]';

/** Même violet que `VibeBackdrop` / page d’accueil (SplitLayout) */
export const homeVibeGradient = 'bg-gradient-to-br from-[#2E0854] via-[#5b0d6f] to-[#8B008B]';
const homeVibeHeader = 'bg-gradient-to-b from-[#2E0854] via-[#5b0d6f] to-[#721c70]';

function IconFolder({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    </svg>
  );
}

function IconChat({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  );
}

function IconLayout({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.25} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
      />
    </svg>
  );
}

function IconUpload({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

const glassSidebarCard =
  'rounded-2xl border border-white/10 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]';

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

export function TeamDashboardLayout({
  groupName,
  schoolName,
  leaderEmail,
  initials,
  activeTab,
  onTab,
  unreadMessages,
  onLogout,
  onMobileFab,
  children,
}: Props) {
  const [mobileNav, setMobileNav] = useState(false);

  const tabBtn = (id: TeamTab, label: string, icon: ReactNode, badge?: number) => {
    const active = activeTab === id;
    return (
      <button
        type="button"
        onClick={() => {
          onTab(id);
          setMobileNav(false);
        }}
        className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
          active
            ? 'bg-gradient-to-r from-vibe-coral/20 to-vibe-cyan/15 text-white shadow-md ring-1 ring-vibe-cyan/35'
            : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
        }`}
      >
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            active ? 'bg-vibe-coral/25 text-white' : 'bg-white/10 text-white/85'
          }`}
        >
          {icon}
        </span>
        {label}
        {badge != null && badge > 0 ? (
          <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-vibe-coral px-1.5 text-[11px] font-bold text-white shadow-coral">
            {badge > 99 ? '99+' : badge}
          </span>
        ) : null}
      </button>
    );
  };

  const inits = initials.slice(0, 2);

  return (
    <div className={`relative flex min-h-screen ${teamShell}`}>
      {/* Voile mobile : net, sans flou fort */}
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
            <BrandLogo to="/" variant="vibrant" compact />
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
                {inits}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold leading-snug text-white">{groupName}</p>
                <p className="mt-1 text-xs text-white/55">{schoolName}</p>
                <p className="mt-0.5 truncate text-[11px] text-white/40">{leaderEmail}</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex flex-col gap-2">
            <p className="mb-1 px-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Menu</p>
            {tabBtn('home', 'Accueil', <IconLayout />)}
            {tabBtn('files', 'Soumissions', <IconFolder />)}
            {tabBtn('msg', 'Messages', <IconChat />, unreadMessages)}
          </nav>

          <div className="mt-auto space-y-2 border-t border-white/10 pt-6">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              onClick={() => setMobileNav(false)}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Site public
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
          {/* En-tête : même bloc vague + glass sur mobile et desktop */}
          <div className="relative z-20 shrink-0 overflow-hidden">
            <div
              className={`relative ${homeVibeHeader} px-4 pb-14 pt-[max(0.65rem,env(safe-area-inset-top))] shadow-[0_20px_50px_rgba(46,8,84,0.45)] lg:px-8 lg:pb-8 lg:pt-6`}
            >
              <div className="flex items-center justify-between gap-3">
                <BrandLogo to="/" variant="vibrant" compact />
                <div className="flex items-center gap-2">
                  <span
                    className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-vibe-coral via-vibe-cyan/80 to-[#5b0d6f] text-sm font-bold uppercase tracking-wide text-white shadow-[0_10px_28px_rgba(34,211,238,0.35),inset_0_2px_0_rgba(255,255,255,0.22)] ring-2 ring-vibe-cyan/50 lg:inline-flex"
                    aria-hidden
                  >
                    {inits}
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
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Espace équipe</p>
                    <p className="truncate font-display text-sm font-semibold text-white">{schoolName}</p>
                    <p className="truncate text-xs text-white/50">{groupName}</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileNav(true)}
                className="absolute bottom-0 left-1/2 z-10 flex h-[4.25rem] w-[4.25rem] -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-vibe-coral via-vibe-cyan to-[#5b0d6f] text-base font-bold uppercase tracking-wide text-white shadow-[0_14px_40px_rgba(34,211,238,0.4),inset_0_2px_0_rgba(255,255,255,0.22)] ring-[5px] ring-[#e6e2f5] lg:hidden"
                aria-label="Ouvrir le menu et le compte"
              >
                {inits}
              </button>
            </div>
            <MobileWave className="relative z-[1] h-12 w-full lg:h-10" />
          </div>

          <main className="relative z-10 flex min-h-0 flex-1 flex-col px-3 pt-2 pb-8 max-lg:pb-[calc(6.35rem+env(safe-area-inset-bottom,0px))] sm:px-6 max-lg:pt-3 lg:px-8 lg:pt-6">
            {children}
          </main>

          {/* Barre basse mobile : icônes seules, très contrastées (blanc / cyan comme liens accueil) */}
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] lg:hidden">
            <div className="pointer-events-auto border-t border-[#2E0854]/20 bg-[#e6e2f5] px-3 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))] pt-2 shadow-[0_-10px_36px_rgba(46,8,84,0.15)]">
              <nav
                className="relative mx-auto flex min-h-[4rem] w-full max-w-[32rem] items-center justify-between gap-1 rounded-[3rem] border-2 border-white bg-[#2E0854] px-2 py-1.5 shadow-[0_16px_48px_rgba(46,8,84,0.55),inset_0_1px_0_rgba(255,255,255,0.12)]"
                aria-label="Navigation principale"
              >
                <button
                  type="button"
                  onClick={() => {
                    onTab('home');
                    setMobileNav(false);
                  }}
                  className="flex flex-1 items-center justify-center py-1.5 transition active:scale-[0.96]"
                  aria-label="Accueil"
                >
                  <span
                    className={`flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full text-sm font-bold uppercase tracking-tight shadow-lg ${
                      activeTab === 'home'
                        ? 'bg-vibe-coral text-white ring-[3px] ring-white'
                        : 'bg-white text-[#1a0a2e] ring-2 ring-neutral-900/20'
                    }`}
                  >
                    {inits}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onTab('files');
                    setMobileNav(false);
                  }}
                  className="flex flex-1 items-center justify-center py-1.5 transition active:scale-[0.96]"
                  aria-label="Soumissions et fichiers"
                >
                  <span
                    className={`flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full shadow-md ${
                      activeTab === 'files'
                        ? 'bg-vibe-cyan text-white ring-[3px] ring-white'
                        : 'bg-gradient-to-br from-[#2E0854] via-[#5b0d6f] to-[#8B008B] text-white ring-2 ring-white/45'
                    }`}
                  >
                    <IconFolder className="h-8 w-8 shrink-0 drop-shadow-sm" />
                  </span>
                </button>

                <div className="relative flex w-11 shrink-0 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      onMobileFab?.();
                      setMobileNav(false);
                    }}
                    className="absolute -top-[2.15rem] flex h-[3.15rem] w-[3.15rem] items-center justify-center rounded-full bg-gradient-to-br from-[#2E0854] via-[#5b0d6f] to-[#8B008B] text-white shadow-[0_10px_28px_rgba(46,8,84,0.55),0_6px_18px_rgba(0,0,0,0.35)] ring-4 ring-white transition active:scale-95"
                    aria-label={activeTab === 'msg' ? 'Écrire un message' : 'Téléverser des fichiers'}
                  >
                    <IconUpload className="h-7 w-7 shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onTab('msg');
                    setMobileNav(false);
                  }}
                  className="relative flex flex-1 items-center justify-center py-1.5 transition active:scale-[0.96]"
                  aria-label="Messages"
                >
                  <span className="relative">
                    <span
                      className={`flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full shadow-md ${
                        activeTab === 'msg'
                          ? 'bg-vibe-cyan text-white ring-[3px] ring-white'
                          : 'bg-gradient-to-br from-[#2E0854] via-[#5b0d6f] to-[#8B008B] text-white ring-2 ring-white/45'
                      }`}
                    >
                      <IconChat className="h-8 w-8 shrink-0 drop-shadow-sm" />
                    </span>
                    {unreadMessages > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-vibe-coral px-1 text-[10px] font-bold leading-none text-white shadow-md">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    ) : null}
                  </span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Cartes glass (même traitement mobile & web, sur fond lavande) */
export const lightPanel =
  'rounded-3xl border border-white/55 bg-white/50 shadow-[10px_10px_28px_rgba(100,90,140,0.12),-6px_-6px_22px_rgba(255,255,255,0.85),inset_0_1px_0_rgba(255,255,255,0.65)] ring-1 ring-white/45 backdrop-blur-xl';

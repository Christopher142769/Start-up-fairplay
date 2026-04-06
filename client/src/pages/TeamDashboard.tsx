import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  lightPanel,
  teamInk,
  teamMobileLavender,
  TeamDashboardLayout,
  type TeamTab,
} from '../components/team/TeamDashboardLayout';
import { CoralButton } from '../components/vibrant-ui';
import { api, getGroupToken, setGroupToken } from '../lib/api';

type Me = {
  id: string;
  groupName: string;
  leaderEmail: string;
  school: { name: string };
  unreadMessages?: number;
};

type Sub = {
  _id: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

type Msg = { _id: string; fromRole: 'admin' | 'group'; body: string; createdAt: string };

function formatBytes(n: number) {
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
}

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase() || 'FP';
}

function firstNameFromGroup(name: string) {
  const p = name.trim().split(/\s+/)[0];
  return p || name;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dayLabel(d: Date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(d, today)) return "Aujourd'hui";
  if (isSameDay(d, yesterday)) return 'Hier';
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

const chatInputClass =
  'max-h-36 min-h-[52px] w-full resize-none rounded-2xl border-2 border-neutral-800 bg-white px-4 py-3.5 text-base leading-snug text-neutral-900 placeholder:text-neutral-600 shadow-inner outline-none transition focus:border-vibe-cyan focus:ring-4 focus:ring-vibe-cyan/30 lg:min-h-[48px] lg:border-2 lg:border-stone-400 lg:py-3 lg:text-sm lg:text-stone-900 lg:shadow-sm lg:focus:border-[#2E0854] lg:focus:ring-2 lg:focus:ring-vibe-cyan/35';

/** Panneaux section fichiers : fond blanc net (lisible sur mobile / verre) */
const filesSolidPanel =
  'rounded-3xl border-2 border-neutral-800/20 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] ring-1 ring-neutral-900/5';

function IconFolderBold({ className = 'h-8 w-8' }: { className?: string }) {
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

function IconUploadBold({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2.75} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

export function TeamDashboard() {
  const nav = useNavigate();
  const [me, setMe] = useState<Me | null>(null);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [reply, setReply] = useState('');
  const [tab, setTab] = useState<TeamTab>('home');
  const [files, setFiles] = useState<FileList | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [up, setUp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  function handleMobileFab() {
    if (tab === 'msg') {
      document.getElementById('team-reply-textarea')?.focus();
      return;
    }
    if (tab === 'home') setTab('files');
    window.requestAnimationFrame(() => fileInputRef.current?.click());
  }

  const load = useCallback(async () => {
    if (!getGroupToken()) {
      nav('/connexion');
      return;
    }
    setErr(null);
    try {
      const [m, s, box] = await Promise.all([
        api<Me>('/api/team/me', { auth: 'group' }),
        api<Sub[]>('/api/team/submissions', { auth: 'group' }),
        api<{ messages: Msg[] }>('/api/team/messages', { auth: 'group' }),
      ]);
      setMe(m);
      setSubs(s);
      setMsgs(box.messages);
    } catch (e) {
      if (e instanceof Error && e.message.includes('Non autorisé')) {
        setGroupToken(null);
        nav('/connexion');
        return;
      }
      setErr(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [nav]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const id = window.setInterval(load, 20000);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    if (tab === 'msg') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tab, msgs]);

  const totalBytes = useMemo(() => subs.reduce((a, f) => a + f.size, 0), [subs]);
  /** Repère visuel type « stockage » (pas une limite serveur) */
  const softQuotaBytes = 512 * 1024 * 1024;
  const storageBarPct =
    totalBytes === 0 ? 0 : Math.max(5, Math.min(100, (totalBytes / softQuotaBytes) * 100));

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    if (!files?.length) {
      setErr('Sélectionnez au moins un fichier');
      return;
    }
    setErr(null);
    setUp(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('files', f));
      const prefix = import.meta.env.VITE_API_URL ?? '';
      const res = await fetch(`${prefix}/api/team/submissions`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getGroupToken()}` },
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { error?: string }).error || 'Échec envoi');
      setFiles(null);
      (e.target as HTMLFormElement).reset();
      await load();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    } finally {
      setUp(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce fichier ?')) return;
    setErr(null);
    try {
      await api(`/api/team/submissions/${id}`, { method: 'DELETE', auth: 'group' });
      await load();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    }
  }

  async function sendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!reply.trim()) return;
    setErr(null);
    try {
      await api('/api/team/messages', {
        method: 'POST',
        auth: 'group',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: reply }),
      });
      setReply('');
      await load();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    }
  }

  function logout() {
    setGroupToken(null);
    nav('/');
  }

  if (loading || !me) {
    return (
      <div className={`relative min-h-screen ${teamMobileLavender}`}>
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className={`${lightPanel} max-w-sm px-10 py-10 text-center`}>
            <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-gradient-to-tr from-vibe-coral to-fuchsia-500" />
            <p className="text-sm font-semibold text-stone-800">Chargement de ton espace…</p>
            <p className="mt-2 text-xs text-stone-500">Patience, tout arrive.</p>
          </div>
        </div>
      </div>
    );
  }

  const unread = me.unreadMessages ?? 0;
  const inits = initialsFromName(me.groupName);

  const errBanner =
    err != null ? (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 shadow-sm">
        {err}
      </div>
    ) : null;

  return (
    <TeamDashboardLayout
      groupName={me.groupName}
      schoolName={me.school?.name ?? '—'}
      leaderEmail={me.leaderEmail}
      initials={inits}
      activeTab={tab}
      onTab={setTab}
      unreadMessages={unread}
      onLogout={logout}
      onMobileFab={handleMobileFab}
    >
      <div className="flex min-h-0 flex-1 flex-col space-y-6 max-lg:animate-team-panel-in lg:animate-none motion-reduce:animate-none">
        {errBanner}

        {tab === 'home' ? (
          <section className={`${lightPanel} p-5 sm:p-8`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-medium text-stone-500 lg:text-sm">Bonjour 👋</p>
                <h1 className="mt-1 font-display text-xl font-bold leading-tight tracking-tight text-stone-900 sm:text-2xl lg:text-3xl">
                  {firstNameFromGroup(me.groupName)}
                  <span className="text-stone-400">,</span>{' '}
                  <span className="bg-gradient-to-r from-vibe-coral via-fuchsia-500 to-fuchsia-700 bg-clip-text text-transparent">
                    équipe en forme ?
                  </span>
                </h1>
                <p className="mt-2 text-sm text-stone-600">{me.groupName}</p>
                <p className="text-xs text-stone-500">{me.school?.name}</p>
              </div>
              <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-vibe-coral via-fuchsia-500 to-fuchsia-800 text-lg font-bold uppercase tracking-wide text-white shadow-[0_12px_32px_rgba(255,77,109,0.35)] ring-4 ring-[#e6e2f5] lg:flex">
                {inits.slice(0, 2)}
              </div>
            </div>

            {/* Mobile : carte type « MyDocs » + raccourcis squircle */}
            <div className="mt-6 space-y-4 lg:hidden">
              <div className="rounded-[1.35rem] border border-white/60 bg-white/40 p-5 shadow-[10px_10px_26px_rgba(100,90,140,0.14),-5px_-5px_18px_rgba(255,255,255,0.88),inset_0_1px_0_rgba(255,255,255,0.75)] ring-1 ring-white/50 backdrop-blur-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Mes dépôts</p>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <p className="font-display text-4xl font-bold tabular-nums text-stone-900">{subs.length}</p>
                  <span className="pb-1 text-right text-xs font-medium text-stone-600">
                    fichiers · {formatBytes(totalBytes)}
                  </span>
                </div>
                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-stone-300/40 shadow-[inset_0_2px_4px_rgba(45,38,80,0.12)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-vibe-coral via-fuchsia-500 to-[#a855f7] shadow-[0_0_12px_rgba(236,72,153,0.35)] transition-all duration-500"
                    style={{ width: `${storageBarPct}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-stone-500">Indicateur visuel — pas une limite imposée.</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTab('files')}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[#2E0854]/35 bg-gradient-to-br from-[#2E0854] via-[#5b0d6f] to-[#8B008B] py-4 text-white shadow-[0_10px_24px_rgba(46,8,84,0.35)] transition active:scale-[0.97]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-vibe-cyan text-white shadow-[0_8px_22px_rgba(34,211,238,0.45)] ring-2 ring-white/35">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                      />
                    </svg>
                  </span>
                  <span className="text-center text-[9px] font-bold uppercase tracking-wide text-white/95">Fichiers</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTab('msg')}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[#2E0854]/35 bg-gradient-to-br from-[#2E0854] via-[#5b0d6f] to-[#8B008B] py-4 text-white shadow-[0_10px_24px_rgba(46,8,84,0.35)] transition active:scale-[0.97]"
                >
                  <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-vibe-cyan text-white shadow-[0_8px_22px_rgba(34,211,238,0.45)] ring-2 ring-white/35">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                      />
                    </svg>
                    {unread > 0 ? (
                      <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-vibe-coral px-1 text-[8px] font-bold text-white">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-center text-[9px] font-bold uppercase tracking-wide text-white/95">Messages</span>
                </button>
                <button
                  type="button"
                  onClick={handleMobileFab}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-[#2E0854]/35 bg-gradient-to-br from-[#2E0854] via-[#5b0d6f] to-[#8B008B] py-4 text-white shadow-[0_10px_24px_rgba(46,8,84,0.35)] transition active:scale-[0.97]"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-vibe-coral to-fuchsia-600 text-white shadow-[0_8px_20px_rgba(236,72,153,0.35)]">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.25} stroke="currentColor" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </span>
                  <span className="text-center text-[9px] font-bold uppercase tracking-wide text-white/95">Envoyer</span>
                </button>
              </div>
            </div>

            <div className="mt-8 hidden gap-3 lg:grid lg:grid-cols-3">
              <div className={`${teamInk} rounded-2xl p-5 text-white`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Fichiers</p>
                <p className="mt-1 font-display text-3xl font-bold tabular-nums">{subs.length}</p>
              </div>
              <div className={`${teamInk} rounded-2xl p-5 text-white`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Volume</p>
                <p className="mt-1 font-display text-xl font-bold tabular-nums text-vibe-cyan">{formatBytes(totalBytes)}</p>
              </div>
              <div
                className={`rounded-2xl border border-stone-200 bg-stone-50 p-5 ${
                  unread > 0 ? 'ring-2 ring-vibe-coral/30' : ''
                }`}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Messages</p>
                <p className="mt-1 font-display text-3xl font-bold tabular-nums text-stone-900">{unread}</p>
                <p className="text-xs text-stone-500">non lus</p>
              </div>
            </div>

            <div className="mt-8 hidden flex-wrap gap-3 lg:flex">
              <button
                type="button"
                onClick={() => setTab('files')}
                className="rounded-pill border-2 border-[#2E0854] bg-gradient-to-r from-[#2E0854] to-[#5b0d6f] px-6 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(46,8,84,0.35)] transition hover:brightness-110"
              >
                Soumissions
              </button>
              <button
                type="button"
                onClick={() => setTab('msg')}
                className="rounded-pill border-2 border-vibe-coral bg-vibe-coral px-6 py-2.5 text-sm font-bold text-white shadow-coral transition hover:bg-vibe-coralHover"
              >
                Ouvrir le chat
              </button>
            </div>
          </section>
        ) : null}

        {tab === 'files' ? (
          <>
            <div className="flex flex-wrap gap-3">
              <div className={`${filesSolidPanel} flex min-w-[10rem] flex-1 items-center gap-3 px-4 py-3.5`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-vibe-cyan text-white shadow-md ring-2 ring-[#0e7490]/30">
                  <IconFolderBold className="h-7 w-7" />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wide text-neutral-600">Fichiers</span>
                  <p className="font-display text-2xl font-bold tabular-nums text-neutral-900">{subs.length}</p>
                </div>
              </div>
              <div className={`${filesSolidPanel} flex min-w-[10rem] flex-1 items-center gap-3 px-4 py-3.5`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-vibe-coral text-white shadow-md ring-2 ring-[#2E0854]/25">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.5m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v1.5m18 0H3" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wide text-neutral-600">Volume</span>
                  <p className="truncate font-display text-lg font-bold tabular-nums text-neutral-900">{formatBytes(totalBytes)}</p>
                </div>
              </div>
            </div>

            <div className={`${filesSolidPanel} p-5 sm:p-7`}>
              <h2 className="font-display text-lg font-bold text-neutral-900">Envoyer des fichiers</h2>
              <p className="mt-2 text-sm font-medium text-neutral-700">
                PDF, Office, images, vidéos — <strong className="text-neutral-950">200 Mo</strong> max par fichier.
              </p>
              <form className="mt-6 space-y-5" onSubmit={upload}>
                <input
                  ref={fileInputRef}
                  id="team-submissions-file-input"
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpeg,.jpg,.mp4,.webm,.mov,.avi,.mkv,.mpeg,.mpg,.m4v,.3gp"
                  className="sr-only"
                />
                <label
                  htmlFor="team-submissions-file-input"
                  className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#2E0854]/60 bg-gradient-to-br from-[#f1ecff] via-[#ece8f8] to-[#e7e2f6] px-4 py-10 text-center shadow-inner transition hover:border-vibe-cyan hover:shadow-md"
                >
                  <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-vibe-cyan text-white shadow-[0_8px_28px_rgba(34,211,238,0.45)] ring-4 ring-white">
                    <IconUploadBold className="h-11 w-11" />
                  </span>
                  <span className="space-y-1">
                    <span className="block font-display text-lg font-bold text-neutral-900">Choisir des fichiers</span>
                    <span className="block text-sm text-neutral-700">Touche pour ouvrir la galerie ou les documents</span>
                  </span>
                  {files != null && files.length > 0 ? (
                    <span className="rounded-full bg-vibe-coral px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md">
                      {files.length} sélectionné{files.length > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-neutral-500">Aucun fichier sélectionné pour l’instant</span>
                  )}
                </label>
                <CoralButton
                  type="submit"
                  className="flex w-full items-center justify-center gap-3 border-2 border-[#2E0854] py-4 shadow-[0_8px_28px_rgba(255,77,109,0.5)] sm:w-auto lg:px-12 lg:py-4 lg:text-base"
                  disabled={up}
                >
                  <IconUploadBold className="h-6 w-6 shrink-0 text-white lg:h-5 lg:w-5" />
                  {up ? 'Envoi en cours…' : 'Téléverser'}
                </CoralButton>
              </form>
            </div>

            <div
              className={`${teamInk} overflow-hidden rounded-t-[2rem] px-4 pb-8 pt-6 text-white sm:px-6 sm:pt-8 max-lg:rounded-[1.35rem] max-lg:border-2 max-lg:border-white/25 max-lg:bg-gradient-to-br max-lg:from-[#2E0854] max-lg:via-[#5b0d6f] max-lg:to-[#8B008B]`}
            >
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/30">
                  <IconFolderBold className="h-5 w-5" />
                </span>
                <h2 className="font-display text-lg font-bold text-white">Fichiers déposés</h2>
              </div>
              <ul className="mt-4 max-h-[min(52vh,480px)] space-y-2 overflow-y-auto pr-1">
                {subs.length === 0 ? (
                  <li className="rounded-2xl border-2 border-white/25 bg-white/10 py-10 text-center text-sm font-medium text-white/90">
                    Aucun fichier — choisis des pièces ci-dessus puis envoie-les.
                  </li>
                ) : (
                  subs.map((f) => (
                    <li
                      key={f._id}
                      className="flex items-center justify-between gap-3 rounded-2xl border-2 border-white/20 bg-white/10 px-3 py-3 text-sm shadow-sm backdrop-blur-sm transition hover:border-white/35 hover:bg-white/15"
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white ring-1 ring-white/25">
                          <IconFolderBold className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-white">{f.originalName}</p>
                          <p className="text-xs text-white/70">
                            {formatBytes(f.size)} · {new Date(f.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(f._id)}
                        className="shrink-0 rounded-xl border-2 border-red-300/50 bg-red-600/25 px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-red-600/40"
                      >
                        Supprimer
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </>
        ) : null}

        {tab === 'msg' ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border-2 border-neutral-700/30 bg-white shadow-md ring-1 ring-stone-400/50 backdrop-blur-sm max-lg:rounded-[1.5rem] max-lg:border-neutral-800/40 max-lg:shadow-[0_12px_40px_rgba(46,8,84,0.22)] lg:max-h-[calc(100vh-7rem)] lg:border-2 lg:border-stone-400 lg:bg-white lg:shadow-lg lg:ring-stone-300/80">
            <div className="flex shrink-0 items-center gap-3 border-b-2 border-stone-400 bg-white px-4 py-3 sm:px-5 lg:border-b-2 lg:border-stone-400 lg:bg-white">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-vibe-coral via-vibe-cyan/70 to-[#5b0d6f] text-sm font-bold text-white shadow-md ring-2 ring-vibe-cyan/40">
                FP
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400" />
              </span>
              <div>
                <p className="font-display font-bold text-stone-900">Fair Play</p>
                <p className="text-xs text-stone-500">Organisation · réponses sous 24–48 h</p>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-stone-200 px-3 py-4 sm:px-5 max-lg:bg-neutral-200 lg:bg-stone-200">
              {msgs.length === 0 ? (
                <p className="py-16 text-center text-sm font-medium text-neutral-700">
                  Aucun message pour l’instant. Écris un premier mot pour lancer la conversation.
                </p>
              ) : (
                msgs.map((m, i) => {
                  const d = new Date(m.createdAt);
                  const prev = i > 0 ? new Date(msgs[i - 1].createdAt) : null;
                  const showDay = !prev || !isSameDay(d, prev);
                  return (
                    <div key={m._id}>
                      {showDay ? (
                        <div className="mb-3 flex justify-center">
                          <span className="rounded-full border-2 border-stone-500 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-neutral-800 shadow-md">
                            {dayLabel(d)}
                          </span>
                        </div>
                      ) : null}
                      <div className={`flex ${m.fromRole === 'group' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[min(88%,28rem)] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                            m.fromRole === 'group'
                              ? 'rounded-br-md bg-gradient-to-br from-vibe-coral via-vibe-cyan to-[#5b0d6f] text-white shadow-lg [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]'
                              : 'rounded-bl-md border-2 border-neutral-700 bg-white text-neutral-900 shadow-md'
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>
                          <p
                            className={`mt-1.5 text-right text-[10px] tabular-nums ${
                              m.fromRole === 'group' ? 'text-white/75' : 'text-stone-400'
                            }`}
                          >
                            {d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={sendReply}
              className="shrink-0 border-t-2 border-neutral-400 bg-white p-3 sm:p-4 max-lg:border-neutral-600 max-lg:shadow-[0_-6px_28px_rgba(46,8,84,0.12)] lg:border-t-2 lg:border-stone-400 lg:bg-white lg:shadow-[inset_0_1px_0_rgba(255,255,255,1)]"
            >
              <div className="flex items-end gap-3">
                <textarea
                  id="team-reply-textarea"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  required
                  rows={1}
                  className={chatInputClass}
                  placeholder="Message…"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      (e.target as HTMLTextAreaElement).form?.requestSubmit();
                    }
                  }}
                />
                <button
                  type="submit"
                  className="flex h-[3.35rem] w-[3.35rem] shrink-0 items-center justify-center rounded-2xl bg-vibe-cyan text-white shadow-[0_6px_22px_rgba(34,211,238,0.55)] ring-2 ring-[#0e7490] ring-offset-2 ring-offset-white transition hover:brightness-105 active:scale-[0.97] disabled:opacity-50 lg:h-12 lg:w-12 lg:rounded-full lg:bg-vibe-coral lg:text-white lg:shadow-[0_8px_24px_rgba(255,77,109,0.55)] lg:ring-2 lg:ring-[#2E0854] lg:ring-offset-2 lg:ring-offset-white lg:hover:bg-vibe-coralHover"
                  aria-label="Envoyer"
                >
                  <svg className="h-7 w-7 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.75} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </TeamDashboardLayout>
  );
}

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardLayout } from '../components/admin/AdminDashboardLayout';
import { CoralButton } from '../components/vibrant-ui';
import { lightPanel, teamInk } from '../components/team/TeamDashboardLayout';
import { api, getAdminToken, setAdminToken } from '../lib/api';
import { ADMIN_ENTRY_PATH } from '../lib/adminPaths';

type GroupRow = {
  _id: string;
  groupName: string;
  leaderEmail: string;
  school: { name: string };
  fileCount: number;
  adminUnread?: number;
  createdAt: string;
};

type Msg = { _id: string; fromRole: 'admin' | 'group'; body: string; createdAt: string };

type SchoolRow = { _id: string; name: string };

const prefix = import.meta.env.VITE_API_URL ?? '';

const tableRow =
  'border-t border-stone-200/80 transition hover:bg-white/60 max-sm:flex max-sm:flex-col max-sm:gap-2 max-sm:py-3 sm:table-row';

export function AdminDashboard() {
  const nav = useNavigate();
  const [rows, setRows] = useState<GroupRow[]>([]);
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [schoolName, setSchoolName] = useState('');
  const [selected, setSelected] = useState<GroupRow | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [body, setBody] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [addingSchool, setAddingSchool] = useState(false);

  const loadSchools = useCallback(async () => {
    try {
      const s = await api<SchoolRow[]>('/api/admin/schools', { auth: 'admin' });
      setSchools(s);
    } catch {
      /* ignore */
    }
  }, []);

  const loadGroups = useCallback(async (): Promise<GroupRow[] | null> => {
    if (!getAdminToken()) {
      nav(ADMIN_ENTRY_PATH);
      return null;
    }
    setErr(null);
    try {
      const g = await api<GroupRow[]>('/api/admin/groups', { auth: 'admin' });
      setRows(g);
      return g;
    } catch (e) {
      if (e instanceof Error && e.message.includes('Non autorisé')) {
        setAdminToken(null);
        nav(ADMIN_ENTRY_PATH);
        return null;
      }
      setErr(e instanceof Error ? e.message : 'Erreur');
      return null;
    } finally {
      setLoading(false);
    }
  }, [nav]);

  useEffect(() => {
    void loadGroups();
    void loadSchools();
  }, [loadGroups, loadSchools]);

  async function openThread(g: GroupRow) {
    setSelected(g);
    setErr(null);
    try {
      const r = await api<{ messages: Msg[] }>(`/api/admin/threads/${g._id}/messages`, { auth: 'admin' });
      setMsgs(r.messages);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur');
    }
  }

  const refreshMsgs = useCallback(async () => {
    if (!selected) return;
    try {
      const r = await api<{ messages: Msg[] }>(`/api/admin/threads/${selected._id}/messages`, {
        auth: 'admin',
      });
      setMsgs(r.messages);
    } catch {
      /* ignore */
    }
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const id = window.setInterval(() => {
      void refreshMsgs();
    }, 12000);
    return () => window.clearInterval(id);
  }, [selected, refreshMsgs]);

  async function sendToGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !body.trim()) return;
    setSending(true);
    setErr(null);
    try {
      await api(`/api/admin/threads/${selected._id}/messages`, {
        method: 'POST',
        auth: 'admin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      });
      setBody('');
      await openThread(selected);
      await loadGroups();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    } finally {
      setSending(false);
    }
  }

  async function removeSchool(id: string, name: string) {
    if (
      !confirm(
        `Supprimer l’école « ${name} » ?\n\nTous les groupes rattachés seront supprimés (fichiers déposés, fil de messages et accès).`
      )
    ) {
      return;
    }
    const prevSelected = selected;
    setErr(null);
    try {
      await api(`/api/admin/schools/${id}`, { method: 'DELETE', auth: 'admin' });
      await loadSchools();
      const g = await loadGroups();
      if (g && prevSelected && !g.some((r) => r._id === prevSelected._id)) {
        setSelected(null);
        setMsgs([]);
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    }
  }

  async function removeGroup(g: GroupRow) {
    if (
      !confirm(
        `Supprimer définitivement le groupe « ${g.groupName} » (${g.leaderEmail}) ?\n\nTous les fichiers, messages et accès seront supprimés.`
      )
    ) {
      return;
    }
    setErr(null);
    try {
      await api(`/api/admin/groups/${g._id}`, { method: 'DELETE', auth: 'admin' });
      if (selected?._id === g._id) {
        setSelected(null);
        setMsgs([]);
      }
      await loadGroups();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    }
  }

  async function addSchool(e: React.FormEvent) {
    e.preventDefault();
    const n = schoolName.trim();
    if (!n) return;
    setErr(null);
    setAddingSchool(true);
    try {
      await api('/api/admin/schools', {
        method: 'POST',
        auth: 'admin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: n }),
      });
      setSchoolName('');
      await loadSchools();
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    } finally {
      setAddingSchool(false);
    }
  }

  function downloadZip(g: GroupRow) {
    const url = `${prefix}/api/admin/groups/${g._id}/submissions.zip`;
    const token = getAdminToken();
    if (!token) return;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error('Téléchargement impossible');
        return res.blob();
      })
      .then((blob) => {
        const u = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = u;
        a.download = `${g.groupName}_${g.school?.name || 'ecole'}.zip`.replace(/\s+/g, '_');
        a.click();
        URL.revokeObjectURL(u);
      })
      .catch(() => setErr('ZIP indisponible (aucun fichier ou erreur réseau)'));
  }

  function logout() {
    setAdminToken(null);
    nav(ADMIN_ENTRY_PATH);
  }

  const errBanner =
    err != null ? (
      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 shadow-sm">
        {err}
      </div>
    ) : null;

  if (loading) {
    return (
      <AdminDashboardLayout onLogout={logout}>
        <div className={`${lightPanel} mx-auto max-w-md px-8 py-12 text-center`}>
          <div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full bg-gradient-to-tr from-vibe-coral to-fuchsia-500" />
          <p className="font-display text-sm font-semibold text-stone-800">Chargement…</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout onLogout={logout}>
      <div className="flex min-h-0 flex-1 flex-col space-y-6 max-lg:animate-team-panel-in lg:animate-none motion-reduce:animate-none">
        {errBanner}

        <section className={`${lightPanel} p-5 sm:p-7`}>
          <h2 className="font-display text-lg font-bold text-stone-900">Écoles proposées à l’inscription</h2>
          <p className="mt-1 text-sm text-stone-600">Les groupes choisissent une école dans cette liste.</p>
          <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={addSchool}>
            <label className="min-w-0 flex-1">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500">Nouvelle école</span>
              <input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Ex. Université Paris Cité"
                className="w-full rounded-2xl border-2 border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 shadow-inner outline-none transition focus:border-vibe-cyan focus:ring-2 focus:ring-vibe-cyan/30"
              />
            </label>
            <CoralButton type="submit" className="shrink-0 sm:w-auto sm:px-8" disabled={addingSchool || !schoolName.trim()}>
              {addingSchool ? 'Ajout…' : 'Ajouter'}
            </CoralButton>
          </form>
          <ul className="mt-4 flex max-h-48 flex-col gap-2 overflow-y-auto sm:max-h-40">
            {schools.length === 0 ? (
              <li className="text-sm text-stone-500">Aucune école — ajoute la première ci-dessus.</li>
            ) : (
              schools.map((s) => (
                <li
                  key={s._id}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-stone-200 bg-white/90 px-3 py-2 text-sm font-medium text-stone-800 shadow-sm"
                >
                  <span className="min-w-0 truncate">{s.name}</span>
                  <button
                    type="button"
                    onClick={() => removeSchool(s._id, s.name)}
                    className="shrink-0 rounded-xl border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 transition hover:bg-red-100"
                  >
                    Supprimer
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <section className={`${lightPanel} overflow-hidden p-0`}>
            <div className="border-b border-white/50 bg-white/30 px-5 py-4 backdrop-blur-sm">
              <h2 className="font-display text-lg font-bold text-stone-900">Utilisateurs — groupes</h2>
              <p className="text-xs text-stone-600">
                Chaque ligne est un compte groupe (chef + école). ZIP, messages ou suppression définitive.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-stone-200 bg-stone-100/80 text-xs font-bold uppercase tracking-wide text-stone-500">
                  <tr>
                    <th className="px-4 py-3">Groupe</th>
                    <th className="px-4 py-3">École</th>
                    <th className="px-4 py-3">Fichiers</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/40">
                  {rows.map((g) => (
                    <tr key={g._id} className={tableRow}>
                      <td className="px-4 py-3 align-top">
                        <p className="font-semibold text-stone-900">{g.groupName}</p>
                        <p className="text-xs text-stone-500">{g.leaderEmail}</p>
                        <p className="mt-0.5 text-[10px] text-stone-400">
                          Inscrit le {new Date(g.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        {(g.adminUnread ?? 0) > 0 ? (
                          <span className="mt-1 inline-block rounded-full bg-vibe-coral/15 px-2 py-0.5 text-[10px] font-bold text-vibe-coral">
                            {g.adminUnread} non lu(s)
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 align-top text-stone-600">{g.school?.name}</td>
                      <td className="px-4 py-3 align-top font-medium text-stone-900">{g.fileCount}</td>
                      <td className="px-4 py-3 align-top text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            disabled={g.fileCount === 0}
                            onClick={() => downloadZip(g)}
                            className="rounded-xl border-2 border-stone-300 bg-white px-3 py-1.5 text-xs font-bold text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            ZIP
                          </button>
                          <button
                            type="button"
                            onClick={() => openThread(g)}
                            className="rounded-xl border-2 border-[#2E0854] bg-gradient-to-r from-[#2E0854] to-[#5b0d6f] px-3 py-1.5 text-xs font-bold text-white shadow-md transition hover:brightness-110"
                          >
                            Messages
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGroup(g)}
                            className="rounded-xl border-2 border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-800 transition hover:bg-red-100"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length === 0 ? (
              <p className="p-6 text-center text-sm text-stone-500">Aucun groupe pour le moment.</p>
            ) : null}
          </section>

          <section className={`${teamInk} flex min-h-[min(70vh,520px)] flex-col overflow-hidden rounded-[1.35rem] border-2 border-white/20 shadow-[0_12px_40px_rgba(46,8,84,0.25)] lg:rounded-3xl`}>
            {selected ? (
              <>
                <div className="flex shrink-0 items-center gap-2 border-b border-white/15 px-4 py-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-white ring-1 ring-white/30">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                      />
                    </svg>
                  </span>
                  <h3 className="font-display text-base font-bold text-white">Discussion — {selected.groupName}</h3>
                </div>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-black/20 px-3 py-4">
                  {msgs.map((m) => (
                    <div key={m._id} className={`flex ${m.fromRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[min(92%,20rem)] rounded-2xl px-4 py-2.5 text-sm shadow-md ${
                          m.fromRole === 'admin'
                            ? 'rounded-br-md bg-gradient-to-br from-vibe-coral via-vibe-cyan to-[#5b0d6f] text-white'
                            : 'rounded-bl-md border border-white/25 bg-white/10 text-white backdrop-blur-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{m.body}</p>
                        <p className={`mt-1 text-right text-[10px] ${m.fromRole === 'admin' ? 'text-white/75' : 'text-white/55'}`}>
                          {new Date(m.createdAt).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {msgs.length === 0 ? (
                    <p className="py-8 text-center text-sm text-white/70">Pas encore d’échange.</p>
                  ) : null}
                </div>
                <form className="shrink-0 border-t border-white/15 bg-black/25 p-3 sm:p-4" onSubmit={sendToGroup}>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                    rows={2}
                    placeholder="Message au groupe…"
                    className="mb-3 w-full resize-none rounded-2xl border-2 border-white/25 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-vibe-cyan focus:ring-2 focus:ring-vibe-cyan/30"
                  />
                  <p className="mb-2 text-[11px] text-white/55">Un e-mail est envoyé au chef de groupe.</p>
                  <CoralButton type="submit" className="w-full sm:w-auto sm:px-10" disabled={sending}>
                    {sending ? 'Envoi…' : 'Envoyer'}
                  </CoralButton>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-white/75">
                Sélectionne un groupe dans le tableau pour ouvrir la conversation.
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

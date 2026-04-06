import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shell } from '../components/Shell';
import { Button, Card, Field, TextArea } from '../components/ui';
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

const prefix = import.meta.env.VITE_API_URL ?? '';

export function AdminDashboard() {
  const nav = useNavigate();
  const [rows, setRows] = useState<GroupRow[]>([]);
  const [selected, setSelected] = useState<GroupRow | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [body, setBody] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadGroups = useCallback(async () => {
    if (!getAdminToken()) {
      nav(ADMIN_ENTRY_PATH);
      return;
    }
    setErr(null);
    try {
      const g = await api<GroupRow[]>('/api/admin/groups', { auth: 'admin' });
      setRows(g);
    } catch (e) {
      if (e instanceof Error && e.message.includes('Non autorisé')) {
        setAdminToken(null);
        nav(ADMIN_ENTRY_PATH);
        return;
      }
      setErr(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [nav]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

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
    nav('/');
  }

  if (loading) {
    return (
      <Shell variant="admin">
        <p className="text-fp-muted">Chargement…</p>
      </Shell>
    );
  }

  return (
    <Shell variant="admin">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fp-ink">Groupes inscrits</h1>
          <p className="mt-1 text-sm text-fp-muted">Export ZIP et messages ciblés.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/">
            <Button variant="ghost">Site public</Button>
          </Link>
          <Button variant="ghost" onClick={logout}>
            Déconnexion
          </Button>
        </div>
      </div>

      {err ? (
        <p className="mb-4 rounded-ui border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="overflow-hidden p-0 sm:p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-fp-line bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-fp-muted">
                <tr>
                  <th className="px-4 py-3">Groupe</th>
                  <th className="px-4 py-3">École</th>
                  <th className="px-4 py-3">Fichiers</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((g) => (
                  <tr key={g._id} className="border-t border-fp-line hover:bg-neutral-50/80">
                    <td className="px-4 py-3">
                      <p className="font-medium text-fp-ink">{g.groupName}</p>
                      <p className="text-xs text-fp-muted">{g.leaderEmail}</p>
                      {(g.adminUnread ?? 0) > 0 ? (
                        <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          {g.adminUnread} non lu(s)
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-fp-muted">{g.school?.name}</td>
                    <td className="px-4 py-3 text-fp-ink">{g.fileCount}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs"
                          disabled={g.fileCount === 0}
                          onClick={() => downloadZip(g)}
                        >
                          ZIP
                        </Button>
                        <Button className="px-2 py-1 text-xs" onClick={() => openThread(g)}>
                          Messages
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 ? (
            <p className="p-6 text-center text-sm text-fp-muted">Aucun groupe pour le moment.</p>
          ) : null}
        </Card>

        <Card>
          {selected ? (
            <>
              <h2 className="text-lg font-semibold text-fp-ink">Discussion — {selected.groupName}</h2>
              <div className="mt-3 max-h-[min(40vh,360px)] space-y-3 overflow-y-auto rounded-ui border border-fp-line bg-neutral-50/50 p-3">
                {msgs.map((m) => (
                  <div
                    key={m._id}
                    className={`flex ${m.fromRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-ui px-4 py-2.5 text-sm ${
                        m.fromRole === 'admin'
                          ? 'rounded-br-sm bg-fp-brand text-white'
                          : 'rounded-bl-sm border border-fp-line bg-fp-card text-fp-ink shadow-card'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.body}</p>
                      <p
                        className={`mt-1 text-[10px] ${m.fromRole === 'admin' ? 'text-white/75' : 'text-fp-muted'}`}
                      >
                        {new Date(m.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
                {msgs.length === 0 ? (
                  <p className="text-center text-sm text-fp-muted">Pas encore d’échange.</p>
                ) : null}
              </div>
              <form className="mt-4 space-y-3" onSubmit={sendToGroup}>
                <Field label="Message au groupe">
                  <TextArea value={body} onChange={(e) => setBody(e.target.value)} required />
                </Field>
                <p className="text-xs text-fp-muted">Un e-mail est envoyé au chef de groupe.</p>
                <Button type="submit" disabled={sending}>
                  {sending ? 'Envoi…' : 'Envoyer'}
                </Button>
              </form>
            </>
          ) : (
            <p className="text-sm text-fp-muted">Sélectionnez un groupe pour la conversation.</p>
          )}
        </Card>
      </div>
    </Shell>
  );
}

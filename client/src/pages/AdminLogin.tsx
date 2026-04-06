import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SplitLayout } from '../components/SplitLayout';
import { CoralButton, MailIcon, VibeField, VibeInput, VibePasswordInput } from '../components/vibrant-ui';
import { api, setAdminToken } from '../lib/api';
import { ADMIN_DASHBOARD_PATH } from '../lib/adminPaths';

export function AdminLogin() {
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await api<{ message?: string }>('/api/admin/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setInfo(r.message ?? 'Code envoyé.');
      setStep(2);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const r = await api<{ token: string }>('/api/admin/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, code }),
      });
      setAdminToken(r.token);
      nav(ADMIN_DASHBOARD_PATH);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SplitLayout
      titleBefore="Backstage"
      titleAccent="Fair Play."
      subtitle="Espace organisation : mot de passe + code e-mail. Pas de reset auto — garde tes accès safe."
      topAction={{ to: '/connexion', label: 'Espace groupes' }}
      showArt
    >
      {step === 1 ? (
        <form className="space-y-5" onSubmit={requestCode}>
          <VibeField label="E-mail administrateur">
            <VibeInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<MailIcon />}
            />
          </VibeField>
          <VibeField label="Mot de passe">
            <VibePasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </VibeField>
          {err ? <p className="text-sm font-medium text-red-300">{err}</p> : null}
          <CoralButton type="submit" disabled={loading}>
            {loading ? 'Envoi…' : 'Recevoir le code'}
          </CoralButton>
        </form>
      ) : (
        <form className="space-y-5" onSubmit={verify}>
          {info ? (
            <p className="rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-3 py-2.5 text-sm text-emerald-100">
              {info}
            </p>
          ) : null}
          <VibeField label="Code à 6 chiffres">
            <VibeInput
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              autoComplete="one-time-code"
              className="text-center text-lg tracking-[0.35em]"
            />
          </VibeField>
          {err ? <p className="text-sm font-medium text-red-300">{err}</p> : null}
          <CoralButton type="submit" disabled={loading || code.length !== 6}>
            {loading ? 'Vérification…' : 'Entrer'}
          </CoralButton>
          <div className="flex justify-center">
            <button
              type="button"
              className="text-sm font-medium text-white/65 hover:text-white"
              onClick={() => {
                setStep(1);
                setCode('');
                setErr(null);
              }}
            >
              ← Retour
            </button>
          </div>
        </form>
      )}
    </SplitLayout>
  );
}

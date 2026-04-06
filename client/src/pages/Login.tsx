import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SplitLayout } from '../components/SplitLayout';
import {
  CoralButton,
  MailIcon,
  VibeDividerOr,
  VibeField,
  VibeInput,
  VibePasswordInput,
} from '../components/vibrant-ui';
import { api, setGroupToken } from '../lib/api';

export function Login() {
  const nav = useNavigate();
  const loc = useLocation() as { state?: { email?: string } };
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (loc.state?.email) setEmail(loc.state.email);
  }, [loc.state]);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    setLoading(true);
    try {
      const r = await api<{ message?: string }>('/api/auth/login/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      setInfo(r.message ?? 'Code envoyé.');
      setStep(2);
      if (remember) {
        try {
          localStorage.setItem('fairplay_remember_email', email);
        } catch {
          /* ignore */
        }
      }
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
      const r = await api<{ token: string }>('/api/auth/login/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, code }),
      });
      setGroupToken(r.token);
      nav('/dashboard');
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SplitLayout
      titleBefore="Connecte-toi à ton"
      titleAccent="compte."
      subtitle="Tu t’es déjà inscrit puis déconnecté ? Saisis ton e-mail et ton mot de passe : on t’envoie un code à 6 chiffres pour rouvrir ton espace."
      topAction={{ to: '/inscription', label: "S'inscrire" }}
    >
      {step === 1 ? (
        <form className="space-y-5" onSubmit={requestCode}>
          <VibeField label="E-mail">
            <VibeInput
              type="email"
              placeholder="chef@groupe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-white/85">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-white/40 bg-white/10 text-vibe-coral focus:ring-vibe-coral"
              />
              Se souvenir de moi
            </label>
            <Link to="/mot-de-passe-oublie" className="text-white/85 underline-offset-4 hover:text-white hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          {err ? <p className="text-sm font-medium text-red-300">{err}</p> : null}
          <CoralButton type="submit" disabled={loading}>
            {loading ? 'Envoi…' : 'Recevoir le code'}
          </CoralButton>
          <VibeDividerOr />
          <p className="text-center text-sm text-white/70">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="font-semibold text-vibe-cyan hover:underline">
              Inscris ton groupe
            </Link>
          </p>
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
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              autoComplete="one-time-code"
              placeholder="• • • • • •"
              className="text-center text-lg tracking-[0.4em]"
            />
          </VibeField>
          {err ? <p className="text-sm font-medium text-red-300">{err}</p> : null}
          <CoralButton type="submit" disabled={loading || code.length !== 6}>
            {loading ? 'Vérification…' : 'Valider & entrer'}
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
              ← Modifier l’e-mail ou le mot de passe
            </button>
          </div>
        </form>
      )}
    </SplitLayout>
  );
}

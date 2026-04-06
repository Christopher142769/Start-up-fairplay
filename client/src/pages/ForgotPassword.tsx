import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SplitLayout } from '../components/SplitLayout';
import { CoralButton, MailIcon, VibeField, VibeInput, VibePasswordInput } from '../components/vibrant-ui';
import { api } from '../lib/api';

export function ForgotPassword() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function request(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);
    try {
      const r = await api<{ message?: string }>('/api/auth/forgot/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setOk(r.message ?? 'Si un compte existe, un code a été envoyé.');
      setStep(2);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await api('/api/auth/forgot/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code,
          newPassword,
          newPasswordConfirm,
        }),
      });
      setOk('Mot de passe mis à jour. Tu peux te connecter.');
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SplitLayout
      titleBefore="Reset ton"
      titleAccent="mot de passe."
      subtitle="Réservé aux groupes : on t’envoie un code à 6 chiffres sur l’e-mail du chef d’équipe."
      topAction={{ to: '/inscription', label: "S'inscrire" }}
      topLink={{ to: '/connexion', label: 'Connexion' }}
    >
      {step === 1 ? (
        <form className="space-y-5" onSubmit={request}>
          <VibeField label="E-mail du chef de groupe">
            <VibeInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={<MailIcon />}
            />
          </VibeField>
          {err ? <p className="text-sm font-medium text-red-300">{err}</p> : null}
          <CoralButton type="submit" disabled={loading}>
            {loading ? 'Envoi…' : 'Recevoir le code'}
          </CoralButton>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={confirm}>
          {ok ? (
            <p className="rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-3 py-2.5 text-sm text-emerald-100">
              {ok}
            </p>
          ) : null}
          <VibeField label="Code reçu">
            <VibeInput
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              className="text-center text-lg tracking-[0.35em]"
            />
          </VibeField>
          <VibeField label="Nouveau mot de passe">
            <VibePasswordInput
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </VibeField>
          <VibeField label="Confirmer">
            <VibePasswordInput
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </VibeField>
          {err ? <p className="text-sm font-medium text-red-300">{err}</p> : null}
          <CoralButton type="submit" disabled={loading}>
            Mettre à jour
          </CoralButton>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-white/70">
        <Link to="/connexion" className="font-semibold text-vibe-cyan hover:underline">
          Retour connexion
        </Link>
      </p>
    </SplitLayout>
  );
}

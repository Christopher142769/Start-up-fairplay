import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SplitLayout } from '../components/SplitLayout';
import {
  CoralButton,
  MailIcon,
  SchoolIcon,
  TeamIcon,
  VibeDividerOr,
  VibeField,
  VibeInput,
  VibePasswordInput,
  VibeSelectStyled,
} from '../components/vibrant-ui';
import { api, setGroupToken } from '../lib/api';

type School = { _id: string; name: string };

export function Register() {
  const nav = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);
  const [groupName, setGroupName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api<School[]>('/api/schools')
      .then(setSchools)
      .catch(() => setErr('Impossible de charger les écoles'));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const data = await api<{ token: string }>('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupName,
          schoolId,
          leaderEmail,
          password,
          passwordConfirm,
        }),
      });
      if (!data.token) {
        throw new Error('Réponse serveur invalide');
      }
      setGroupToken(data.token);
      nav('/dashboard');
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SplitLayout
      titleBefore="Inscris ton"
      titleAccent="crew."
      subtitle="Remplis le formulaire : tu accèdes tout de suite à ton tableau de bord. Le code par e-mail, c’est seulement quand tu reviens après une déconnexion."
      topAction={{ to: '/connexion', label: 'Connexion' }}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <VibeField label="Nom du groupe">
          <VibeInput
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            placeholder="Les invincibles"
            icon={<TeamIcon />}
          />
        </VibeField>
        <VibeField
          label="École"
          hint="La liste est gérée par l'administration. Si ton école n'apparait pas, contacte l'organisation."
        >
          <VibeSelectStyled
            icon={<SchoolIcon />}
            value={schoolId}
            onChange={(e) => setSchoolId(e.target.value)}
            required
            disabled={schools.length === 0}
          >
            <option value="">
              {schools.length === 0 ? 'Aucune école disponible pour le moment' : 'Choisis ton école…'}
            </option>
            {schools.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </VibeSelectStyled>
        </VibeField>
        <VibeField label="E-mail du chef de groupe">
          <VibeInput
            type="email"
            placeholder="chef@groupe.com"
            value={leaderEmail}
            onChange={(e) => setLeaderEmail(e.target.value)}
            required
            icon={<MailIcon />}
          />
        </VibeField>
        <VibeField label="Mot de passe" hint="8 caractères minimum">
          <VibePasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
          />
        </VibeField>
        <VibeField label="Confirmer le mot de passe">
          <VibePasswordInput
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            autoComplete="new-password"
          />
        </VibeField>
        {err ? <p className="text-sm font-medium text-red-300">{err}</p> : null}
        <CoralButton type="submit" className="mt-2" disabled={loading}>
          {loading ? 'Création…' : 'Créer le groupe'}
        </CoralButton>
        <VibeDividerOr />
        <p className="text-center text-sm text-white/70">
          Déjà inscrit ?{' '}
          <Link to="/connexion" className="font-semibold text-vibe-cyan hover:underline">
            Connexion
          </Link>
        </p>
      </form>
    </SplitLayout>
  );
}

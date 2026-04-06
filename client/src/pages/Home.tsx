import { Link } from 'react-router-dom';
import { SplitLayout } from '../components/SplitLayout';
import { VibeDividerOr } from '../components/vibrant-ui';

const coralLinkClass =
  'group relative flex w-full items-center justify-center overflow-hidden rounded-pill bg-vibe-coral py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-coral transition duration-300 hover:-translate-y-0.5 hover:bg-vibe-coralHover hover:shadow-[0_18px_44px_-10px_rgba(255,77,109,0.75)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export function Home() {
  return (
    <SplitLayout
      titleBefore="Ton challenge,"
      titleAccent="version spectaculaire."
      subtitle="Inscris ton equipe. Depose. Echange. Gagne."
      topAction={{ to: '/inscription', label: "S'inscrire" }}
    >
      <div className="flex flex-wrap gap-2">
        <span className="animate-vibe-float rounded-pill border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90">
          Rapide
        </span>
        <span className="animate-vibe-ribbon rounded-pill border border-vibe-cyan/45 bg-vibe-cyan/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-vibe-cyan">
          Fluide
        </span>
        <span className="animate-pulse rounded-pill border border-vibe-pink/45 bg-vibe-pink/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-vibe-pink">
          Immersif
        </span>
      </div>
      <div className="mt-5 rounded-3xl border border-white/25 bg-white/[0.08] p-4 shadow-[0_16px_42px_rgba(17,6,33,0.45)] backdrop-blur-xl sm:p-5">
        <p className="text-sm font-semibold text-white">Accede a ton espace groupe en un instant.</p>
        <p className="mt-1 text-xs text-white/65">
          Inscription immediate, depots simplifies, messagerie directe avec l'organisation.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2.5 text-center">
          <div className="rounded-2xl border border-white/20 bg-[#2E0854]/55 px-2 py-2.5">
            <p className="text-[10px] uppercase tracking-widest text-white/55">Etapes</p>
            <p className="mt-0.5 font-display text-lg font-bold text-vibe-cyan">3</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-[#2E0854]/55 px-2 py-2.5">
            <p className="text-[10px] uppercase tracking-widest text-white/55">Upload</p>
            <p className="mt-0.5 font-display text-lg font-bold text-vibe-pink">200 Mo</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-[#2E0854]/55 px-2 py-2.5">
            <p className="text-[10px] uppercase tracking-widest text-white/55">Support</p>
            <p className="mt-0.5 font-display text-lg font-bold text-vibe-yellow">24/7</p>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        <Link to="/connexion" className={coralLinkClass}>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-full" />
          Se connecter
        </Link>
        <VibeDividerOr />
        <p className="text-center text-sm text-white/75">
          Pas encore de groupe ?{' '}
          <Link to="/inscription" className="font-semibold text-vibe-cyan underline-offset-4 hover:underline">
            Cree ton equipe
          </Link>
        </p>
      </div>
    </SplitLayout>
  );
}

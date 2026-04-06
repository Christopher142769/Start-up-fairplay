import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { BrandLogo } from './BrandLogo';

type Props = { children: ReactNode; variant?: 'public' | 'team' | 'admin' };

export function Shell({ children, variant = 'public' }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-fp-canvas">
      <header className="border-b border-fp-line bg-fp-canvas">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <BrandLogo to="/" size="dashboard" />
          {variant === 'team' && (
            <span className="text-sm font-medium text-fp-muted">Espace groupe</span>
          )}
          {variant === 'admin' && (
            <span className="text-sm font-medium text-fp-muted">Administration</span>
          )}
          {variant === 'public' && (
            <Link
              to="/connexion"
              className="text-sm font-medium text-fp-muted hover:text-fp-ink"
            >
              Connexion
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8">{children}</main>
      <footer className="border-t border-fp-line py-6 text-center text-xs text-fp-muted">
        Fair Play © {new Date().getFullYear()} · Plateforme de challenges étudiants
      </footer>
    </div>
  );
}

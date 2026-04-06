import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';

export function FormCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-ui border border-fp-line bg-fp-card p-6 shadow-card sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

/** @deprecated préférer FormCard pour le nouveau design */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <FormCard className={className}>{children}</FormCard>;
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'outline' }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-ui px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fp-brand disabled:opacity-50';
  const styles = {
    primary: 'bg-fp-brand text-white shadow-sm hover:bg-fp-brandHover',
    outline: 'border border-fp-brand bg-transparent text-fp-brand hover:bg-fp-brand hover:text-white',
    ghost: 'border border-fp-line bg-white text-fp-ink hover:border-neutral-300 hover:bg-neutral-50',
    danger: 'border border-red-100 bg-red-50 text-red-700 hover:bg-red-100',
  };
  return (
    <button type="button" className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function DividerOr() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-fp-line" />
      <span className="text-xs font-medium uppercase tracking-wide text-fp-muted">ou</span>
      <span className="h-px flex-1 bg-fp-line" />
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-fp-ink">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-fp-muted">{hint}</span> : null}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-11 w-full rounded-ui border border-fp-line bg-white px-3.5 text-sm text-fp-ink outline-none transition placeholder:text-neutral-400 focus:border-fp-brand focus:ring-1 focus:ring-fp-brand ${props.className || ''}`}
    />
  );
}

export function PasswordInput(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  const { className, ...rest } = props;
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...rest} type={show ? 'text' : 'password'} className={`pr-11 ${className ?? ''}`} />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-fp-muted hover:text-fp-ink"
        aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {show ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-11 w-full rounded-ui border border-fp-line bg-white px-3.5 text-sm text-fp-ink outline-none focus:border-fp-brand focus:ring-1 focus:ring-fp-brand ${props.className || ''}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-[120px] w-full rounded-ui border border-fp-line bg-white px-3.5 py-2.5 text-sm text-fp-ink outline-none focus:border-fp-brand focus:ring-1 focus:ring-fp-brand ${props.className || ''}`}
    />
  );
}

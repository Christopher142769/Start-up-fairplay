import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { useState } from 'react';

const fieldWrap =
  'flex h-12 w-full items-center gap-3 rounded-xl border border-white/45 bg-white/[0.07] px-3 backdrop-blur-md transition focus-within:border-white focus-within:bg-white/[0.12] focus-within:ring-2 focus-within:ring-white/25';

const inputInner =
  'min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-white/45';

export function VibeField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white/90">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-white/50">{hint}</span> : null}
    </label>
  );
}

export function VibeInput({
  icon,
  className = '',
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return (
    <div className={fieldWrap}>
      {icon ? <span className="shrink-0 text-white/65 [&_svg]:h-5 [&_svg]:w-5">{icon}</span> : null}
      <input {...props} className={`${inputInner} ${className}`} />
    </div>
  );
}

export function VibePasswordInput(
  props: Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { icon?: ReactNode }
) {
  const { className, icon, ...rest } = props;
  const [show, setShow] = useState(false);
  return (
    <div className={fieldWrap}>
      {icon ?? (
        <span className="shrink-0 text-white/65">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </span>
      )}
      <input
        {...rest}
        type={show ? 'text' : 'password'}
        className={`${inputInner} ${className ?? ''}`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="shrink-0 p-1.5 text-white/55 transition hover:text-white"
        aria-label={show ? 'Masquer' : 'Afficher'}
      >
        {show ? (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}

/** Select avec chevron (optionnel : icône à gauche) */
export function VibeSelectStyled({
  icon,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { icon?: ReactNode }) {
  return (
    <div className="relative flex h-12 w-full items-center gap-3 rounded-xl border border-white/45 bg-white/[0.07] px-3 backdrop-blur-md transition focus-within:border-white focus-within:bg-white/[0.12] focus-within:ring-2 focus-within:ring-white/25">
      {icon ? <span className="shrink-0 text-white/65 [&_svg]:h-5 [&_svg]:w-5">{icon}</span> : null}
      <select
        {...props}
        className={`vibe-select min-w-0 flex-1 cursor-pointer appearance-none border-0 bg-transparent pr-8 text-sm text-white outline-none ${className ?? ''}`}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
}

export function CoralButton({
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`w-full rounded-pill bg-vibe-coral py-3.5 text-center text-sm font-bold uppercase tracking-[0.2em] text-white shadow-coral transition hover:bg-vibe-coralHover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-50 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function VibeDividerOr() {
  return (
    <div className="my-6 flex items-center gap-3">
      <span className="h-px flex-1 bg-white/25" />
      <span className="text-xs font-semibold uppercase tracking-widest text-white/45">ou</span>
      <span className="h-px flex-1 bg-white/25" />
    </div>
  );
}

export function UserIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

export function SchoolIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.011 50.011 0 0 1 12 10.5h.008v.008H12V10.5z"
      />
    </svg>
  );
}

export function TeamIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  );
}

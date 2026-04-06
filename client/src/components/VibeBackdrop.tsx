/** Fond violet / magenta identique à la page d’accueil (SplitLayout). */
export function VibeBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2E0854] via-[#5b0d6f] to-[#8B008B]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-fuchsia-500/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-purple-600/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/4 top-1/3 h-[520px] w-[720px] -translate-x-1/2 rounded-[100%] border border-white/[0.07] bg-violet-600/10 blur-2xl"
        aria-hidden
      />
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
        aria-hidden
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <path
          d="M0,240 C180,170 360,120 540,180 C760,255 980,255 1200,185 C1430,110 1670,120 1920,190 L1920,0 L0,0 Z"
          fill="url(#vibeWaveDash)"
        />
        <g className="hidden md:block" aria-hidden>
          <path
            d="M0,430 C220,370 430,335 650,380 C860,425 1060,425 1270,375 C1495,320 1705,330 1920,385 L1920,0 L0,0 Z"
            fill="url(#vibeWaveDashSoft)"
          />
        </g>
        <defs>
          <linearGradient id="vibeWaveDash" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="vibeWaveDashSoft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f0abfc" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.25" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

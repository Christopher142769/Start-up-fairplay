/** Fond violet / magenta — vagues dédiées mobile (fluides, multicouches) + version large écran. */
export function VibeBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#2E0854] via-[#5b0d6f] to-[#8B008B]"
        aria-hidden
      />

      {/* Halos : mobile renforcé */}
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-fuchsia-500/25 blur-3xl max-lg:opacity-90 lg:opacity-100" aria-hidden />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-purple-600/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute left-1/4 top-1/3 h-[520px] w-[720px] -translate-x-1/2 rounded-[100%] border border-white/[0.07] bg-violet-600/10 blur-2xl" aria-hidden />

      {/* Halos supplémentaires — mobile, tons foncés uniquement */}
      <div
        className="pointer-events-none absolute -left-10 top-24 h-48 w-48 rounded-full bg-teal-900/35 blur-2xl max-lg:block lg:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 top-36 h-44 w-44 rounded-full bg-fuchsia-950/40 blur-2xl max-lg:block lg:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-16 h-40 w-40 -translate-x-1/2 rounded-full bg-violet-950/45 blur-2xl max-lg:block lg:hidden"
        aria-hidden
      />

      {/* Vagues portrait mobile : dégradés profonds (violet / magenta / teal), sans tons clairs */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(52vh,400px)] w-full max-lg:block lg:hidden"
        viewBox="0 0 390 420"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="mWaveDeep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#86198f" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#134e4a" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="mWaveMid" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b0764" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#701a75" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.35" />
          </linearGradient>
          <linearGradient id="mWaveTop" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2E0854" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,210 C65,155 130,175 195,150 C260,125 325,140 390,115 L390,0 L0,0 Z"
          fill="url(#mWaveTop)"
        />
        <path
          d="M0,248 Q97,188 195,218 Q292,248 390,198 L390,0 L0,0 Z"
          fill="url(#mWaveDeep)"
          opacity="0.92"
        />
        <path
          d="M0,300 C78,255 156,320 234,275 C292,242 350,265 390,235 L390,0 L0,0 Z"
          fill="url(#mWaveMid)"
          opacity="0.88"
        />
        <path
          d="M0,175 C120,220 270,120 390,165 L390,0 L0,0 Z"
          fill="#4c1d95"
          opacity="0.18"
        />
      </svg>

      {/* Vagues large écran */}
      <svg
        className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-[0.12] lg:block"
        aria-hidden
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        <path
          d="M0,240 C180,170 360,120 540,180 C760,255 980,255 1200,185 C1430,110 1670,120 1920,190 L1920,0 L0,0 Z"
          fill="url(#vibeWaveDash)"
        />
        <path
          d="M0,430 C220,370 430,335 650,380 C860,425 1060,425 1270,375 C1495,320 1705,330 1920,385 L1920,0 L0,0 Z"
          fill="url(#vibeWaveDashSoft)"
        />
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

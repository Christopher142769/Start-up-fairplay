import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/** Animation Lottie (DotLottie) — hero pages publiques */
export const FAIRPLAY_HERO_LOTTIE_SRC =
  'https://lottie.host/9a02b012-f518-408f-b7f4-1ad106f0d257/FWqpZYh8xG.lottie';

export function HeroLottie({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex w-full items-center justify-center ${className} max-w-[min(100%,480px)] sm:max-w-[560px] lg:max-w-[min(94vw,820px)] xl:max-w-[min(94vw,900px)]`}
    >
      <DotLottieReact
        src={FAIRPLAY_HERO_LOTTIE_SRC}
        loop
        autoplay
        className="h-[min(48vh,360px)] w-full object-contain sm:h-[min(56vh,420px)] lg:h-[min(72vh,620px)] lg:scale-[1.02] xl:h-[min(76vh,700px)] xl:scale-105"
      />
    </div>
  );
}

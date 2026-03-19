'use client'

import { useEffect, useState } from 'react'
import { sounds } from '@/lib/sounds'

const BODY_PATH =
  'M754.001 120.29C776.702 98.7359 812.803 69.8455 843.832 63.0023C858.097 67.7528 863.595 75.3823 852.788 88.6187C846.358 96.5007 841.279 104.069 836.375 112.923C851.039 107.3 895.394 88.539 909.044 90.9316C913.022 91.6291 916.912 93.9744 919.135 97.3853C920.979 100.217 921.316 103.538 920.648 106.802C919.56 112.107 917.46 113.929 913.225 116.77C892.82 130.461 882.257 146.953 877.542 170.673C900.034 187.77 931.292 215.868 945.929 240.861C953.162 253.217 948.901 280.78 943.011 294.207C960.457 328.853 977.822 363.679 995.728 398.082C1002.41 410.914 1012.09 423.621 1018.63 436.679C1022.7 444.785 1020.39 453.374 1024.06 461.058C1032.13 477.936 1041.27 494.422 1047.26 512.172C1054.27 532.982 1059.24 550.331 1047.57 570.539C1043.91 576.883 1042.65 580.293 1036.56 585.576C1030.45 590.881 1022.71 594.179 1017.65 600.449C1013.57 605.488 1013.61 613.489 1009.7 618.822C1006.74 623.031 1000.15 626.552 997.288 630.574C982.044 652.009 965.786 673.337 954.392 697.078C989.676 781.922 998.956 869.548 978.734 959.551C953.939 1068.37 887.349 1163.08 793.331 1223.25C760.404 1244.21 724.741 1260.53 687.343 1271.73C579.686 1303.81 463.699 1291.94 364.779 1238.7C265.521 1185.13 191.644 1094.29 159.434 986.211C133.549 898.45 136.589 804.693 168.105 718.795C176.669 695.626 185.398 678.001 196.975 656.559C187.54 644.756 171.653 629.397 161.862 617.402C160.69 615.966 162.996 614.873 161.995 611.957C152.065 609.02 144.151 617.739 133.426 612.706C122.005 607.346 126.923 594.093 121.894 588.034C109.15 572.68 84.9087 567.133 78.715 545.768C73.2563 526.938 79.1926 509.099 83.3424 490.775C87.3793 473.143 90.3877 456.819 98.284 440.415C104.189 428.149 116.385 427.075 122.072 417.568C146.723 376.362 171.622 335.226 194.143 292.804C166.155 256.049 182.646 205.554 214.673 177.804C226.093 167.91 234.398 159.006 247.978 151.519C244.985 129.427 240.754 115.888 230.443 96.03C226.553 88.5363 228.437 81.7699 234.404 75.9765C243.751 66.9006 254.857 72.23 264.745 76.9989C287.728 87.7395 303.964 103.984 321.034 122.217C319.177 114.666 315.366 104.271 311.133 97.6703C301.947 83.3501 297.093 70.275 317.92 63.5049C334.52 62.7042 369.579 97.357 381.318 109.333C463.272 86.7049 551.848 84.1921 636.142 91.4961C661.457 93.6895 691.126 97.7318 715.873 104.249C727.024 107.186 743.518 115.256 754.001 120.29Z'

const CIRCLE_PATH =
  'M557.747 487.921C765.976 483.47 938.377 648.644 942.808 856.832C947.239 1065.02 782.011 1237.37 573.781 1241.78C365.588 1246.18 193.237 1081.02 188.81 872.863C184.383 664.709 349.555 492.372 557.747 487.921Z'

type Phase = 'tracing' | 'revealing' | 'fading'

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('tracing')

  const isTeamsters = localStorage.getItem('app-theme') === 'teamsters'
  const colors = isTeamsters
    ? { bg: '#112440', trace: '#FEA81A', glow: '#FEA81A', logoFilter: undefined }
    : { bg: '#09090b', trace: '#e4e4e7', glow: '#e4e4e7', logoFilter: 'grayscale(1) brightness(2)' }

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('revealing'), 2000),
      setTimeout(() => { setPhase('fading'); sounds.whoosh() }, 3100),
      setTimeout(onComplete, 3800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: colors.bg, opacity: phase === 'fading' ? 0 : 1, transition: 'opacity 0.7s ease', pointerEvents: phase === 'fading' ? 'none' : 'auto' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: phase !== 'tracing' ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      >
        <div className="w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]" style={{ background: colors.glow }} />
      </div>

      <div
        className="relative flex flex-col items-center"
        style={{
          transform: phase === 'revealing' ? 'scale(1.015)' : 'scale(1)',
          transition: 'transform 1s ease',
        }}
      >
        {/* SVG container — constrained to viewport height */}
        <div className="relative" style={{ height: 'min(80vh, 560px)', aspectRatio: '1080/1383' }}>

          {/* Trace animation SVG */}
          <svg
            viewBox="0 0 1080 1383"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%' }}
          >
            <style>{`
              @keyframes drawPath {
                from { stroke-dashoffset: 1; }
                to   { stroke-dashoffset: 0; }
              }
              .trace-body {
                stroke-dasharray: 1;
                stroke-dashoffset: 1;
                animation: drawPath 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.15s forwards;
              }
              .trace-circle {
                stroke-dasharray: 1;
                stroke-dashoffset: 1;
                animation: drawPath 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s forwards;
              }
            `}</style>

            {/* Body outline trace */}
            <path
              className="trace-body"
              d={BODY_PATH}
              pathLength="1"
              stroke={colors.trace}
              strokeWidth="10"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              style={{ filter: `drop-shadow(0 0 10px ${colors.trace}88)` }}
            />

            {/* Circle outline trace */}
            <path
              className="trace-circle"
              d={CIRCLE_PATH}
              pathLength="1"
              stroke={colors.trace}
              strokeWidth="10"
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="none"
              style={{ filter: `drop-shadow(0 0 10px ${colors.trace}88)` }}
            />
          </svg>

          {/* Full-color SVG fade-in on top */}
          <div
            className="absolute inset-0"
            style={{
              opacity: phase !== 'tracing' ? 1 : 0,
              transition: 'opacity 0.9s ease',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/teamsters-logo.svg"
              alt="Teamsters"
              style={{ width: '100%', height: '100%', objectFit: 'contain', filter: colors.logoFilter }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

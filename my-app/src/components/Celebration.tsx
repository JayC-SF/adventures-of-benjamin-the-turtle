"use client";

import { HERO_NAME, type Milestone } from "@/data/quest";

export interface ConfettiPiece {
  id: number;
  left: string;
  delay: string;
  dur: string;
  size: number;
  char: string | null;
  color: string;
}

const CONFETTI_EMOJI = ["🎉", "✨", "⭐", "💚", "🌙", "💤", "🐢", "🎊"];

export function makeConfetti(): ConfettiPiece[] {
  return Array.from({ length: 26 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${(Math.random() * 0.8).toFixed(2)}s`,
    dur: `${(1.8 + Math.random() * 1.4).toFixed(2)}s`,
    size: 16 + Math.random() * 18,
    char:
      Math.random() > 0.4
        ? CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)]
        : null,
    color: `hsl(${Math.floor(Math.random() * 360)} 85% 65%)`,
  }));
}

interface Props {
  pieces: ConfettiPiece[];
  finished: boolean;
  milestone: Milestone | null;
  onDismiss: () => void;
}

export function Celebration({ pieces, finished, milestone, onDismiss }: Props) {
  const active = pieces.length > 0;

  return (
    <>
      {active && (
        <div
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          aria-hidden
        >
          {pieces.map((p) =>
            p.char ? (
              <span
                key={p.id}
                className="animate-fall absolute top-0"
                style={{
                  left: p.left,
                  fontSize: p.size,
                  animationDelay: p.delay,
                  animationDuration: p.dur,
                }}
              >
                {p.char}
              </span>
            ) : (
              <span
                key={p.id}
                className="animate-fall absolute top-0 rounded-sm"
                style={{
                  left: p.left,
                  width: p.size * 0.5,
                  height: p.size,
                  background: p.color,
                  animationDelay: p.delay,
                  animationDuration: p.dur,
                }}
              />
            ),
          )}

          {milestone && (
            <div className="animate-cheer absolute left-1/2 top-1/4 flex -translate-x-1/2 flex-col items-center gap-2">
              <p className="text-sm font-semibold text-indigo-200/90">
                Milestone complete!
              </p>
              <p
                className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-extrabold text-night-950 shadow-xl"
                style={{ background: milestone.part.color }}
              >
                <span aria-hidden>{milestone.part.emoji}</span>
                You earned the {milestone.part.name}!
              </p>
            </div>
          )}
        </div>
      )}

      {finished && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-night-950/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Quest complete"
        >
          <div className="glass animate-cheer flex max-w-md flex-col items-center gap-5 rounded-[2rem] p-8 text-center">
            <div className="animate-wobble text-7xl" aria-hidden>
              🐢💚
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Quest Complete!
            </h2>
            <p className="leading-7 text-indigo-200/80">
              {HERO_NAME}, the CPAP machine is fully assembled. All {`7`}{" "}
              milestones conquered — every nap, every early night, every sip of
              water led here.
            </p>
            <p className="text-xl font-semibold text-emerald-300">
              Sweet, dreamy, CPAP-powered sleep awaits. 🌙
            </p>
            <button
              type="button"
              onClick={onDismiss}
              className="mt-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 px-6 py-3 font-bold text-night-950 shadow-lg shadow-emerald-500/25 transition-transform hover:brightness-110 active:scale-95"
            >
              Back to the quest
            </button>
          </div>
        </div>
      )}
    </>
  );
}
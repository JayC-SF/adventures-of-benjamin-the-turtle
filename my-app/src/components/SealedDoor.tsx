"use client";

import { GATES } from "@/data/quest";
import { gateState } from "@/lib/progress-store";
import type { ProgressState } from "@/lib/progress-store";

interface Props {
  state?: ProgressState;
  clearedCount?: number;
}

export function SealedDoor({ state, clearedCount }: Props) {
  const gs = state ? gateState(state) : null;
  const count = clearedCount ?? gs?.clearedCount ?? 0;
  const total = GATES.length;
  const crack = Math.min(count / total, 1);
  const lightOpacity = 0.15 + crack * 0.7;
  const crackHeight = 20 + crack * 120;

  return (
    <section
      aria-labelledby="sealed-door-heading"
      className="relative mx-auto flex w-full max-w-md flex-col items-center gap-4"
    >
      <h2
        id="sealed-door-heading"
        className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-300/70"
      >
        The Game-Day Door
      </h2>

      <div className="relative h-72 w-52 overflow-hidden rounded-t-[4rem] border-2 border-white/15 bg-gradient-to-b from-night-800 to-night-950 shadow-2xl">
        {/* Crack of light */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-700"
          style={{
            width: 6,
            height: crackHeight,
            background: `linear-gradient(to top, rgba(251,191,36,${lightOpacity}), transparent)`,
            filter: "blur(4px)",
          }}
          aria-hidden
        />
        <div
          className="absolute inset-0 transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 90%, rgba(251,191,36,${lightOpacity * 0.6}) 0%, transparent 60%)`,
          }}
          aria-hidden
        />

        {/* Door panels */}
        <div className="absolute inset-x-4 top-6 bottom-6 flex flex-col gap-3 opacity-80" aria-hidden>
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5" />
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5" />
        </div>

        {/* Lock */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber-300/40 bg-night-900 text-2xl shadow-lg">
          🔒
        </div>

        {/* Sealed badge */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <span className="glass rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-indigo-200/80">
            Sealed
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-indigo-200/70">
        {count === 0
          ? "The door is sealed. Clear the medical gates to let in a little light."
          : count < total
            ? `${count} of ${total} gates cleared — the crack of light grows.`
            : "All gates cleared. The door waits for game day."}
      </p>
    </section>
  );
}
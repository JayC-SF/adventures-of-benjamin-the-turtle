"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { HERO_NAME, MILESTONES, type Milestone } from "@/data/quest";
import {
  clearProgress,
  getServerSnapshot,
  getSnapshot,
  hydrateProgress,
  subscribe,
  toggleMilestone,
} from "@/lib/progress-store";
import { ProgressHeader } from "./ProgressHeader";
import { CpapAssembler } from "./CpapAssembler";
import { QuestTrail } from "./QuestTrail";
import { Celebration, makeConfetti, type ConfettiPiece } from "./Celebration";

export default function QuestDashboard() {
  const { ready, completed } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [lastUnlocked, setLastUnlocked] = useState<Milestone | null>(null);
  const [finaleDismissed, setFinaleDismissed] = useState(false);

  useEffect(() => {
    hydrateProgress();
  }, []);

  useEffect(() => {
    if (confetti.length === 0) return;
    const t = window.setTimeout(() => setConfetti([]), 3400);
    return () => window.clearTimeout(t);
  }, [confetti]);

  const doneCount = completed.size;
  const finished = doneCount === MILESTONES.length;

  const nextUp = useMemo(
    () =>
      MILESTONES.find(
        (m, i) => !completed.has(m.id) && doneCount === i,
      ) ?? null,
    [completed, doneCount],
  );

  const unlockedParts = useMemo(
    () => MILESTONES.filter((m) => completed.has(m.id)).map((m) => m.part.id),
    [completed],
  );

  const toggle = (id: string) => {
    const added = toggleMilestone(id);
    if (added) {
      const milestone = MILESTONES.find((m) => m.id === id) ?? null;
      setLastUnlocked(milestone);
      setConfetti(makeConfetti());
    } else if (finished) {
      setFinaleDismissed(false);
    }
  };

  const reset = () => {
    if (!window.confirm(`Wipe all progress and restart ${HERO_NAME}'s quest?`))
      return;
    clearProgress();
    setConfetti([]);
    setFinaleDismissed(false);
  };

  if (!ready) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-indigo-200/70">
        <div className="animate-wobble text-5xl" aria-hidden>
          🐢
        </div>
        <p className="text-sm">Waking up the night&hellip;</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-14 px-4 py-14">
      <ProgressHeader
        completed={doneCount}
        total={MILESTONES.length}
        nextUp={nextUp}
        finished={finished}
      />

      <section aria-labelledby="assembler-heading">
        <h2
          id="assembler-heading"
          className="mb-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-indigo-300/70"
        >
          The prize, piece by piece
        </h2>
        <CpapAssembler unlocked={unlockedParts} />
      </section>

      <section aria-labelledby="trail-heading">
        <h2
          id="trail-heading"
          className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-indigo-300/70"
        >
          The quest trail
        </h2>
        <QuestTrail completed={completed} onToggle={toggle} />
      </section>

      <footer className="flex flex-col items-center gap-3 border-t border-white/10 pt-6">
        <p className="text-xs text-indigo-300/50">
          Made with 💚 for {HERO_NAME}. Progress is saved on this device only.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-white/50 transition-colors hover:border-white/25 hover:text-white/80"
        >
          Start over
        </button>
      </footer>

      <Celebration
        pieces={confetti}
        finished={finished && !finaleDismissed}
        milestone={confetti.length > 0 ? lastUnlocked : null}
        onDismiss={() => setFinaleDismissed(true)}
      />
    </div>
  );
}
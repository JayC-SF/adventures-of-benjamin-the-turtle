"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { HERO_NAME, MILESTONES, GAME_DAY_AVAILABLE } from "@/data/quest";
import {
  clearProgress,
  completeWithPassword,
  getServerSnapshot,
  getSnapshot,
  hydrateProgress,
  subscribe,
  undoMilestone,
} from "@/lib/progress-store";
import { ProgressHeader } from "./ProgressHeader";
import { CpapAssembler } from "./CpapAssembler";
import { QuestTrail } from "./QuestTrail";
import { Celebration, makeConfetti, type ConfettiPiece } from "./Celebration";
import { GateLayer } from "./GateLayer";
import { SealedDoor } from "./SealedDoor";
import { Countdown } from "./Countdown";

export default function QuestDashboard() {
  const { completed } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [lastUnlocked, setLastUnlocked] = useState<(typeof MILESTONES)[number] | null>(null);
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

  const handleComplete = async (id: string, password: string): Promise<boolean> => {
    const result = await completeWithPassword(id, password);
    if (result === "complete") {
      const milestone = MILESTONES.find((m) => m.id === id) ?? null;
      setLastUnlocked(milestone);
      setConfetti(makeConfetti());
      return true;
    }
    return false;
  };

  const handleUndo = (id: string) => {
    const wasUndo = undoMilestone(id);
    if (wasUndo && finished) {
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

  if (!GAME_DAY_AVAILABLE) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-4 py-10">
        <GateLayer />

        <section className="flex flex-col items-center gap-8">
          <SealedDoor state={getSnapshot()} />
          <Countdown />
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
          finished={false}
          milestone={null}
          onDismiss={() => setConfetti([])}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-16 px-4 py-14">
      <ProgressHeader
        completed={doneCount}
        total={MILESTONES.length}
        nextUp={nextUp}
        finished={finished}
      />

      <section aria-labelledby="assembler-heading">
        <h2
          id="assembler-heading"
          className="mb-5 text-center text-xs font-bold uppercase tracking-[0.3em] text-indigo-300/70"
        >
          The prize, piece by piece
        </h2>
        <CpapAssembler unlocked={unlockedParts} />
      </section>

      <section aria-labelledby="trail-heading">
        <h2
          id="trail-heading"
          className="mb-5 text-center text-xs font-bold uppercase tracking-[0.3em] text-indigo-300/70"
        >
          The quest trail
        </h2>
        <QuestTrail completed={completed} onComplete={handleComplete} onUndo={handleUndo} />
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
import { HERO_NAME, type Milestone } from "@/data/quest";

interface Props {
  completed: number;
  total: number;
  nextUp: Milestone | null;
  finished: boolean;
}

export function ProgressHeader({ completed, total, nextUp, finished }: Props) {
  const pct = Math.round((completed / total) * 100);

  return (
    <header className="flex flex-col items-center gap-5 text-center">
      <div className="animate-wobble text-6xl" aria-hidden>
        🐢
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/80">
          A nighttime quest for
        </p>
        <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          {HERO_NAME}
        </h1>
        <p className="mt-2 text-sm text-indigo-200/70 sm:text-base">
          {finished
            ? "The CPAP machine is assembled. Adventure complete! 🎉"
            : "Collect every part of the CPAP machine by finishing each milestone below."}
        </p>
      </div>

      <div className="w-full max-w-xl">
        <div className="mb-2 flex items-center justify-between text-sm font-medium">
          <span className="text-indigo-200/80">Machine progress</span>
          <span className="font-mono text-emerald-300">
            {completed}/{total} parts
          </span>
        </div>
        <div
          className="h-4 w-full overflow-hidden rounded-full border border-white/10 bg-white/5"
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="CPAP machine assembly progress"
        >
          <div
            className="relative h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          >
            <span className="absolute inset-y-0 right-0 w-6 rounded-full bg-white/40 blur-[6px]" />
          </div>
        </div>

        {!finished && nextUp && (
          <p className="mt-3 text-sm text-indigo-200/70">
            Next up:{" "}
            <span className="font-semibold text-white">
              {nextUp.emoji} {nextUp.title}
            </span>{" "}
            <span className="text-white/40">({nextUp.place})</span>
          </p>
        )}
        {finished && (
          <p className="mt-3 animate-cheer text-sm font-semibold text-emerald-300">
            All {total} milestones complete. Sweet dreams, {HERO_NAME}! 💚
          </p>
        )}
      </div>
    </header>
  );
}
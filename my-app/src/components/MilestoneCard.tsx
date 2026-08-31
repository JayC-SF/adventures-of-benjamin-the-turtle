import type { Milestone } from "@/data/quest";

interface Props {
  milestone: Milestone;
  done: boolean;
  isNext: boolean;
  onToggle: () => void;
}

export function MilestoneCard({ milestone, done, isNext, onToggle }: Props) {
  const part = milestone.part;

  return (
    <article
      className={`glass animate-cheer flex w-full flex-col gap-4 rounded-3xl p-5 transition-all duration-300 sm:flex-row sm:items-center sm:p-6 ${
        done
          ? "border-white/20"
          : isNext
            ? "trail-node-ring border-sky-300/40"
            : "opacity-75"
      }`}
    >
      <div className="flex shrink-0 items-center gap-4 sm:w-40 sm:flex-col sm:items-center sm:text-center">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl transition-all ${
            done ? "" : "bg-white/5 grayscale"
          }`}
          style={done ? { background: part.color } : undefined}
          aria-hidden
        >
          {done ? (
            <span className="animate-pop-in">{part.emoji}</span>
          ) : (
            milestone.emoji
          )}
        </div>
        <div className="text-left sm:text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-300/70">
            Stop {milestone.number}
          </p>
          <p className="text-sm font-semibold text-white/90">
            {milestone.place}
          </p>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold text-white">{milestone.title}</h3>
          {done && (
            <span
              className="animate-pop-in rounded-full px-2 py-0.5 text-[11px] font-bold text-night-950"
              style={{ background: part.color }}
            >
              ✓ {part.name}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm leading-6 text-indigo-200/75">
          {milestone.description}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={done}
        aria-label={
          done
            ? `Mark "${milestone.title}" as not done`
            : `Mark "${milestone.title}" as done`
        }
        className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-95 ${
          done
            ? "border border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
            : isNext
              ? "bg-gradient-to-r from-emerald-400 to-teal-300 text-night-950 shadow-lg shadow-emerald-500/25 hover:brightness-110"
              : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        {done ? "Undo" : "Complete"}
      </button>
    </article>
  );
}
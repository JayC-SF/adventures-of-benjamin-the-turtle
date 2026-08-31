import { MILESTONES } from "@/data/quest";
import { MilestoneCard } from "./MilestoneCard";

interface Props {
  completed: Set<string>;
  onToggle: (id: string) => void;
}

export function QuestTrail({ completed, onToggle }: Props) {
  const doneCount = MILESTONES.filter((m) => completed.has(m.id)).length;

  return (
    <div className="relative">
      <div
        className="trail-dashes absolute bottom-4 left-6 top-4 w-px border-l-2 border-dashed border-indigo-300/25 sm:left-1/2"
        aria-hidden
      />

      <ol className="flex flex-col gap-8">
        {MILESTONES.map((milestone, i) => {
          const done = completed.has(milestone.id);
          const isNext = !done && doneCount === i;
          const leftSide = i % 2 === 0;

          return (
            <li key={milestone.id} className="relative">
              {/* Marker on the trail */}
              <span
                aria-hidden
                className={`absolute left-6 top-7 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border-2 text-base font-bold shadow-lg sm:left-1/2 ${
                  done
                    ? "border-white/40"
                    : isNext
                      ? "trail-node-ring animate-wobble border-sky-300/60"
                      : "border-white/15"
                }`}
                style={
                  done
                    ? { background: milestone.part.color, color: "#0b1026" }
                    : isNext
                      ? { background: "#0e1333" }
                      : { background: "#171c40" }
                }
              >
                {done ? "✓" : isNext ? milestone.emoji : milestone.number}
              </span>

              <div className="grid pl-16 sm:grid-cols-2 sm:pl-0">
                <div
                  className={`sm:max-w-[46%] ${
                    leftSide
                      ? "sm:justify-self-end sm:pr-4"
                      : "sm:col-start-2 sm:row-start-1 sm:justify-self-start sm:pl-4"
                  }`}
                >
                  <MilestoneCard
                    milestone={milestone}
                    done={done}
                    isNext={isNext}
                    onToggle={() => onToggle(milestone.id)}
                  />
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-10 flex justify-center sm:justify-end sm:pr-[26%]">
        <p className="glass rounded-full px-5 py-2.5 text-center text-sm text-indigo-200/80">
          🐢 The turtle marches on&hellip; to sweet, dreamy, CPAP-powered sleep!
        </p>
      </div>
    </div>
  );
}
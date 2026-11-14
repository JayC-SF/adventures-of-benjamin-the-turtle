"use client";

import { useEffect, useState } from "react";
import { countdownState, daysUntilGameDay } from "@/lib/progress-store";

interface Props {
  now?: number | Date;
}

export function Countdown({ now }: Props) {
  const [tick, setTick] = useState<number>(() => (now === undefined ? Date.now() : 0));

  useEffect(() => {
    if (now !== undefined) return;
    const id = window.setInterval(() => setTick(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, [now]);

  const current =
    now !== undefined ? (now instanceof Date ? now.getTime() : Number(now)) : tick;

  const status = countdownState(current);
  const days = daysUntilGameDay(current);

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-300/80">
          Game Day
        </p>
        <p className="animate-cheer text-2xl font-extrabold text-amber-200 sm:text-3xl">
          GAME DAY — PENDING
        </p>
        <p className="text-sm text-indigo-200/70">
          January 10 has passed. The adventure awaits whenever the gates are cleared.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300/80">
        Countdown to Game Day
      </p>
      <p className="text-4xl font-extrabold tabular-nums text-white sm:text-5xl">
        {days}
        <span className="ml-2 text-base font-semibold text-indigo-200/70 sm:text-lg">
          {days === 1 ? "day" : "days"}
        </span>
      </p>
      <p className="text-sm text-indigo-200/70">
        Until January 10 — the day the door may open.
      </p>
    </div>
  );
}
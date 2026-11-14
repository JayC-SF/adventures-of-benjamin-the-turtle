"use client";

import { useState } from "react";
import type { Milestone } from "@/data/quest";

interface Props {
  milestone: Milestone;
  done: boolean;
  isNext: boolean;
  onComplete: (id: string, password: string) => boolean | Promise<boolean | "complete" | "wrong" | "already">;
  onUndo: (id: string) => void;
}

export function MilestoneCard({
  milestone,
  done,
  isNext,
  onComplete,
  onUndo,
}: Props) {
  const part = milestone.part;
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  const locked = !done && !isNext;

  const submit = async () => {
    setPending(true);
    try {
      const result = await onComplete(milestone.id, value);
      const ok =
        result === true || result === "complete";
      if (ok) {
        setValue("");
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  };

  return (
    <article
      className={`glass animate-cheer flex w-full flex-col items-center gap-6 rounded-3xl p-6 text-center transition-all duration-300 sm:gap-8 sm:p-8 ${
        done
          ? "border-white/20"
          : isNext
            ? "trail-node-ring border-sky-300/40"
            : "opacity-60"
      }`}
    >
      <div className="relative flex flex-col items-center gap-3">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl transition-all sm:h-20 sm:w-20 sm:text-4xl ${
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
        {locked && !done && (
          <span
            className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-night-800 text-sm"
            title="Locked"
            aria-hidden
          >
            🔒
          </span>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/70">
            Stop {milestone.number}
          </p>
          <p className="mt-1 text-sm font-semibold text-white/90">
            {milestone.place}
          </p>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <h3 className="text-xl font-bold text-white sm:text-2xl">{milestone.title}</h3>
          {done && (
            <span
              className="animate-pop-in rounded-full px-2.5 py-1 text-xs font-bold text-night-950"
              style={{ background: part.color }}
            >
              ✓ {part.name}
            </span>
          )}
        </div>
        <p className="mt-2.5 text-sm leading-7 text-indigo-200/75 sm:text-base">
          {milestone.description}
        </p>
      </div>

      {done ? (
        <button
          type="button"
          onClick={() => onUndo(milestone.id)}
          className="shrink-0 w-full rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white/80 active:scale-95 sm:w-auto sm:px-8"
        >
          Undo
        </button>
      ) : locked ? (
        <span
          className="w-full rounded-xl border border-dashed border-white/10 px-6 py-3 text-sm font-semibold text-white/30 sm:w-auto sm:px-8"
          aria-hidden
        >
          Locked
        </span>
      ) : (
        <form
          className="flex w-full flex-col items-center gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div className="flex w-full max-w-xs items-center gap-2">
            <input
              type="password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              placeholder="Enter secret word…"
              aria-label={`Password to unlock ${milestone.title}`}
              autoComplete="off"
              spellCheck={false}
              className={`w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold text-night-950 placeholder-white/30 outline-none transition-all focus:ring-2 ${
                error
                  ? "border-red-400 bg-white/10 text-red-200 ring-2 ring-red-400/40"
                  : "bg-white/10 text-white placeholder-white/40 focus:border-sky-300/60 focus:ring-sky-300/40"
              }`}
            />
          </div>
          {error && (
            <p className="animate-cheer text-xs font-semibold text-red-300">
              Not quite — try again, pilgrim! 🌙
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="shrink-0 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-6 py-3 text-sm font-bold text-night-950 shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-60 sm:w-auto sm:px-8"
          >
            {pending ? "Checking…" : "Unlock"}
          </button>
        </form>
      )}
    </article>
  );
}
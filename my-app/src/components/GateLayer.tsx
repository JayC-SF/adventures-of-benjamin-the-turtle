"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { GATES, HERO_NAME, type Gate } from "@/data/quest";
import {
  completeGate,
  getServerSnapshot,
  getSnapshot,
  hydrateProgress,
  subscribe,
} from "@/lib/progress-store";
import { Celebration, makeConfetti, type ConfettiPiece } from "./Celebration";

export function GateLayer() {
  const { ready, gatesCleared } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    hydrateProgress();
  }, []);

  useEffect(() => {
    if (confetti.length === 0) return;
    const t = window.setTimeout(() => setConfetti([]), 3400);
    return () => window.clearTimeout(t);
  }, [confetti]);

  const clearedCount = useMemo(
    () => GATES.filter((g) => gatesCleared.has(g.id)).length,
    [gatesCleared],
  );

  const handleClear = async (gate: Gate) => {
    const value = values[gate.id] ?? "";
    setPending((p) => ({ ...p, [gate.id]: true }));
    try {
      const result = await completeGate(gate.id, value);
      const ok = result === "complete" || result === true;
      if (ok) {
        setValues((v) => ({ ...v, [gate.id]: "" }));
        setErrors((e) => ({ ...e, [gate.id]: false }));
        setConfetti(makeConfetti());
      } else {
        setErrors((e) => ({ ...e, [gate.id]: true }));
      }
    } catch {
      setErrors((e) => ({ ...e, [gate.id]: true }));
    } finally {
      setPending((p) => ({ ...p, [gate.id]: false }));
    }
  };

  if (!ready) {
    return (
      <div className="flex min-h-32 flex-col items-center justify-center gap-3 text-indigo-200/70">
        <div className="animate-wobble text-4xl" aria-hidden>
          🐢
        </div>
        <p className="text-sm">Waking up the night&hellip;</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col items-center gap-3 text-center">
        <div className="animate-wobble text-5xl" aria-hidden>
          🐢
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/80">
          A nighttime quest for
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {HERO_NAME}
        </h1>
        <p className="max-w-md text-sm text-indigo-200/75">
          Three medical gates stand between Benjamin and game day. Each clears
          only when the real-world step is truly done.
        </p>
        <p className="text-sm font-mono text-emerald-300">
          {clearedCount}/{GATES.length} gates cleared
        </p>
      </header>

      <ol className="flex flex-col gap-5">
        {GATES.map((gate, i) => {
          const cleared = gatesCleared.has(gate.id);
          const previousCleared = i === 0 || gatesCleared.has(GATES[i - 1].id);
          const enterable = !cleared && previousCleared;
          const locked = !cleared && !previousCleared;

          return (
            <li key={gate.id}>
              <article
                className={`glass flex flex-col gap-4 rounded-3xl p-5 transition-all duration-300 sm:p-6 ${
                  cleared
                    ? "border-emerald-300/30"
                    : enterable
                      ? "border-sky-300/40"
                      : "opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold ${
                      cleared
                        ? "border-emerald-300 bg-emerald-400 text-night-950"
                        : enterable
                          ? "border-sky-300/60 bg-night-800 text-sky-200"
                          : "border-white/15 bg-night-800 text-white/40"
                    }`}
                    aria-hidden
                  >
                    {cleared ? "✓" : gate.number}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300/70">
                      Gate {gate.number}
                    </p>
                    <h3 className="text-lg font-bold text-white">{gate.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-indigo-200/75">
                      {gate.description}
                    </p>
                  </div>
                </div>

                {cleared ? (
                  <p className="animate-pop-in text-center text-sm font-semibold text-emerald-300">
                    Cleared ✨
                  </p>
                ) : locked ? (
                  <p className="text-center text-xs font-semibold text-white/30">
                    🔒 Clear the previous gate first
                  </p>
                ) : (
                  <form
                    className="flex w-full flex-col items-center gap-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleClear(gate);
                    }}
                  >
                    <div className="flex w-full max-w-xs items-center gap-2">
                      <input
                        type="password"
                        value={values[gate.id] ?? ""}
                        onChange={(e) => {
                          setValues((v) => ({ ...v, [gate.id]: e.target.value }));
                          setErrors((er) => ({ ...er, [gate.id]: false }));
                        }}
                        placeholder="Enter gate code…"
                        aria-label={`Code to clear ${gate.title}`}
                        autoComplete="off"
                        spellCheck={false}
                        className={`w-full rounded-xl border px-4 py-3 text-center text-sm font-semibold outline-none transition-all focus:ring-2 ${
                          errors[gate.id]
                            ? "border-red-400 bg-white/10 text-red-200 ring-2 ring-red-400/40"
                            : "bg-white/10 text-white placeholder-white/40 focus:border-sky-300/60 focus:ring-sky-300/40"
                        }`}
                      />
                    </div>
                    {errors[gate.id] && (
                      <p className="animate-cheer text-xs font-semibold text-red-300">
                        Not quite — try again, gently. 🌙
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={pending[gate.id]}
                      className="shrink-0 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-6 py-3 text-sm font-bold text-night-950 shadow-lg shadow-emerald-500/25 transition-all hover:brightness-110 active:scale-95 disabled:opacity-60 sm:w-auto sm:px-8"
                    >
                      {pending[gate.id] ? "Checking…" : "Unlock gate"}
                    </button>
                  </form>
                )}
              </article>
            </li>
          );
        })}
      </ol>

      <Celebration pieces={confetti} finished={false} milestone={null} onDismiss={() => setConfetti([])} />
    </div>
  );
}
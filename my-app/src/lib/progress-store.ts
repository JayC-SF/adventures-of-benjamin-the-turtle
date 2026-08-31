import { STORAGE_KEY } from "@/data/quest";

export interface ProgressState {
  ready: boolean;
  completed: Set<string>;
}

const listeners = new Set<() => void>();

let current: ProgressState = { ready: false, completed: new Set() };

const emit = () => {
  for (const listener of listeners) listener();
};

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): ProgressState {
  return current;
}

export function getServerSnapshot(): ProgressState {
  return { ready: false, completed: new Set() };
}

export function hydrateProgress() {
  if (current.ready || typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        current = {
          ready: true,
          completed: new Set(
            parsed.filter((x): x is string => typeof x === "string"),
          ),
        };
        emit();
        return;
      }
    }
  } catch {
    // Fall through to a fresh quest.
  }
  current = { ready: true, completed: new Set() };
  emit();
}

export function toggleMilestone(id: string): boolean {
  const next = new Set(current.completed);
  let added = false;
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
    added = true;
  }
  current = { ready: true, completed: next };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
  } catch {
    // Private mode — progress just won't persist.
  }
  emit();
  return added;
}

export function clearProgress() {
  current = { ready: true, completed: new Set() };
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  emit();
}
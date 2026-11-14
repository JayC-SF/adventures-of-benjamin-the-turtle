// Browser adapter: implements the engine's storage port over localStorage.
import { STORAGE_KEY } from "../data/quest.ts";
import * as E from "./quest-engine.ts";

export * from "./quest-engine.ts";

export function browserStoragePort(): E.StoragePort {
  return {
    getItem(key: string): string | null {
      try { return window.localStorage.getItem(key); } catch { return null; }
    },
    setItem(key: string, value: string): void {
      try { window.localStorage.setItem(key, value); } catch { /* private mode */ }
    },
    removeItem(key: string): void {
      try { window.localStorage.removeItem(key); } catch { /* ignore */ }
    },
  };
}

export function hydrateProgress(): ReturnType<typeof E.hydrateProgress> {
  if (typeof window === "undefined") return E.hydrateProgress(undefined, STORAGE_KEY);
  return E.hydrateProgress(browserStoragePort(), STORAGE_KEY);
}
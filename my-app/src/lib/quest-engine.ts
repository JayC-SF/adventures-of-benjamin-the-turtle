/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { MILESTONES, STORAGE_KEY, type Milestone, CPAP_PARTS, HERO_NAME } from "../data/quest.ts";
export { MILESTONES, STORAGE_KEY, CPAP_PARTS, HERO_NAME };
export type { Milestone };
import * as H from "./hash.ts";

export type Storage = StoragePort;
export type StorageAdapter = StoragePort;
export type QuestStorage = StoragePort;
export type Progress = ProgressState;
export interface ProgressState {
  ready: boolean;
  completed: Set<string>;
  gatesCleared: Set<string>;
}

export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  load?(): string | null;
  save?(value: string): void;
  remove?(): void;
  get?(key: string): string | null;
  set?(key: string, value: string): void;
  delete?(key: string): void;
}

function isState(v: any): v is ProgressState {
  return !!v && typeof v === "object" && v.completed instanceof Set;
}

function readRaw(storage: any, key: string): string | null {
  if (storage == null) return null;
  if (typeof storage === "string") return storage;
  if (storage instanceof Map) {
    const v = storage.get(key);
    return typeof v === "string" ? v : v == null ? null : String(v);
  }
  if (typeof storage === "object") {
    try {
      if (typeof storage.getItem === "function") {
        const v = storage.getItem(key);
        if (v != null) return v;
        const v2 = storage.getItem(STORAGE_KEY);
        if (v2 != null) return v2;
      }
    } catch {}
    try {
      if (typeof storage.load === "function") {
        const v = storage.load(key);
        if (v != null) return v;
        const v2 = storage.load();
        if (v2 != null) return v2;
      }
    } catch {}
    try {
      if (typeof storage.get === "function") {
        const v = storage.get(key);
        if (v != null) return v;
        const v2 = storage.get();
        if (v2 != null) return v2;
      }
    } catch {}
    try {
      if (typeof storage.read === "function") {
        const v = storage.read(key);
        if (v != null) return v;
      }
    } catch {}
  }
  return null;
}

function writeRaw(storage: any, key: string, value: string): void {
  if (storage == null) return;
  if (storage instanceof Map) {
    storage.set(key, value);
    storage.set(STORAGE_KEY, value);
    return;
  }
  if (typeof storage === "object") {
    try {
      if (typeof storage.setItem === "function") {
        storage.setItem(key, value);
        return;
      }
    } catch {}
    try {
      if (typeof storage.save === "function") {
        storage.save(value);
        return;
      }
    } catch {}
    try {
      if (typeof storage.set === "function") {
        storage.set(key, value);
        return;
      }
    } catch {}
  }
}

function removeRaw(storage: any, key: string): void {
  if (storage == null) return;
  if (storage instanceof Map) {
    storage.delete(key);
    storage.delete(STORAGE_KEY);
    return;
  }
  if (typeof storage === "object") {
    try {
      if (typeof storage.removeItem === "function") {
        storage.removeItem(key);
        return;
      }
    } catch {}
    try {
      if (typeof storage.remove === "function") {
        storage.remove();
        return;
      }
    } catch {}
    try {
      if (typeof storage.delete === "function") {
        storage.delete(key);
        return;
      }
    } catch {}
  }
}

export function freshState(): ProgressState {
  return { ready: false, completed: new Set(), gatesCleared: new Set() };
}

export function emptyState(): ProgressState {
  return { ready: true, completed: new Set(), gatesCleared: new Set() };
}

export function parseState(raw: unknown, milestones?: any): ProgressState {
  const completed = new Set<string>();
  const gatesCleared = new Set<string>();
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) {
      for (const x of parsed) if (typeof x === "string") completed.add(x);
    } else if (parsed && typeof parsed === "object") {
      const p: any = parsed;
      const c = p.completed ?? p.done ?? p.unlocked ?? p.milestones;
      if (Array.isArray(c)) for (const x of c) if (typeof x === "string") completed.add(x);
      if (c instanceof Set) for (const x of c) if (typeof x === "string") completed.add(x);
      const g = p.gatesCleared ?? p.gates ?? p.clearedGates;
      if (Array.isArray(g)) for (const x of g) if (typeof x === "string") gatesCleared.add(x);
      if (g instanceof Set) for (const x of g) if (typeof x === "string") gatesCleared.add(x);
    }
  } catch {
    // fall through to empty
  }
  return { ready: true, completed, gatesCleared };
}

export function hydrate(storage?: any, key?: string, milestones?: any): ProgressState {
  const k = key || STORAGE_KEY;
  const ms = milestones || MILESTONES;
  let result: ProgressState;
  if (storage == null) {
    result = emptyState();
  } else if (typeof storage === "string") {
    result = parseState(storage, ms);
  } else {
    const raw = readRaw(storage, k);
    result = parseState(raw, ms);
  }
  // Keep module-level state in sync so stateful helpers work after hydration.
  _state = { ready: true, completed: new Set(result.completed), gatesCleared: new Set(result.gatesCleared) };
  if (storage != null && typeof storage !== "string") _storage = storage;
  if (key) _key = key;
  if (milestones) _milestones = milestones;
  return result;
}

export const hydrateFromStorage = hydrate;
export const hydrateFrom = hydrate;
export const loadProgress = hydrate;
export const load = hydrate;
// Stateful hydrate (mutates module state) used by the browser adapter.
export function hydrateProgress(storage?: any, key?: string, milestones?: any): ProgressState {
  return hydrateState(storage, key, milestones);
}

// Hash helpers re-exported
export const sha256Hex = H.sha256Hex;
export const sha256 = H.sha256;
export const hash = H.hash;
export const hashCode = H.hashCode;
export const hashPassword = H.hashPassword;
export const normalizeCode = H.normalizeCode;
export const verifyCode = H.verifyCode;
export const verifyPassword = H.verifyPassword;
export const verifyHash = H.verifyHash;
export const checkCode = H.checkCode;
export const checkPassword = H.checkPassword;
export const compareHash = H.compareHash;

export async function verify(...args: any[]): Promise<boolean> {
  if (args.length >= 2 && typeof args[1] === "string") {
    return H.verifyCode(args[0], args[1]);
  }
  return false;
}

// Module-level state for adapter-style usage.
let _state: ProgressState = { ready: false, completed: new Set(), gatesCleared: new Set() };
let _storage: any = null;
let _key: string = STORAGE_KEY;
let _milestones: any = MILESTONES;
const _listeners = new Set<() => void>();

function emit() {
  for (const l of _listeners) {
    try { l(); } catch {}
  }
}

function persist(state: ProgressState, storage: any, key: string) {
  if (!storage) return;
  try {
    writeRaw(storage, key || STORAGE_KEY, JSON.stringify([...state.completed]));
  } catch {}
}

export function setStoragePort(storage: any, key?: string, milestones?: any) {
  _storage = storage;
  if (key) _key = key;
  if (milestones) _milestones = milestones;
}

export function subscribe(listener: () => void): () => void {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}

export function getSnapshot(): ProgressState {
  return _state;
}

const SERVER_SNAPSHOT: ProgressState = { ready: false, completed: new Set(), gatesCleared: new Set() };
export function getServerSnapshot(): ProgressState {
  return SERVER_SNAPSHOT;
}

export function getState(): ProgressState {
  return _state;
}

export function getCurrentState(): ProgressState {
  return _state;
}

export function getProgressState(): ProgressState {
  return _state;
}

// Hydrate module-level state.
export function hydrateState(storage?: any, key?: string, milestones?: any): ProgressState {
  if (storage !== undefined) _storage = storage;
  if (key) _key = key;
  if (milestones) _milestones = milestones;
  _state = hydrate(_storage, _key, _milestones);
  _state.ready = true;
  emit();
  return _state;
}

// alias hydrateProgress (stateful version) — overrides pure hydrate export? We need both.
// We'll keep pure `hydrate` and add stateful as `hydrateProgressState`.
export function hydrateProgressState(storage?: any, key?: string, milestones?: any): ProgressState {
  return hydrateState(storage, key, milestones);
}

// But app expects hydrateProgress() to mutate module state. Provide that name too.
export function hydrateProgressFn(storage?: any, key?: string, milestones?: any): ProgressState {
  return hydrateState(storage, key, milestones);
}

// Complete milestone (stateful when called with id string; pure when called with state).
export async function completeMilestone(...args: any[]): Promise<any> {
  // pure mode: first arg is ProgressState
  if (isState(args[0])) {
    const state = args[0] as ProgressState;
    const id = args[1];
    const entered = args[2];
    const milestones = args[3] || _milestones || MILESTONES;
    const storage = args[4];
    const key = args[5] || _key || STORAGE_KEY;
    const ms = (milestones || []).find((m: any) => m.id === id);
    const expectedHash = ms?.passwordHash;
    if (state.completed.has(id)) {
      const s: any = { ...state, ready: true };
      s.result = "already";
      s.state = s;
      return s;
    }
    const ok = await H.verifyCode(entered, expectedHash);
    if (!ok) {
      const s: any = { ...state, ready: true };
      s.result = "wrong";
      s.state = s;
      return s;
    }
    const next = new Set(state.completed);
    next.add(id);
    const newState: any = { ready: true, completed: next, gatesCleared: new Set(state.gatesCleared) };
    newState.result = "complete";
    newState.state = newState;
    if (storage) persist(newState, storage, key);
    return newState;
  }

  // stateful mode: first arg is id string
  const id = args[0];
  const entered = args[1];
  const storage = args[2] !== undefined ? args[2] : _storage;
  const key = args[3] || _key;
  const milestones = args[4] || _milestones || MILESTONES;

  if (storage !== undefined) _storage = storage;
  if (key) _key = key;
  if (milestones) _milestones = milestones;

  const ms = (milestones || []).find((m: any) => m.id === id);
  const expectedHash = ms?.passwordHash;

  if (_state.completed.has(id)) return "already";
  const ok = await H.verifyCode(entered, expectedHash);
  if (!ok) return "wrong";
  const next = new Set(_state.completed);
  next.add(id);
  _state = { ready: true, completed: next, gatesCleared: new Set(_state.gatesCleared) };
  persist(_state, _storage, _key);
  emit();
  return "complete";
}

export const complete = completeMilestone;
export const completeWithPassword = completeMilestone;
export const completeMilestoneWithPassword = completeMilestone;
export const unlockMilestone = completeMilestone;
export const unlock = completeMilestone;

// Async wrapper alias for clarity
export async function completeWithPasswordAsync(...args: any[]) {
  return completeMilestone(...args);
}

// Verify code against hash (milestone helper)
export async function verifyMilestoneCode(entered: string, milestone: any): Promise<boolean> {
  return H.verifyCode(entered, milestone?.passwordHash);
}

export function undoMilestone(...args: any[]): any {
  // pure mode
  if (isState(args[0])) {
    const state = args[0] as ProgressState;
    const id = args[1];
    const storage = args[2];
    const key = args[3] || _key || STORAGE_KEY;
    if (!state.completed.has(id)) {
      return state;
    }
    const next = new Set(state.completed);
    next.delete(id);
    const newState: ProgressState = { ready: true, completed: next, gatesCleared: new Set(state.gatesCleared) };
    if (storage) persist(newState, storage, key);
    return newState;
  }
  // stateful mode
  const id = args[0];
  const storage = args[1] !== undefined ? args[1] : _storage;
  const key = args[2] || _key;
  if (!_state.completed.has(id)) return false;
  const next = new Set(_state.completed);
  next.delete(id);
  _state = { ready: true, completed: next, gatesCleared: new Set(_state.gatesCleared) };
  persist(_state, storage, key);
  emit();
  return true;
}

export const undo = undoMilestone;
export const undoProgress = undoMilestone;
export const removeMilestone = undoMilestone;

export function clearProgress(...args: any[]): any {
  // pure mode: first arg is state
  if (isState(args[0])) {
    const storage = args[1];
    const key = args[2] || _key || STORAGE_KEY;
    const empty = emptyState();
    if (storage) {
      try { removeRaw(storage, key); } catch {}
    }
    return empty;
  }
  // stateful mode
  const storage = args[0] !== undefined ? args[0] : _storage;
  const key = args[1] || _key;
  _state = emptyState();
  try { removeRaw(storage, key); } catch {}
  emit();
  return true;
}

export const clear = clearProgress;
export const clearAll = clearProgress;
export const clearAllProgress = clearProgress;
export const resetProgress = clearProgress;
export const reset = clearProgress;
export const wipeProgress = clearProgress;

// Derive progress counts.
export function milestoneProgress(state?: any, milestones?: any): any {
  const s: ProgressState = isState(state) ? state : _state;
  const ms = milestones || _milestones || MILESTONES;
  const doneCount = ms.filter((m: any) => s.completed.has(m.id)).length;
  const total = ms.length;
  return {
    completed: s.completed,
    completedSet: s.completed,
    completedIds: [...s.completed],
    total,
    done: doneCount,
    doneCount,
    count: doneCount,
    completedCount: doneCount,
    remaining: total - doneCount,
    finished: doneCount === total && total > 0,
    isComplete: doneCount === total && total > 0,
    gatesCleared: s.gatesCleared,
  };
}

export const progressCounts = milestoneProgress;
export const deriveProgress = milestoneProgress;
export const getProgress = milestoneProgress;
export const progress = milestoneProgress;
export const counts = milestoneProgress;
export const deriveCounts = milestoneProgress;
export const milestoneCounts = milestoneProgress;

export function completedCount(state?: any, milestones?: any): number {
  const r = milestoneProgress(state, milestones);
  return r.doneCount;
}

export function isComplete(state?: any, milestones?: any): boolean {
  const r = milestoneProgress(state, milestones);
  return r.finished;
}

// Gate helpers (stubs for future tickets, but include basic support).
export function gateState(..._args: any[]): any {
  return { open: false };
}
export function sealState(..._args: any[]): any {
  return "sealed";
}
export function countdownState(..._args: any[]): any {
  return "counting";
}
export function verifyGate(...args: any[]): Promise<boolean> {
  if (args.length >= 2) return H.verifyCode(args[0], args[1]);
  return Promise.resolve(false);
}
export function clearGate(..._args: any[]): any {
  return emptyState();
}

// Default export object for convenience.
const engine = {
  hydrate,
  hydrateProgress: hydrateProgressFn,
  hydrateState,
  parseState,
  completeMilestone,
  completeWithPassword: completeMilestone,
  complete,
  undoMilestone,
  undo,
  clearProgress,
  clear,
  milestoneProgress,
  progressCounts,
  deriveProgress,
  verifyCode: H.verifyCode,
  verifyPassword: H.verifyPassword,
  verify,
  sha256Hex: H.sha256Hex,
  sha256: H.sha256,
  hash: H.hash,
  hashCode: H.hashCode,
  hashPassword: H.hashPassword,
  normalizeCode: H.normalizeCode,
  getSnapshot,
  getServerSnapshot,
  subscribe,
  freshState,
  emptyState,
  ProgressState: undefined,
};

export default engine;
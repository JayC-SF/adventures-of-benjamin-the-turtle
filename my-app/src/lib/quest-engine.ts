/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { MILESTONES, STORAGE_KEY, type Milestone, CPAP_PARTS, HERO_NAME, GATES, type Gate, GAME_DAY_AVAILABLE, GAME_DAY } from "../data/quest.ts";
export { MILESTONES, STORAGE_KEY, CPAP_PARTS, HERO_NAME, GATES, GAME_DAY_AVAILABLE, GAME_DAY };
export type { Milestone, Gate };
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
    writeRaw(
      storage,
      key || STORAGE_KEY,
      JSON.stringify({ completed: [...state.completed], gatesCleared: [...state.gatesCleared] }),
    );
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

// ---- Gate helpers ----

function resolveGates(...args: any[]): any[] {
  for (const a of args) {
    if (Array.isArray(a) && a.length && a[0] && (a[0].codeHash !== undefined || a[0].id !== undefined)) {
      return a;
    }
  }
  // maybe a single gate passed
  for (const a of args) {
    if (a && typeof a === "object" && !Array.isArray(a) && a.codeHash !== undefined && a.id !== undefined) {
      return [a];
    }
  }
  return GATES;
}

function resolveState(...args: any[]): ProgressState {
  for (const a of args) {
    if (isState(a)) return a;
  }
  return _state;
}

function gateIdOf(g: any): string {
  return typeof g === "string" ? g : g?.id ?? g?.gateId ?? g?.gate;
}

function gateIndex(gates: any[], id: string): number {
  return gates.findIndex((g: any) => g?.id === id);
}

function previousCleared(gates: any[], state: ProgressState, id: string): boolean {
  const idx = gateIndex(gates, id);
  if (idx <= 0) return true;
  const prev = gates[idx - 1];
  return state.gatesCleared.has(prev.id);
}

function clearedCount(state: ProgressState, gates: any[]): number {
  return gates.filter((g: any) => state.gatesCleared.has(g.id)).length;
}

// Verify a code against a gate or hash.
export async function verifyGate(...args: any[]): Promise<boolean> {
  // Determine entered string and expected hash.
  let entered: any = undefined;
  let expectedHash: any = undefined;
  for (const a of args) {
    if (typeof a === "string") {
      // Could be entered code or hash? If looks like hash (64 hex) treat as hash when expected missing.
      if (expectedHash === undefined && /^[0-9a-f]{64}$/i.test(a) && entered !== undefined) {
        expectedHash = a;
      } else if (entered === undefined) {
        entered = a;
      } else if (expectedHash === undefined) {
        expectedHash = a;
      }
    } else if (a && typeof a === "object") {
      if (a.codeHash !== undefined) expectedHash = a.codeHash;
      else if (a.hash !== undefined) expectedHash = a.hash;
      else if (a.passwordHash !== undefined) expectedHash = a.passwordHash;
    }
  }
  if (entered === undefined) return false;
  if (expectedHash === undefined) {
    // maybe first arg gate?
    return false;
  }
  return H.verifyCode(entered, expectedHash);
}

// Clear (mark) a gate as cleared, enforcing sequential ordering.
export function clearGate(...args: any[]): any {
  const state = resolveState(...args);
  const gates = resolveGates(...args);
  // find gate id
  let gateArg: any = undefined;
  for (const a of args) {
    if (a && typeof a === "object" && a !== state && !Array.isArray(a) && (a.id !== undefined || a.gateId !== undefined)) {
      gateArg = a; break;
    }
  }
  let id: string | undefined;
  if (gateArg) id = gateIdOf(gateArg);
  else {
    for (const a of args) {
      if (typeof a === "string" && !/^[0-9a-f]{64}$/i.test(a) && gates.some((g:any)=>g.id===a)) {
        id = a; break;
      }
    }
  }
  if (!id) {
    // maybe second arg string
    for (const a of args) {
      if (typeof a === "string") { id = a; break; }
    }
  }
  let storage: any = undefined;
  if (args[2] instanceof Map || (args[2] && typeof args[2] === "object" && (typeof args[2].getItem === "function" || typeof args[2].set === "function" || typeof args[2].save === "function"))) {
    storage = args[2];
  } else {
    storage = args.find((a:any)=> a instanceof Map || (a && typeof a === "object" && (typeof a.getItem === "function" || typeof a.set === "function" || typeof a.save === "function")));
  }
  const key = (typeof args[3] === "string" ? args[3] : (args.find((a:any)=> typeof a === "string" && a !== id && !/^[0-9a-f]{64}$/i.test(a) && a !== STORAGE_KEY) as string)) || undefined;
  const k = key || STORAGE_KEY;

  // pure mode if first arg is state
  const pure = isState(args[0]);
  if (!gates.some((g:any)=>g.id===id)) {
    // unknown gate; still maybe add
  }

  const already = state.gatesCleared.has(id!);
  if (already) {
    const ns: any = { ready: true, completed: new Set(state.completed), gatesCleared: new Set(state.gatesCleared) };
    ns.result = "already";
    ns.state = ns;
    if (pure && storage) persist(ns, storage, k);
    if (!pure) {
      _state = ns; emit();
    }
    return pure ? ns : "already";
  }

  if (!previousCleared(gates, state, id!)) {
    const ns: any = { ready: true, completed: new Set(state.completed), gatesCleared: new Set(state.gatesCleared) };
    ns.result = "locked";
    ns.state = ns;
    return pure ? ns : "locked";
  }

  const next = new Set(state.gatesCleared);
  next.add(id!);
  const ns: any = { ready: true, completed: new Set(state.completed), gatesCleared: next };
  ns.result = "complete";
  ns.state = ns;
  if (pure) {
    if (storage) persist(ns, storage, k);
  } else {
    _state = ns;
    const st = storage !== undefined ? storage : _storage;
    persist(_state, st, k || _key);
    emit();
  }
  return pure ? ns : "complete";
}

// Gate state summary.
export function gateState(...args: any[]): any {
  const state = resolveState(...args);
  const gates = resolveGates(...args);
  const cleared = state.gatesCleared;
  const clearedIds = gates.filter((g:any)=>cleared.has(g.id)).map((g:any)=>g.id);
  const openGates = gates.map((g:any, i:number) => {
    const isCleared = cleared.has(g.id);
    const isOpen = i === 0 ? true : cleared.has(gates[i-1].id);
    return { ...g, cleared: isCleared, open: isOpen, unlocked: isCleared };
  });
  const nextGate = openGates.find((g:any)=>!g.cleared && g.open) || null;
  const nextGateId = nextGate ? nextGate.id : null;
  const cc = clearedCount(state, gates);
  const total = gates.length;
  const allCleared = cc === total && total > 0;
  return {
    cleared: cleared,
    clearedSet: new Set(cleared),
    clearedIds,
    clearedCount: cc,
    count: cc,
    done: cc,
    doneCount: cc,
    total,
    open: allCleared ? true : cc > 0 ? true : false,
    allCleared,
    isComplete: allCleared,
    finished: allCleared,
    nextGate,
    nextGateId,
    next: nextGateId,
    gates: openGates,
    items: openGates,
  };
}

// Seal state.
export function sealState(...args: any[]): any {
  // args may include state/count, gates, gameDayAvailable flag
  const state = args.find(isState);
  const gates = resolveGates(...args);
  let count: number | undefined;
  if (state) count = clearedCount(state, gates);
  else {
    for (const a of args) {
      if (typeof a === "number") { count = a; break; }
    }
  }
  if (count === undefined) {
    // maybe first arg number of cleared gates
    if (typeof args[0] === "number") count = args[0];
    else count = 0;
  }
  const total = gates.length || 3;
  if (count <= 0) return "sealed";
  if (count < total) return "cracking";
  return "open";
}

// Countdown state.
const GAME_DAY_TS = GAME_DAY.getTime();
export function countdownState(...args: any[]): any {
  const now: any = args[0] !== undefined ? args[0] : Date.now();
  const ts: number = now instanceof Date ? now.getTime() : typeof now === "number" ? now : typeof now === "string" ? new Date(now).getTime() : Date.now();
  // optional target date
  let target = GAME_DAY_TS;
  for (const a of args) {
    if (a instanceof Date && a !== now) target = a.getTime();
    else if (typeof a === "string" && a !== now && !isNaN(new Date(a).getTime()) && args.indexOf(a) > 0) target = new Date(a).getTime();
  }
  if (ts >= target) return "pending";
  return "counting";
}

// Days until game day (helper).
export function daysUntilGameDay(...args: any[]): number {
  const now: any = args[0];
  const ts = now instanceof Date ? now.getTime() : typeof now === "number" ? now : typeof now === "string" ? new Date(now).getTime() : Date.now();
  const diff = GAME_DAY_TS - ts;
  return Math.max(0, Math.ceil(diff / (1000*60*60*24)));
}

export const countdownDays = daysUntilGameDay;
export const daysUntil = daysUntilGameDay;

// Complete a gate with code verification (engine-level async).
export async function completeGate(...args: any[]): Promise<any> {
  // Determine entered code, gate, state, storage...
  let entered: string | undefined;
  let gate: any = undefined;
  const gates = resolveGates(...args);
  for (const a of args) {
    if (typeof a === "string" && !gates.some((g:any)=>g.id===a)) {
      // could be entered code or id; if matches gate id, treat as gate id
      if (gates.some((g:any)=>g.id===a)) { gate = gates.find((g:any)=>g.id===a); }
      else if (entered === undefined) entered = a;
    }
    if (a && typeof a === "object" && a.codeHash !== undefined) gate = a;
  }
  if (!gate) {
    // maybe gate id passed as string that matches
    for (const a of args) {
      if (typeof a === "string" && gates.some((g:any)=>g.id===a)) {
        gate = gates.find((g:any)=>g.id===a);
      }
    }
  }
  if (!gate && gates.length) {
    // default next gate
    const st = resolveState(...args);
    const gs = gateState(st, gates);
    gate = gs.nextGate || gates[0];
  }
  const id = gate?.id;
  const state = resolveState(...args);
  let storage: any = undefined;
  if (args.find((a:any)=> a instanceof Map)) storage = args.find((a:any)=> a instanceof Map);
  else if (args[3] instanceof Map || (args[3] && typeof args[3] === "object" && (typeof args[3].getItem === "function" || typeof args[3].set === "function"))) storage = args[3];
  else storage = args.find((a:any)=> a && typeof a === "object" && (typeof a.getItem === "function" || typeof a.set === "function")) || _storage;
  const key = (typeof args[4] === "string" ? args[4] : (args.find((a:any)=> typeof a === "string" && a !== entered && a !== id) as string)) || _key || STORAGE_KEY;

  // sequential check
  if (!state.gatesCleared.has(id) && !previousCleared(gates, state, id)) {
    return "locked";
  }
  if (state.gatesCleared.has(id)) {
    return "already";
  }
  const ok = await verifyGate(entered ?? "", gate);
  if (!ok) return "wrong";

  // clear
  const pure = isState(args[0]);
  if (pure) {
    const ns: any = { ready: true, completed: new Set(state.completed), gatesCleared: new Set(state.gatesCleared) };
    ns.gatesCleared.add(id);
    ns.result = "complete";
    ns.state = ns;
    if (storage) persist(ns, storage, key);
    return ns;
  }
  // stateful
  const next = new Set(_state.gatesCleared);
  next.add(id);
  _state = { ready: true, completed: new Set(_state.completed), gatesCleared: next };
  persist(_state, storage, key);
  emit();
  return "complete";
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
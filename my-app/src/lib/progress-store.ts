// Browser adapter: thin wrapper over quest-engine's module-level state.
// All logic lives in quest-engine; this module only re-exports it so the
// existing import paths keep working.
export * from "./quest-engine.ts";

import { MILESTONES } from "../data/quest.ts";
export { MILESTONES };
export type { Milestone } from "../data/quest.ts";
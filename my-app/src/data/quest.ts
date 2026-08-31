export type CpapPartId =
  | "humidifier"
  | "tubing"
  | "filter"
  | "headgear"
  | "mask"
  | "power"
  | "machine";

export interface CpapPart {
  id: CpapPartId;
  name: string;
  emoji: string;
  color: string;
}

export interface Milestone {
  id: string;
  number: number;
  place: string;
  title: string;
  description: string;
  emoji: string;
  part: CpapPart;
  password: string;
}

export const HERO_NAME = "Benjamin";

export const CPAP_PARTS: Record<CpapPartId, CpapPart> = {
  humidifier: {
    id: "humidifier",
    name: "Humidifier Tank",
    emoji: "💧",
    color: "#38bdf8",
  },
  tubing: {
    id: "tubing",
    name: "Air Tubing",
    emoji: "🌀",
    color: "#a78bfa",
  },
  filter: {
    id: "filter",
    name: "Air Filter",
    emoji: "🌱",
    color: "#4ade80",
  },
  headgear: {
    id: "headgear",
    name: "Headgear Straps",
    emoji: "🪢",
    color: "#fbbf24",
  },
  mask: {
    id: "mask",
    name: "Sleep Mask",
    emoji: "🫧",
    color: "#f472b6",
  },
  power: {
    id: "power",
    name: "Power Supply",
    emoji: "⚡",
    color: "#facc15",
  },
  machine: {
    id: "machine",
    name: "The Machine",
    emoji: "💚",
    color: "#34d399",
  },
};

export const MILESTONES: Milestone[] = [
  {
    id: "hydration-oasis",
    number: 1,
    place: "The Water Oasis",
    title: "Drink the Deep Water",
    description:
      "Drink at least 6 glasses of water every day for 7 days in a row. Hydration keeps the journey moving!",
    emoji: "🐳",
    part: CPAP_PARTS.humidifier,
    password: "oasis",
  },
  {
    id: "wind-tunnel",
    number: 2,
    place: "The Wind Tunnel",
    title: "Move Like the Breeze",
    description:
      "Get moving — 30 minutes of exercise, 3 days a week, for 2 weeks. Strong lungs build strong journeys.",
    emoji: "🍃",
    part: CPAP_PARTS.tubing,
    password: "breeze",
  },
  {
    id: "filtering-ferns",
    number: 3,
    place: "The Filtering Ferns",
    title: "Clear the Night Air",
    description:
      "No screens for 1 hour before bed for 7 nights in a row. Let your brain drift away from the bright world.",
    emoji: "🍀",
    part: CPAP_PARTS.filter,
    password: "clean",
  },
  {
    id: "velcro-vines",
    number: 4,
    place: "The Velcro Vines",
    title: "Beat the Fern-Bed Curfew",
    description:
      "Be in bed by 11pm for 10 nights. Early to bed keeps the adventure well rested.",
    emoji: "🌿",
    part: CPAP_PARTS.headgear,
    password: "settle",
  },
  {
    id: "snuggle-stone",
    number: 5,
    place: "The Snuggle Stone",
    title: "Claim the Full Night",
    description:
      "Sleep at least 7 full hours for 14 nights. Those are the nights adventures are made of.",
    emoji: "🪨",
    part: CPAP_PARTS.mask,
    password: "dream",
  },
  {
    id: "lightning-root",
    number: 6,
    place: "The Lightning Root",
    title: "Tame the Clock",
    description:
      "Sleep and wake at roughly the same time every day for 3 straight weeks. A steady clock powers a steady turtle.",
    emoji: "⚡",
    part: CPAP_PARTS.power,
    password: "charge",
  },
  {
    id: "heart-of-the-quest",
    number: 7,
    place: "The Heart of the Quest",
    title: "The Champion's Rest",
    description:
      "30 days of great sleep habits, all together. Longest and hardest leg — and the one that wins the machine.",
    emoji: "❤️",
    part: CPAP_PARTS.machine,
    password: "breathe",
  },
];

export const STORAGE_KEY = "benjamin-quest-progress";
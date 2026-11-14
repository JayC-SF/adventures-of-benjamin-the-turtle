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
  passwordHash: string;
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
    passwordHash: "8e424db8e5664ade76226356bcf5ef6ad9d0879bdad6377db835868b17c443ba",
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
    passwordHash: "7e92c11499fd4106a899eeb457db8277bd6f09dd29e683f33ae704e12fa29cae",
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
    passwordHash: "3b066804f6d1d077173cfe4d06002e6a61e6f21c2b2e648417962115f1afcd8e",
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
    passwordHash: "6868e83de35c465d84d347493ccc23d12b3bfacb9809d30292d21fc4701224d1",
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
    passwordHash: "30fde358b34772de141e11ba599e28f9f44aa80ae89aaf243b73e6b9b9ebc896",
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
    passwordHash: "97488fbab3282166738a47c2f619037228568494475d4ac107c46c02678cb728",
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
    passwordHash: "aa8430ca0e63091efb65532391ebb2f1b7c1f02bc8f0f1e5fb82cc877d83ed71",
  },
];

export const STORAGE_KEY = "benjamin-quest-progress";
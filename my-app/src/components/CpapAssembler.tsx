import type { CSSProperties } from "react";
import { CPAP_PARTS, type CpapPartId } from "@/data/quest";

interface Props {
  unlocked: CpapPartId[];
}

const P = (unlocked: boolean, color: string) =>
  ({
    fill: unlocked ? color : "#171c40",
    stroke: unlocked ? "#ffffff" : "rgba(255,255,255,0.22)",
    strokeDasharray: unlocked ? undefined : "4 4",
    strokeWidth: 2,
    strokeLinejoin: "round",
    strokeLinecap: "round",
  }) as const;

function Group({
  id,
  unlocked,
  fillColor,
  children,
}: {
  id: CpapPartId;
  unlocked: boolean;
  fillColor: string;
  children: React.ReactNode;
}) {
  return (
    <g
      className={unlocked ? "part-glow animate-pop-in" : ""}
      style={
        {
          "--part-color": fillColor,
          transformBox: "fill-box",
          transformOrigin: "center",
        } as CSSProperties
      }
      opacity={unlocked ? 1 : 0.42}
      aria-label={CPAP_PARTS[id].name}
      data-part={id}
      data-unlocked={unlocked}
    >
      {children}
    </g>
  );
}

export function CpapAssembler({ unlocked }: Props) {
  const has = (id: CpapPartId) => unlocked.includes(id);
  const c = (id: CpapPartId) => CPAP_PARTS[id].color;

  return (
    <div className="glass rounded-3xl p-4 sm:p-6">
      <div className="flex flex-col gap-3">
        <svg
          viewBox="0 0 760 500"
          role="img"
          aria-label="An animated CPAP machine assembled from collected parts"
          className="w-full max-w-2xl self-center drop-shadow-2xl"
        >
          {/* Nightstand */}
          <g aria-hidden>
            <rect x="60" y="392" width="640" height="24" rx="6" fill="#3a2d22" />
            <rect x="60" y="392" width="640" height="7" rx="3.5" fill="#4a3a2c" />
            <rect x="128" y="416" width="20" height="70" rx="6" fill="#2c2119" />
            <rect x="612" y="416" width="20" height="70" rx="6" fill="#2c2119" />

            <rect x="680" y="452" width="24" height="34" rx="5" fill="#2a3169" />
            <circle cx="688" cy="464" r="2.5" fill="#0b1026" />
            <circle cx="696" cy="464" r="2.5" fill="#0b1026" />

            <ellipse cx="380" cy="392" rx="220" ry="16" fill="rgba(0,0,0,0.35)" />
          </g>

          {/* Humidifier tank */}
          <Group id="humidifier" unlocked={has("humidifier")} fillColor={c("humidifier")}>
            <rect x="516" y="318" width="86" height="72" rx="12" {...P(has("humidifier"), c("humidifier"))} />
            <rect x="524" y="326" width="70" height="28" rx="8" fill="rgba(255,255,255,0.22)" />
            <rect x="530" y="314" width="58" height="12" rx="6" {...P(has("humidifier"), c("humidifier"))} />
            <path
              d="M 524 362 H 594"
              stroke={has("humidifier") ? "#e0f2fe" : "#333a63"}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="541" cy="350" r="3" fill="rgba(224,242,254,0.7)" />
            <circle cx="557" cy="350" r="3" fill="rgba(224,242,254,0.7)" />
            <circle cx="573" cy="350" r="3" fill="rgba(224,242,254,0.7)" />
          </Group>

          {/* Machine body */}
          <Group id="machine" unlocked={has("machine")} fillColor={c("machine")}>
            <rect x="286" y="300" width="226" height="92" rx="14" {...P(has("machine"), c("machine"))} />
            <rect x="296" y="310" width="206" height="72" rx="9" fill="rgba(0,0,0,0.16)" />
            <rect x="326" y="322" width="66" height="22" rx="6" fill="#0b1026" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            {has("machine") && (
              <path
                d="M 334 333 h 12 M 354 333 h 18 M 380 333 h 4"
                stroke="#7ff3c9"
                strokeWidth="2.5"
                opacity={0.9}
              />
            )}
            <circle cx="474" cy="333" r="8" fill="#0b1026" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
            <circle cx="474" cy="333" r="3" fill={has("machine") ? "#7ff3c9" : "#333a63"} />
            <rect x="478" y="346" width="26" height="22" rx="5" fill="rgba(0,0,0,0.14)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
            <ellipse cx="330" cy="300" rx="19" ry="8" fill="#0b1026" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
          </Group>

          {/* Filter */}
          <Group id="filter" unlocked={has("filter")} fillColor={c("filter")}>
            <rect x="272" y="322" width="24" height="52" rx="8" {...P(has("filter"), c("filter"))} />
            <path
              d="M 278 336 v 12 M 278 356 v 12"
              stroke={has("filter") ? "#052e12" : "#333a63"}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </Group>

          {/* Tubing */}
          <Group id="tubing" unlocked={has("tubing")} fillColor={c("tubing")}>
            <path
              d="M 330 300 C 366 206, 268 130, 192 116"
              fill="none"
              stroke={has("tubing") ? c("tubing") : "#171c40"}
              strokeWidth="17"
              strokeLinecap="round"
              {...(has("tubing") ? {} : { strokeDasharray: "4 4", stroke: "rgba(255,255,255,0.22)" })}
            />
            <path
              d="M 330 300 C 366 206, 268 130, 192 116"
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={has("tubing") ? undefined : "2 5"}
            />
            <path
              d="M 330 300 C 366 206, 268 130, 192 116"
              fill="none"
              stroke={has("tubing") ? "#4c1d95" : "transparent"}
              strokeWidth="17"
              strokeLinecap="round"
              strokeDasharray={has("tubing") ? "26 24" : undefined}
              opacity={0.5}
            />
          </Group>

          {/* Headgear straps */}
          <Group id="headgear" unlocked={has("headgear")} fillColor={c("headgear")}>
            <path
              d="M 102 112 C 40 54, 262 54, 204 108"
              fill="none"
              stroke={has("headgear") ? c("headgear") : "rgba(255,255,255,0.22)"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={has("headgear") ? undefined : "4 4"}
            />
            <path
              d="M 104 146 C 60 220, 254 220, 206 134"
              fill="none"
              stroke={has("headgear") ? c("headgear") : "rgba(255,255,255,0.22)"}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={has("headgear") ? undefined : "4 4"}
            />
            <rect x="204" y="102" width="14" height="30" rx="6" {...P(has("headgear"), c("headgear"))} />
          </Group>

          {/* Mask */}
          <Group id="mask" unlocked={has("mask")} fillColor={c("mask")}>
            <ellipse cx="150" cy="132" rx="52" ry="40" transform="rotate(-10 150 132)" {...P(has("mask"), c("mask"))} />
            <ellipse cx="150" cy="132" rx="36" ry="26" transform="rotate(-10 150 132)" fill="#171c40" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
            <path
              d="M 112 120 C 126 140, 174 146, 190 128"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="193" cy="112" r="11" {...P(has("mask"), c("mask"))} />
            <circle cx="193" cy="112" r="4" fill="#171c40" />
          </Group>

          {/* Power */}
          <Group id="power" unlocked={has("power")} fillColor={c("power")}>
            <path
              d="M 512 372 C 574 372, 582 352, 616 370"
              fill="none"
              stroke={has("power") ? c("power") : "rgba(255,255,255,0.22)"}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={has("power") ? undefined : "4 4"}
            />
            <rect x="618" y="366" width="66" height="40" rx="10" {...P(has("power"), c("power"))} />
            <circle cx="640" cy="376" r="5" fill={has("power") ? "#0b1026" : "#333a63"} />
            <circle cx="688" cy="388" r="5" fill="rgba(255,255,255,0.25)" />
            <path
              d="M 684 398 C 700 410, 700 428, 690 450"
              fill="none"
              stroke={has("power") ? c("power") : "rgba(255,255,255,0.22)"}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={has("power") ? undefined : "4 4"}
            />
          </Group>
        </svg>

        {/* Parts legend */}
        <ul className="flex flex-wrap justify-center gap-2">
          {Object.values(CPAP_PARTS).map((part) => {
            const got = has(part.id);
            return (
              <li
                key={part.id}
                title={part.name}
                className={`animate-pop-in flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  got
                    ? "text-night-950 shadow-lg"
                    : "bg-white/5 text-white/40 line-through"
                }`}
                style={got ? { background: part.color } : undefined}
              >
                <span aria-hidden>{part.emoji}</span>
                {part.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
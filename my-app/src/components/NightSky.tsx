import type { CSSProperties } from "react";

const STARS = [
  { top: "8%", left: "6%", size: 3, dur: "2.6s", delay: "0s" },
  { top: "14%", left: "22%", size: 2, dur: "3.4s", delay: "0.6s" },
  { top: "6%", left: "38%", size: 2, dur: "2.9s", delay: "1.2s" },
  { top: "18%", left: "52%", size: 3, dur: "3.8s", delay: "0.3s" },
  { top: "9%", left: "66%", size: 2, dur: "3.1s", delay: "1.6s" },
  { top: "22%", left: "80%", size: 3, dur: "2.7s", delay: "0.9s" },
  { top: "28%", left: "12%", size: 2, dur: "3.6s", delay: "2s" },
  { top: "34%", left: "30%", size: 2, dur: "3s", delay: "0.2s" },
  { top: "40%", left: "58%", size: 3, dur: "3.3s", delay: "1.4s" },
  { top: "44%", left: "86%", size: 2, dur: "2.8s", delay: "0.7s" },
  { top: "52%", left: "20%", size: 2, dur: "3.5s", delay: "1.9s" },
  { top: "58%", left: "74%", size: 3, dur: "2.9s", delay: "2.4s" },
];

const FIREFLIES = [
  { top: "30%", left: "12%", dur: "7.5s", delay: "0s" },
  { top: "46%", left: "82%", dur: "9s", delay: "1.2s" },
  { top: "62%", left: "14%", dur: "8.2s", delay: "2.4s" },
  { top: "72%", left: "78%", dur: "7s", delay: "0.8s" },
  { top: "86%", left: "38%", dur: "8.8s", delay: "3s" },
  { top: "18%", left: "72%", dur: "7.8s", delay: "1.8s" },
];

export function NightSky() {
  return (
    <div className="sky" aria-hidden>
      <div className="moon" />
      {STARS.map((s, i) => (
        <span
          key={`star-${i}`}
          className="star"
          style={
            {
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              "--tw-dur": s.dur,
              "--tw-delay": s.delay,
            } as CSSProperties
          }
        />
      ))}
      {FIREFLIES.map((f, i) => (
        <span
          key={`fly-${i}`}
          className="firefly"
          style={
            {
              top: f.top,
              left: f.left,
              "--fl-dur": f.dur,
              "--fl-delay": f.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
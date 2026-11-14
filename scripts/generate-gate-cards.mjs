// Generates printable handover cards for the three medical gate codes.
// Usage: node scripts/generate-gate-cards.mjs <code1> <code2> <code3>
// Codes are passed on the command line so they are never stored in the repo.
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const [, , ...codes] = process.argv;
if (codes.length < 3) {
  console.error("Usage: node scripts/generate-gate-cards.mjs <code1> <code2> <code3>");
  process.exit(1);
}

const titles = ["Sleep-Test Prescription", "Sleep Test", "CPAP Prescription"];
const outDir = resolve(process.cwd(), "handover");
mkdirSync(outDir, { recursive: true });

for (let i = 0; i < 3; i++) {
  const code = codes[i];
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Gate ${i + 1} Handover Card</title>
<style>
  body { font-family: system-ui, sans-serif; background: #0b1026; color: #e2e8f0; margin: 0; padding: 40px; }
  .card { max-width: 420px; margin: 0 auto; border: 2px solid #fbbf24; border-radius: 24px; padding: 32px; text-align: center; background: #171c40; }
  .num { font-size: 12px; letter-spacing: 0.3em; text-transform: uppercase; color: #93c5fd; }
  h1 { font-size: 22px; margin: 12px 0 6px; }
  .code { font-family: monospace; font-size: 32px; font-weight: 800; color: #fbbf24; margin: 24px 0; letter-spacing: 0.1em; }
  p { font-size: 14px; color: #cbd5e1; line-height: 1.5; }
  .foot { margin-top: 24px; font-size: 11px; color: #64748b; }
</style>
</head>
<body>
  <div class="card">
    <div class="num">Gate ${i + 1} of 3</div>
    <h1>${titles[i]}</h1>
    <p>Hand this card to Benjamin when this step is truly complete.</p>
    <div class="code">${code}</div>
    <p>Enter this code on the medical-gates page to unlock the next step.</p>
    <div class="foot">Adventures of Benjamin the Turtle — keep this card private.</div>
  </div>
</body>
</html>`;
  writeFileSync(resolve(outDir, `gate-${i + 1}.html`), html);
}
console.log("Generated 3 handover cards in", outDir);
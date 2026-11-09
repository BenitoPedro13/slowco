#!/usr/bin/env node
// Contrast check for every theme × drop-accent combination (docs/02-VISUAL-IDENTITY.md §3.3).
// Parses src/styles/tokens.css, applies the top-level blocks whose selector matches an <html>
// carrying data-theme + data-drop-accent, ordered like the cascade (specificity, then source
// order), resolves var() chains, and checks WCAG 2.x ratios:
//   --content and --subtle against --canvas ≥ 4.5 (text), --accent against --canvas ≥ 3 (UI).
// Exit 1 on any failure. No dependencies.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssPath = fileURLToPath(new URL("../src/styles/tokens.css", import.meta.url));
const css = readFileSync(cssPath, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

const THEMES = ["preto", "branco", "drop"];
const ACCENTS = ["vermelho", "roxo", "azul", "verde"];

// Top-level blocks only: walk braces, keep depth-0 `selector { body }` without nested braces.
function topLevelBlocks(text) {
  const blocks = [];
  let depth = 0;
  let start = 0;
  let selectorStart = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === "{") {
      if (depth === 0) {
        start = i;
      }
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const selector = text.slice(selectorStart, start).trim();
        const body = text.slice(start + 1, i);
        if (!body.includes("{")) blocks.push({ selector, body });
        selectorStart = i + 1;
      }
    } else if (ch === ";" && depth === 0) {
      selectorStart = i + 1;
    }
  }
  return blocks;
}

function parseDecls(body) {
  const decls = {};
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) decls[m[1]] = m[2].trim();
  return decls;
}

// Supports `:root`, `[attr="v"]` and compounds of attribute selectors.
function matches(selector, attrs) {
  if (selector === ":root") return { ok: true, specificity: 1 };
  const parts = [...selector.matchAll(/\[([\w-]+)="([^"]+)"\]/g)];
  if (parts.length === 0 || parts.map((p) => p[0]).join("") !== selector.replace(/\s+/g, "")) {
    return { ok: false };
  }
  return { ok: parts.every(([, k, v]) => attrs[k] === v), specificity: parts.length };
}

const blocks = topLevelBlocks(css).map((b, order) => ({ ...b, order, decls: parseDecls(b.body) }));

function resolveFor(theme, accent) {
  const attrs = { "data-theme": theme, "data-drop-accent": accent };
  const applied = blocks
    .map((b) => ({ ...b, m: matches(b.selector, attrs) }))
    .filter((b) => b.m.ok)
    .sort((a, b) => a.m.specificity - b.m.specificity || a.order - b.order);
  const vars = {};
  for (const b of applied) Object.assign(vars, b.decls);
  const resolve = (value, seen = new Set()) => {
    const m = /^var\((--[\w-]+)\)$/.exec(value);
    if (!m) return value;
    if (seen.has(m[1])) throw new Error(`cycle at ${m[1]}`);
    seen.add(m[1]);
    if (!(m[1] in vars)) throw new Error(`undefined ${m[1]}`);
    return resolve(vars[m[1]], seen);
  };
  const out = {};
  for (const role of ["--canvas", "--content", "--subtle", "--accent"]) out[role] = resolve(vars[role]);
  return out;
}

function luminance(hex) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`not a #rrggbb hex: ${hex}`);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

let failures = 0;
const rows = [];
for (const accent of ACCENTS) {
  for (const theme of THEMES) {
    const v = resolveFor(theme, accent);
    const checks = [
      ["--content", 4.5],
      ["--subtle", 4.5],
      ["--accent", 3],
    ].map(([role, min]) => {
      const r = ratio(v[role], v["--canvas"]);
      const ok = r >= min;
      if (!ok) failures++;
      return `${v[role]} ${r.toFixed(2)}${ok ? "" : ` FAIL<${min}`}`;
    });
    rows.push([accent, theme, v["--canvas"], ...checks]);
  }
}

console.log("| accent | theme | canvas | content (≥4.5) | subtle (≥4.5) | accent (≥3) |");
console.log("| --- | --- | --- | --- | --- | --- |");
for (const r of rows) console.log(`| ${r.join(" | ")} |`);
console.log(failures ? `\n${failures} failing pair(s)` : `\nall ${rows.length * 3} pairs pass`);
process.exit(failures ? 1 : 0);

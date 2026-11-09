// Launch gate (docs/07-IMPLEMENTATION-PLAN.md T10): lists what still blocks the public launch
// and exits 1 while anything does. Run: pnpm check:launch
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const blockers = [];
const read = (p) => readFileSync(p, "utf8");
const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const placeholders = (read("src/content/catalog.ts").match(/placeholder: true/g) ?? []).length;
if (placeholders) blockers.push(`${placeholders} placeholder catalogue records (08 #22, #7, #14, #21)`);

const standins = walk("src").filter((f) => /\.tsx?$/.test(f) && read(f).includes('data-standin="wordmark"'));
if (standins.length) blockers.push(`wordmark stand-in in ${standins.join(", ")} (08 #2)`);

let env = "";
try {
  env = read(".env.local");
} catch {}
if (!/^NEXT_PUBLIC_WHATSAPP_NUMBER=\d{10,15}\s*$/m.test(env) && !process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
  blockers.push("NEXT_PUBLIC_WHATSAPP_NUMBER not set (08 #4)");

const approvals = read("docs/05-CONTENT.md").split("## 11.")[1] ?? "";
if (!/\|\s*\d{4}-\d{2}-\d{2}\s*\|/.test(approvals)) blockers.push("no copy approval logged in 05 §11 (08 #16)");

const open = read("docs/08-OPEN-INPUTS.md")
  .split("\n")
  .filter((l) => /^\|\s*\d+\s*\|/.test(l) && /\|\s*open[^|]*\|\s*$/i.test(l)).length;
if (open) blockers.push(`${open} open rows in docs/08-OPEN-INPUTS.md`);

if (blockers.length) {
  console.log("NOT READY TO LAUNCH:\n- " + blockers.join("\n- "));
  process.exit(1);
}
console.log("launch gate: nothing blocking");

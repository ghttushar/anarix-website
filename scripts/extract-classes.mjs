import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(p)) files.push(p);
  }
})("src");

const tokens = new Map();
for (const f of files) {
  const src = readFileSync(f, "utf8");
  // class strings: className="..." , className={`...`}, cn("...","..."), variant maps
  for (const m of src.matchAll(/(?:className|class)\s*=\s*(?:"([^"]*)"|\{`([^`]*)`\}|\{([^}]*)\})/g)) {
    const raw = (m[1] ?? m[2] ?? m[3] ?? "");
    for (const s of raw.matchAll(/["'`]([^"'`]*)["'`]/g)) collect(s[1], f);
    if (m[1] ?? m[2]) collect(m[1] ?? m[2], f);
  }
  for (const m of src.matchAll(/cn\(([\s\S]*?)\)/g)) {
    for (const s of m[1].matchAll(/["'`]([^"'`]*)["'`]/g)) collect(s[1], f);
  }
}
function collect(str, file) {
  for (const t of str.split(/\s+/)) {
    if (!t || /[<>{}()$]/.test(t)) continue;
    if (!/^[a-zA-Z[-]/.test(t)) continue;
    if (!tokens.has(t)) tokens.set(t, new Set());
    tokens.get(t).add(file);
  }
}
const list = [...tokens.keys()].sort();
writeFileSync("scripts/.classes.json", JSON.stringify(list, null, 1));
console.log("tokens:", list.length);

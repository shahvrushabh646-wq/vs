import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const archive = path.join(root, "gDFrm1D7ladISGL6-grok-workspace.zip");
const temp = path.join(root, ".vercel-workspace-extract");

if (!fs.existsSync(archive)) {
  throw new Error("Workspace ZIP is missing: " + path.basename(archive));
}

fs.rmSync(temp, { recursive: true, force: true });
fs.mkdirSync(temp, { recursive: true });
execFileSync("unzip", ["-q", archive, "-d", temp], { stdio: "inherit" });

// ZIPs can contain a wrapper directory whose name varies. Find the actual
// application root by locating package.json next to the application's src/.
function findAppRoot(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  if (entries.some(e => e.isFile() && e.name === "package.json") &&
      entries.some(e => e.isDirectory() && e.name === "src")) {
    return dir;
  }
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "node_modules" || entry.name === ".git") continue;
    const found = findAppRoot(path.join(dir, entry.name));
    if (found) return found;
  }
  return null;
}

const appRoot = findAppRoot(temp);
if (!appRoot) {
  const listing = execFileSync("unzip", ["-Z1", archive], { encoding: "utf8" })
    .split("\n").filter(Boolean).slice(0, 40).join(", ");
  throw new Error("Could not locate an app directory containing both package.json and src/ in workspace ZIP. First ZIP entries: " + listing);
}

// Preserve the ZIP and this preparation script; replace the thin wrapper with
// the discovered app root, regardless of the ZIP's internal folder name.
for (const name of fs.readdirSync(root)) {
  if (name === ".git" || name === ".vercel" || name === path.basename(archive) ||
      name === "prepare-vercel.mjs" || name === path.basename(temp)) continue;
  fs.rmSync(path.join(root, name), { recursive: true, force: true });
}
fs.cpSync(appRoot, root, { recursive: true });
fs.rmSync(temp, { recursive: true, force: true });
console.log("Prepared the complete app from " + path.relative(temp, appRoot) + " for Vercel.");

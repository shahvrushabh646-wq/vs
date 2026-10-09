import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const archive = path.join(root, "gDFrm1D7ladISGL6-grok-workspace.zip");
const temp = path.join(root, ".vercel-workspace-extract");
const extracted = path.join(temp, "final");

if (!fs.existsSync(archive)) {
  throw new Error("Workspace ZIP is missing: " + path.basename(archive));
}

fs.rmSync(temp, { recursive: true, force: true });
fs.mkdirSync(temp, { recursive: true });
execFileSync("unzip", ["-q", archive, "-d", temp], { stdio: "inherit" });

if (!fs.existsSync(path.join(extracted, "package.json")) || !fs.existsSync(path.join(extracted, "src"))) {
  throw new Error("Workspace ZIP does not contain final/package.json and final/src");
}

// Replace the thin deployment wrapper with the actual app from the workspace archive.
for (const name of fs.readdirSync(root)) {
  if (name === ".git" || name === ".vercel" || name === path.basename(archive) ||
      name === "prepare-vercel.mjs" || name === path.basename(temp)) continue;
  fs.rmSync(path.join(root, name), { recursive: true, force: true });
}
fs.cpSync(extracted, root, { recursive: true, force: true });
fs.rmSync(temp, { recursive: true, force: true });
console.log("Prepared the complete app from the workspace ZIP for Vercel.");

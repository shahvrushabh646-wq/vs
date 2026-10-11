#!/usr/bin/env node
/**
 * Run repository tests from an isolated working directory.
 *
 * Some head-injection tests intentionally model a blank customer workspace.
 * Running the suite from the repository root lets this repo's own public/og.jpg
 * and app identity leak into those fixtures. A temporary cwd makes the suite
 * deterministic while absolute test paths still load source and dependencies.
 */
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cwd = tmpdir();
const run = (args) => {
  const result = spawnSync(process.execPath, args, {
    cwd,
    stdio: "inherit",
    env: process.env,
  });
  if (result.error) {
    console.error(`[test] Could not start Node: ${result.error.message}`);
    process.exit(1);
  }
  if (result.signal) {
    console.error(`[test] Node test runner stopped by ${result.signal}`);
    process.exit(1);
  }
  return result.status ?? 1;
};

const jsStatus = run(["--test", join(root, "scripts/**/*.test.mjs")]);
if (jsStatus !== 0) process.exit(jsStatus);

const tsTests = [
  "src/lib/app-data/app-data.test.ts",
  "src/lib/app-data/readiness-schedule.test.ts",
  "src/lib/auth/gate-identity.test.ts",
  "src/lib/auth/sign-in-gate.test.ts",
].map((file) => join(root, file));
process.exit(run(["--experimental-strip-types", "--test", ...tsTests]));

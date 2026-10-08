import fs from "node:fs";

const route = "src/routes/index.tsx";
fs.mkdirSync("src/routes", { recursive: true });
fs.writeFileSync(route, `import { createFileRoute } from "@tanstack/react-router";
import { Studio } from "@/components/studio/studio";

export const Route = createFileRoute("/")({
  component: Studio,
});
`);

const db = "src/lib/db.ts";
if (fs.existsSync(db)) {
  let s = fs.readFileSync(db, "utf8");
  // Do not eagerly start PGLite during module evaluation. Database callers
  // still await ensureDbReady when they actually need persistence.
  s = s.replace(
    /\n\s*void ensureDbReady\(\);\s*$/m,
    "\n",
  );
  fs.writeFileSync(db, s);
}

console.log("[render] Removed blocking boot screen and eager DB startup");

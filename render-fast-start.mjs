import fs from "node:fs";

const path = "src/routes/index.tsx";
const source = `import { createFileRoute } from "@tanstack/react-router";
import { Studio } from "@/components/studio/studio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <Studio />;
}
`;

fs.mkdirSync("src/routes", { recursive: true });
fs.writeFileSync(path, source);
console.log("[render] Fast startup route installed");

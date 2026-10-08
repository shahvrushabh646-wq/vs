import fs from "node:fs";

const path = "vite.config.ts";
let s = fs.readFileSync(path, "utf8");

if (!s.includes('allowedHosts: ["vs-77lx.onrender.com"]')) {
  const needle = `    strictPort: true,\n  },`;
  const replacement = `    strictPort: true,\n    allowedHosts: ["vs-77lx.onrender.com"],\n    hmr: { protocol: "wss", host: "vs-77lx.onrender.com", clientPort: 443 },\n  },`;
  if (!s.includes(needle)) throw new Error("Could not locate Vite server block");
  s = s.replace(needle, replacement);
}

fs.writeFileSync(path, s);

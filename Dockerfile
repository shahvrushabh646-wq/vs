FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
ENV __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=vs-77lx.onrender.com

RUN apt-get update \
  && apt-get install -y --no-install-recommends unzip \
  && rm -rf /var/lib/apt/lists/*

COPY gDFrm1D7ladISGL6-grok-workspace.zip /tmp/workspace.zip

RUN unzip -q /tmp/workspace.zip -d /app \
  && rm -f /tmp/workspace.zip \
  && test -f /app/package.json \
  && test -d /app/src \
  && test -d /app/scripts \
  && node -e 'const fs=require("fs"); const p="src/routes/index.tsx"; let s=fs.readFileSync(p,"utf8"); s=s.replace("import { useEffect, useState } from \"react\";","").replace(/function Home\(\) \{[\\s\\S]*?\n\}/, "function Home() {\\n  return <Studio />;\\n}"); fs.writeFileSync(p,s);' \
  && node -e 'const fs=require("fs"); const p="vite.config.ts"; let s=fs.readFileSync(p,"utf8"); s=s.replace(/server: \{\n    host: "0\\.0\\.0",\n    port: 8080,\n    strictPort: true,\n  \},/, \'server: {\\n    host: "0.0.0.0",\\n    port: 8080,\\n    strictPort: true,\\n    allowedHosts: ["vs-77lx.onrender.com"],\\n    hmr: { protocol: "wss", host: "vs-77lx.onrender.com", clientPort: 443 },\\n    forwardConsole: { unhandledErrors: true, logLevels: ["warn", "error"] },\\n  },\'); fs.writeFileSync(p,s);'

RUN npm install --no-audit --no-fund --include=dev

EXPOSE 8080

CMD ["npm", "run", "dev"]

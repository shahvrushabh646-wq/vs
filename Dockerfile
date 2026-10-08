FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0
ENV __VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS=vs-77lx.onrender.com

RUN apt-get update \
  && apt-get install -y --no-install-recommends unzip ffmpeg \
  && rm -rf /var/lib/apt/lists/*

COPY gDFrm1D7ladISGL6-grok-workspace.zip /tmp/workspace.zip
COPY render-vite-fix.mjs /tmp/render-vite-fix.mjs
COPY render-fast-start.mjs /tmp/render-fast-start.mjs

RUN mkdir -p /tmp/workspace \
  && unzip -q /tmp/workspace.zip -d /tmp/workspace \
  && test -f /tmp/workspace/final/package.json \
  && test -d /tmp/workspace/final/src \
  && cp -a /tmp/workspace/final/. /app/ \
  && rm -rf /tmp/workspace /tmp/workspace.zip \
  && cp /tmp/render-vite-fix.mjs /app/render-vite-fix.mjs \
  && node /app/render-vite-fix.mjs \
  && cp /tmp/render-fast-start.mjs /app/render-fast-start.mjs \
  && node /app/render-fast-start.mjs \
  && rm -f /app/render-vite-fix.mjs /tmp/render-vite-fix.mjs /tmp/render-fast-start.mjs

RUN npm ci --no-audit --no-fund --include=dev

EXPOSE 8080

CMD ["npm", "run", "dev"]

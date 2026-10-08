FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

RUN apt-get update \
  && apt-get install -y --no-install-recommends unzip \
  && rm -rf /var/lib/apt/lists/*

COPY gDFrm1D7ladISGL6-grok-workspace.zip /tmp/workspace.zip

RUN unzip -q /tmp/workspace.zip -d /app \
  && rm /tmp/workspace.zip \
  && test -f /app/package.json \
  && test -f /app/package-lock.json \
  && test -d /app/src

RUN npm ci --no-audit --no-fund
RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "dev"]

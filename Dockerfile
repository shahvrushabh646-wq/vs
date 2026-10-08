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
  && test -d /app/scripts

RUN npm install --no-audit --no-fund --include=dev

EXPOSE 8080

CMD ["npm", "run", "dev"]

# Service vidéo AdStack : labo vidéo + ffmpeg + Chromium (rendu des sous-titres et incrustations)
FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
      ffmpeg chromium ca-certificates \
      fonts-liberation fonts-dejavu-core fonts-noto-core fonts-noto-color-emoji \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund
COPY . .

# LAB_OUT = disque persistant monté sur /data (l'état des productions et les fichiers y survivent aux redémarrages)
ENV NODE_ENV=production \
    LAB_OUT=/data/lab_out \
    HYPERFRAMES_BROWSER_PATH=/usr/bin/chromium \
    PORT=10000

EXPOSE 10000
CMD ["node", "lab_server.js"]

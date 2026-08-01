# Pebbles backend — reliable Puppeteer deployment on Render / Railway
# Deploys with Chromium installed via apt so PDF rendering always has a browser.
FROM node:20-slim

WORKDIR /app

# Install Chromium + shared libraries required by Puppeteer to run headless.
# These libs are exactly what Puppeteer's browser needs on slim Debian images.
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libnspr4 \
    libnss3 \
    libxkbcommon0 \
    libxshmfence1 \
    xdg-utils \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy manifests first to leverage Docker layer caching.
COPY package*.json ./
COPY tsconfig.json ./

# Skip downloading Puppeteer's own browser — we use the apt-installed Chromium.
ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN npm install

# Bundle the rest of the source.
COPY . .

# Debian's chromium binary lives here; generatePDF.tsx will discover it.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

ENV NODE_ENV=production
EXPOSE 8000
CMD ["npm", "start"]

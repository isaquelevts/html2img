FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fontconfig \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copiando as fontes para a pasta de fontes do sistema
COPY DMSans-Regular.ttf /usr/share/fonts/
COPY DMSans-Black.ttf /usr/share/fonts/
COPY Audiowide-Regular.ttf /usr/share/fonts/
RUN fc-cache -fv

WORKDIR /app
COPY package.json .
RUN npm install
COPY index.js .

EXPOSE 3033
CMD ["node", "index.js"]

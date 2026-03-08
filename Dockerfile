FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fontconfig \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY DMSans-Regular.ttf /usr/share/fonts/
COPY DMSans-Black.ttf /usr/share/fonts/
RUN fc-cache -fv

WORKDIR /app
COPY package.json .
RUN npm install
COPY index.js .

EXPOSE 3033
CMD ["node", "index.js"]
```

---

### Fontes
Sobe os dois arquivos `.ttf` na raiz do repositório junto com os outros arquivos. A estrutura final do repo fica assim:
```
html2img/
├── Dockerfile
├── index.js
├── package.json
├── DMSans-Regular.ttf
└── DMSans-Black.ttf

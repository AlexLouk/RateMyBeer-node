# Verwende ein Node.js-Base-Image mit einer bestimmten Version
FROM node:19-apline

# Setze das Arbeitsverzeichnis innerhalb des Docker-Images
WORKDIR /

# Kopiere die package.json und yarn.lock in das Arbeitsverzeichnis
COPY package*.json yarn.lock ./

# Installiere die Abhängigkeiten
RUN yarn install --production

# Kopiere den gesamten Backend-Code in das Arbeitsverzeichnis
COPY . .

# Setze den Port, den dein Backend verwenden soll (z.B. 3000)
ENV PORT=3000

# Öffne den Port im Container
EXPOSE $PORT

# Starte dein Backend
CMD [ "node", "index.js" ]
# Dockerfile (avec Node.js Debian)
FROM node:18-bullseye

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json package-lock.json* ./

# Installer les dépendances avec --legacy-peer-deps
RUN npm install --legacy-peer-deps

# Copier le reste de l'application
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 3000

# Démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
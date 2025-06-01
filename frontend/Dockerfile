# Image de base Node.js Alpine
FROM node:20-alpine AS development

# Installer bash
RUN apk add --no-cache bash

# Définir le dossier de travail
WORKDIR /app

# Installer Ionic CLI globalement
RUN npm install -g @ionic/cli

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Donner les permissions à node sur les répertoires nécessaires (node_modules, dist)
RUN chown -R node:node /app/node_modules /app/www || true


# Exposer le port Ionic
EXPOSE 8100

# Passer à l'utilisateur node
USER node

# Commande de démarrage
CMD ["npm", "run", "start"]

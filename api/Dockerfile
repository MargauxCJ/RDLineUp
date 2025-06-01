# Image de base
FROM node:20-alpine

# Installer bash
RUN apk add --no-cache bash

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers du projet
COPY . .

# Donner les permissions à node sur les dossiers nécessaires uniquement (dist et node_modules)
RUN chown -R node:node /app/dist /app/node_modules || true

# Installer les dépendances en tant que root (pour pouvoir écrire dans /app)
RUN npm install --unsafe-perm

# Redonner les droits à node uniquement sur les répertoires nécessaires après l'installation
RUN chown -R node:node /app/node_modules

# Exposer le port
EXPOSE 3000

# Passer à l'utilisateur node
USER node

# Commande de démarrage
CMD ["npm", "run", "start"]

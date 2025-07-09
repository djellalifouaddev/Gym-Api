# ---- Étape de build : compilation TypeScript ---- 
FROM node:20 AS builder
WORKDIR /app

# 1. Installation des dépendances (prod + dev) en utilisant le cache Docker
COPY package*.json ./
RUN npm install 

# 2. Copie du code source et compilation TypeScript en JavaScript
COPY . . 
RUN npm run build 

# 3. Nettoyage des dépendances de développement pour réduire la taille
RUN npm prune --omit=dev && npm cache clean --force

# ---- Étape finale : image de production ---- 
FROM node:20-slim AS runner
WORKDIR /app

# 4. Copie des artefacts nécessaires depuis l'étape de build
COPY --from=builder /app/dist ./dist 
COPY --from=builder /app/node_modules ./node_modules 
COPY --from=builder /app/package.json ./package.json 

# 5. (Optionnel) Variables d'environnement de production
ENV NODE_ENV=production

# 6. Exposition du port applicatif (exemple : 3000)
EXPOSE 3000

# 7. Démarrage de l'application Node.js
CMD ["node", "dist/server.js"]

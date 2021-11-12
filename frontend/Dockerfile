# Node 17 currently doesn't work with webpack :(
FROM node:lts-alpine

# Explicitly copy package.json, so that npm ci will run whenever new packages are installed
COPY package.json package-lock.json ./frontend/
WORKDIR /frontend
RUN npm ci

CMD ["npm", "start"]
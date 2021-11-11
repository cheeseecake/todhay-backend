# Node 17 currently doesn't work with webpack :(
FROM node:lts-alpine

# Install packages first... (so that this command doesn't run again if no new packages are installed)
COPY package.json package-lock.json ./
RUN npm ci

# ...then copy everything else
COPY . .
CMD ["npm", "start"]
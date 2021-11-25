# Node 17 currently doesn't work with webpack :(
FROM node:lts-alpine

WORKDIR /frontend

# `npm i` is run to ensure the node_modules is created locally, and then bind-mounted
# Workaround for bind mounts overwriting the container's node_modules folder
CMD npm i && npm start
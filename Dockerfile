FROM node:lts-alpine AS builder
WORKDIR /usr/src

COPY ./package*.json ./

COPY . .

RUN npm install

RUN npm run-script build && ls

FROM node:lts-alpine
ARG PORT=5050

# Update the system
RUN apk --no-cache -U upgrade
RUN apk update && apk add bash && apk cache clean

RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/public/images && chown -R node:node /home/node/app/public/images

WORKDIR /home/node/app

USER node

COPY --chown=node:node --from=builder /usr/src/package*.json ./

RUN npm install

COPY --chown=node:node --from=builder /usr/src/dist ./dist
COPY --chown=node:node --from=builder /usr/src/config ./config
COPY --chown=node:node --from=builder /usr/src/migrations ./migrations
COPY --chown=node:node --from=builder /usr/src/knexfile.js ./knexfile.js

EXPOSE ${PORT}

CMD [ "npm", "start" ]

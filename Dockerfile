FROM node:14-alpine AS BUILD_IMAGE

RUN apk add --no-cache make gcc g++

WORKDIR /usr/src/botmoney

COPY . .

RUN npm install
RUN npm run build
RUN npm prune --production

FROM node:14-alpine

WORKDIR /usr/src/botmoney

# copy from build image
COPY --from=BUILD_IMAGE /usr/src/botmoney/dist ./dist
COPY --from=BUILD_IMAGE /usr/src/botmoney/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/botmoney/package.json ./package.json
COPY --from=BUILD_IMAGE /usr/src/botmoney/prisma ./prisma
COPY --from=BUILD_IMAGE /usr/src/botmoney/scripts ./scripts

RUN apk add --no-cache tzdata
ENV TZ=America/Sao_Paulo

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]

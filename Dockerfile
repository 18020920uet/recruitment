FROM node:14-alpine3.12

RUN apk add --no-cache tzdata

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /home/recruitment

COPY ./tsconfig.build.json ./tsconfig.build.json
COPY ./tsconfig.json ./tsconfig.json
COPY ./.env.development ./.env.development
COPY ./.env.product ./.env.product
COPY ./package.json ./package.json
COPY ./nest-cli.json ./nest-cli.json

RUN npm install -g nest @nestjs/cli typeorm

RUN npm install

CMD ["node", "dist/main.js"]

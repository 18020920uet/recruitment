FROM node:14-alpine3.12
# AS development

WORKDIR /home/recruitment

COPY ./recruitment /home/recruitment

RUN yarn install

RUN yarn build

CMD ["node", "dist/main.js"]

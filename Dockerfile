FROM node:14-alpine3.12
# AS development

WORKDIR /home/recruitment

COPY ./recruitment /home/recruitment

RUN yarn install

RUN yarn global add ts-node --prefix /usr/local

RUN ln -s /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime

RUN yarn build

CMD ["node", "dist/main.js"]

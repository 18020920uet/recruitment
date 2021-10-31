FROM node:14-alpine3.12
# AS development

WORKDIR /home/recruitment

COPY ./ /home/recruitment

RUN ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime

RUN npm install -g nest @nestjs/cli typeorm

RUN npm build

CMD ["node", "dist/main.js"]

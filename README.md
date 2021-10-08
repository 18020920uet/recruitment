# thuchanhphattrienphanmemdeptrai123

[Sheet](https://docs.google.com/spreadsheets/d/1X_GFqA3NgNdl1daS5YV_8CiTEk2DpNWf4cdikxENW8o/edit#gid=0)

## Một số yêu cầu trước khi cài đặt

### Môi trường chạy

    node v14.17.4
    yarn
    postgresql

### Một số dependencies package mà yêu cầu cài đặt global:

    typeorm
    nestjs


### Một số yêu cầu trước khi sử dụng


Tạo file _recruitment/_**.env**

```.env
PORT=
BCRYPT_SALT_OF_ROUNDS=15
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
```

Tạo file _recruitment/_**ormconfig.json** và sửa config tùy chỉnh
```json
{
   "type": "postgres",
   "host": <HOST>, // database (nếu dùng docker)
   "port": 5432,
   "username": <DATABASE_USER>,
   "password": <DATABASE_PASSWORD>,
   "database": <DATABASE_NAME>,
   "synchronize": true,
   "logging": false,
   "entities": [
      "dist/**/*.entity{.ts,.js}",
   ],
   "migrations": [
      "src/migrations/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entities",
      "migrationsDir": "src/migrations",
      "subscribersDir": "src/subscribers"
   }
}
```

Tạo 1 thư mục mới: _/database_

### Chạy ứng dụng với docker
Yêu cầu:

      docker
      docker-compose

Chạy ứng dụng với môi trường development

```bash
docker-compose --env-file ./recruitment/.env up dev
```

Chạy ứng dụng với môi trường product

```bash
docker-compose --env-file ./recruitment/.env up prod
```

<!-- ## Phần tìm hiểu thêm -->
<!-- ### Request and Response Pipeline -->
<!-- ![Request And Respone Pipeline](images/request_response_pipeline.jpg) -->

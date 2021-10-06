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


### Cài đặt .env và typeorm.json

- Tạo file **.env** từ file **.env.example**
```.env
PORT=400
BCRYPT_SALT_OF_ROUNDS=17
```

- Tạo file **ormconfig.json** và sửa config tùy chỉnh
```json
{
   "type": "postgres",
   "host": <HOST>,
   "port": 5432,
   "username": <USERNAME>,
   "password": <PASSWORD>,
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

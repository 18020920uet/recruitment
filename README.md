# thuchanhphattrienphanmemdeptrai123

[Sheet](https://docs.google.com/spreadsheets/d/1X_GFqA3NgNdl1daS5YV_8CiTEk2DpNWf4cdikxENW8o/edit#gid=0)

## Một số yêu cầu trước khi cài đặt

### Môi trường chạy

    node v14.17.4
    yarn
    postgres

### Một số node dependencies package mà yêu cầu cài đặt global:

    typeorm
    nestjs


### Một số yêu cầu trước khi sử dụng

Tạo 1 thư mục mới: _/database_

Nếu chạy product thì tạo file **product.env** từ giống file **development.env** và cấu hình lại thông tin sửa  


### Chạy ứng dụng với docker
Yêu cầu:

      docker
      docker-compose

Build

>Nếu đã build rồi thì xóa thư mục _/database_ và _/dist_ đi để có thể build lại

```bash
docker-compose --env-file <path to .env file> build
```

Chạy ứng dụng với môi trường code

```bash
docker-compose --env-file ./.env.development up work
```

Chạy ứng dụng với môi trường dev

```bash
docker-compose --env-file ./.env.development up dev
```

Chạy ứng dụng với môi trường product ('Yêu cầu build lại')

```bash
mv -r database dist
docker-compose --env-file ./.env.product up --build prod
```

### Sử dụng

Sử dụng lấy **Container ID** của

```bash
docker ps
```

Lấy host IP bằng lệnh dưới

```bash
docker inspect {} | grep IPAddress
```

<!-- ## Phần tìm hiểu thêm -->
<!-- ### Request and Response Pipeline -->
<!-- ![Request And Respone Pipeline](images/request_response_pipeline.jpg) -->

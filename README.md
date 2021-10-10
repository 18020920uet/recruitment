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

Tạo 1 thư mục mới: _/database_

Nếu chạy product thì tạo file **product.env** từ giống file **development.env** và cấu hình lại thông tin sửa  


### Chạy ứng dụng với docker
Yêu cầu:

      docker
      docker-compose

Build

>Nếu đã build rồi thì xóa thư mục _/database_ đi để có thể build lại

```bash
docker-compose --env-file <path to .env file> build
```

Chạy ứng dụng với môi trường development

```bash
docker-compose --env-file ./recruitment/development.env up dev
```

Chạy ứng dụng với môi trường product ('Yêu cầu build lại')

```bash
docker-compose --env-file ./recruitment/product.env up prod
```

<!-- ## Phần tìm hiểu thêm -->
<!-- ### Request and Response Pipeline -->
<!-- ![Request And Respone Pipeline](images/request_response_pipeline.jpg) -->

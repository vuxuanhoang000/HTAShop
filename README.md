# HTA Shop

## 1. Giới thiệu

-   Dự án website thương mại điện tử `HTA Shop` được viết bằng javascript.
-   Dự án được chia thành 2 thư mục gồm `server` (backend) và `client` (frontend), với thư mục `server` định nghĩa các api và thư mục `client` định nghĩa các trang cho website.
-   Dự án được viết bằng [ExpressJS](https://expressjs.com/) (backend) và [ReactJs](https://react.dev/) (frontend) trên môi trường node v16.20.0 .

## 2. Yêu cầu máy chủ

-   Dung lượng ổ cứng > 23 GB.
-   Đã cài đặt phiên bản Nodejs <= v16.x .

## 3. Hướng dẫn chạy source code

### 3.1. Nhập dữ liệu database vào một máy chủ mongodb

-   Dữ liệu dự án được đặt ở thư mục `database`. Đây là các tệp json và có thể nhập vào cơ sở dữ liệu `mongodb` thông qua các công cụ như [MongoDB Compass](https://www.mongodb.com/products/compass) hay [Studio 3T](https://studio3t.com/download/).
-   Lấy đường dẫn URI của cơ sở dữ liệu và nhập vào tệp .env trong thư mục `server`.

### 3.2. Cài đặt thư viện

-   B1: Mở `terminal` trỏ đến đường dẫn của dự án.
-   B2: Cài đặt các gói thư viện cho `server`

```bash
cd /server && npm install && cd ..
```

-   B3: Cài đặt các gói thư viện cho `client`

```bash
cd /client && npm install && cd ..
```

### 3.3. Chạy dự án

-   B1: Chạy `server`. Mở một termimal mới trỏ đến đường dẫn của dự án.

```bash
cd /server && npm run start
```

-   B2:Chạy `client`. Mở một termimal mới trỏ đến đường dẫn của dự án.

```bash
cd /client && npm run start
```

-   B3: Vào trình duyệt mở đường dẫn [http://localhost:3000](http://localhost:3000).

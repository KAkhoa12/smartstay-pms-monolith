# SmartStay Auth API Guide

## Muc tieu

Tai lieu nay dung de test luong dang ky, dang nhap, refresh token, logout va lay thong tin nguoi dung bang Postman.

He thong da duoc tach thanh 2 nhom tai khoan:

- `BUSINESS`: tai khoan doanh nghiep, co tao `tenant` va `memberships`
- `CUSTOMER`: tai khoan khach hang, chi tao `user`, khong tao `tenant`

## Format response chung

Tat ca auth API deu tra ve theo format:

```json
{
  "success": true,
  "message": "Thong bao",
  "payload": {}
}
```

## Dich vu can chay

- PostgreSQL
- `services/auth-service`
- `apps/client` chi can khi ban muon test giao dien web

## URL mac dinh

- Auth service: `http://localhost:8081`
- Swagger: `http://localhost:8081/api-docs`

## 1. Dang ky doanh nghiep

- Method: `POST`
- URL: `http://localhost:8081/auth/register/business`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "email": "business@example.com",
  "password": "123456",
  "fullName": "Business Admin",
  "companyName": "SmartStay Hotel Group",
  "legalName": "SmartStay Hospitality Joint Stock Company",
  "businessType": "hospitality",
  "taxCode": "0123456789",
  "phoneNumber": "+84901234567",
  "jobTitle": "Operations Director",
  "websiteUrl": "https://smartstay.vn",
  "addressLine": "123 Nguyen Hue, District 1",
  "city": "Ho Chi Minh City",
  "country": "Vietnam",
  "companySize": "11-50",
  "hotelCount": 3
}
```

- Ghi chu:
  - `domain` la optional
  - Neu khong gui `domain`, backend se tu sinh tu `companyName`
  - Neu domain bi trung, backend se tu them hau to de dam bao duy nhat

- Ky vong:
  - HTTP `201` hoac `200`
  - Response:

```json
{
  "success": true,
  "message": "Business register successful",
  "payload": {
    "user": {
      "accountType": "BUSINESS"
    },
    "memberships": [
      {
        "roleName": "OWNER",
        "tenant": {}
      }
    ],
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

## 2. Dang nhap doanh nghiep

- Method: `POST`
- URL: `http://localhost:8081/auth/login/business`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "email": "business@example.com",
  "password": "123456",
  "deviceInfo": "Postman on Windows",
  "ipAddress": "127.0.0.1"
}
```

- Ky vong:
  - HTTP `201` hoac `200`
  - Response:

```json
{
  "success": true,
  "message": "Business login successful",
  "payload": {
    "user": {
      "accountType": "BUSINESS"
    },
    "memberships": [
      {
        "roleName": "OWNER",
        "tenant": {}
      }
    ],
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

## 3. Dang ky khach hang

- Method: `POST`
- URL: `http://localhost:8081/auth/register/customer`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "email": "customer1@example.com",
  "password": "123456",
  "fullName": "Customer Demo",
  "phoneNumber": "+84901111222"
}
```

- Ky vong:
  - HTTP `201` hoac `200`
  - Response:

```json
{
  "success": true,
  "message": "Customer register successful",
  "payload": {
    "user": {
      "accountType": "CUSTOMER"
    },
    "memberships": [],
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

## 4. Dang nhap khach hang

- Method: `POST`
- URL: `http://localhost:8081/auth/login/customer`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "email": "customer1@example.com",
  "password": "123456",
  "deviceInfo": "Postman on Windows",
  "ipAddress": "127.0.0.1"
}
```

- Ky vong:
  - HTTP `201` hoac `200`
  - Response:

```json
{
  "success": true,
  "message": "Customer login successful",
  "payload": {
    "user": {
      "accountType": "CUSTOMER"
    },
    "memberships": [],
    "accessToken": "jwt_access_token",
    "refreshToken": "jwt_refresh_token"
  }
}
```

## 5. Lay thong tin user bang access token

- Method: `GET`
- URL: `http://localhost:8081/auth/me`
- Headers:
  - `Authorization: Bearer {{accessToken}}`

- Ky vong:
  - HTTP `200`
  - Response:

```json
{
  "success": true,
  "message": "Get profile successful",
  "payload": {
    "user": {
      "id": "user-id",
      "email": "business@example.com",
      "fullName": "Business Admin",
      "accountType": "BUSINESS"
    },
    "memberships": [
      {
        "roleName": "OWNER",
        "tenant": {
          "name": "SmartStay Hotel Group",
          "businessType": "hospitality"
        }
      }
    ]
  }
}
```

## 6. Refresh token

- Method: `POST`
- URL: `http://localhost:8081/auth/refresh`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "refreshToken": "{{refreshToken}}",
  "deviceInfo": "Postman on Windows",
  "ipAddress": "127.0.0.1"
}
```

## 7. Logout

- Method: `POST`
- URL: `http://localhost:8081/auth/logout`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

## Thu tu test khuyen nghi tren Postman

1. Goi `Business Register` hoac `Customer Register`
2. Lay `accessToken` va `refreshToken`
3. Goi `Me`
4. Goi `Refresh`
5. Goi `Logout`

## Luu y

- Neu dung nham endpoint login, backend se tra ve `Account type is not allowed for this endpoint`
- Neu dang ky trung email, backend se tra loi `Email already exists`
- Response loi cung theo format chung:

```json
{
  "success": false,
  "message": "Invalid email or password",
  "payload": {}
}
```

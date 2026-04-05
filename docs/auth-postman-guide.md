# SmartStay Auth API Guide

## Muc tieu

Tai lieu nay dung de test cac luong auth hien co bang Postman:

- Dang ky doanh nghiep
- Dang nhap doanh nghiep
- Dang ky khach hang
- Dang nhap khach hang
- Lay thong tin user
- Refresh token
- Logout
- Quen mat khau: gui OTP qua email
- Quen mat khau: xac thuc OTP
- Quen mat khau: doi mat khau moi

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
  "email": "customer@example.com",
  "password": "123456",
  "fullName": "Customer Demo",
  "phoneNumber": "+84901111222"
}
```

- Ky vong:
  - HTTP `201` hoac `200`

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
  "email": "customer@example.com",
  "password": "123456",
  "deviceInfo": "Postman on Windows",
  "ipAddress": "127.0.0.1"
}
```

- Ky vong:
  - HTTP `201` hoac `200`

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

- Ky vong:
  - HTTP `201` hoac `200`

```json
{
  "success": true,
  "message": "Refresh token successful",
  "payload": {
    "accessToken": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
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

- Ky vong:
  - HTTP `201` hoac `200`

```json
{
  "success": true,
  "message": "Logout successful",
  "payload": {
    "success": true
  }
}
```

## 8. Quen mat khau - Gui OTP

- Method: `POST`
- URL: `http://localhost:8081/auth/forgot-password/request`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "email": "customer@example.com"
}
```

- Ky vong:
  - HTTP `200`

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "payload": {
    "email": "customer@example.com",
    "expiresInSeconds": 600,
    "delivery": "email"
  }
}
```

- Ghi chu:
  - Neu chua cau hinh SMTP, backend co the tra them `otpPreview` trong `payload` de test local
  - Khi co SMTP that, OTP se duoc gui ve email

## Dieu kien de OTP gui duoc qua email that

De API `POST /auth/forgot-password/request` gui OTP ve email that, can dam bao:

- `auth-service` dang chay
- PostgreSQL dang ket noi thanh cong
- da cau hinh SMTP hop le

### Cau hinh SMTP voi Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=dangphamdangkhoa21@gmail.com
SMTP_PASS=YOUR_NEW_APP_PASSWORD
SMTP_FROM=dangphamdangkhoa21@gmail.com
```

### Cach xac nhan da gui mail that

Neu thanh cong, response se co:

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "payload": {
    "email": "customer@example.com",
    "expiresInSeconds": 600,
    "delivery": "email"
  }
}
```

Neu response van la:

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "payload": {
    "delivery": "mock",
    "otpPreview": "123456"
  }
}
```

thi nghia la backend chua doc du bien SMTP that.

## 9. Quen mat khau - Xac thuc OTP

- Method: `POST`
- URL: `http://localhost:8081/auth/forgot-password/verify-otp`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "email": "customer@example.com",
  "otp": "123456"
}
```

- Ky vong:
  - HTTP `200`

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "payload": {
    "email": "customer@example.com",
    "verified": true
  }
}
```

## 10. Quen mat khau - Doi mat khau moi

- Method: `POST`
- URL: `http://localhost:8081/auth/forgot-password/reset-password`
- Headers:
  - `Content-Type: application/json`
- Body:

```json
{
  "email": "customer@example.com",
  "otp": "123456",
  "newPassword": "newStrongPassword123"
}
```

- Ky vong:
  - HTTP `200`

```json
{
  "success": true,
  "message": "Password reset successful",
  "payload": {
    "email": "customer@example.com",
    "passwordReset": true
  }
}
```

## Thu tu test khuyen nghi tren Postman

1. Goi `Business Register` hoac `Customer Register`
2. Goi `Business Login` hoac `Customer Login`
3. Lay `accessToken` va `refreshToken`
4. Goi `Me`
5. Goi `Refresh`
6. Goi `Logout`
7. Goi `Forgot Password Request`
8. Goi `Forgot Password Verify OTP`
9. Goi `Forgot Password Reset Password`

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

- Frontend web hien tai luu token vao `localStorage` voi cac key:
  - `smartstay_access_token`
  - `smartstay_refresh_token`
  - `smartstay_user`

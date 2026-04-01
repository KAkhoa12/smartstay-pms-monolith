# auth-service

## 1) Setup nhanh

```bash
cd services/auth-service
cp .env.local .env
go mod tidy
go run ./cmd/server
```

## 2) Kết nối PostgreSQL

Dùng biến môi trường trong `.env`:  
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DB_SSL_MODE`
- `JWT_SECRET`

Hoặc chạy full stack bằng docker:

```bash
docker compose up -d postgres
docker compose up -d auth-service
```

## 3) Chạy migration

Cài `golang-migrate` CLI trước, sau đó:

```bash
cd services/auth-service
bash scripts/migrate.sh
```

## 4) Cấu trúc module DB đề xuất

- `users`: tài khoản đăng nhập, profile cơ bản.
- `roles`: danh mục quyền (super_admin, hotel_admin, staff).
- `user_roles`: bảng many-to-many user-role.
- `refresh_tokens`: quản lý phiên đăng nhập và revoke token.

Khi mở rộng PMS, tách thêm schema/module:

- `iam`: users/roles/permissions/policies.
- `tenant`: hotel, branches, subscription.
- `audit`: login history, security events.

## 5) API hiện có

- `GET /healthz`
- `POST /v1/auth/register`
- `POST /v1/auth/login`

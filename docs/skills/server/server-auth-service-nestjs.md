# Kỹ Năng: Auth Service (NestJS)

## Mục tiêu

Phát triển và vận hành `services/auth-service` theo chuẩn NestJS + TypeORM + JWT.

## Kiến trúc hiện tại

- Framework: NestJS 11
- ORM: TypeORM
- DB: PostgreSQL
- Security: JWT access + refresh token hash (bcrypt)
- API docs: Swagger qua `main.ts`

## Phạm vi module

- `src/modules/auth/*`
- `src/modules/users/*`
- `src/modules/refresh-token/*`
- `src/modules/role/*`
- `src/modules/permission/*`
- `src/modules/tenant/*`
- `src/modules/user-tenant-role/*`

## Quy tắc implementation

1. Mọi endpoint auth phải qua DTO rõ ràng.
2. Refresh token phải lưu hash, không lưu raw token.
3. Revocation logic bắt buộc trong refresh/logout.
4. Kiểm soát biến môi trường:
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`

## Checklist review

- Kiểm tra mismatch tên env DB (`DB_USERNAME` vs `DB_USER`) trước khi deploy.
- `synchronize` chỉ dùng cho local/dev, không dùng production.
- Guard `JwtAuthGuard` bảo vệ endpoint `me`.
- Swagger path được cấu hình bằng `SWAGGER_PATH`.

## Mở rộng khuyến nghị

- Thêm migration thay vì phụ thuộc `synchronize`.
- Thêm integration test cho register/login/refresh/logout.
- Tách policy phân quyền theo tenant + role + permission rõ hơn.

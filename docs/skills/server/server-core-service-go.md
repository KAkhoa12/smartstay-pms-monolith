# Kỹ Năng: Core Service (Go)

## Mục tiêu

Làm chủ service Go trong `services/core-service` theo hướng clean layering.

## Kiến trúc hiện tại

- Entrypoint: `cmd/server/main.go`
- Config: `internal/config/config.go` + `configs/*.yaml` + env override
- Delivery: `internal/delivery/http/*`
- Usecase: `internal/usecase/auth_usecase.go`
- Repository: `internal/repository/postgres/*`
- Infra: `pkg/database`, `pkg/logger`

## Năng lực cần có

- Go net/http routing style (`GET /healthz`, `POST /v1/auth/*`).
- JWT signing với `github.com/golang-jwt/jwt/v5`.
- Hash password (bcrypt) + hash refresh token (sha256).
- Postgres thông qua pgx pool.

## Quy tắc phát triển

1. Handler chỉ parse/validate request-response, không nhúng business logic.
2. Usecase giữ business rules auth.
3. Repository thuần CRUD, không biết business flow.
4. Config có validate bắt buộc (`JWT_SECRET`, DB config, TTL).

## Checklist review

- Import path phải đồng bộ với module `services/core-service` (hiện tại có dấu hiệu lệch sang `services/auth-service`).
- Router phải bao gồm đủ endpoint cần thiết (`register/login`, có thể bổ sung refresh/logout).
- Migration trong `deployments/migrations` cần được chạy trước khi start.
- Smoke cmd (`cmd/smoke`) cần phù hợp API version hiện tại.

## Hướng nâng cấp

- Bổ sung middleware request-id, structured log, panic recovery.
- Bổ sung refresh/logout endpoint để đồng bộ với auth flow NestJS.
- Thêm test cho usecase và repository.

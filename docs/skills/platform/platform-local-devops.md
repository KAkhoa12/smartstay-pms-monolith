# Kỹ Năng: Local DevOps Nền Tảng

## Mục tiêu

Khởi động, kiểm thử và giữ môi trường local ổn định cho client + backend + postgres.

## Phạm vi

- Root `docker-compose.yml`
- `apps/client` scripts (`dev/build/start/lint`)
- `services/auth-service` scripts (`start:dev/test/...`)
- `services/core-service` (`Makefile`, `scripts/migrate.sh`)

## Năng lực cần có

- Docker Compose cho postgres và auth layer.
- Chuẩn hóa env files (`.env`, `.env.local`).
- Kiểm soát ports:
- client: 3000 (mặc định Next)
- auth-service Nest: 3000 (mặc định trong `main.ts` nếu không set `PORT`)
- core-service Go: theo yaml config (`server.port`)
- postgres: 5432

## Workflow đề xuất

1. Start PostgreSQL trước.
2. Chạy migration schema.
3. Start backend được chọn (Nest hoặc Go).
4. Start frontend và test luồng login/booking.

## Checklist release local

- Biến môi trường không bị trùng tên nhưng khác nghĩa.
- Swagger/API docs truy cập được.
- Health check endpoint trả về 200.
- Frontend call đúng endpoint backend.

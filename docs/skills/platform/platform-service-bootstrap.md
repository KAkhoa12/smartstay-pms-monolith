# Kỹ Năng: Bootstrap Service (API Gateway, Payment, AI)

## Mục tiêu

Khởi tạo 3 service đang trống trong `services/` theo một khung thống nhất, để mở rộng monolith thành hệ thống module rõ ràng.

## Đối tượng

- `services/api-gateway`
- `services/payment-service`
- `services/ai-service`

## Bootstrap checklist chung

1. Chọn stack từng service (Go/Nest/FastAPI) và ghi rõ trong README.
2. Tạo boilerplate tối thiểu:
- entrypoint
- health endpoint (`GET /healthz`)
- config loader (env)
- logging middleware
3. Tạo Dockerfile + compose fragment.
4. Tạo API contract draft (OpenAPI hoặc swagger).
5. Tạo test skeleton (unit + smoke).

## Định hướng theo domain

### API Gateway
- Route aggregation và auth middleware.
- Rate limit, request-id, observability hooks.

### Payment Service
- Payment intent lifecycle.
- Webhook verify.
- Idempotency key cho transaction APIs.

### AI Service
- Prompt orchestration.
- Guardrails input/output.
- Tracking token usage, latency, fallback model.

## Tiêu chí hoàn thành

- Mỗi service có README setup 5 phút.
- Có health endpoint chạy được bằng docker compose.
- Có pipeline test/lint cơ bản.

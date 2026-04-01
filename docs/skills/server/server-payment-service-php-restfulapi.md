# Kỹ Năng: Payment Service PHP RESTful API

## Mục tiêu

Thiết lập và phát triển `services/payment-service` bằng PHP framework theo chuẩn RESTful API.

## Framework đề xuất

- Slim Framework 4 (nhẹ, phù hợp microservice).
- PHP >= 8.2.
- Composer để quản lý dependency.

## Phạm vi kỹ thuật

- API phiên bản hóa theo prefix `/api/v1`.
- Chuẩn hóa response JSON (`success`, `message`, `data`).
- Cấu trúc domain thanh toán:
- tạo payment intent
- cập nhật trạng thái giao dịch
- truy vấn chi tiết giao dịch
- webhook callback từ cổng thanh toán

## Cấu trúc thư mục khuyến nghị

- `public/index.php`: entrypoint HTTP.
- `src/Controllers`: controller cho payment và health.
- `src/Services`: nghiệp vụ thanh toán.
- `src/Repositories`: truy cập dữ liệu (tạm thời có thể in-memory).
- `app/routes.php`: định nghĩa routes RESTful.
- `deployments/Dockerfile`: chạy service bằng container.

## Endpoint nền tảng

- `GET /healthz`
- `POST /api/v1/payments`
- `GET /api/v1/payments/{id}`
- `PATCH /api/v1/payments/{id}/status`
- `POST /api/v1/payments/webhook`

## Kỹ năng bắt buộc khi triển khai thật

- Idempotency key cho endpoint tạo thanh toán.
- Chữ ký webhook (HMAC) và chống replay.
- Mapping trạng thái giao dịch nhất quán (`pending`, `authorized`, `paid`, `failed`, `refunded`, `cancelled`).
- Log và trace theo `request_id`.

## Checklist review

- API trả đúng HTTP status code.
- Input validation đầy đủ cho amount/currency/status.
- Không log thông tin nhạy cảm (token thẻ, secret key).
- Có test cho happy path và failed path.


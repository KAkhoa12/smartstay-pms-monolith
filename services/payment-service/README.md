# Payment Service (PHP RESTful API)

## Công nghệ

- PHP 8.2+
- Slim Framework 4
- PSR-7 (`slim/psr7`)

## Chạy local bằng PHP

1. Cài PHP + Composer.
2. Trong thư mục này chạy:
```bash
composer install
cp .env.example .env
composer start
```
3. API chạy tại `http://localhost:8082`.

## Chạy bằng Docker

```bash
docker build -f deployments/Dockerfile -t smartstay-payment-service .
docker run --rm -p 8082:8082 smartstay-payment-service
```

## Endpoint

- `GET /healthz`
- `POST /api/v1/payments`
- `GET /api/v1/payments/{id}`
- `PATCH /api/v1/payments/{id}/status`
- `POST /api/v1/payments/webhook`

## Payload mẫu tạo payment

```json
{
  "amount": 1200000,
  "currency": "VND",
  "orderId": "ORDER-10001",
  "description": "Thanh toán đặt phòng",
  "customerId": "CUST-001"
}
```


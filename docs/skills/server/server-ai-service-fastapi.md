# Kỹ Năng: AI Service (FastAPI)

## Mục tiêu

Thiết kế và phát triển `services/ai-service` bằng FastAPI theo chuẩn service AI nội bộ cho SmartStay.

## Phạm vi kỹ thuật

- Framework: FastAPI (Python 3.12+).
- API versioning theo prefix `/api/v1`.
- Chuẩn hóa response JSON và mã lỗi.
- Ưu tiên bất đồng bộ (`async`) cho các tác vụ gọi model/provider.

## Năng lực bắt buộc

1. Quản lý endpoint AI:
- tạo phản hồi hội thoại
- tóm tắt nội dung
- trích xuất thông tin có cấu trúc
2. Guardrails:
- validate input
- giới hạn độ dài prompt
- lọc nội dung không an toàn theo policy
3. Vận hành:
- log theo `request_id`
- theo dõi latency/token usage
- timeout và fallback model

## Cấu trúc thư mục khuyến nghị

- `main.py`: khởi tạo app FastAPI.
- `app/api/v1`: routers.
- `app/schemas`: Pydantic models request/response.
- `app/services`: orchestration gọi model.
- `app/core`: config, logging, security.
- `app/clients`: adapter đến LLM provider.

## Endpoint nền tảng khuyến nghị

- `GET /healthz`
- `POST /api/v1/ai/chat`
- `POST /api/v1/ai/summarize`
- `POST /api/v1/ai/extract`

## Checklist review

- Có timeout rõ ràng cho mỗi request đến provider.
- Không log prompt chứa dữ liệu nhạy cảm.
- Có cơ chế retry có giới hạn cho lỗi tạm thời.
- Có schema response ổn định để frontend/backend khác tích hợp.
- Tách business logic khỏi layer API handler.


# AI Service (FastAPI)

## Mục tiêu

Service AI nội bộ cho SmartStay, cung cấp các API xử lý ngôn ngữ tự nhiên như chat, tóm tắt và trích xuất thông tin.

## Công nghệ

- Python 3.12+
- FastAPI
- Uvicorn
- Pydantic

## Hướng API

- Prefix: `/api/v1`
- Các endpoint khuyến nghị:
- `GET /healthz`
- `POST /api/v1/ai/chat`
- `POST /api/v1/ai/summarize`
- `POST /api/v1/ai/extract`

## Chuẩn response đề xuất

```json
{
  "success": true,
  "message": "OK",
  "data": {}
}
```

## Yêu cầu vận hành

- Gắn `request_id` cho mỗi request.
- Thiết lập timeout rõ ràng khi gọi model/provider.
- Không ghi log dữ liệu nhạy cảm trong prompt.
- Theo dõi latency và token usage.

## Bước tiếp theo

1. Bổ sung dependency FastAPI vào `pyproject.toml`.
2. Chuyển `main.py` sang app FastAPI thực thụ.
3. Thêm router, schema và service layer theo cấu trúc chuẩn.

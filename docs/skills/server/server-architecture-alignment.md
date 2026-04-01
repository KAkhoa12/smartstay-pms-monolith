# Kỹ Năng: Căn Chỉnh Kiến Trúc Server

## Mục tiêu

Căn chỉnh kiến trúc backend để tránh trùng lặp giữa `auth-service` (NestJS) và `core-service` (Go).

## Vấn đề hiện tại cần xử lý

1. Hai implementation auth cùng tồn tại song song.
2. README và hướng dẫn setup có chỗ sai context service.
3. Docker compose đang trỏ tới `services/auth-service/deployments/Dockerfile` trong khi thư mục này không có file này.
4. Import path trong Go usecase có dấu hiệu copy sai namespace.

## Chiến lược kỹ năng

### Bước 1: Chọn service auth chính thức
- Lựa chọn A: dùng NestJS auth-service.
- Lựa chọn B: dùng Go core-service làm auth backend.
- Không để 2 auth flow cùng production.

### Bước 2: Đồng bộ tài liệu và scripts
- Sửa `README` từng service.
- Sửa `docker-compose.yml` theo service đã chọn.
- Chuẩn hóa env names và config keys.

### Bước 3: Chuẩn hóa API contract
- Giữ chung prefix (`/v1/auth` hoặc `/auth`) theo một quy ước.
- Đồng bộ payload register/login/refresh/logout/me.
- Đồng bộ response schema và mã lỗi.

### Bước 4: Chuẩn hóa DB model
- Định nghĩa schema users/roles/tenant/refresh_tokens duy nhất.
- Phân bổ migration cho service sở hữu schema.

## Tiêu chí hoàn thành

- Có một auth service active rõ ràng.
- Docker compose start được stack local không patch tay.
- Tài liệu setup và endpoint khớp với code thực tế.

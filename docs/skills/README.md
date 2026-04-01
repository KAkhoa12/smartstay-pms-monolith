# Bộ Kỹ Năng Hệ Thống SmartStay

Tài liệu này tổng hợp các bộ kỹ năng theo đúng hiện trạng mã nguồn trong `smartstay-pms-monolith`.

## Danh sách bộ kỹ năng

### Client
- [client-booking-experience.md](./client/client-booking-experience.md)
- [client-search-filter-flow.md](./client/client-search-filter-flow.md)

### Server
- [server-auth-service-nestjs.md](./server/server-auth-service-nestjs.md)
- [server-core-service-go.md](./server/server-core-service-go.md)
- [server-architecture-alignment.md](./server/server-architecture-alignment.md)

### Platform
- [platform-local-devops.md](./platform/platform-local-devops.md)
- [platform-service-bootstrap.md](./platform/platform-service-bootstrap.md)

## Ghi chú phạm vi

- `apps/client`: đã có luồng giao diện du lịch/booking khá đầy đủ.
- `services/auth-service`: NestJS, TypeORM, JWT, mô hình vai trò đa tenant.
- `services/core-service`: Go service cho auth flow, có migration và config YAML.
- `services/api-gateway`, `services/payment-service`, `services/ai-service`: chưa có implementation.

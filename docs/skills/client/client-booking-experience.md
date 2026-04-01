# Kỹ Năng: Trải Nghiệm Booking Ở Client

## Mục tiêu

Xây dựng và mở rộng luồng UI booking trong `apps/client` theo đúng style và hành vi hiện có.

## Phạm vi mã chính

- `app/login/page.tsx`
- `app/(travel)/booking/page.tsx`
- `app/(travel)/booking/results/page.tsx`
- `app/(travel)/booking/hotel-details/[hotelId]/page.tsx`
- `app/(travel)/flights/page.tsx`
- `components/booking/*`
- `components/ui/*`
- `app/globals.css`

## Năng lực cần có

- Next.js App Router với page server/client mix.
- Tailwind CSS 4, utility-first, responsive theo breakpoints `md/lg/xl`.
- Tổ chức state phức tạp cho booking flow bằng React hooks.
- Quản lý query string (`URLSearchParams`) để giữ state tìm kiếm giữa các page.

## Quy tắc thực thi

1. Giữ đồng bộ trải nghiệm giữa các màn:
- booking page -> results page -> hotel details.
2. Ưu tiên tái sử dụng:
- `SharedSearchShell`
- `DropdownPanel`
- `useOutsideDismiss`
- constants trong `search-field-styles.ts`
3. Thông điệp lỗi và label phải nhất quán:
- destination required message
- date/guest labels
4. Khi thêm giao diện mới, bố trí theo section rõ:
- hero
- search
- cards/list
- detail tabs

## Checklist review

- Có giữ được params `destination/checkIn/checkOut/adults/children/rooms/beds` khi điều hướng không.
- Có vỡ responsive ở `md/lg` khi đổi view mode/filter drawer không.
- Có trùng lặp logic date picker/guest picker không, có thể trích về component chung được không.
- Có xung đột class tailwind với globals custom (`glossy-button`, `marina-header`) không.

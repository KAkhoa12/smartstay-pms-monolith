# Kỹ Năng: Luồng Tìm Kiếm Và Bộ Lọc Ở Client

## Mục tiêu

Làm chủ toàn bộ hệ thống tìm kiếm, lọc, sắp xếp và đổi chế độ hiển thị trong booking results.

## Phạm vi mã chính

- `components/booking/shared-search-shell.tsx`
- `app/(travel)/booking/results/page.tsx`
- `components/ui/destination-required-message.tsx`
- `components/ui/dropdown-panel.tsx`
- `components/ui/use-outside-dismiss.ts`

## Năng lực cần có

- Quản lý overlay/dropdown state không xung đột.
- Sticky search bar có compact mode theo scroll.
- Kết hợp filter map + keyword + price range + sort + view mode.
- Mapping filter tags từ dataset hotel mock.

## Mẫu workflow khuyến nghị

1. Cập nhật query params trước, đồng bộ state sau.
2. Xử lý validate bắt buộc điểm đến trước khi submit.
3. Tách hàm helper:
- normalize text
- parse number
- parse price/rating/distance
4. Duy trì nguồn sự thật cho filter state:
- `checkedMap`
- `selectedSortKey`
- `priceRangeMin/priceRangeMax`

## Rủi ro thường gặp

- Lệch state khi `useSearchParams` thay đổi nhưng local state không sync.
- Trượt focus/không đóng panel khi click ngoài.
- Logic date range bị sai nếu user chọn ngày check-out trước check-in.
- Hiệu năng giảm khi danh sách hotel tăng lớn mà chưa memoized.

## Tiêu chí hoàn thành

- Tìm kiếm và lọc cho kết quả ổn định, không mất params.
- UI dropdown/filter hoạt động đúng trên desktop và mobile.
- Không có warning React do state update không đồng bộ.

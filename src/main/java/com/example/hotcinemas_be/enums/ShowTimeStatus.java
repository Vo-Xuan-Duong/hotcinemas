package com.example.hotcinemas_be.enums;

/**
 * Status lifecycle of a showtime:
 * SCHEDULED -> ONGOING -> COMPLETED -> EXPIRED
 *            |
 *            +-> CANCELED (manual action)
 */
public enum ShowTimeStatus {
    /**
     * Trạng thái nháp. Suất chiếu đã được tạo trong hệ thống
     * nhưng chưa được công bố hoặc chưa mở bán vé.
     */
    DRAFT,

    /**
     * Đã lên lịch và đang trong thời gian mở bán vé.
     * (Thay thế cho 'SCHEDULED' để làm rõ nghĩa hơn).
     */
    OPEN_FOR_BOOKING,

    /**
     * Đã hết thời gian đặt vé (ví dụ: 30 phút trước giờ chiếu)
     * nhưng suất chiếu chưa bắt đầu.
     */
    BOOKING_CLOSED,

    /**
     * Suất chiếu đang diễn ra.
     * (Giữ nguyên 'ONGOING' của bạn, hoặc có thể dùng 'IN_PROGRESS').
     */
    ONGOING,

    /**
     * Suất chiếu đã kết thúc.
     * (Gộp 'COMPLETED' và 'EXPIRED' thành một trạng thái cuối cùng).
     */
    FINISHED,

    /**
     * Suất chiếu đã bị hủy.
     */
    CANCELED
}

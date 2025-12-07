package com.example.hotcinemas_be.models;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tickets",
        // 1. QUAN TRỌNG NHẤT: Ràng buộc duy nhất để chống trùng vé
        // Không bao giờ cho phép 1 ghế bán 2 lần trong 1 suất chiếu
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_showtime_seat", columnNames = {"showtime_id", "seat_name"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Vé thuộc về đơn hàng nào?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // Vé của suất chiếu nào?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    private Showtime showtime;

    // 2. Tên ghế (SNAPSHOT): Dữ liệu quan trọng nhất để in vé
    @Column(name = "seat_name", length = 10, nullable = false)
    private String seatName;

    // 3. (Tùy chọn) Liên kết lỏng lẻo đến bảng Seats
    // Để NULLABLE (không bắt buộc) phòng khi rạp sửa đổi xóa ghế vật lý
    // Dùng để thống kê sau này (VD: Ghế nào hay được ngồi nhất?)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_id", nullable = true)
    private Seat seat;

    // 4. Giá tiền: Tuyệt đối dùng BigDecimal, KHÔNG dùng Double
    // Double sẽ bị lỗi làm tròn số (Floating Point Error)
    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Column(name = "ticket_code", unique = true, length = 100)
    private String ticketCode;

    // Trạng thái vé: Đã soát vé vào rạp chưa?
    @Builder.Default
    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false;

    // Thời gian soát vé (Check-in time)
    @Column(name = "used_at")
    private LocalDateTime usedAt;
}
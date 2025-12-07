package com.example.hotcinemas_be.enums;

public enum BookingStatus {
    PENDING,    // Đang chờ thanh toán
    PAID,       // Đã thanh toán thành công
    CANCELLED,  // Hủy do hết giờ hoặc người dùng hủy
    FAILED,     // Thanh toán lỗi
    REFUNDED    // Đã hoàn tiền
}

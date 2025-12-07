package com.example.hotcinemas_be.enums;

/**
 * Enum định nghĩa các loại permission trong hệ thống cinema
 */
public enum PermissionType {

    // ========== USER MANAGEMENT ==========
    USER_CREATE("USER_CREATE", "Tạo người dùng mới"),
    USER_READ("USER_READ", "Xem thông tin người dùng"),
    USER_UPDATE("USER_UPDATE", "Cập nhật thông tin người dùng"),
    USER_DELETE("USER_DELETE", "Xóa người dùng"),
    USER_ACTIVATE("USER_ACTIVATE", "Kích hoạt người dùng"),
    USER_DEACTIVATE("USER_DEACTIVATE", "Vô hiệu hóa người dùng"),

    // ========== ROLE MANAGEMENT ==========
    ROLE_CREATE("ROLE_CREATE", "Tạo vai trò mới"),
    ROLE_READ("ROLE_READ", "Xem thông tin vai trò"),
    ROLE_UPDATE("ROLE_UPDATE", "Cập nhật vai trò"),
    ROLE_DELETE("ROLE_DELETE", "Xóa vai trò"),
    ROLE_ASSIGN_PERMISSION("ROLE_ASSIGN_PERMISSION", "Gán quyền cho vai trò"),

    // ========== PERMISSION MANAGEMENT ==========
    PERMISSION_CREATE("PERMISSION_CREATE", "Tạo quyền mới"),
    PERMISSION_READ("PERMISSION_READ", "Xem thông tin quyền"),
    PERMISSION_UPDATE("PERMISSION_UPDATE", "Cập nhật quyền"),
    PERMISSION_DELETE("PERMISSION_DELETE", "Xóa quyền"),
    PERMISSION_ACTIVATE("PERMISSION_ACTIVATE", "Kích hoạt quyền"),
    PERMISSION_DEACTIVATE("PERMISSION_DEACTIVATE", "Vô hiệu hóa quyền"),

    // ========== MOVIE MANAGEMENT ==========
    MOVIE_CREATE("MOVIE_CREATE", "Tạo phim mới"),
    MOVIE_READ("MOVIE_READ", "Xem thông tin phim"),
    MOVIE_UPDATE("MOVIE_UPDATE", "Cập nhật thông tin phim"),
    MOVIE_DELETE("MOVIE_DELETE", "Xóa phim"),
    MOVIE_ACTIVATE("MOVIE_ACTIVATE", "Kích hoạt phim"),
    MOVIE_DEACTIVATE("MOVIE_DEACTIVATE", "Vô hiệu hóa phim"),

    // ========== CINEMA MANAGEMENT ==========
    CINEMA_CREATE("CINEMA_CREATE", "Tạo rạp chiếu phim mới"),
    CINEMA_READ("CINEMA_READ", "Xem thông tin rạp chiếu phim"),
    CINEMA_UPDATE("CINEMA_UPDATE", "Cập nhật thông tin rạp chiếu phim"),
    CINEMA_DELETE("CINEMA_DELETE", "Xóa rạp chiếu phim"),
    CINEMA_ACTIVATE("CINEMA_ACTIVATE", "Kích hoạt rạp chiếu phim"),
    CINEMA_DEACTIVATE("CINEMA_DEACTIVATE", "Vô hiệu hóa rạp chiếu phim"),

    // ========== CINEMA CLUSTER MANAGEMENT ==========
    CINEMA_CLUSTER_CREATE("CINEMA_CLUSTER_CREATE", "Tạo cụm rạp chiếu phim mới"),
    CINEMA_CLUSTER_READ("CINEMA_CLUSTER_READ", "Xem thông tin cụm rạp chiếu phim"),
    CINEMA_CLUSTER_UPDATE("CINEMA_CLUSTER_UPDATE", "Cập nhật thông tin cụm rạp chiếu phim"),
    CINEMA_CLUSTER_DELETE("CINEMA_CLUSTER_DELETE", "Xóa cụm rạp chiếu phim"),
    CINEMA_CLUSTER_ACTIVATE("CINEMA_CLUSTER_ACTIVATE", "Kích hoạt cụm rạp chiếu phim"),
    CINEMA_CLUSTER_DEACTIVATE("CINEMA_CLUSTER_DEACTIVATE", "Vô hiệu hóa cụm rạp chiếu phim"),

    // ========== ROOM MANAGEMENT ==========
    ROOM_CREATE("ROOM_CREATE", "Tạo phòng chiếu mới"),
    ROOM_READ("ROOM_READ", "Xem thông tin phòng chiếu"),
    ROOM_UPDATE("ROOM_UPDATE", "Cập nhật thông tin phòng chiếu"),
    ROOM_DELETE("ROOM_DELETE", "Xóa phòng chiếu"),
    ROOM_ACTIVATE("ROOM_ACTIVATE", "Kích hoạt phòng chiếu"),
    ROOM_DEACTIVATE("ROOM_DEACTIVATE", "Vô hiệu hóa phòng chiếu"),

    // ========== SEAT MANAGEMENT ==========
    SEAT_CREATE("SEAT_CREATE", "Tạo ghế ngồi mới"),
    SEAT_READ("SEAT_READ", "Xem thông tin ghế ngồi"),
    SEAT_UPDATE("SEAT_UPDATE", "Cập nhật thông tin ghế ngồi"),
    SEAT_DELETE("SEAT_DELETE", "Xóa ghế ngồi"),
    SEAT_ACTIVATE("SEAT_ACTIVATE", "Kích hoạt ghế ngồi"),
    SEAT_DEACTIVATE("SEAT_DEACTIVATE", "Vô hiệu hóa ghế ngồi"),

    // ========== SHOWTIME MANAGEMENT ==========
    SHOWTIME_CREATE("SHOWTIME_CREATE", "Tạo suất chiếu mới"),
    SHOWTIME_READ("SHOWTIME_READ", "Xem thông tin suất chiếu"),
    SHOWTIME_UPDATE("SHOWTIME_UPDATE", "Cập nhật thông tin suất chiếu"),
    SHOWTIME_DELETE("SHOWTIME_DELETE", "Xóa suất chiếu"),
    SHOWTIME_ACTIVATE("SHOWTIME_ACTIVATE", "Kích hoạt suất chiếu"),
    SHOWTIME_DEACTIVATE("SHOWTIME_DEACTIVATE", "Vô hiệu hóa suất chiếu"),

    // ========== BOOKING MANAGEMENT ==========
    BOOKING_CREATE("BOOKING_CREATE", "Tạo đặt vé mới"),
    BOOKING_READ("BOOKING_READ", "Xem thông tin đặt vé"),
    BOOKING_UPDATE("BOOKING_UPDATE", "Cập nhật thông tin đặt vé"),
    BOOKING_DELETE("BOOKING_DELETE", "Xóa đặt vé"),
    BOOKING_CANCEL("BOOKING_CANCEL", "Hủy đặt vé"),
    BOOKING_CONFIRM("BOOKING_CONFIRM", "Xác nhận đặt vé"),

    // ========== PAYMENT MANAGEMENT ==========
    PAYMENT_CREATE("PAYMENT_CREATE", "Tạo thanh toán mới"),
    PAYMENT_READ("PAYMENT_READ", "Xem thông tin thanh toán"),
    PAYMENT_UPDATE("PAYMENT_UPDATE", "Cập nhật thông tin thanh toán"),
    PAYMENT_DELETE("PAYMENT_DELETE", "Xóa thanh toán"),
    PAYMENT_PROCESS("PAYMENT_PROCESS", "Xử lý thanh toán"),
    PAYMENT_REFUND("PAYMENT_REFUND", "Hoàn tiền"),

    // ========== VOUCHER MANAGEMENT ==========
    VOUCHER_CREATE("VOUCHER_CREATE", "Tạo voucher mới"),
    VOUCHER_READ("VOUCHER_READ", "Xem thông tin voucher"),
    VOUCHER_UPDATE("VOUCHER_UPDATE", "Cập nhật thông tin voucher"),
    VOUCHER_DELETE("VOUCHER_DELETE", "Xóa voucher"),
    VOUCHER_ACTIVATE("VOUCHER_ACTIVATE", "Kích hoạt voucher"),
    VOUCHER_DEACTIVATE("VOUCHER_DEACTIVATE", "Vô hiệu hóa voucher"),

    // ========== SYSTEM MANAGEMENT ==========
    SYSTEM_READ_LOGS("SYSTEM_READ_LOGS", "Xem nhật ký hệ thống"),
    SYSTEM_READ_ANALYTICS("SYSTEM_READ_ANALYTICS", "Xem báo cáo thống kê"),
    SYSTEM_MANAGE_SETTINGS("SYSTEM_MANAGE_SETTINGS", "Quản lý cài đặt hệ thống"),
    SYSTEM_BACKUP("SYSTEM_BACKUP", "Sao lưu dữ liệu"),
    SYSTEM_RESTORE("SYSTEM_RESTORE", "Khôi phục dữ liệu");

    private final String code;
    private final String description;

    PermissionType(String code, String description) {
        this.code = code;
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public String getDescription() {
        return description;
    }

    /**
     * Lấy PermissionType theo code
     */
    public static PermissionType fromCode(String code) {
        for (PermissionType type : values()) {
            if (type.code.equals(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException("No permission type found for code: " + code);
    }
}

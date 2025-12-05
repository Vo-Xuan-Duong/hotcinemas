-- Script để tạo các permission cơ bản cho hệ thống cinema
-- Chạy script này để insert các permission vào database

-- ========== USER MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('USER_CREATE', 'Tạo người dùng mới', 'Cho phép tạo tài khoản người dùng mới trong hệ thống', true),
('USER_READ', 'Xem thông tin người dùng', 'Cho phép xem thông tin chi tiết của người dùng', true),
('USER_UPDATE', 'Cập nhật thông tin người dùng', 'Cho phép cập nhật thông tin cá nhân của người dùng', true),
('USER_DELETE', 'Xóa người dùng', 'Cho phép xóa tài khoản người dùng khỏi hệ thống', true),
('USER_ACTIVATE', 'Kích hoạt người dùng', 'Cho phép kích hoạt tài khoản người dùng', true),
('USER_DEACTIVATE', 'Vô hiệu hóa người dùng', 'Cho phép vô hiệu hóa tài khoản người dùng', true);

-- ========== ROLE MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('ROLE_CREATE', 'Tạo vai trò mới', 'Cho phép tạo vai trò mới trong hệ thống', true),
('ROLE_READ', 'Xem thông tin vai trò', 'Cho phép xem danh sách và chi tiết vai trò', true),
('ROLE_UPDATE', 'Cập nhật vai trò', 'Cho phép cập nhật thông tin vai trò', true),
('ROLE_DELETE', 'Xóa vai trò', 'Cho phép xóa vai trò khỏi hệ thống', true),
('ROLE_ASSIGN_PERMISSION', 'Gán quyền cho vai trò', 'Cho phép gán hoặc thu hồi quyền cho vai trò', true);

-- ========== PERMISSION MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('PERMISSION_CREATE', 'Tạo quyền mới', 'Cho phép tạo quyền mới trong hệ thống', true),
('PERMISSION_READ', 'Xem thông tin quyền', 'Cho phép xem danh sách và chi tiết quyền', true),
('PERMISSION_UPDATE', 'Cập nhật quyền', 'Cho phép cập nhật thông tin quyền', true),
('PERMISSION_DELETE', 'Xóa quyền', 'Cho phép xóa quyền khỏi hệ thống', true),
('PERMISSION_ACTIVATE', 'Kích hoạt quyền', 'Cho phép kích hoạt quyền trong hệ thống', true),
('PERMISSION_DEACTIVATE', 'Vô hiệu hóa quyền', 'Cho phép vô hiệu hóa quyền trong hệ thống', true);

-- ========== MOVIE MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('MOVIE_CREATE', 'Tạo phim mới', 'Cho phép thêm phim mới vào hệ thống', true),
('MOVIE_READ', 'Xem thông tin phim', 'Cho phép xem danh sách và chi tiết phim', true),
('MOVIE_UPDATE', 'Cập nhật thông tin phim', 'Cho phép cập nhật thông tin phim', true),
('MOVIE_DELETE', 'Xóa phim', 'Cho phép xóa phim khỏi hệ thống', true),
('MOVIE_ACTIVATE', 'Kích hoạt phim', 'Cho phép kích hoạt phim để bán vé', true),
('MOVIE_DEACTIVATE', 'Vô hiệu hóa phim', 'Cho phép vô hiệu hóa phim', true);

-- ========== CINEMA MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('CINEMA_CREATE', 'Tạo rạp chiếu phim mới', 'Cho phép thêm rạp chiếu phim mới', true),
('CINEMA_READ', 'Xem thông tin rạp chiếu phim', 'Cho phép xem danh sách và chi tiết rạp chiếu phim', true),
('CINEMA_UPDATE', 'Cập nhật thông tin rạp chiếu phim', 'Cho phép cập nhật thông tin rạp chiếu phim', true),
('CINEMA_DELETE', 'Xóa rạp chiếu phim', 'Cho phép xóa rạp chiếu phim khỏi hệ thống', true),
('CINEMA_ACTIVATE', 'Kích hoạt rạp chiếu phim', 'Cho phép kích hoạt rạp chiếu phim', true),
('CINEMA_DEACTIVATE', 'Vô hiệu hóa rạp chiếu phim', 'Cho phép vô hiệu hóa rạp chiếu phim', true);

-- ========== CINEMA CLUSTER MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('CINEMA_CLUSTER_CREATE', 'Tạo cụm rạp chiếu phim mới', 'Cho phép thêm cụm rạp chiếu phim mới', true),
('CINEMA_CLUSTER_READ', 'Xem thông tin cụm rạp chiếu phim', 'Cho phép xem danh sách và chi tiết cụm rạp chiếu phim', true),
('CINEMA_CLUSTER_UPDATE', 'Cập nhật thông tin cụm rạp chiếu phim', 'Cho phép cập nhật thông tin cụm rạp chiếu phim', true),
('CINEMA_CLUSTER_DELETE', 'Xóa cụm rạp chiếu phim', 'Cho phép xóa cụm rạp chiếu phim khỏi hệ thống', true),
('CINEMA_CLUSTER_ACTIVATE', 'Kích hoạt cụm rạp chiếu phim', 'Cho phép kích hoạt cụm rạp chiếu phim', true),
('CINEMA_CLUSTER_DEACTIVATE', 'Vô hiệu hóa cụm rạp chiếu phim', 'Cho phép vô hiệu hóa cụm rạp chiếu phim', true);

-- ========== ROOM MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('ROOM_CREATE', 'Tạo phòng chiếu mới', 'Cho phép thêm phòng chiếu mới vào rạp', true),
('ROOM_READ', 'Xem thông tin phòng chiếu', 'Cho phép xem danh sách và chi tiết phòng chiếu', true),
('ROOM_UPDATE', 'Cập nhật thông tin phòng chiếu', 'Cho phép cập nhật thông tin phòng chiếu', true),
('ROOM_DELETE', 'Xóa phòng chiếu', 'Cho phép xóa phòng chiếu khỏi hệ thống', true),
('ROOM_ACTIVATE', 'Kích hoạt phòng chiếu', 'Cho phép kích hoạt phòng chiếu', true),
('ROOM_DEACTIVATE', 'Vô hiệu hóa phòng chiếu', 'Cho phép vô hiệu hóa phòng chiếu', true);

-- ========== SEAT MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('SEAT_CREATE', 'Tạo ghế ngồi mới', 'Cho phép thêm ghế ngồi mới vào phòng chiếu', true),
('SEAT_READ', 'Xem thông tin ghế ngồi', 'Cho phép xem danh sách và chi tiết ghế ngồi', true),
('SEAT_UPDATE', 'Cập nhật thông tin ghế ngồi', 'Cho phép cập nhật thông tin ghế ngồi', true),
('SEAT_DELETE', 'Xóa ghế ngồi', 'Cho phép xóa ghế ngồi khỏi hệ thống', true),
('SEAT_ACTIVATE', 'Kích hoạt ghế ngồi', 'Cho phép kích hoạt ghế ngồi', true),
('SEAT_DEACTIVATE', 'Vô hiệu hóa ghế ngồi', 'Cho phép vô hiệu hóa ghế ngồi', true);

-- ========== SHOWTIME MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('SHOWTIME_CREATE', 'Tạo suất chiếu mới', 'Cho phép tạo suất chiếu mới cho phim', true),
('SHOWTIME_READ', 'Xem thông tin suất chiếu', 'Cho phép xem danh sách và chi tiết suất chiếu', true),
('SHOWTIME_UPDATE', 'Cập nhật thông tin suất chiếu', 'Cho phép cập nhật thông tin suất chiếu', true),
('SHOWTIME_DELETE', 'Xóa suất chiếu', 'Cho phép xóa suất chiếu khỏi hệ thống', true),
('SHOWTIME_ACTIVATE', 'Kích hoạt suất chiếu', 'Cho phép kích hoạt suất chiếu', true),
('SHOWTIME_DEACTIVATE', 'Vô hiệu hóa suất chiếu', 'Cho phép vô hiệu hóa suất chiếu', true);

-- ========== BOOKING MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('BOOKING_CREATE', 'Tạo đặt vé mới', 'Cho phép tạo đặt vé mới cho khách hàng', true),
('BOOKING_READ', 'Xem thông tin đặt vé', 'Cho phép xem danh sách và chi tiết đặt vé', true),
('BOOKING_UPDATE', 'Cập nhật thông tin đặt vé', 'Cho phép cập nhật thông tin đặt vé', true),
('BOOKING_DELETE', 'Xóa đặt vé', 'Cho phép xóa đặt vé khỏi hệ thống', true),
('BOOKING_CANCEL', 'Hủy đặt vé', 'Cho phép hủy đặt vé', true),
('BOOKING_CONFIRM', 'Xác nhận đặt vé', 'Cho phép xác nhận đặt vé', true);

-- ========== PAYMENT MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('PAYMENT_CREATE', 'Tạo thanh toán mới', 'Cho phép tạo giao dịch thanh toán mới', true),
('PAYMENT_READ', 'Xem thông tin thanh toán', 'Cho phép xem danh sách và chi tiết thanh toán', true),
('PAYMENT_UPDATE', 'Cập nhật thông tin thanh toán', 'Cho phép cập nhật thông tin thanh toán', true),
('PAYMENT_DELETE', 'Xóa thanh toán', 'Cho phép xóa thanh toán khỏi hệ thống', true),
('PAYMENT_PROCESS', 'Xử lý thanh toán', 'Cho phép xử lý giao dịch thanh toán', true),
('PAYMENT_REFUND', 'Hoàn tiền', 'Cho phép thực hiện hoàn tiền', true);

-- ========== VOUCHER MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('VOUCHER_CREATE', 'Tạo voucher mới', 'Cho phép tạo voucher khuyến mãi mới', true),
('VOUCHER_READ', 'Xem thông tin voucher', 'Cho phép xem danh sách và chi tiết voucher', true),
('VOUCHER_UPDATE', 'Cập nhật thông tin voucher', 'Cho phép cập nhật thông tin voucher', true),
('VOUCHER_DELETE', 'Xóa voucher', 'Cho phép xóa voucher khỏi hệ thống', true),
('VOUCHER_ACTIVATE', 'Kích hoạt voucher', 'Cho phép kích hoạt voucher', true),
('VOUCHER_DEACTIVATE', 'Vô hiệu hóa voucher', 'Cho phép vô hiệu hóa voucher', true);

-- ========== SYSTEM MANAGEMENT PERMISSIONS ==========
INSERT INTO permissions (code, name, description, is_active) VALUES 
('SYSTEM_READ_LOGS', 'Xem nhật ký hệ thống', 'Cho phép xem nhật ký hoạt động của hệ thống', true),
('SYSTEM_READ_ANALYTICS', 'Xem báo cáo thống kê', 'Cho phép xem báo cáo và thống kê hệ thống', true),
('SYSTEM_MANAGE_SETTINGS', 'Quản lý cài đặt hệ thống', 'Cho phép cấu hình các cài đặt hệ thống', true),
('SYSTEM_BACKUP', 'Sao lưu dữ liệu', 'Cho phép thực hiện sao lưu dữ liệu hệ thống', true),
('SYSTEM_RESTORE', 'Khôi phục dữ liệu', 'Cho phép khôi phục dữ liệu từ bản sao lưu', true);

-- Kiểm tra số lượng permission đã được tạo
SELECT COUNT(*) as total_permissions FROM permissions;

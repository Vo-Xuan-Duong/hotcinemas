-- Script để tạo các role cơ bản và gán permission
-- Chạy script này sau khi đã chạy permissions.sql
-- (Tùy chọn - chỉ cần nếu muốn tạo sẵn roles)

-- ========== TẠO CÁC ROLE CƠ BẢN ==========

-- 1. SUPER_ADMIN - Quản trị viên cấp cao nhất
INSERT INTO roles (code, name, description, is_active) VALUES 
('SUPER_ADMIN', 'Super Administrator', 'Quản trị viên cấp cao nhất với toàn quyền trong hệ thống', true);

-- 2. ADMIN - Quản trị viên
INSERT INTO roles (code, name, description, is_active) VALUES 
('ADMIN', 'Administrator', 'Quản trị viên với quyền quản lý toàn bộ hệ thống', true);

-- 3. MANAGER - Quản lý
INSERT INTO roles (code, name, description, is_active) VALUES 
('MANAGER', 'Manager', 'Quản lý với quyền quản lý rạp chiếu phim và nội dung', true);

-- 4. STAFF - Nhân viên
INSERT INTO roles (code, name, description, is_active) VALUES 
('STAFF', 'Staff', 'Nhân viên với quyền hạn cơ bản', true);

-- 5. CUSTOMER - Khách hàng
INSERT INTO roles (code, name, description, is_active) VALUES 
('CUSTOMER', 'Customer', 'Khách hàng với quyền xem và đặt vé', true);

-- ========== GÁN PERMISSION CHO SUPER_ADMIN ==========
-- Super Admin có tất cả quyền
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'SUPER_ADMIN';

-- ========== GÁN PERMISSION CHO ADMIN ==========
-- Admin có hầu hết quyền trừ một số quyền hệ thống nhạy cảm
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'ADMIN'
AND p.code NOT IN (
    'SYSTEM_BACKUP',
    'SYSTEM_RESTORE',
    'SYSTEM_MANAGE_SETTINGS'
);

-- ========== GÁN PERMISSION CHO MANAGER ==========
-- Manager có quyền quản lý nội dung và rạp chiếu phim
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'MANAGER'
AND p.code IN (
    -- Movie Management
    'MOVIE_CREATE', 'MOVIE_READ', 'MOVIE_UPDATE', 'MOVIE_ACTIVATE', 'MOVIE_DEACTIVATE',
    -- Cinema Management
    'CINEMA_CREATE', 'CINEMA_READ', 'CINEMA_UPDATE', 'CINEMA_ACTIVATE', 'CINEMA_DEACTIVATE',
    -- Cinema Cluster Management
    'CINEMA_CLUSTER_CREATE', 'CINEMA_CLUSTER_READ', 'CINEMA_CLUSTER_UPDATE', 'CINEMA_CLUSTER_ACTIVATE', 'CINEMA_CLUSTER_DEACTIVATE',
    -- Room Management
    'ROOM_CREATE', 'ROOM_READ', 'ROOM_UPDATE', 'ROOM_ACTIVATE', 'ROOM_DEACTIVATE',
    -- Seat Management
    'SEAT_CREATE', 'SEAT_READ', 'SEAT_UPDATE', 'SEAT_ACTIVATE', 'SEAT_DEACTIVATE',
    -- Showtime Management
    'SHOWTIME_CREATE', 'SHOWTIME_READ', 'SHOWTIME_UPDATE', 'SHOWTIME_ACTIVATE', 'SHOWTIME_DEACTIVATE',
    -- Booking Management
    'BOOKING_READ', 'BOOKING_UPDATE', 'BOOKING_CANCEL', 'BOOKING_CONFIRM',
    -- Payment Management
    'PAYMENT_READ', 'PAYMENT_PROCESS', 'PAYMENT_REFUND',
    -- Voucher Management
    'VOUCHER_CREATE', 'VOUCHER_READ', 'VOUCHER_UPDATE', 'VOUCHER_ACTIVATE', 'VOUCHER_DEACTIVATE',
    -- User Management (limited)
    'USER_READ', 'USER_ACTIVATE', 'USER_DEACTIVATE',
    -- Analytics
    'SYSTEM_READ_ANALYTICS'
);

-- ========== GÁN PERMISSION CHO STAFF ==========
-- Staff có quyền cơ bản để phục vụ khách hàng
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'STAFF'
AND p.code IN (
    -- Movie Management (read only)
    'MOVIE_READ',
    -- Cinema Management (read only)
    'CINEMA_READ', 'CINEMA_CLUSTER_READ',
    -- Room Management (read only)
    'ROOM_READ', 'SEAT_READ',
    -- Showtime Management (read only)
    'SHOWTIME_READ',
    -- Booking Management
    'BOOKING_CREATE', 'BOOKING_READ', 'BOOKING_UPDATE', 'BOOKING_CANCEL', 'BOOKING_CONFIRM',
    -- Payment Management
    'PAYMENT_CREATE', 'PAYMENT_READ', 'PAYMENT_PROCESS',
    -- Voucher Management (read only)
    'VOUCHER_READ',
    -- User Management (read only)
    'USER_READ'
);

-- ========== GÁN PERMISSION CHO CUSTOMER ==========
-- Customer có quyền cơ bản để sử dụng dịch vụ
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.code = 'CUSTOMER'
AND p.code IN (
    -- Movie Management (read only)
    'MOVIE_READ',
    -- Cinema Management (read only)
    'CINEMA_READ', 'CINEMA_CLUSTER_READ',
    -- Room Management (read only)
    'ROOM_READ', 'SEAT_READ',
    -- Showtime Management (read only)
    'SHOWTIME_READ',
    -- Booking Management (limited)
    'BOOKING_CREATE', 'BOOKING_READ', 'BOOKING_CANCEL',
    -- Payment Management (limited)
    'PAYMENT_CREATE', 'PAYMENT_READ',
    -- Voucher Management (read only)
    'VOUCHER_READ',
    -- User Management (self only)
    'USER_READ', 'USER_UPDATE'
);

-- ========== KIỂM TRA KẾT QUẢ ==========
-- Kiểm tra số lượng role đã tạo
SELECT 'Roles created:' as info, COUNT(*) as count FROM roles;

-- Kiểm tra số lượng permission đã tạo
SELECT 'Permissions created:' as info, COUNT(*) as count FROM permissions;

-- Kiểm tra số lượng role-permission assignments
SELECT 'Role-Permission assignments:' as info, COUNT(*) as count FROM role_permissions;

-- Hiển thị chi tiết các role và số lượng permission của mỗi role
SELECT 
    r.name as role_name,
    r.code as role_code,
    COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.name, r.code
ORDER BY permission_count DESC;

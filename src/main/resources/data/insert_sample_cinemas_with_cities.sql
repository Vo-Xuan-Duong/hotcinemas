-- Insert sample cinemas with city references
-- This file creates sample cinema data that references the cities

-- First, ensure cities are inserted (run insert_major_cities.sql first)
-- Then run this file to create sample cinemas

-- Sample cinemas in Ho Chi Minh City
INSERT INTO cinemas (name, address, phone_number, city_id, cinema_cluster_id, is_active, created_at, updated_at) VALUES
('CGV Vincom Center', '72 Lê Thánh Tôn, Quận 1, TP.HCM', '1900 6017', 
 (SELECT id FROM cities WHERE name = 'Ho Chi Minh City' LIMIT 1), 
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1), 
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('CGV Landmark 81', 'Vinhomes Central Park, Quận Bình Thạnh, TP.HCM', '1900 6017',
 (SELECT id FROM cities WHERE name = 'Ho Chi Minh City' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Lotte Cinema Diamond Plaza', '34 Lê Duẩn, Quận 1, TP.HCM', '1900 1533',
 (SELECT id FROM cities WHERE name = 'Ho Chi Minh City' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'Lotte Cinema' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Galaxy Cinema Nguyễn Du', '116 Nguyễn Du, Quận 1, TP.HCM', '1900 2224',
 (SELECT id FROM cities WHERE name = 'Ho Chi Minh City' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'Galaxy Cinema' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sample cinemas in Ha Noi
('CGV Vincom Royal City', '72A Nguyễn Trãi, Thanh Xuân, Hà Nội', '1900 6017',
 (SELECT id FROM cities WHERE name = 'Ha Noi' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Lotte Cinema Westlake', 'Tây Hồ, Hà Nội', '1900 1533',
 (SELECT id FROM cities WHERE name = 'Ha Noi' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'Lotte Cinema' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Galaxy Cinema Cầu Giấy', 'Cầu Giấy, Hà Nội', '1900 2224',
 (SELECT id FROM cities WHERE name = 'Ha Noi' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'Galaxy Cinema' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sample cinemas in Da Nang
('CGV Vincom Da Nang', '910A Ngô Quyền, Sơn Trà, Đà Nẵng', '1900 6017',
 (SELECT id FROM cities WHERE name = 'Da Nang' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('Lotte Cinema Da Nang', 'Đà Nẵng', '1900 1533',
 (SELECT id FROM cities WHERE name = 'Da Nang' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'Lotte Cinema' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sample cinemas in Can Tho
('CGV Vincom Can Tho', 'Cần Thơ', '1900 6017',
 (SELECT id FROM cities WHERE name = 'Can Tho' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sample cinemas in Hai Phong
('CGV Vincom Hai Phong', 'Hải Phòng', '1900 6017',
 (SELECT id FROM cities WHERE name = 'Hai Phong' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sample cinemas in Bien Hoa
('CGV Vincom Bien Hoa', 'Biên Hòa, Đồng Nai', '1900 6017',
 (SELECT id FROM cities WHERE name = 'Bien Hoa' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sample cinemas in Hue
('CGV Vincom Hue', 'Huế', '1900 6017',
 (SELECT id FROM cities WHERE name = 'Hue' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sample cinemas in Nha Trang
('CGV Vincom Nha Trang', 'Nha Trang, Khánh Hòa', '1900 6017',
 (SELECT id FROM cities WHERE name = 'Nha Trang' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sample cinemas in Vung Tau
('CGV Vincom Vung Tau', 'Vũng Tàu', '1900 6017',
 (SELECT id FROM cities WHERE name = 'Vung Tau' LIMIT 1),
 (SELECT id FROM cinema_clusters WHERE name = 'CGV' LIMIT 1),
 TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Verify the data
SELECT c.name as cinema_name, c.address, city.name as city_name, cc.name as cluster_name
FROM cinemas c
JOIN cities city ON c.city_id = city.id
LEFT JOIN cinema_clusters cc ON c.cinema_cluster_id = cc.id
ORDER BY city.name, c.name;

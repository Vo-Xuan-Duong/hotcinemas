-- Insert major cities for cinema business in Vietnam
-- This file contains only the most important cities where cinemas are typically located

-- Clear existing data (optional - uncomment if needed)
-- DELETE FROM cities;

-- Insert major cities for cinema business
INSERT INTO cities (name, code, country, is_active, created_at, updated_at) VALUES
-- Tier 1 cities (Major metropolitan areas)
('Ho Chi Minh City', 'HCM', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ha Noi', 'HN', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Da Nang', 'DN', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Tier 2 cities (Important economic centers)
('Can Tho', 'CT', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hai Phong', 'HP', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bien Hoa', 'BH', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hue', 'HU', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nha Trang', 'NT', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vung Tau', 'VT', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quy Nhon', 'QN', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Tier 3 cities (Regional centers with potential for cinema business)
('Buon Ma Thuot', 'BMT', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Da Lat', 'DL', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pleiku', 'PL', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rach Gia', 'RG', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ca Mau', 'CM', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Long Xuyen', 'LX', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('My Tho', 'MT', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tra Vinh', 'TV', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vinh Long', 'VL', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Cao Lanh', 'CL', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chau Doc', 'CD', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Phu Quoc', 'PQ', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ha Long', 'HL', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thai Nguyen', 'TN', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nam Dinh', 'ND', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Thanh Hoa', 'TH', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vinh', 'VH', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quang Ngai', 'QG', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tuy Hoa', 'TY', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Phan Thiet', 'PT', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tay Ninh', 'TN', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bac Lieu', 'BL', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Soc Trang', 'ST', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vi Thanh', 'VT', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sapa', 'SP', 'Vietnam', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Verify the data
SELECT COUNT(*) as total_cities FROM cities;
SELECT name, code, country FROM cities ORDER BY name;

-- Migration: Add districts table
-- Date: 2025-11-22
-- Description: Create districts table and update cinemas table to reference districts

-- Create districts table
CREATE TABLE IF NOT EXISTS districts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    prefix VARCHAR(20),
    city_id BIGINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_district_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    CONSTRAINT uq_district_name_city UNIQUE(name, city_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_district_city ON districts(city_id);
CREATE INDEX IF NOT EXISTS idx_district_name ON districts(name);
CREATE INDEX IF NOT EXISTS idx_district_active ON districts(is_active);

-- Add district_id column to cinemas table if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='cinemas' AND column_name='district_id') THEN
        ALTER TABLE cinemas ADD COLUMN district_id BIGINT;
        ALTER TABLE cinemas ADD CONSTRAINT fk_cinema_district
            FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL;
        CREATE INDEX idx_cinema_district ON cinemas(district_id);
    END IF;
END $$;

-- Insert sample districts for Ho Chi Minh City (assuming city_id = 1)
-- You can modify this based on your actual city IDs
INSERT INTO districts (name, prefix, city_id, is_active) VALUES
    ('Quận 1', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 2', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 3', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 4', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 5', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 6', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 7', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 8', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 10', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 11', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận 12', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận Bình Tân', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận Bình Thạnh', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận Gò Vấp', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận Phú Nhuận', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận Tân Bình', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Quận Tân Phú', 'Quận', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Thành phố Thủ Đức', 'Thành phố', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Huyện Bình Chánh', 'Huyện', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Huyện Cần Giờ', 'Huyện', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Huyện Củ Chi', 'Huyện', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Huyện Hóc Môn', 'Huyện', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true),
    ('Huyện Nhà Bè', 'Huyện', (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1), true)
ON CONFLICT (name, city_id) DO NOTHING;

-- Insert sample districts for Hanoi (assuming city code = 'HN')
INSERT INTO districts (name, prefix, city_id, is_active) VALUES
    ('Quận Ba Đình', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Hoàn Kiếm', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Tây Hồ', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Long Biên', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Cầu Giấy', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Đống Đa', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Hai Bà Trưng', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Hoàng Mai', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Thanh Xuân', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Nam Từ Liêm', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Bắc Từ Liêm', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true),
    ('Quận Hà Đông', 'Quận', (SELECT id FROM cities WHERE code = 'HN' LIMIT 1), true)
ON CONFLICT (name, city_id) DO NOTHING;

-- Insert sample districts for Da Nang (assuming city code = 'DN')
INSERT INTO districts (name, prefix, city_id, is_active) VALUES
    ('Quận Hải Châu', 'Quận', (SELECT id FROM cities WHERE code = 'DN' LIMIT 1), true),
    ('Quận Thanh Khê', 'Quận', (SELECT id FROM cities WHERE code = 'DN' LIMIT 1), true),
    ('Quận Sơn Trà', 'Quận', (SELECT id FROM cities WHERE code = 'DN' LIMIT 1), true),
    ('Quận Ngũ Hành Sơn', 'Quận', (SELECT id FROM cities WHERE code = 'DN' LIMIT 1), true),
    ('Quận Liên Chiểu', 'Quận', (SELECT id FROM cities WHERE code = 'DN' LIMIT 1), true),
    ('Quận Cẩm Lệ', 'Quận', (SELECT id FROM cities WHERE code = 'DN' LIMIT 1), true),
    ('Huyện Hòa Vang', 'Huyện', (SELECT id FROM cities WHERE code = 'DN' LIMIT 1), true),
    ('Huyện Hoàng Sa', 'Huyện', (SELECT id FROM cities WHERE code = 'DN' LIMIT 1), true)
ON CONFLICT (name, city_id) DO NOTHING;

COMMENT ON TABLE districts IS 'Districts/Quận/Huyện within cities';
COMMENT ON COLUMN districts.name IS 'Full district name (e.g., "Quận 1", "Thành phố Thủ Đức")';
COMMENT ON COLUMN districts.prefix IS 'District type prefix (e.g., "Quận", "Huyện", "Thành phố")';
COMMENT ON COLUMN districts.city_id IS 'Reference to parent city';


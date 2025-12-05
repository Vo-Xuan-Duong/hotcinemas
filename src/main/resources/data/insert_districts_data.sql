-- Insert sample district data
-- Make sure cities table has data before running this

-- Insert districts for Ho Chi Minh City (code = 'HCM')
DO $$
DECLARE
    v_city_id BIGINT;
BEGIN
    -- Get HCM city id
    SELECT id INTO v_city_id FROM cities WHERE code = 'HCM' LIMIT 1;

    IF v_city_id IS NOT NULL THEN
        -- Insert HCM districts
        INSERT INTO districts (name, prefix, city_id, is_active) VALUES
            ('Quận 1', 'Quận', v_city_id, true),
            ('Quận 2', 'Quận', v_city_id, true),
            ('Quận 3', 'Quận', v_city_id, true),
            ('Quận 4', 'Quận', v_city_id, true),
            ('Quận 5', 'Quận', v_city_id, true),
            ('Quận 6', 'Quận', v_city_id, true),
            ('Quận 7', 'Quận', v_city_id, true),
            ('Quận 8', 'Quận', v_city_id, true),
            ('Quận 10', 'Quận', v_city_id, true),
            ('Quận 11', 'Quận', v_city_id, true),
            ('Quận 12', 'Quận', v_city_id, true),
            ('Quận Bình Tân', 'Quận', v_city_id, true),
            ('Quận Bình Thạnh', 'Quận', v_city_id, true),
            ('Quận Gò Vấp', 'Quận', v_city_id, true),
            ('Quận Phú Nhuận', 'Quận', v_city_id, true),
            ('Quận Tân Bình', 'Quận', v_city_id, true),
            ('Quận Tân Phú', 'Quận', v_city_id, true),
            ('Thành phố Thủ Đức', 'Thành phố', v_city_id, true),
            ('Huyện Bình Chánh', 'Huyện', v_city_id, true),
            ('Huyện Cần Giờ', 'Huyện', v_city_id, true),
            ('Huyện Củ Chi', 'Huyện', v_city_id, true),
            ('Huyện Hóc Môn', 'Huyện', v_city_id, true),
            ('Huyện Nhà Bè', 'Huyện', v_city_id, true)
        ON CONFLICT (name, city_id) DO NOTHING;

        RAISE NOTICE 'Inserted districts for Ho Chi Minh City (city_id: %)', v_city_id;
    ELSE
        RAISE NOTICE 'City with code HCM not found. Skipping HCM districts.';
    END IF;
END $$;

-- Insert districts for Hanoi (code = 'HN')
DO $$
DECLARE
    v_city_id BIGINT;
BEGIN
    -- Get Hanoi city id
    SELECT id INTO v_city_id FROM cities WHERE code = 'HN' LIMIT 1;

    IF v_city_id IS NOT NULL THEN
        -- Insert Hanoi districts
        INSERT INTO districts (name, prefix, city_id, is_active) VALUES
            ('Quận Ba Đình', 'Quận', v_city_id, true),
            ('Quận Hoàn Kiếm', 'Quận', v_city_id, true),
            ('Quận Tây Hồ', 'Quận', v_city_id, true),
            ('Quận Long Biên', 'Quận', v_city_id, true),
            ('Quận Cầu Giấy', 'Quận', v_city_id, true),
            ('Quận Đống Đa', 'Quận', v_city_id, true),
            ('Quận Hai Bà Trưng', 'Quận', v_city_id, true),
            ('Quận Hoàng Mai', 'Quận', v_city_id, true),
            ('Quận Thanh Xuân', 'Quận', v_city_id, true),
            ('Quận Nam Từ Liêm', 'Quận', v_city_id, true),
            ('Quận Bắc Từ Liêm', 'Quận', v_city_id, true),
            ('Quận Hà Đông', 'Quận', v_city_id, true)
        ON CONFLICT (name, city_id) DO NOTHING;

        RAISE NOTICE 'Inserted districts for Hanoi (city_id: %)', v_city_id;
    ELSE
        RAISE NOTICE 'City with code HN not found. Skipping Hanoi districts.';
    END IF;
END $$;

-- Insert districts for Da Nang (code = 'DN')
DO $$
DECLARE
    v_city_id BIGINT;
BEGIN
    -- Get Da Nang city id
    SELECT id INTO v_city_id FROM cities WHERE code = 'DN' LIMIT 1;

    IF v_city_id IS NOT NULL THEN
        -- Insert Da Nang districts
        INSERT INTO districts (name, prefix, city_id, is_active) VALUES
            ('Quận Hải Châu', 'Quận', v_city_id, true),
            ('Quận Thanh Khê', 'Quận', v_city_id, true),
            ('Quận Sơn Trà', 'Quận', v_city_id, true),
            ('Quận Ngũ Hành Sơn', 'Quận', v_city_id, true),
            ('Quận Liên Chiểu', 'Quận', v_city_id, true),
            ('Quận Cẩm Lệ', 'Quận', v_city_id, true),
            ('Huyện Hòa Vang', 'Huyện', v_city_id, true),
            ('Huyện Hoàng Sa', 'Huyện', v_city_id, true)
        ON CONFLICT (name, city_id) DO NOTHING;

        RAISE NOTICE 'Inserted districts for Da Nang (city_id: %)', v_city_id;
    ELSE
        RAISE NOTICE 'City with code DN not found. Skipping Da Nang districts.';
    END IF;
END $$;

-- Show results
SELECT 'Total districts inserted:' AS info, count(*) AS total FROM districts;
SELECT c.name AS city_name, count(d.id) AS district_count
FROM cities c
LEFT JOIN districts d ON d.city_id = c.id
GROUP BY c.name
ORDER BY district_count DESC;


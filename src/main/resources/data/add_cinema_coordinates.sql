-- Migration: Add latitude and longitude to cinemas table
-- Date: 2025-11-22
-- Description: Add geographic coordinates to cinemas for map integration and location services

-- Add latitude and longitude columns to cinemas table
DO $$
BEGIN
    -- Add latitude column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='cinemas' AND column_name='latitude') THEN
        ALTER TABLE cinemas ADD COLUMN latitude NUMERIC(10,8);
        COMMENT ON COLUMN cinemas.latitude IS 'Latitude coordinate (Vĩ độ) - Range: -90 to 90';
    END IF;

    -- Add longitude column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name='cinemas' AND column_name='longitude') THEN
        ALTER TABLE cinemas ADD COLUMN longitude NUMERIC(11,8);
        COMMENT ON COLUMN cinemas.longitude IS 'Longitude coordinate (Kinh độ) - Range: -180 to 180';
    END IF;
END $$;

-- Add index for location-based queries (optional but recommended for performance)
CREATE INDEX IF NOT EXISTS idx_cinema_location ON cinemas(latitude, longitude);

-- Verify columns added
SELECT column_name, data_type, numeric_precision, numeric_scale
FROM information_schema.columns
WHERE table_name = 'cinemas'
AND column_name IN ('latitude', 'longitude')
ORDER BY column_name;

-- Sample update for some famous cinemas in Vietnam (you can adjust these)
-- Ho Chi Minh City cinemas
UPDATE cinemas SET
    latitude = 10.7769000,
    longitude = 106.7009000
WHERE name LIKE '%CGV%' AND city_id = (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1)
AND latitude IS NULL;

UPDATE cinemas SET
    latitude = 10.7829000,
    longitude = 106.6984000
WHERE name LIKE '%Lotte%' AND city_id = (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1)
AND latitude IS NULL;

UPDATE cinemas SET
    latitude = 10.7821000,
    longitude = 106.6983000
WHERE name LIKE '%Galaxy%' AND city_id = (SELECT id FROM cities WHERE code = 'HCM' LIMIT 1)
AND latitude IS NULL;

-- Hanoi cinemas
UPDATE cinemas SET
    latitude = 21.0285000,
    longitude = 105.8542000
WHERE name LIKE '%CGV%' AND city_id = (SELECT id FROM cities WHERE code = 'HN' LIMIT 1)
AND latitude IS NULL;

UPDATE cinemas SET
    latitude = 21.0227000,
    longitude = 105.8410000
WHERE name LIKE '%Lotte%' AND city_id = (SELECT id FROM cities WHERE code = 'HN' LIMIT 1)
AND latitude IS NULL;

-- Da Nang cinemas
UPDATE cinemas SET
    latitude = 16.0544000,
    longitude = 108.2022000
WHERE name LIKE '%CGV%' AND city_id = (SELECT id FROM cities WHERE code = 'DN' LIMIT 1)
AND latitude IS NULL;

-- Show summary
SELECT
    'Total cinemas' AS metric,
    COUNT(*) AS count
FROM cinemas
UNION ALL
SELECT
    'Cinemas with coordinates' AS metric,
    COUNT(*) AS count
FROM cinemas
WHERE latitude IS NOT NULL AND longitude IS NOT NULL
UNION ALL
SELECT
    'Cinemas without coordinates' AS metric,
    COUNT(*) AS count
FROM cinemas
WHERE latitude IS NULL OR longitude IS NULL;

COMMENT ON TABLE cinemas IS 'Cinema locations with geographic coordinates for map integration';


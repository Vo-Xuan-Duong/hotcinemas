-- Quick test migration for districts
-- Run this after ensuring cities table exists

-- Step 1: Create districts table
CREATE TABLE IF NOT EXISTS districts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    prefix VARCHAR(20),
    city_id BIGINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_district_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- Step 2: Add unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS uq_district_name_city ON districts(name, city_id);

-- Step 3: Add indexes
CREATE INDEX IF NOT EXISTS idx_district_city ON districts(city_id);
CREATE INDEX IF NOT EXISTS idx_district_name ON districts(name);
CREATE INDEX IF NOT EXISTS idx_district_active ON districts(is_active);

-- Step 4: Add district_id to cinemas (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name='cinemas' AND column_name='district_id'
    ) THEN
        ALTER TABLE cinemas ADD COLUMN district_id BIGINT;
        ALTER TABLE cinemas ADD CONSTRAINT fk_cinema_district
            FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL;
        CREATE INDEX idx_cinema_district ON cinemas(district_id);
    END IF;
END $$;

-- Verify tables
SELECT 'Districts table created successfully!' AS status;
SELECT 'Check districts table:' AS info, count(*) AS district_count FROM districts;
SELECT 'Check cinemas district_id column:' AS info,
       CASE WHEN EXISTS (
           SELECT 1 FROM information_schema.columns
           WHERE table_name='cinemas' AND column_name='district_id'
       ) THEN 'Column exists' ELSE 'Column missing' END AS status;


-- SAFE MIGRATION: Add movie_format column with proper handling
-- Run this script BEFORE starting the application with updated Showtime model

-- Step 1: Add column as nullable first (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'showtimes'
        AND column_name = 'movie_format'
    ) THEN
        ALTER TABLE showtimes
        ADD COLUMN movie_format VARCHAR(255);

        RAISE NOTICE 'Column movie_format added as nullable';
    ELSE
        RAISE NOTICE 'Column movie_format already exists';
    END IF;
END $$;

-- Step 2: Update all existing records with default value
UPDATE showtimes
SET movie_format = 'TWO_D_SUB'
WHERE movie_format IS NULL;

-- Step 3: Verify update
SELECT
    COUNT(*) as total_records,
    COUNT(movie_format) as non_null_records,
    COUNT(*) - COUNT(movie_format) as null_records
FROM showtimes;

-- Step 4: Add NOT NULL constraint now that all values are set
ALTER TABLE showtimes
ALTER COLUMN movie_format SET NOT NULL;

-- Step 5: Add check constraint for valid enum values
ALTER TABLE showtimes
ADD CONSTRAINT check_movie_format
CHECK (movie_format IN (
    'TWO_D_SUB',
    'TWO_D_DUB',
    'TWO_D_VIET',
    'THREE_D_SUB',
    'THREE_D_DUB',
    'IMAX_2D',
    'IMAX_3D',
    'FOUR_DX'
));

-- Step 6: Verify final state
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'showtimes'
AND column_name = 'movie_format';

-- Step 7: Show data distribution
SELECT movie_format, COUNT(*) as count
FROM showtimes
GROUP BY movie_format
ORDER BY count DESC;

RAISE NOTICE 'Migration completed successfully!';


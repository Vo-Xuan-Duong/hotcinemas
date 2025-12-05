-- Migration: Add movie_format column to showtimes table
-- Date: 2025-11-20

-- Add movie_format column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'showtimes'
        AND column_name = 'movie_format'
    ) THEN
        ALTER TABLE showtimes
        ADD COLUMN movie_format VARCHAR(50);

        -- Update existing records with default value
        UPDATE showtimes
        SET movie_format = 'TWO_D_SUB'
        WHERE movie_format IS NULL;

        -- Make the column NOT NULL after setting default values
        ALTER TABLE showtimes
        ALTER COLUMN movie_format SET NOT NULL;

        RAISE NOTICE 'Column movie_format added to showtimes table';
    ELSE
        RAISE NOTICE 'Column movie_format already exists in showtimes table';
    END IF;
END $$;

-- Verify the column was added
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'showtimes'
AND column_name = 'movie_format';


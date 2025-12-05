-- Step-by-step migration for movie_format column
-- Run this AFTER the application starts successfully with nullable movie_format

-- Step 1: Update all NULL values to default TWO_D_SUB
UPDATE showtimes
SET movie_format = 'TWO_D_SUB'
WHERE movie_format IS NULL;

-- Step 2: Verify no NULL values remain
SELECT COUNT(*) as null_count
FROM showtimes
WHERE movie_format IS NULL;
-- Expected: null_count = 0

-- Step 3: Add NOT NULL constraint (after verifying no nulls)
ALTER TABLE showtimes
ALTER COLUMN movie_format SET NOT NULL;

-- Step 4: Verify the constraint was added
SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'showtimes'
AND column_name = 'movie_format';
-- Expected: is_nullable = 'NO'

-- Step 5: Check data distribution
SELECT movie_format, COUNT(*) as count
FROM showtimes
GROUP BY movie_format
ORDER BY count DESC;


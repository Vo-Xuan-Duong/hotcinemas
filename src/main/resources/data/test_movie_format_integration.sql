-- Test Script for MovieFormat Integration
-- Run this after migration to verify the integration

-- 1. Check if movie_format column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'showtimes'
AND column_name = 'movie_format';

-- 2. Check existing showtimes have default value
SELECT id, movie_id, room_id, date, start_time, movie_format, status
FROM showtimes
ORDER BY id DESC
LIMIT 10;

-- 3. Count showtimes by movie format
SELECT movie_format, COUNT(*) as total
FROM showtimes
GROUP BY movie_format
ORDER BY total DESC;

-- 4. Test insert new showtime with movie format
-- Replace with actual movie_id and room_id from your database
-- INSERT INTO showtimes (movie_id, room_id, date, start_time, end_time, ticket_price, movie_format, status)
-- VALUES (1, 1, '2025-11-25', '19:30:00', '22:00:00', 150000, 'IMAX_3D', 'OPEN_FOR_BOOKING');

-- 5. Verify the insert worked
-- SELECT * FROM showtimes WHERE date = '2025-11-25' AND start_time = '19:30:00';

-- 6. Test filtering by movie format
SELECT s.id, m.title as movie_title, r.name as room_name,
       s.date, s.start_time, s.movie_format, s.status
FROM showtimes s
JOIN movies m ON s.movie_id = m.id
JOIN rooms r ON s.room_id = r.id
WHERE s.movie_format = 'IMAX_3D'
ORDER BY s.date, s.start_time;

-- 7. Check all distinct movie formats in use
SELECT DISTINCT movie_format
FROM showtimes
ORDER BY movie_format;

-- Expected Results:
-- - Column movie_format should exist with type VARCHAR(50)
-- - All existing showtimes should have movie_format = 'TWO_D_SUB' (default)
-- - New inserts should accept any valid MovieFormat enum value
-- - Filtering by movie_format should work correctly


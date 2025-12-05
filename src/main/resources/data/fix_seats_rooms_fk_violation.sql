-- Fix Foreign Key Constraint Violation: seats → rooms
-- Date: 2025-11-22
-- Issue: Seats table has orphaned records (room_id references non-existent rooms)

-- Step 1: Check orphaned seats (seats without valid room_id)
SELECT
    'Orphaned Seats Count' AS check_type,
    COUNT(*) AS count
FROM seat s
LEFT JOIN rooms r ON s.room_id = r.id
WHERE r.id IS NULL;

-- Step 2: Show details of orphaned seats
SELECT
    s.id AS seat_id,
    s.room_id,
    s.row_label,
    s.seat_number,
    s.seat_type
FROM seat s
LEFT JOIN rooms r ON s.room_id = r.id
WHERE r.id IS NULL
LIMIT 20;

-- Step 3: Fix Option A - Delete orphaned seats (RECOMMENDED for clean database)
-- This removes seats that reference non-existent rooms
DELETE FROM seat
WHERE room_id NOT IN (SELECT id FROM rooms);

-- Verify deletion
SELECT 'After cleanup - Total seats' AS status, COUNT(*) AS count FROM seat;

-- Step 4: Verify no more orphaned records
SELECT
    CASE
        WHEN COUNT(*) = 0 THEN '✅ No orphaned seats found'
        ELSE '❌ Still have orphaned seats: ' || COUNT(*)::TEXT
    END AS validation_result
FROM seat s
LEFT JOIN rooms r ON s.room_id = r.id
WHERE r.id IS NULL;

-- Step 5: Check rooms and their seats count
SELECT
    r.id AS room_id,
    r.name AS room_name,
    c.name AS cinema_name,
    COUNT(s.id) AS seats_count
FROM rooms r
LEFT JOIN cinemas c ON r.cinema_id = c.id
LEFT JOIN seat s ON s.room_id = r.id
GROUP BY r.id, r.name, c.name
ORDER BY r.id;

-- Step 6: Alternative - If you need to keep the seats, create dummy rooms
-- (NOT RECOMMENDED - only use if you need to preserve seat data)
/*
-- Create missing rooms for orphaned seats
INSERT INTO rooms (cinema_id, name, seat_schema_version, is_active)
SELECT
    1 AS cinema_id, -- Default cinema_id, adjust as needed
    'Room ' || DISTINCT room_id AS name,
    1 AS seat_schema_version,
    false AS is_active -- Mark as inactive
FROM seat
WHERE room_id NOT IN (SELECT id FROM rooms)
ON CONFLICT (id) DO NOTHING;
*/

-- Step 7: Summary report
SELECT
    'Total Rooms' AS metric,
    COUNT(*) AS count
FROM rooms
UNION ALL
SELECT
    'Total Seats' AS metric,
    COUNT(*) AS count
FROM seat
UNION ALL
SELECT
    'Orphaned Seats' AS metric,
    COUNT(*) AS count
FROM seat s
LEFT JOIN rooms r ON s.room_id = r.id
WHERE r.id IS NULL;

COMMENT ON TABLE seat IS 'Cinema seats - FK constraint to rooms table';


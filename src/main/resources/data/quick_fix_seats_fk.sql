-- Quick Fix: Remove orphaned seats
-- This is the fastest solution to fix FK constraint violation

-- Option 1: Delete orphaned seats (RECOMMENDED)
DELETE FROM seat
WHERE room_id NOT IN (SELECT id FROM rooms);

-- Verify
SELECT
    CASE
        WHEN COUNT(*) = 0 THEN 'SUCCESS: No orphaned seats'
        ELSE 'ERROR: Still have ' || COUNT(*)::TEXT || ' orphaned seats'
    END AS result
FROM seat s
LEFT JOIN rooms r ON s.room_id = r.id
WHERE r.id IS NULL;


-- Migration: Add room_seat_pricing table and sample data
-- This file contains the DDL and sample data for room-based seat pricing

-- Create table (if not already created by schema.sql)
CREATE TABLE IF NOT EXISTS room_seat_pricing (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL,
    seat_type VARCHAR(20) NOT NULL,
    additional_price NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_room_seat_pricing_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT uq_room_seat_pricing UNIQUE(room_id, seat_type)
);

-- Sample data: Configure pricing for different rooms
-- Example: Room 1 - Standard pricing
INSERT INTO room_seat_pricing (room_id, seat_type, additional_price)
VALUES
    (1, 'NORMAL', 0.00),
    (1, 'VIP', 20000.00),
    (1, 'COUPLE', 30000.00)
ON CONFLICT (room_id, seat_type) DO UPDATE
SET additional_price = EXCLUDED.additional_price;

-- Example: Room 2 - Premium pricing
INSERT INTO room_seat_pricing (room_id, seat_type, additional_price)
VALUES
    (2, 'NORMAL', 0.00),
    (2, 'VIP', 25000.00),
    (2, 'COUPLE', 35000.00)
ON CONFLICT (room_id, seat_type) DO UPDATE
SET additional_price = EXCLUDED.additional_price;

-- Example: Room 3 - IMAX pricing (higher rates)
INSERT INTO room_seat_pricing (room_id, seat_type, additional_price)
VALUES
    (3, 'NORMAL', 10000.00),
    (3, 'VIP', 40000.00),
    (3, 'COUPLE', 50000.00)
ON CONFLICT (room_id, seat_type) DO UPDATE
SET additional_price = EXCLUDED.additional_price;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_room_seat_pricing_room ON room_seat_pricing(room_id);
CREATE INDEX IF NOT EXISTS idx_room_seat_pricing_seat_type ON room_seat_pricing(seat_type);

-- Comments for documentation
COMMENT ON TABLE room_seat_pricing IS 'Stores additional pricing for different seat types per room';
COMMENT ON COLUMN room_seat_pricing.room_id IS 'Reference to the room';
COMMENT ON COLUMN room_seat_pricing.seat_type IS 'Type of seat: VIP, NORMAL, COUPLE';
COMMENT ON COLUMN room_seat_pricing.additional_price IS 'Additional price to add to base ticket price';


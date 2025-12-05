# Room-Based Seat Pricing System

## Tổng quan (Overview)

Hệ thống định giá ghế theo phòng cho phép mỗi phòng chiếu có cấu hình giá riêng biệt cho từng loại ghế (VIP, NORMAL, COUPLE). Giá cuối cùng của ghế được tính bằng công thức:

**Giá ghế = Giá vé cơ bản (showtime.ticketPrice) + Giá phụ trội theo loại ghế (room_seat_pricing.additionalPrice)**

## Cấu trúc Database

### Bảng `room_seat_pricing`

```sql
CREATE TABLE room_seat_pricing (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL,
    seat_type VARCHAR(20) NOT NULL,
    additional_price NUMERIC(10,2) NOT NULL,
    CONSTRAINT fk_room_seat_pricing_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT uq_room_seat_pricing UNIQUE(room_id, seat_type)
);
```

### Các trường (Fields)
- **id**: Khóa chính
- **room_id**: ID của phòng chiếu
- **seat_type**: Loại ghế (VIP, NORMAL, COUPLE)
- **additional_price**: Giá phụ trội cần cộng thêm vào giá vé cơ bản

## Ví dụ cấu hình (Configuration Examples)

### Phòng 1 - Giá tiêu chuẩn
```sql
INSERT INTO room_seat_pricing (room_id, seat_type, additional_price) VALUES 
    (1, 'NORMAL', 0.00),      -- Ghế thường: +0đ
    (1, 'VIP', 20000.00),     -- Ghế VIP: +20,000đ
    (1, 'COUPLE', 30000.00);  -- Ghế đôi: +30,000đ
```

### Phòng 2 - Giá cao cấp
```sql
INSERT INTO room_seat_pricing (room_id, seat_type, additional_price) VALUES 
    (2, 'NORMAL', 0.00),      -- Ghế thường: +0đ
    (2, 'VIP', 25000.00),     -- Ghế VIP: +25,000đ
    (2, 'COUPLE', 35000.00);  -- Ghế đôi: +35,000đ
```

### Phòng 3 - IMAX (Giá cao hơn)
```sql
INSERT INTO room_seat_pricing (room_id, seat_type, additional_price) VALUES 
    (3, 'NORMAL', 10000.00),  -- Ghế thường: +10,000đ
    (3, 'VIP', 40000.00),     -- Ghế VIP: +40,000đ
    (3, 'COUPLE', 50000.00);  -- Ghế đôi: +50,000đ
```

## API Endpoints

### 1. Lấy cấu hình giá theo phòng
```http
GET /api/room-seat-pricing/room/{roomId}
```

**Response:**
```json
[
  {
    "id": 1,
    "roomId": 1,
    "seatType": "VIP",
    "additionalPrice": 20000.00
  },
  {
    "id": 2,
    "roomId": 1,
    "seatType": "COUPLE",
    "additionalPrice": 30000.00
  }
]
```

### 2. Lấy giá cho loại ghế cụ thể
```http
GET /api/room-seat-pricing/room/{roomId}/seat-type/{seatType}
```

**Example:** `GET /api/room-seat-pricing/room/1/seat-type/VIP`

### 3. Tạo hoặc cập nhật cấu hình giá
```http
POST /api/room-seat-pricing
Content-Type: application/json

{
  "roomId": 1,
  "seatType": "VIP",
  "additionalPrice": 20000.00
}
```

### 4. Cập nhật hàng loạt (Batch Update)
```http
POST /api/room-seat-pricing/room/{roomId}/batch
Content-Type: application/json

[
  {
    "seatType": "NORMAL",
    "additionalPrice": 0.00
  },
  {
    "seatType": "VIP",
    "additionalPrice": 20000.00
  },
  {
    "seatType": "COUPLE",
    "additionalPrice": 30000.00
  }
]
```

### 5. Xóa cấu hình giá
```http
DELETE /api/room-seat-pricing/{id}
```

### 6. Xóa cấu hình theo phòng và loại ghế
```http
DELETE /api/room-seat-pricing/room/{roomId}/seat-type/{seatType}
```

### 7. Xóa tất cả cấu hình của phòng
```http
DELETE /api/room-seat-pricing/room/{roomId}
```

### 8. Tính giá ghế
```http
GET /api/room-seat-pricing/calculate?basePrice=100000&roomId=1&seatType=VIP
```

**Response:** `120000` (100,000 + 20,000)

## Cách hoạt động (How It Works)

### 1. Khi tạo showtime seats
Khi tạo ghế cho một suất chiếu, hệ thống sẽ:
1. Lấy `ticketPrice` từ showtime (giá vé cơ bản)
2. Lấy `room_id` từ showtime
3. Lấy `seat_type` từ mỗi ghế
4. Tra cứu `additional_price` từ bảng `room_seat_pricing`
5. Tính giá cuối cùng: `finalPrice = ticketPrice + additionalPrice`
6. Lưu giá vào trường `price` của `showtime_seats`

### 2. Flow trong code

```java
// Trong ShowtimeSeatServiceImpl.createShowtimeSeats()
BigDecimal basePrice = showtime.getTicketPrice();  // VD: 100,000đ
BigDecimal finalPrice = roomSeatPricingService.calculateSeatPrice(
    basePrice,      // 100,000đ
    room.getId(),   // Phòng 1
    seat.getSeatType()  // VIP
);
// finalPrice = 120,000đ (100,000 + 20,000)
showtimeSeat.setPrice(finalPrice);
```

## Ưu điểm (Advantages)

✅ **Linh hoạt theo từng phòng**: Mỗi phòng có cấu hình giá riêng  
✅ **Dễ quản lý, dễ cập nhật**: Chỉ cần cập nhật bảng `room_seat_pricing`  
✅ **Không cần sửa nhiều dữ liệu hiện tại**: Tương thích với cấu trúc database hiện có  
✅ **Logic đơn giản, dễ hiểu**: Công thức rõ ràng, dễ maintain  
✅ **Tự động áp dụng**: Giá được tính tự động khi tạo showtime seats  
✅ **Mặc định là 0**: Nếu không có cấu hình, giá phụ trội = 0 (không thay đổi giá gốc)

## Migration và Sample Data

### Chạy migration
```bash
# Áp dụng schema
psql -U username -d database_name -f src/main/resources/schema.sql

# Import sample data
psql -U username -d database_name -f src/main/resources/data/room_seat_pricing_migration.sql
```

### Hoặc sử dụng Spring Boot
File migration sẽ tự động được áp dụng nếu cấu hình trong `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update
```

## Components Created

### 1. Model
- `RoomSeatPricing.java` - Entity cho bảng room_seat_pricing

### 2. Repository
- `RoomSeatPricingRepository.java` - JPA Repository với các query methods

### 3. DTO
- `RoomSeatPricingDTO.java` - Data Transfer Object

### 4. Service
- `RoomSeatPricingService.java` - Business logic cho pricing

### 5. Controller
- `RoomSeatPricingController.java` - REST API endpoints

### 6. Updated Files
- `Room.java` - Thêm relationship với RoomSeatPricing
- `ShowtimeSeatServiceImpl.java` - Tích hợp logic tính giá
- `schema.sql` - Thêm table definition

## Testing

### Test tính giá ghế
```java
// Giá vé cơ bản: 100,000đ
// Phòng 1, ghế VIP có additionalPrice = 20,000đ
BigDecimal finalPrice = roomSeatPricingService.calculateSeatPrice(
    new BigDecimal("100000"), 
    1L, 
    SeatType.VIP
);
// Kết quả: 120,000đ
```

### Test API với curl
```bash
# Tạo cấu hình giá
curl -X POST http://localhost:8080/api/room-seat-pricing \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 1,
    "seatType": "VIP",
    "additionalPrice": 20000.00
  }'

# Lấy cấu hình giá của phòng
curl http://localhost:8080/api/room-seat-pricing/room/1

# Tính giá ghế
curl "http://localhost:8080/api/room-seat-pricing/calculate?basePrice=100000&roomId=1&seatType=VIP"
```

## Notes

- Nếu không có cấu hình giá cho room + seat_type, giá phụ trội mặc định là 0
- Constraint UNIQUE(room_id, seat_type) đảm bảo mỗi loại ghế trong phòng chỉ có 1 cấu hình
- Khi xóa phòng, tất cả cấu hình giá liên quan cũng bị xóa (ON DELETE CASCADE)
- Giá được tính và lưu vào `showtime_seats` khi tạo suất chiếu, không cần tính lại mỗi lần query

## Future Enhancements

- Thêm time-based pricing (giá khác nhau theo giờ chiếu)
- Thêm day-of-week pricing (giá khác nhau theo ngày trong tuần)
- Thêm season pricing (giá khác nhau theo mùa/dịp lễ)
- Thêm audit trail cho thay đổi giá


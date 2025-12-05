# MovieFormat Integration with Showtime

## Tổng Quan
Đã tích hợp `MovieFormat` enum vào entity `Showtime` để hỗ trợ các định dạng phim khác nhau (2D, 3D, IMAX, 4DX).

## Các Thay Đổi

### 1. Database Schema
- **File**: `schema.sql`
- **Thay đổi**: Thêm cột `movie_format VARCHAR(50) NOT NULL` vào bảng `showtimes`
- **Migration**: Chạy file `add_movie_format_to_showtimes.sql` để cập nhật database hiện có

### 2. Entity Model
- **File**: `models/Showtime.java`
- **Thay đổi**: 
  ```java
  @Enumerated(EnumType.STRING)
  @Column(name = "movie_format", nullable = false)
  private MovieFormat movieFormat;
  ```

### 3. DTOs
- **ShowtimeRequest**: Thêm field `movieFormat` để nhận từ client
- **ShowtimeResponse**: Thêm field `movieFormat` và `movieFormatLabel` để trả về
- **ShowtimeFilterRequest**: Thêm field `movieFormat` để filter showtime theo định dạng

### 4. Service Layer
- **ShowtimeService**: 
  - Cập nhật `createShowtime()` để lưu movieFormat
  - Cập nhật `updateShowtime()` để cập nhật movieFormat
  - Cập nhật `getShowtimesWithFilters()` để filter theo movieFormat

### 5. Mapper
- **ShowtimeMapper**: 
  - Cập nhật `mapToResponse()` để bao gồm movieFormat và movieFormatLabel

### 6. Repository
- **ShowtimeRepository**: 
  - Cập nhật query `findShowtimesWithFilters()` để hỗ trợ filter theo movieFormat
  - Cập nhật query `findShowtimesWithFiltersPaged()` tương tự

## Cách Sử Dụng

### Tạo Showtime Mới
```json
POST /api/v1/showtimes
{
  "roomId": 1,
  "movieId": 10,
  "date": "2025-11-25",
  "startTime": "19:30",
  "ticketPrice": 80000,
  "movieFormat": "IMAX_3D",
  "status": "OPEN_FOR_BOOKING"
}
```

### Filter Showtimes
```json
POST /api/v1/showtimes/filter
{
  "movieId": 10,
  "cinemaCity": "Hồ Chí Minh",
  "showDate": "2025-11-25",
  "movieFormat": "IMAX_3D"
}
```

### Response Format
```json
{
  "id": 1,
  "movieTitle": "Avatar 3",
  "cinemaName": "CGV Vincom",
  "roomName": "IMAX Theater 1",
  "showDate": "2025-11-25",
  "startTime": "19:30:00",
  "endTime": "22:00:00",
  "price": 150000,
  "movieFormat": "IMAX_3D",
  "movieFormatLabel": "IMAX 3D",
  "status": "OPEN_FOR_BOOKING",
  "totalSeats": 150,
  "seatsBooked": 35,
  "isActive": true
}
```

## MovieFormat Values

| Enum Value | Label | is3D | isImax | Surcharge |
|-----------|-------|------|--------|-----------|
| TWO_D_SUB | 2D Phụ đề | false | false | 0đ |
| TWO_D_DUB | 2D Lồng tiếng | false | false | 0đ |
| TWO_D_VIET | 2D Tiếng Việt | false | false | 0đ |
| THREE_D_SUB | 3D Phụ đề | true | false | 20,000đ |
| THREE_D_DUB | 3D Lồng tiếng | true | false | 20,000đ |
| IMAX_2D | IMAX 2D | false | true | 50,000đ |
| IMAX_3D | IMAX 3D | true | true | 70,000đ |
| FOUR_DX | 4DX | false | false | 0đ |

## Migration Instructions

1. **Backup database** trước khi chạy migration
2. Chạy migration script:
   ```bash
   psql -U your_user -d your_database -f add_movie_format_to_showtimes.sql
   ```
3. Verify bằng cách query:
   ```sql
   SELECT * FROM information_schema.columns 
   WHERE table_name = 'showtimes' AND column_name = 'movie_format';
   ```

## Notes

- Giá trị mặc định cho records hiện có: `TWO_D_SUB`
- MovieFormat là REQUIRED field khi tạo showtime mới
- Phụ thu được tính tự động dựa trên `calculateSurcharge()` method
- Filter theo movieFormat là OPTIONAL (NULL = lấy tất cả)

## Testing

Sau khi deploy, test các scenarios:
1. ✅ Tạo showtime với movieFormat
2. ✅ Cập nhật movieFormat của showtime
3. ✅ Filter showtimes theo movieFormat
4. ✅ Response bao gồm movieFormat và label
5. ✅ Existing showtimes có giá trị default

## Date: 2025-11-20


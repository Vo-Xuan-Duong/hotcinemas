# Districts Management - Quản lý Quận/Huyện

## Mô tả
Module Districts giúp quản lý các quận/huyện/thành phố thuộc tỉnh trong hệ thống HotCinemas.

## Cấu trúc Database

### Bảng `districts`

```sql
CREATE TABLE districts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,           -- Tên đầy đủ: "Quận 1", "Thành phố Thủ Đức"
    prefix VARCHAR(20),                   -- Tiền tố: "Quận", "Huyện", "Thành phố"
    city_id BIGINT NOT NULL,              -- Liên kết với bảng cities
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_district_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    CONSTRAINT uq_district_name_city UNIQUE(name, city_id)
);
```

### Indexes
- `idx_district_city`: Index trên city_id để tăng tốc query theo thành phố
- `idx_district_name`: Index trên name để tìm kiếm nhanh
- `idx_district_active`: Index trên is_active để lọc districts đang hoạt động

### Relationships

1. **District → City (Many-to-One)**
   - Một district thuộc về một city
   - Cascade: ON DELETE CASCADE (xóa city sẽ xóa tất cả districts)

2. **District → Cinema (One-to-Many)**
   - Một district có thể có nhiều cinemas
   - Cinema có thể thuộc về một district cụ thể

## Model Entity

```java
@Entity
@Table(name = "districts")
public class District {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;        // "Quận 1", "Thành phố Thủ Đức"
    private String prefix;      // "Quận", "Huyện", "Thành phố"
    
    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;
    
    @OneToMany(mappedBy = "district")
    private List<Cinema> cinemas;
}
```

## Repository Methods

### Basic CRUD
- `findById(Long id)`: Tìm district theo ID
- `findAll()`: Lấy tất cả districts
- `save(District)`: Tạo hoặc cập nhật district
- `deleteById(Long id)`: Xóa district

### Custom Queries
- `findByName(String name)`: Tìm theo tên chính xác
- `findByIsActiveTrue()`: Lấy tất cả districts đang hoạt động
- `findByCityId(Long cityId)`: Lấy districts theo thành phố
- `findByCityIdAndIsActiveTrue(Long cityId)`: Lấy districts active theo thành phố
- `findActiveByCityIdOrderByName(Long cityId)`: Lấy districts active, sắp xếp theo tên
- `findByNameContainingIgnoreCase(String name)`: Tìm kiếm theo tên (ignore case)
- `findByCityIdAndNameContainingIgnoreCase(Long cityId, String name)`: Tìm kiếm trong thành phố
- `existsByNameAndCityId(String name, Long cityId)`: Kiểm tra tồn tại
- `countActiveByCityId(Long cityId)`: Đếm số districts active trong thành phố

## Sample Data

### TP. Hồ Chí Minh
- 17 Quận: Quận 1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, Bình Tân, Bình Thạnh, Gò Vấp, Phú Nhuận, Tân Bình, Tân Phú
- 1 Thành phố: Thủ Đức
- 5 Huyện: Bình Chánh, Cần Giờ, Củ Chi, Hóc Môn, Nhà Bè

### Hà Nội
- 12 Quận: Ba Đình, Hoàn Kiếm, Tây Hồ, Long Biên, Cầu Giấy, Đống Đa, Hai Bà Trưng, Hoàng Mai, Thanh Xuân, Nam Từ Liêm, Bắc Từ Liêm, Hà Đông

### Đà Nẵng
- 6 Quận: Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Liên Chiểu, Cẩm Lệ
- 2 Huyện: Hòa Vang, Hoàng Sa

## Migration Guide

### Chạy Migration

```bash
# Option 1: Sử dụng psql
psql -U your_username -d hotcinemas_db -f src/main/resources/data/districts_migration.sql

# Option 2: Từ ứng dụng Spring Boot
# Migration sẽ tự động chạy nếu bạn cấu hình trong application.properties
spring.jpa.hibernate.ddl-auto=update
```

### Cập nhật Cinemas với Districts

Sau khi tạo districts, bạn có thể cập nhật cinemas:

```sql
-- Example: Update cinema to belong to Quận 1
UPDATE cinemas 
SET district_id = (SELECT id FROM districts WHERE name = 'Quận 1' AND city_id = 1)
WHERE id = 1;
```

## API Endpoints (Suggested)

### GET /api/districts
- Lấy tất cả districts
- Query params: `cityId`, `isActive`, `search`

### GET /api/districts/{id}
- Lấy chi tiết district

### GET /api/districts/city/{cityId}
- Lấy districts theo thành phố

### POST /api/districts
- Tạo district mới
- Body:
```json
{
  "name": "Quận 1",
  "prefix": "Quận",
  "cityId": 1,
  "isActive": true
}
```

### PUT /api/districts/{id}
- Cập nhật district

### DELETE /api/districts/{id}
- Xóa district (soft delete: set isActive = false)

## Best Practices

1. **Naming Convention**
   - Sử dụng tên đầy đủ trong field `name`: "Quận 1", "Thành phố Thủ Đức"
   - Lưu prefix riêng: "Quận", "Huyện", "Thành phố"
   - Dễ dàng hiển thị và format theo ý muốn

2. **Data Integrity**
   - Luôn validate cityId tồn tại trước khi tạo district
   - Sử dụng unique constraint (name, city_id) để tránh duplicate

3. **Performance**
   - Sử dụng index trên city_id cho queries thường xuyên
   - Lazy loading cho relationships để tránh N+1 queries

4. **Soft Delete**
   - Sử dụng `isActive` flag thay vì xóa thật
   - Giữ lại dữ liệu lịch sử

## Testing

```java
@Test
public void testFindDistrictsByCity() {
    Long cityId = 1L; // TP.HCM
    List<District> districts = districtRepository.findByCityIdAndIsActiveTrue(cityId);
    assertThat(districts).isNotEmpty();
    assertThat(districts.size()).isGreaterThan(0);
}

@Test
public void testSearchDistrict() {
    String searchTerm = "Quận 1";
    List<District> districts = districtRepository.findByNameContainingIgnoreCase(searchTerm);
    assertThat(districts).isNotEmpty();
}
```

## Future Enhancements

1. **Wards/Phường**: Thêm bảng wards (phường/xã) thuộc districts
2. **Geocoding**: Thêm latitude/longitude cho districts
3. **Multilingual**: Hỗ trợ tên districts đa ngôn ngữ
4. **Statistics**: API thống kê số cinemas, showtimes theo district

## Notes

- District names phải unique trong một city (UNIQUE constraint)
- Prefix có thể null nếu không cần thiết
- Cascade delete từ City → Districts → Cinemas được handle tự động
- Migration script bao gồm sample data cho 3 thành phố lớn: HCM, HN, DN


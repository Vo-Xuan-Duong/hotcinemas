# Trang Quản Trị Hot Cinemas

## Tổng Quan

Trang quản trị Hot Cinemas cung cấp giao diện quản lý toàn diện cho hệ thống đặt vé xem phim, bao gồm các chức năng quản lý phim, rạp chiếu, lịch chiếu, người dùng và đặt vé.

## Truy Cập

Để truy cập trang quản trị, truy cập đường dẫn: `/admin`

## Các Trang Quản Lý

### 1. Dashboard (`/admin/dashboard`)

- **Mô tả**: Trang tổng quan với thống kê và biểu đồ
- **Chức năng**:
  - Hiển thị tổng số phim, rạp, người dùng, đặt vé
  - Thống kê doanh thu và đặt vé chờ xác nhận
  - Danh sách đặt vé gần đây
  - Quick actions để truy cập nhanh các trang quản lý

### 2. Quản Lý Phim (`/admin/movies`)

- **Mô tả**: Quản lý thông tin phim trong hệ thống
- **Chức năng**:
  - Xem danh sách tất cả phim
  - Thêm phim mới với đầy đủ thông tin
  - Chỉnh sửa thông tin phim
  - Xóa phim
  - Quản lý poster, trailer, thông tin diễn viên

### 3. Quản Lý Rạp (`/admin/cinemas`)

- **Mô tả**: Quản lý thông tin rạp chiếu phim
- **Chức năng**:
  - Xem danh sách tất cả rạp
  - Thêm rạp mới
  - Chỉnh sửa thông tin rạp
  - Xóa rạp
  - Quản lý tiện nghi và màn hình của rạp

### 4. Quản Lý Lịch Chiếu (`/admin/schedules`)

- **Mô tả**: Quản lý lịch chiếu phim
- **Chức năng**:
  - Xem danh sách tất cả suất chiếu
  - Thêm suất chiếu mới
  - Chỉnh sửa thông tin suất chiếu
  - Xóa suất chiếu
  - Quản lý giá vé, định dạng, ngôn ngữ

### 5. Quản Lý Người Dùng (`/admin/users`)

- **Mô tả**: Quản lý tài khoản người dùng
- **Chức năng**:
  - Xem danh sách tất cả người dùng
  - Thêm người dùng mới
  - Chỉnh sửa thông tin người dùng
  - Xóa người dùng
  - Quản lý vai trò và trạng thái tài khoản

### 6. Quản Lý Đặt Vé (`/admin/bookings`)

- **Mô tả**: Quản lý đặt vé của khách hàng
- **Chức năng**:
  - Xem danh sách tất cả đặt vé
  - Lọc theo trạng thái
  - Xem chi tiết đặt vé
  - Cập nhật trạng thái đặt vé
  - Xóa đặt vé

## Tính Năng Chung

### Responsive Design

- Giao diện tương thích với mọi thiết bị
- Tối ưu hóa cho desktop, tablet và mobile

### Modal Forms

- Form thêm/sửa dữ liệu trong modal
- Validation đầy đủ
- UX thân thiện

### Status Badges

- Hiển thị trạng thái bằng màu sắc
- Dễ dàng phân biệt các trạng thái khác nhau

### Search & Filter

- Tìm kiếm và lọc dữ liệu
- Hiển thị kết quả real-time

## Cấu Trúc Dữ Liệu

### Phim (Movies)

```json
{
  "id": 1,
  "title": "Tên phim",
  "genre": "Thể loại",
  "releaseDate": "dd.mm.yyyy",
  "poster": "URL poster",
  "description": "Mô tả phim",
  "duration": 120,
  "rating": 8.5,
  "ageLabel": "18+",
  "format": "2D",
  "trailer": "URL trailer",
  "director": "Đạo diễn",
  "cast": [...],
  "productionStudio": "Hãng sản xuất",
  "audioOptions": [...]
}
```

### Rạp (Cinemas)

```json
{
  "id": 1,
  "name": "Tên rạp",
  "address": "Địa chỉ",
  "phone": "Số điện thoại",
  "email": "Email",
  "description": "Mô tả",
  "image": "URL hình ảnh",
  "facilities": ["Tiện nghi 1", "Tiện nghi 2"],
  "screens": [
    {
      "name": "Tên màn hình",
      "capacity": 100,
      "type": "2D"
    }
  ]
}
```

### Lịch Chiếu (Schedules)

```json
{
  "id": 1,
  "movieId": 1,
  "cinemaId": 1,
  "screenName": "Tên màn hình",
  "date": "yyyy-mm-dd",
  "time": "HH:mm",
  "price": 100000,
  "format": "2D",
  "language": "Tiếng Việt",
  "type": "Phụ đề"
}
```

### Người Dùng (Users)

```json
{
  "id": 1,
  "username": "tên đăng nhập",
  "email": "email@example.com",
  "fullName": "Họ tên đầy đủ",
  "phone": "Số điện thoại",
  "role": "user|moderator|admin",
  "status": "active|inactive|suspended",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Đặt Vé (Bookings)

```json
{
  "id": 1,
  "userId": 1,
  "movieId": 1,
  "cinemaId": 1,
  "showtime": {
    "date": "dd.mm.yyyy",
    "time": "HH:mm"
  },
  "seats": ["A1", "A2"],
  "totalAmount": 200000,
  "paymentMethod": "Credit Card",
  "status": "pending|confirmed|completed|cancelled|expired",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Bảo Mật

- Chỉ admin mới có quyền truy cập trang quản trị
- Validation dữ liệu đầu vào
- Xác nhận trước khi xóa dữ liệu quan trọng

## Hướng Dẫn Sử Dụng

1. **Truy cập trang admin**: `/admin`
2. **Chọn chức năng** từ sidebar bên trái
3. **Thêm dữ liệu**: Click nút "Thêm mới" và điền form
4. **Sửa dữ liệu**: Click nút "Sửa" trên dòng tương ứng
5. **Xóa dữ liệu**: Click nút "Xóa" và xác nhận
6. **Xem chi tiết**: Click nút "Chi tiết" (nếu có)

## Lưu Ý

- Dữ liệu được lưu trữ trong file JSON (demo)
- Trong môi trường production, cần kết nối database thực
- Backup dữ liệu thường xuyên
- Kiểm tra quyền truy cập trước khi thực hiện thao tác

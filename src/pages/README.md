# Pages Directory Structure

## Cấu trúc thư mục Pages đã được sắp xếp lại

```
src/pages/
├── Admin/                  # Trang quản trị viên
│   ├── Dashboard/         # Trang dashboard admin
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── Admin.css
│   │   └── index.js
│   ├── Movies/           # Quản lý phim
│   │   ├── Movies.jsx
│   │   └── index.js
│   ├── Cinemas/          # Quản lý rạp chiếu
│   │   ├── Cinemas.jsx
│   │   └── index.js
│   ├── Bookings/         # Quản lý đặt vé
│   │   ├── Bookings.jsx
│   │   └── index.js
│   ├── Users/            # Quản lý người dùng
│   │   ├── Users.jsx
│   │   └── index.js
│   └── Schedules/        # Quản lý lịch chiếu
│       ├── Schedules.jsx
│       └── index.js
│
├── User/                  # Trang dành cho người dùng
│   ├── Home/             # Trang chủ
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   └── index.js
│   ├── Movies/           # Xem phim
│   │   ├── Movies.jsx
│   │   ├── Movies.css
│   │   ├── MovieDetail.jsx
│   │   ├── MovieDetail.css
│   │   └── index.js
│   ├── Cinemas/          # Xem rạp chiếu
│   │   ├── Cinemas.jsx
│   │   ├── Cinemas.css
│   │   ├── CinemaDetail.jsx
│   │   ├── CinemaDetail.css
│   │   └── index.js
│   ├── Booking/          # Đặt vé
│   │   ├── Booking.jsx
│   │   ├── Booking.css
│   │   ├── BookingConfirm.jsx
│   │   ├── BookingConfirm.css
│   │   └── index.js
│   ├── Profile/          # Hồ sơ người dùng
│   │   ├── Profile.jsx
│   │   ├── Profile.css
│   │   └── index.js
│   └── BookingHistory/   # Lịch sử đặt vé
│       ├── BookingHistory.jsx
│       └── index.js
│
├── Auth/                  # Trang xác thực
│   ├── Login.jsx
│   └── Register.jsx
│
└── Common/               # Trang chung
    └── ErrorPages/       # Trang lỗi
        ├── BadRequest.jsx
        ├── Forbidden.jsx
        ├── InternalError.jsx
        ├── Maintenance.jsx
        ├── NotFound.jsx
        └── ErrorPages.css
```

## Ưu điểm của cấu trúc mới:

### 1. **Phân chia rõ ràng**
- **Admin/**: Tất cả trang quản trị viên
- **User/**: Tất cả trang người dùng
- **Auth/**: Trang xác thực (login, register)
- **Common/**: Trang chung (error pages)

### 2. **Tổ chức theo feature**
- Mỗi feature có thư mục riêng
- Tất cả file liên quan (JSX, CSS) trong cùng thư mục
- File index.js để export dễ dàng

### 3. **Dễ dàng bảo trì**
- Tìm file nhanh chóng
- Thêm/xóa feature dễ dàng
- Import paths rõ ràng

### 4. **Scalability**
- Dễ dàng mở rộng thêm trang mới
- Cấu trúc nhất quán
- Tách biệt admin và user interface

## Import Examples:

```javascript
// Sử dụng index.js
import AdminDashboard from './pages/Admin/Dashboard';
import UserHome from './pages/User/Home';

// Hoặc import trực tiếp
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import Home from './pages/User/Home/Home';
```

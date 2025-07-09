# HotCinemas Frontend

Frontend React cho ứng dụng rạp chiếu phim HotCinemas.

## 🛠️ Công nghệ sử dụng

- **React 19** - UI Framework
- **Vite** - Build tool và development server
- **React Router** - Client-side routing
- **Axios** - HTTP client cho API calls
- **CSS3** - Styling và responsive design

## 📁 Cấu trúc thư mục

```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── Comments/       # Components cho bình luận
│   │   ├── FeaturedComments/ # Components cho bình luận nổi bật
│   │   ├── FeaturesSection/ # Components cho phần tính năng
│   │   ├── Footer/         # Footer component
│   │   ├── Header/         # Header component
│   │   ├── HeroSlider/     # Hero slider component
│   │   ├── Info/           # Movie info components
│   │   ├── Loading/        # Loading components
│   │   ├── MovieCard/      # Movie card component
│   │   ├── MovieSlider/    # Movie slider component
│   │   ├── Seats/          # Seat selection components
│   │   ├── Showtimes/      # Showtime components
│   │   └── Trailer/        # Trailer modal component
│   ├── context/            # React Context
│   │   ├── AuthContext.jsx # Authentication context
│   │   ├── AuthContextUtils.js # Auth utilities
│   │   ├── TrailerModalContext.jsx # Trailer modal context
│   │   └── useAuth.js      # Custom auth hook
│   ├── data/               # Mock data
│   │   ├── bookings.json   # Booking data
│   │   ├── cinemas.json    # Cinema data
│   │   ├── movies.json     # Movie data
│   │   ├── seatData.json   # Seat data
│   │   ├── showtimes.json  # Showtime data
│   │   └── users.json      # User data
│   ├── hooks/              # Custom hooks
│   │   └── useLocalStorage.js # Local storage hook
│   ├── layouts/            # Layout components
│   │   ├── AdminLayout.css # Admin layout styles
│   │   ├── AdminLayout.jsx # Admin layout component
│   │   └── UserLayout.jsx  # User layout component
│   ├── pages/              # Page components
│   │   ├── Admin/          # Admin pages
│   │   ├── Auth/           # Authentication pages
│   │   ├── Booking/        # Booking pages
│   │   ├── Cinemas/        # Cinema pages
│   │   ├── ErrorPages/     # Error pages
│   │   ├── Home/           # Home page
│   │   ├── Movies/         # Movie pages
│   │   └── User/           # User pages
│   ├── services/           # API services
│   │   ├── authService.js  # Authentication service
│   │   ├── bookingService.js # Booking service
│   │   ├── cinemaService.js # Cinema service
│   │   ├── movieService.js # Movie service
│   │   └── userService.js  # User service
│   ├── utils/              # Utilities
│   │   ├── apiClient.js    # Axios client configuration
│   │   ├── constants.js    # Application constants
│   │   └── movieData.js    # Movie data utilities
│   ├── App.css             # App styles
│   ├── App.jsx             # Main App component
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── package.json            # Dependencies và scripts
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML entry point
└── README.md               # This file
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống

- Node.js 18+
- npm hoặc yarn

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:5173

### 3. Build cho production

```bash
npm run build
```

### 4. Preview build

```bash
npm run preview
```

## 🔧 Cấu hình

### API Configuration

Cập nhật API URL trong `src/utils/apiClient.js`:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

### Environment Variables

Tạo file `.env` trong thư mục frontend:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=HotCinemas
```

## 📱 Tính năng

### Cho người dùng

- **Trang chủ**: Hiển thị phim nổi bật, slider, tính năng
- **Danh sách phim**: Xem tất cả phim với filter và search
- **Chi tiết phim**: Thông tin phim, trailer, đánh giá
- **Đặt vé**: Chọn rạp, lịch chiếu, ghế ngồi
- **Quản lý tài khoản**: Profile, lịch sử đặt vé
- **Rạp chiếu**: Xem thông tin rạp và lịch chiếu

### Cho admin

- **Dashboard**: Thống kê tổng quan
- **Quản lý phim**: CRUD operations
- **Quản lý rạp**: Thêm, sửa, xóa rạp
- **Quản lý lịch chiếu**: Tạo và quản lý showtimes
- **Quản lý đặt vé**: Xem và quản lý bookings
- **Quản lý người dùng**: User management

## 🎨 UI/UX Features

- **Responsive Design**: Tương thích mobile, tablet, desktop
- **Modern UI**: Thiết kế hiện đại với CSS3
- **Interactive Elements**: Sliders, modals, forms
- **Loading States**: Skeleton loading, spinners
- **Error Handling**: Error pages, validation messages
- **Accessibility**: Keyboard navigation, screen reader support

## 🔐 Authentication

- JWT token authentication
- Protected routes
- Role-based access control
- Auto-logout khi token hết hạn
- Remember me functionality

## 📊 State Management

- React Context cho global state
- Local storage cho persistent data
- Custom hooks cho reusable logic

## 🧪 Testing

```bash
# Chạy tests
npm test

# Chạy tests với coverage
npm run test:coverage
```

## 📦 Build và Deploy

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Docker Build

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## 🔍 Code Quality

### ESLint

```bash
# Kiểm tra lỗi
npm run lint

# Tự động fix lỗi
npm run lint:fix
```

### Prettier

```bash
# Format code
npm run format
```

## 🐛 Troubleshooting

### Lỗi thường gặp

1. **Port 5173 đã được sử dụng**

   - Thay đổi port trong `vite.config.js`:

   ```javascript
   export default defineConfig({
     server: {
       port: 3000,
     },
   });
   ```

2. **Lỗi CORS**

   - Kiểm tra backend CORS configuration
   - Đảm bảo API URL đúng

3. **Lỗi build**

   - Xóa `node_modules` và `package-lock.json`
   - Chạy lại `npm install`

4. **Lỗi dependencies**
   - Cập nhật Node.js version
   - Clear npm cache: `npm cache clean --force`

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License

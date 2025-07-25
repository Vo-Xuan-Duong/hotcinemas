# 🎬 HotCinemas Header Component

Header component hiện đại với hệ thống đăng nhập/đăng xuất hoàn chỉnh và user management.

## 📁 Cấu trúc File

```
src/components/Header/
├── Header.jsx              # Header component chính
├── Header.css              # Main styles
├── HeaderEnhancements.css  # Advanced styles & animations
├── HeaderTest.jsx          # Header test component (standalone)
└── HeaderTest.css          # Styles cho HeaderTest
```

## ✨ Tính năng chính

### 🔐 **Authentication States**
- **Chưa đăng nhập**: Hiển thị nút "Đăng ký" và "Đăng nhập"
- **Đã đăng nhập**: Hiển thị user menu với avatar và dropdown

### 👤 **User Menu Features**
- Avatar hiển thị (với fallback cho user không có ảnh)
- User name display (responsive - ẩn trên mobile)
- Dropdown menu với các tùy chọn:
  - Hồ sơ cá nhân
  - Lịch sử đặt vé  
  - Đăng xuất

### 🔗 **Navigation**
- Responsive navigation menu
- Mobile hamburger menu
- Active link highlighting
- Smooth transitions

### 📱 **Responsive Design**
- Desktop: Full navigation + user info
- Tablet: Compact layout
- Mobile: Hamburger menu + icon-only user menu

## 🚀 Cách sử dụng

### Basic Usage

```jsx
import Header from '../components/Header/Header';

function App() {
  return (
    <div>
      <Header />
      {/* Rest of your app */}
    </div>
  );
}
```

### Với AuthContext

```jsx
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header/Header';

function App() {
  return (
    <AuthProvider>
      <Header />
      {/* App content */}
    </AuthProvider>
  );
}
```

### Test Component

```jsx
import HeaderTest from '../components/Header/HeaderTest';

function Demo() {
  const [user, setUser] = useState(null);
  
  return (
    <HeaderTest 
      user={user}
      onLogin={() => setUser(mockUser)}
      onLogout={() => setUser(null)}
    />
  );
}
```

## 🎨 Props API

### Header Component

Header component tự động lấy user state từ AuthContext, không cần props.

### HeaderTest Component

| Prop | Type | Required | Mô tả |
|------|------|----------|-------|
| `user` | `object \| null` | Yes | User object hoặc null nếu chưa đăng nhập |
| `onLogin` | `function` | Yes | Callback khi user đăng nhập |
| `onLogout` | `function` | Yes | Callback khi user đăng xuất |

#### User Object Structure

```jsx
const user = {
  id: 1,
  name: "Nguyễn Văn A",
  email: "user@example.com",
  avatar: "https://example.com/avatar.jpg" // optional
};
```

## 🎯 User States & Behavior

### 1. Logged Out State
```jsx
// Hiển thị:
<div className="auth-buttons">
  <button className="register-btn">Đăng ký</button>
  <button className="login-btn">Đăng nhập</button>
</div>
```

### 2. Logged In State
```jsx
// Hiển thị:
<div className="user-menu">
  <div className="user-avatar">
    {user.avatar ? <img /> : <div className="fallback" />}
  </div>
  <span className="user-name">{user.name}</span>
  <UserDropdown />
</div>
```

## 🎨 Styling & Customization

### CSS Custom Properties

```css
:root {
  --header-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --header-text: white;
  --accent-color: #feca57;
  --avatar-size: 36px;
  --mobile-avatar-size: 32px;
}
```

### Theme Customization

```css
/* Custom theme */
.header {
  background: var(--custom-header-bg);
}

.logo h1 {
  background: var(--custom-logo-gradient);
}
```

### Mobile Responsive Breakpoints

- **Desktop**: > 768px - Full layout
- **Tablet**: 481px - 768px - Compressed layout  
- **Mobile**: ≤ 480px - Minimal layout

## 🔧 Component Interactions

### AuthModal Integration

```jsx
// Header tự động mở AuthModal khi click auth buttons
const [showAuthModal, setShowAuthModal] = useState(false);

<AuthModal 
  isOpen={showAuthModal}
  onClose={() => setShowAuthModal(false)}
  initialMode="login" // hoặc "register"
/>
```

### Navigation Integration

```jsx
// Sử dụng React Router Link
import { Link } from 'react-router-dom';

<nav>
  <Link to="/movies" className="nav-link">Phim</Link>
</nav>
```

## 📱 Mobile Menu Behavior

### Hamburger Menu
- Click hamburger → Slide in menu từ phải
- Click outside → Đóng menu
- Click nav link → Đóng menu và navigate

### User Menu (Mobile)
- Chỉ hiển thị avatar (ẩn tên user)
- Dropdown vẫn hoạt động bình thường
- Click outside → Đóng dropdown

## 🔍 Demo & Testing

### Demo Page
Truy cập `/header-demo` để test các trạng thái khác nhau:

```
http://localhost:5173/header-demo
```

### Test Cases
- [ ] Logged out state hiển thị đúng
- [ ] Auth buttons mở modal
- [ ] Logged in state hiển thị user menu
- [ ] Avatar fallback hoạt động
- [ ] Dropdown menu interactions
- [ ] Mobile responsive
- [ ] Logout functionality
- [ ] Navigation links

## 🎭 Animation & Effects

### Hover Effects
```css
.nav-link:hover::after {
  width: 100%; /* Underline animation */
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}
```

### Dropdown Animation
```css
.user-dropdown {
  animation: dropdownSlide 0.2s ease-out;
}

@keyframes dropdownSlide {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## ♿ Accessibility Features

### Keyboard Navigation
- Tab navigation qua tất cả interactive elements
- Enter/Space để activate buttons
- Escape để đóng modals/dropdowns

### Screen Reader Support
```jsx
<button aria-label="Toggle menu">
<img alt={user.name} />
```

### Focus Management
```css
.user-menu:focus-visible {
  outline: 2px solid #feca57;
  outline-offset: 2px;
}
```

## 🐛 Troubleshooting

### Common Issues

**1. User menu không hiển thị**
```jsx
// Kiểm tra AuthContext
const { user } = useAuth();
console.log('Current user:', user);
```

**2. Styles bị conflict**
```jsx
// Đảm bảo import CSS đúng thứ tự
import './Header.css';
import './HeaderEnhancements.css';
```

**3. Mobile menu không hoạt động**
```jsx
// Kiểm tra z-index và position
.nav {
  position: fixed;
  z-index: 1050;
}
```

## 🔮 Future Enhancements

### Planned Features
- [ ] Notification badge
- [ ] Search functionality  
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Admin panel access
- [ ] Quick booking shortcut

### Performance Optimizations
- [ ] Lazy load user avatar
- [ ] Optimize re-renders
- [ ] Cache user data
- [ ] Preload critical navigation

---

**Happy Coding! 🎬✨**

# 🔐 HotCinemas Auth Components

Bộ component đăng nhập và đăng ký hiện đại cho ứng dụng HotCinemas với thiết kế UI/UX chuyên nghiệp.

## 📁 Cấu trúc thư mục

```
src/components/Auth/
├── LoginForm.jsx          # Component đăng nhập chính
├── LoginForm.css          # Styles cho LoginForm
├── RegisterForm.jsx       # Component đăng ký chính  
├── RegisterForm.css       # Styles cho RegisterForm
├── AuthModal.jsx          # Component modal auth
├── AuthModal.css          # Styles cho AuthModal
└── index.js              # Export tất cả components
```

## 🚀 Cách sử dụng

### 1. LoginForm Component

```jsx
import { LoginForm } from '../components/Auth';

// Sử dụng standalone (trang riêng)
<LoginForm standalone={true} />

// Sử dụng trong modal hoặc embedded
<LoginForm 
  standalone={false}
  onSwitchToRegister={() => setMode('register')}
/>
```

### 2. RegisterForm Component

```jsx
import { RegisterForm } from '../components/Auth';

// Sử dụng standalone (trang riêng)
<RegisterForm standalone={true} />

// Sử dụng trong modal hoặc embedded
<RegisterForm 
  standalone={false}
  onSwitchToLogin={() => setMode('login')}
/>
```

### 3. AuthModal Component

```jsx
import { AuthModal } from '../components/Auth';

function App() {
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Đăng nhập
      </button>
      
      <AuthModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialMode="login" // hoặc "register"
      />
    </>
  );
}
```

## ✨ Tính năng chính

### 🔐 Bảo mật & Validation
- ✅ Validation form real-time
- ✅ Password strength indicator (RegisterForm)
- ✅ Show/hide password toggle
- ✅ Email format validation
- ✅ Password confirmation matching
- ✅ Remember me functionality

### 🎨 UI/UX Design
- ✅ Modern gradient backgrounds
- ✅ Smooth animations và transitions
- ✅ Loading states với spinner
- ✅ Error handling đẹp mắt
- ✅ Icon integration
- ✅ Hover effects

### 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Touch-friendly interactions
- ✅ Adaptive layouts
- ✅ Cross-browser compatibility

### ♿ Accessibility
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ Focus indicators
- ✅ ARIA labels
- ✅ High contrast mode support

## 🎭 Demo

Truy cập route `/auth-demo` để xem demo tương tác với tất cả các component:

```
http://localhost:5173/auth-demo
```

Demo bao gồm:
- Modal auth với tab switching
- Inline login form
- Inline register form
- Feature showcase

## 🔧 Props API

### LoginForm Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `onSwitchToRegister` | `function` | `undefined` | Callback khi user click "Đăng ký" |
| `standalone` | `boolean` | `true` | Hiển thị ở chế độ trang riêng hay embedded |

### RegisterForm Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `onSwitchToLogin` | `function` | `undefined` | Callback khi user click "Đăng nhập" |
| `standalone` | `boolean` | `true` | Hiển thị ở chế độ trang riêng hay embedded |

### AuthModal Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `isOpen` | `boolean` | `false` | Trạng thái hiển thị modal |
| `onClose` | `function` | **required** | Callback khi đóng modal |
| `initialMode` | `'login' \| 'register'` | `'login'` | Chế độ hiển thị ban đầu |

## 🎨 Customization

### CSS Variables

Bạn có thể tùy chỉnh màu sắc bằng cách override các CSS variables:

```css
:root {
  --auth-primary-color: #667eea;
  --auth-secondary-color: #764ba2;
  --auth-background-color: #f7fafc;
  --auth-error-color: #e53e3e;
  --auth-success-color: #38a169;
}
```

### Theme Customization

Để tạo theme mới, copy và modify các file CSS:

```css
/* Custom theme example */
.login-form {
  background: var(--custom-bg);
  /* ... other custom styles */
}
```

## 🔄 Integration với AuthContext

Các component đã được tích hợp sẵn với AuthContext của dự án:

```jsx
// AuthContext methods được sử dụng:
const {
  login,          // Hàm đăng nhập
  register,       // Hàm đăng ký  
  isLoading,      // Trạng thái loading
  error,          // Thông báo lỗi
  clearError      // Clear error message
} = useAuth();
```

## 🚀 Performance

### Optimizations
- Lazy loading cho validation
- Debounced password strength calculation
- Optimized re-renders
- Efficient CSS animations
- Minimal bundle size

### Bundle Analysis
```bash
# Kiểm tra bundle size
npm run build
npm run preview
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Form validation hoạt động đúng
- [ ] Loading states hiển thị
- [ ] Error handling chính xác
- [ ] Responsive trên mobile
- [ ] Keyboard navigation
- [ ] Remember me functionality
- [ ] Modal interactions

### Automated Testing
```bash
# Chạy tests (nếu có)
npm run test
```

## 🐛 Troubleshooting

### Common Issues

**1. Component không hiển thị đúng**
```jsx
// Đảm bảo import đúng cách
import { LoginForm } from '../components/Auth';
// KHÔNG phải: import LoginForm from '../components/Auth/LoginForm';
```

**2. Styles không apply**
```jsx
// Đảm bảo import CSS files
import './LoginForm.css';
```

**3. AuthContext không hoạt động**
```jsx
// Đảm bảo component được wrap trong AuthProvider
<AuthProvider>
  <LoginForm />
</AuthProvider>
```

## 🔮 Future Enhancements

### Planned Features
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication
- [ ] Forgot password functionality
- [ ] Account verification
- [ ] Profile picture upload
- [ ] Advanced password policies
- [ ] Login activity tracking

### UI Improvements
- [ ] Dark mode support
- [ ] Additional themes
- [ ] More animation options
- [ ] Advanced accessibility features

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Initial release
- ✅ LoginForm component
- ✅ RegisterForm component  
- ✅ AuthModal component
- ✅ Full responsive design
- ✅ Accessibility support
- ✅ Demo page

## 🤝 Contributing

Để đóng góp vào dự án:

1. Fork repository
2. Tạo feature branch
3. Implement changes
4. Test thoroughly
5. Submit pull request

## 📄 License

Dự án này thuộc về HotCinemas team.

---

**Happy Coding! 🎬✨**

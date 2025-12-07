# MovieSlider với Swiper Carousel

## 🚀 Tổng Quan

MovieSlider đã được nâng cấp để sử dụng Swiper.js, mang lại trải nghiệm carousel mượt mà và hiện đại với nhiều tính năng nâng cao.

## ✨ Tính Năng Mới

### 🎨 Giao Diện Mượt Mà
- Sử dụng Swiper.js với hiệu ứng chuyển động mượt mà
- Hiệu ứng hover và scale động
- Gradient background với backdrop filter
- Box shadow động với màu sắc gradient

### 📱 Responsive Design
- Tự động điều chỉnh số lượng slide theo kích thước màn hình:
  - Desktop (1400px+): 5 slides
  - Large (1200px+): 4 slides  
  - Medium (900px+): 3 slides
  - Tablet (640px+): 2 slides
  - Mobile (320px+): 1 slide

### ⚡ Auto Play
- Tự động chuyển slide sau 4 giây
- Tạm dừng khi hover chuột
- Không bị gián đoạn khi tương tác

### 🎯 Touch Support
- Hỗ trợ vuốt trên thiết bị di động
- Grab cursor cho desktop
- Smooth scrolling với momentum

### 🔧 Navigation Controls
- Custom navigation buttons với hiệu ứng gradient
- Disable state khi đến đầu/cuối
- Accessibility support với ARIA labels

## 🛠️ Cài Đặt

```bash
npm install swiper
```

## 📖 Sử Dụng

### Basic Usage

```jsx
import MovieSlider from './components/MovieSlider/MovieSlider';

const MyComponent = () => {
  const movies = getAllMovies();
  
  return (
    <MovieSlider 
      movies={movies} 
      title="Phim Nổi Bật" 
      showMoreButton={true}
      onShowMore={() => console.log('Show more clicked')}
    />
  );
};
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `movies` | Array | required | Danh sách phim để hiển thị |
| `title` | String | optional | Tiêu đề của slider |
| `showMoreButton` | Boolean | false | Hiển thị nút "Xem thêm" |
| `onShowMore` | Function | optional | Callback khi click "Xem thêm" |

## 🎭 Demo

Truy cập `/swiper-demo` để xem demo đầy đủ với nhiều slider khác nhau.

## 🎨 Customization

### CSS Variables

```css
:root {
  --swiper-navigation-size: 60px;
  --swiper-gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --swiper-gradient-secondary: linear-gradient(90deg, #ff6b6b 0%, #feca57 100%);
  --swiper-border-radius: 20px;
  --swiper-backdrop-blur: 20px;
}
```

### Breakpoint Customization

```jsx
const customBreakpoints = {
  320: { slidesPerView: 1, spaceBetween: 10 },
  640: { slidesPerView: 2, spaceBetween: 15 },
  900: { slidesPerView: 3, spaceBetween: 20 },
  1200: { slidesPerView: 4, spaceBetween: 20 },
  1400: { slidesPerView: 5, spaceBetween: 25 }
};
```

## 🔧 Advanced Configuration

### Swiper Options

```jsx
const swiperOptions = {
  speed: 800,
  grabCursor: true,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  },
  effect: "slide"
};
```

## 🎯 Performance

- Lazy loading cho hình ảnh
- Hardware acceleration với CSS transforms
- Optimized re-renders với React.memo
- Smooth 60fps animations

## 🔍 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## 📱 Mobile Features

- Touch/swipe gestures
- Momentum scrolling
- Responsive breakpoints
- Optimized touch target sizes

## 🎪 Animation Effects

- Smooth slide transitions
- Scale effects on hover
- Gradient backgrounds
- Box shadow animations
- Backdrop blur effects

## 🚀 Migration Guide

### Từ MovieSlider cũ

1. **Dependencies**: Cài đặt Swiper
```bash
npm install swiper
```

2. **Import**: Không cần thay đổi import
```jsx
import MovieSlider from './components/MovieSlider/MovieSlider';
```

3. **Props**: Tất cả props cũ vẫn tương thích

### Breaking Changes
- Không còn sử dụng manual pagination logic
- Auto-responsive (không cần handle resize manually)
- Smooth animations thay vì discrete transitions

## 🔬 Testing

Để test trang demo:
```bash
npm run dev
# Truy cập http://localhost:5173/swiper-demo
```

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa.

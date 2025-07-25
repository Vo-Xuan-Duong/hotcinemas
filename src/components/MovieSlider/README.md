# Movie Slider with Carousel

Dự án đã được cập nhật để sử dụng thư viện **react-slick** cho tính năng carousel, mang lại trải nghiệm người dùng mượt mà hơn.

## Cài đặt

Các thư viện đã được cài đặt:
```bash
npm install react-slick slick-carousel
```

## Components

### 1. MovieSlider (Cơ bản)
Component slider cơ bản với các tính năng:
- Responsive design (4 → 3 → 2 → 1 movie per slide)
- Navigation buttons với trạng thái disabled
- Trailer modal integration
- Custom CSS styling

**Cách sử dụng:**
```jsx
import MovieSlider from './components/MovieSlider/MovieSlider';

<MovieSlider 
  movies={movieArray}
  title="Phim mới"
  showMoreButton={true}
  onShowMore={() => console.log('Show more')}
/>
```

### 2. MovieSliderAdvanced (Nâng cao)
Component slider nâng cao với thêm các tính năng:
- Autoplay với tùy chỉnh tốc độ
- Custom dots indicator
- Infinite loop
- Enhanced hover effects
- Advanced navigation styling

**Cách sử dụng:**
```jsx
import MovieSliderAdvanced from './components/MovieSlider/MovieSliderAdvanced';

<MovieSliderAdvanced 
  movies={movieArray}
  title="Phim đề xuất"
  autoplay={true}
  autoplaySpeed={3000}
  showDots={true}
  infinite={true}
  showMoreButton={false}
/>
```

## Props

### MovieSlider Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| movies | Array | [] | Mảng dữ liệu phim |
| title | String | "" | Tiêu đề section |
| showMoreButton | Boolean | false | Hiển thị nút "Xem thêm" |
| onShowMore | Function | null | Callback khi click "Xem thêm" |

### MovieSliderAdvanced Props
Bao gồm tất cả props của MovieSlider và thêm:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| autoplay | Boolean | false | Tự động chuyển slide |
| autoplaySpeed | Number | 3000 | Tốc độ autoplay (ms) |
| showDots | Boolean | false | Hiển thị dots indicator |
| infinite | Boolean | false | Vòng lặp vô tận |

## Tính năng chính

### 1. Responsive Design
- **Desktop (≥1024px):** 4 movies per slide
- **Tablet (768-1023px):** 3 movies per slide  
- **Mobile (480-767px):** 2 movies per slide
- **Small Mobile (≤479px):** 1 movie per slide

### 2. Navigation
- **Prev/Next buttons:** Custom styled với disable state
- **Dots indicator:** Custom dots cho advanced version
- **Touch/Swipe:** Hỗ trợ touch gestures trên mobile

### 3. Performance
- **Lazy loading:** Chỉ render slides hiển thị
- **Smooth transitions:** Animation mượt mà
- **Pause on hover:** Dừng autoplay khi hover

### 4. Accessibility
- **Keyboard navigation:** Hỗ trợ điều hướng bằng phím
- **ARIA labels:** Accessibility cho screen readers
- **Focus management:** Focus states rõ ràng

## Customization

### CSS Classes
Các class CSS chính có thể customize:

```css
/* Basic slider */
.movies-slider-wrapper
.movies-slider
.slider-item
.movies-slider-nav

/* Advanced slider */
.movies-slider-wrapper-advanced
.movies-slider-advanced  
.slider-item-advanced
.custom-dots
.custom-dot
```

### Slick Settings
Có thể tùy chỉnh cấu hình slider thông qua `sliderSettings`:

```javascript
const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  arrows: false,
  autoplay: false,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  // ... responsive settings
};
```

## Browser Support
- Chrome/Edge/Safari: ✅ Full support
- Firefox: ✅ Full support  
- IE11: ⚠️ Requires polyfills
- Mobile browsers: ✅ Full support với touch gestures

## Performance Tips
1. Sử dụng `infinite: false` nếu không cần vòng lặp
2. Tăng `autoplaySpeed` để giảm tải CPU
3. Hạn chế số lượng slides để tối ưu performance
4. Sử dụng `lazy: true` cho large datasets

## Demo
Xem file `src/pages/CarouselDemo.jsx` để test các tính năng carousel.

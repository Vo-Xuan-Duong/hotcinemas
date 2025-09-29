#!/bin/bash

# HotCinemas Cleanup Script
# Tạo backup và thực hiện cleanup theo giai đoạn

echo "🎬 HotCinemas System Cleanup Script"
echo "=================================="

# Tạo backup trước khi cleanup
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
echo "📦 Tạo backup tại: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Backup các files sẽ bị xóa
echo "💾 Đang backup files..."

# Giai đoạn 1: Test & Demo files (HIGH PRIORITY)
mkdir -p "$BACKUP_DIR/test_demo_files"
mkdir -p "$BACKUP_DIR/test_demo_files/pages"
mkdir -p "$BACKUP_DIR/test_demo_files/components"
mkdir -p "$BACKUP_DIR/test_demo_files/data"

# Backup test pages
cp -f src/pages/AuthDemo.* "$BACKUP_DIR/test_demo_files/pages/" 2>/dev/null || true
cp -f src/pages/CarouselDemo.jsx "$BACKUP_DIR/test_demo_files/pages/" 2>/dev/null || true
cp -f src/pages/HeaderDemo.* "$BACKUP_DIR/test_demo_files/pages/" 2>/dev/null || true
cp -f src/pages/HorizontalDemo.* "$BACKUP_DIR/test_demo_files/pages/" 2>/dev/null || true
cp -f src/pages/LoginDemo.jsx "$BACKUP_DIR/test_demo_files/pages/" 2>/dev/null || true
cp -f src/pages/ScrollDemo.jsx "$BACKUP_DIR/test_demo_files/pages/" 2>/dev/null || true
cp -f src/pages/SwiperDemo.* "$BACKUP_DIR/test_demo_files/pages/" 2>/dev/null || true
cp -f src/pages/TestSlider.* "$BACKUP_DIR/test_demo_files/pages/" 2>/dev/null || true
cp -f src/pages/FullTest.jsx "$BACKUP_DIR/test_demo_files/pages/" 2>/dev/null || true
cp -f src/TestUsers.jsx "$BACKUP_DIR/test_demo_files/" 2>/dev/null || true

# Backup test components
cp -f src/components/AuthTest.jsx "$BACKUP_DIR/test_demo_files/components/" 2>/dev/null || true
cp -f src/components/TestAuth.jsx "$BACKUP_DIR/test_demo_files/components/" 2>/dev/null || true
cp -f src/components/Header/HeaderTest.* "$BACKUP_DIR/test_demo_files/components/" 2>/dev/null || true
cp -f src/components/MovieSlider/MovieSliderTest.jsx "$BACKUP_DIR/test_demo_files/components/" 2>/dev/null || true

# Backup test data
cp -f src/data/testing.json "$BACKUP_DIR/test_demo_files/data/" 2>/dev/null || true

# Backup root test files
cp -f test-import.js "$BACKUP_DIR/test_demo_files/" 2>/dev/null || true
cp -f public/test-routes.html "$BACKUP_DIR/test_demo_files/" 2>/dev/null || true

echo "✅ Backup hoàn tất tại: $BACKUP_DIR"
echo ""
echo "🗑️ Bạn có muốn tiếp tục với việc xóa files không? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "🧹 Bắt đầu cleanup..."
    
    # Xóa test & demo files
    echo "Đang xóa test/demo files..."
    rm -f src/pages/AuthDemo.*
    rm -f src/pages/CarouselDemo.jsx
    rm -f src/pages/HeaderDemo.*
    rm -f src/pages/HorizontalDemo.*
    rm -f src/pages/LoginDemo.jsx
    rm -f src/pages/ScrollDemo.jsx
    rm -f src/pages/SwiperDemo.*
    rm -f src/pages/TestSlider.*
    rm -f src/pages/FullTest.jsx
    rm -f src/TestUsers.jsx
    rm -f src/components/AuthTest.jsx
    rm -f src/components/TestAuth.jsx
    rm -f src/components/Header/HeaderTest.*
    rm -f src/components/MovieSlider/MovieSliderTest.jsx
    rm -f src/data/testing.json
    rm -f test-import.js
    rm -f public/test-routes.html
    
    # Xóa dist folder
    echo "Đang xóa dist folder..."
    rm -rf dist/
    
    echo "✅ Giai đoạn 1 cleanup hoàn tất!"
    echo "📊 Ước tính tiết kiệm: ~150-200KB + 2-5MB dist"
    echo ""
    echo "⚠️  LƯU Ý: Hãy test lại ứng dụng và kiểm tra router.jsx"
    echo "📝 Xem chi tiết tại: CLEANUP_ANALYSIS.md"
    
else
    echo "❌ Cleanup đã bị hủy. Files backup vẫn được giữ tại: $BACKUP_DIR"
fi
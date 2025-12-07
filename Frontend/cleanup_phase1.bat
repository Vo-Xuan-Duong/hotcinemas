@echo off
REM HotCinemas Cleanup Script for Windows
REM Tạo backup và thực hiện cleanup theo giai đoạn

echo 🎬 HotCinemas System Cleanup Script
echo ==================================

REM Tạo backup trước khi cleanup
set BACKUP_DIR=backup_%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set BACKUP_DIR=%BACKUP_DIR: =0%
echo 📦 Tạo backup tại: %BACKUP_DIR%
mkdir "%BACKUP_DIR%" 2>nul

echo 💾 Đang backup files...

REM Giai đoạn 1: Test & Demo files (HIGH PRIORITY)
mkdir "%BACKUP_DIR%\test_demo_files" 2>nul
mkdir "%BACKUP_DIR%\test_demo_files\pages" 2>nul
mkdir "%BACKUP_DIR%\test_demo_files\components" 2>nul
mkdir "%BACKUP_DIR%\test_demo_files\data" 2>nul

REM Backup test pages
copy "src\pages\AuthDemo.*" "%BACKUP_DIR%\test_demo_files\pages\" >nul 2>&1
copy "src\pages\CarouselDemo.jsx" "%BACKUP_DIR%\test_demo_files\pages\" >nul 2>&1
copy "src\pages\HeaderDemo.*" "%BACKUP_DIR%\test_demo_files\pages\" >nul 2>&1
copy "src\pages\HorizontalDemo.*" "%BACKUP_DIR%\test_demo_files\pages\" >nul 2>&1
copy "src\pages\LoginDemo.jsx" "%BACKUP_DIR%\test_demo_files\pages\" >nul 2>&1
copy "src\pages\ScrollDemo.jsx" "%BACKUP_DIR%\test_demo_files\pages\" >nul 2>&1
copy "src\pages\SwiperDemo.*" "%BACKUP_DIR%\test_demo_files\pages\" >nul 2>&1
copy "src\pages\TestSlider.*" "%BACKUP_DIR%\test_demo_files\pages\" >nul 2>&1
copy "src\pages\FullTest.jsx" "%BACKUP_DIR%\test_demo_files\pages\" >nul 2>&1
copy "src\TestUsers.jsx" "%BACKUP_DIR%\test_demo_files\" >nul 2>&1

REM Backup test components  
copy "src\components\AuthTest.jsx" "%BACKUP_DIR%\test_demo_files\components\" >nul 2>&1
copy "src\components\TestAuth.jsx" "%BACKUP_DIR%\test_demo_files\components\" >nul 2>&1
copy "src\components\Header\HeaderTest.*" "%BACKUP_DIR%\test_demo_files\components\" >nul 2>&1
copy "src\components\MovieSlider\MovieSliderTest.jsx" "%BACKUP_DIR%\test_demo_files\components\" >nul 2>&1

REM Backup test data
copy "src\data\testing.json" "%BACKUP_DIR%\test_demo_files\data\" >nul 2>&1

REM Backup root test files
copy "test-import.js" "%BACKUP_DIR%\test_demo_files\" >nul 2>&1
copy "public\test-routes.html" "%BACKUP_DIR%\test_demo_files\" >nul 2>&1

echo ✅ Backup hoàn tất tại: %BACKUP_DIR%
echo.
echo 🗑️ Bạn có muốn tiếp tục với việc xóa files không? (y/n)
set /p response=

if /i "%response%"=="y" (
    echo 🧹 Bắt đầu cleanup...
    
    REM Xóa test ^& demo files
    echo Đang xóa test/demo files...
    del /f /q "src\pages\AuthDemo.*" >nul 2>&1
    del /f /q "src\pages\CarouselDemo.jsx" >nul 2>&1
    del /f /q "src\pages\HeaderDemo.*" >nul 2>&1
    del /f /q "src\pages\HorizontalDemo.*" >nul 2>&1
    del /f /q "src\pages\LoginDemo.jsx" >nul 2>&1
    del /f /q "src\pages\ScrollDemo.jsx" >nul 2>&1
    del /f /q "src\pages\SwiperDemo.*" >nul 2>&1
    del /f /q "src\pages\TestSlider.*" >nul 2>&1
    del /f /q "src\pages\FullTest.jsx" >nul 2>&1
    del /f /q "src\TestUsers.jsx" >nul 2>&1
    del /f /q "src\components\AuthTest.jsx" >nul 2>&1
    del /f /q "src\components\TestAuth.jsx" >nul 2>&1
    del /f /q "src\components\Header\HeaderTest.*" >nul 2>&1
    del /f /q "src\components\MovieSlider\MovieSliderTest.jsx" >nul 2>&1
    del /f /q "src\data\testing.json" >nul 2>&1
    del /f /q "test-import.js" >nul 2>&1
    del /f /q "public\test-routes.html" >nul 2>&1
    
    REM Xóa dist folder
    echo Đang xóa dist folder...
    rmdir /s /q "dist" >nul 2>&1
    
    echo ✅ Giai đoạn 1 cleanup hoàn tất!
    echo 📊 Ước tính tiết kiệm: ~150-200KB + 2-5MB dist
    echo.
    echo ⚠️  LƯU Ý: Hãy test lại ứng dụng và kiểm tra router.jsx
    echo 📝 Xem chi tiết tại: CLEANUP_ANALYSIS.md
    
) else (
    echo ❌ Cleanup đã bị hủy. Files backup vẫn được giữ tại: %BACKUP_DIR%
)

pause
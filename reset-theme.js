// Script để reset theme về light mode
// Chạy trong browser console hoặc thêm vào index.html tạm thời

// Xóa theme cũ từ localStorage
localStorage.removeItem('theme');

// Set theme mặc định là light
localStorage.setItem('theme', 'light');

// Reload trang để áp dụng
window.location.reload();

console.log('Theme đã được reset về light mode');
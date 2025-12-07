import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  server: {
    // Cho phép tất cả các host (Dùng cách này tiện nhất khi xài ngrok vì link đổi liên tục)
    allowedHosts: true, 
    
    // HOẶC nếu bạn muốn chỉ định rõ domain (bảo mật hơn nhưng phải đổi mỗi khi tắt ngrok):
    // allowedHosts: ['botchily-radiotelegraphic-ezequiel.ngrok-free.dev'],
  },
})

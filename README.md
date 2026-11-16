# AnimeVietsub Stremio/Nuvio Addon

Addon xem anime Vietsub từ nguồn `animevietsub.best` dành cho Stremio và Nuvio.

## Cách cài đặt lên Render (Không cần cài Node.js)
1. Tải toàn bộ thư mục này lên một Repository mới trên GitHub.
2. Truy cập [Render](https://dashboard.render.com/), chọn **New +** -> **Web Service**.
3. Kết nối Repository GitHub vừa tạo.
4. Cấu hình:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Sau khi deploy xong, copy URL của bạn và thêm `/manifest.json` vào cuối (ví dụ: `https://your-app.onrender.com/manifest.json`) để cài vào Stremio hoặc Nuvio.

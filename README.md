# 🇻🇳 EduSpark — Nền Tảng Tự Học & Ôn Tập Tiếng Việt Tại Nhà

> **Nền tảng học tập Gamified dành cho học sinh Cấp 1 & Cấp 2** kết nối chặt chẽ giữa Cô giáo và Học sinh, rèn luyện 100% chuyên biệt môn Tiếng Việt mỗi tối tại nhà.

---

## ✨ Tính Năng Nổi Bật

### 👧 Dành Cho Học Sinh (Tự Học Tại Nhà)
- **Đăng nhập 1-chạm không cần mật khẩu**: Dán thẻ QR của cô giáo ở góc bàn học, quét mã là vào học ngay.
- **Ôn đúng bài cô giao**: Nhận diện ngay chuyên đề cô đang phân công trên đầu trang chủ.
- **8 Mini-Game Gamified Thuần Tiếng Việt**:
  1. ⚡ **Vua Tiếng Việt**: Quiz phản xạ kiến thức theo từng chuyên đề.
  2. 🧺 **Kéo Thả Từ Loại**: Phân loại danh từ/động từ/tính từ, từ đơn/ghép/láy, tu từ so sánh/nhân hóa.
  3. ✍️ **Bắt Chữ Hoàn Câu**: Sắp xếp trật tự từ ngữ theo đúng ngữ pháp câu tiếng Việt.
  4. 🔗 **Nối Cột Từ Ngữ Laser**: Cặp từ đồng nghĩa - trái nghĩa, thành ngữ tục ngữ dân gian.
  5. 🔤 **Thánh Chính Tả**: Ghép chữ chuẩn quy tắc chính tả (*tr/ch, s/x, d/gi/r*).
  6. ❓ **Đúng Hay Sai Tiếng Việt**: Thử thách 10 giây phản xạ ngữ pháp và câu cú.
  7. 🃏 **Lật Thẻ Ghép Đôi Từ Ngữ**: Rèn luyện trí nhớ và mối liên hệ ngữ nghĩa.
  8. 🎡 **Vòng Quay Tri Thức**: Điểm danh mỗi ngày, thử thách câu hỏi ngắn và mở rương thưởng.
- **📖 Sổ Tay Ngôn Từ Của Em**: Tự động lưu trữ từ vựng, mẹo chính tả và câu văn hay tích lũy từ các bài học.
- **Hệ thống Gamification**: Điểm thưởng XP, chuỗi ngày học tập (Streak), tủ đồ đổi Avatar & Bảng vàng vinh danh.

### 👩‍🏫 Dành Cho Giáo Viên (Quản Lý & Soạn Bài)
- **Studio Soạn Đề Theo Chuyên Đề**: Tạo chuyên đề mới, biên tập câu hỏi thủ công hoặc dùng **AI 1-click** để sinh câu hỏi trắc nghiệm tiếng Việt kèm lời giải chi tiết.
- **1-Click Giao Bài Cho Cả Lớp**: Kích hoạt chuyên đề để hiển thị trực tiếp lên tài khoản học sinh ở nhà.
- **Quản Lý Học Sinh & In Thẻ QR**: Thêm học sinh, nhập file Excel/CSV, in hàng loạt thẻ học sinh có mã QR kèm thông tin lớp.
- **Quản Trị CSDL MySQL XAMPP 1-Click**: Khởi tạo database `eduspark_db` và đồng bộ dữ liệu ngay từ giao diện web.

---

## 🗄️ Hướng Dẫn Cấu Hình Cơ Sở Dữ Liệu XAMPP (Localhost MySQL)

Dự án sử dụng cơ sở dữ liệu **MySQL cục bộ trên máy tính thông qua XAMPP**, hoàn toàn không cần thuê hosting hay cloud database:

### Bước 1: Khởi động MySQL trong XAMPP
1. Mở ứng dụng **XAMPP Control Panel**.
2. Bấm nút **Start** ở dòng **MySQL** (cổng mặc định: `3306`).
*(Có thể bấm Start thêm **Apache** nếu muốn truy cập phpMyAdmin tại `http://localhost/phpmyadmin`)*.

### Bước 2: Khởi tạo Cơ sở dữ liệu (2 Cách)
- **Cách 1 (Nhanh nhất - 1 Click từ Web)**:
  - Mở cổng giáo viên `http://localhost:3000/teacher` (hoặc cổng 3030).
  - Bấm nút **"Khởi Tạo / Cập Nhật CSDL"** tại thanh trạng thái MySQL. Hệ thống sẽ tự động tạo database `eduspark_db`, tạo 5 bảng quan hệ và nạp sẵn toàn bộ dữ liệu mẫu Tiếng Việt!
- **Cách 2 (Qua phpMyAdmin)**:
  - Truy cập `http://localhost/phpmyadmin`.
  - Chọn thẻ **Import** (Nhập).
  - Chọn file `database/schema.sql` trong thư mục dự án và bấm **Import**.

### Cấu hình file `.env.local`
File cấu hình mặc định đã được tạo sẵn trong dự án:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=eduspark_db
```

---

## 🚀 Khởi Chạy Ứng Dụng

```bash
# 1. Cài đặt các gói thư viện
npm install

# 2. Khởi chạy máy chủ phát triển
npm run dev

# 3. Hoặc chạy bản build sản xuất
npm run build
npm start
```

Mở trình duyệt và truy cập:
- **Giao diện Học sinh**: `http://localhost:3000` (hoặc `http://localhost:3030`)
- **Cổng Giáo viên**: `http://localhost:3000/teacher` (hoặc `http://localhost:3030/teacher`)

---

## 🛠️ Công Nghệ Sử Dụng
- **Database**: MySQL 8.x / MariaDB (XAMPP Localhost) qua thư viện `mysql2/promise`
- **Framework**: Next.js 14 (App Router) + React
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS, CSS Animations
- **Icons**: Lucide React
- **Hiệu ứng**: Canvas Confetti, Web Audio API Sound Effects


---
*Phát triển bởi đội ngũ EduSpark 2026 — Đổi mới phương pháp tự học Tiếng Việt tại nhà cho trẻ em Việt Nam.*


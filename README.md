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
- **Quản Trị CSDL SQLite Cục Bộ Tự Động**: Lưu trữ vào tệp `database/eduspark.db`, không cần cài thêm app ngoài.

---

## 🗄️ Cơ Sở Dữ Liệu SQLite Cục Bộ (Zero-Config, Không Cần Cài XAMPP)

Dự án sử dụng cơ sở dữ liệu **SQLite nhúng cục bộ** (`better-sqlite3`), mang lại sự tiện lợi tối đa:

- ✅ **Không cần cài XAMPP hay bất kỳ phần mềm máy chủ nào ở ngoài.**
- ✅ Toàn bộ dữ liệu học sinh, điểm XP, ngân hàng câu hỏi Tiếng Việt và Sổ tay ngôn từ được lưu trữ trực tiếp vào tệp **`database/eduspark.db`** ngay trong thư mục dự án.
- ✅ Tệp CSDL và toàn bộ dữ liệu mẫu Tiếng Việt **tự động khởi tạo ngay khi bạn chạy ứng dụng lần đầu tiên**.
- ✅ Dễ dàng sao chép thư mục dự án sang bất kỳ máy tính nào khác hoặc chia sẻ cho bạn bè, mở lên là chạy được ngay mà không cần cấu hình phức tạp.

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


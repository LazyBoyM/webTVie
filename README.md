# 🇻🇳 EduSpark — Nền Tảng Tự Học & Ôn Tập Tiếng Việt Tại Nhà

> **Nền tảng học tập Gamified dành cho học sinh Cấp 1 & Cấp 2** kết nối chặt chẽ giữa Cô giáo và Học sinh, rèn luyện 100% chuyên biệt môn Tiếng Việt mỗi tối tại nhà.

---

## ✨ Tính Năng Nổi Bật

### 👧 Dành Cho Học Sinh (Tự Học Tại Nhà)
- **Đăng nhập 1-chạm không cần mật khẩu**: Dán thẻ QR của cô giáo ở góc bàn học, quét mã là vào học ngay.
- **Ôn đúng bài cô giao**: Nhận diện ngay chuyên đề cô đang phân công trên đầu trang chủ.
- **6 Mini-Game Gamified Thuần Tiếng Việt**:
  1. ⚡ **Vua Tiếng Việt**: Quiz phản xạ kiến thức theo từng chuyên đề.
  2. 🧺 **Kéo Thả Từ Loại**: Phân loại danh từ/động từ/tính từ, từ đơn/ghép/láy, tu từ so sánh/nhân hóa.
  3. 🔗 **Nối Cột Từ Ngữ Laser**: Cặp từ đồng nghĩa - trái nghĩa, thành ngữ tục ngữ dân gian, từ Hán - Việt.
  4. 🔤 **Thánh Chính Tả**: Ghép chữ chuẩn quy tắc chính tả (*tr/ch, s/x, d/gi/r*).
  5. ❓ **Đúng Hay Sai Tiếng Việt**: Thử thách 45 giây phản xạ ngữ pháp và dấu câu.
  6. 🃏 **Lật Thẻ Ghép Đôi Từ Ngữ**: Rèn luyện trí nhớ từ ngữ lâu dài.
- **Hệ thống Gamification**: Điểm thưởng XP, chuỗi ngày học tập (Streak), tủ đồ đổi Avatar linh vật & Huy hiệu danh dự.

### 👩‍🏫 Dành Cho Giáo Viên (Quản Lý & Soạn Bài)
- **Studio Soạn Đề Theo Chuyên Đề**: Tạo chuyên đề mới, biên tập câu hỏi thủ công hoặc dùng **AI 1-click** để sinh câu hỏi trắc nghiệm tiếng Việt kèm lời giải chi tiết.
- **1-Click Giao Bài Cho Cả Lớp**: Kích hoạt chuyên đề để hiển thị trực tiếp lên tài khoản học sinh ở nhà.
- **Quản Lý Học Sinh & In Thẻ QR**: Thêm học sinh, nhập file Excel/CSV, in hàng loạt thẻ học sinh có mã QR kèm thông tin lớp.
- **Báo Cáo Tiến Độ**: Xuất file Excel tổng hợp điểm số, thời gian học và tỷ lệ hoàn thành.

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu Cầu
- Node.js 18+ trở lên
- Trình quản lý gói `npm` hoặc `yarn`

### Cài Đặt
```bash
# 1. Cài đặt các gói thư viện
npm install

# 2. Khởi chạy máy chủ phát triển (mặc định cổng 3030 hoặc 3000)
npm run dev

# 3. Hoặc chạy bản build tối ưu
npm run build
npm start
```

Mở trình duyệt và truy cập:
- **Giao diện Học sinh**: `http://localhost:3000` (hoặc `http://localhost:3030`)
- **Cổng Giáo viên**: `http://localhost:3000/teacher` (hoặc `http://localhost:3030/teacher`)

---

## 🛠️ Công Nghệ Sử Dụng
- **Framework**: Next.js 14 (App Router) + React 19
- **Ngôn ngữ**: TypeScript
- **Styling**: Tailwind CSS, CSS Animations, Glassmorphism
- **Icons**: Lucide React
- **Hiệu ứng**: Canvas Confetti, Web Audio API Sound Effects

---
*Phát triển bởi đội ngũ EduSpark 2026 — Đổi mới phương pháp tự học Tiếng Việt tại nhà cho trẻ em Việt Nam.*


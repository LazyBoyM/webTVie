# 🇻🇳 EduSpark — Nền Tảng Tự Học & Ôn Tập Tiếng Việt

Ứng dụng ôn tập tiếng Việt tiểu học với trò chơi tương tác, bảng vàng thi đua và cổng quản trị dành cho giáo viên.

---

## 🔑 Danh Sách Tài Khoản Đăng Nhập

### 👩‍🏫 1. Tài Khoản Cô Giáo (Quản trị lớp & soạn bài)
* **Email:** `giaovien@gmail.com`
* **Mật khẩu:** `teacher123`
* **Cách vào:** Chọn tab **"Cô Giáo"** tại hộp đăng nhập hoặc truy cập trực tiếp đường dẫn `/teacher` (hỗ trợ nút đăng nhập nhanh 1-Click).
* **Tính năng:**
  * Bấm **"✏️ Đổi Thông Tin Cô Giáo"** để tự nhập tên cô, tên trường và lớp chủ nhiệm.
  * Xem danh sách lớp, sửa tên học sinh hoặc thêm/xóa học sinh.
  * Soạn đề ôn tập và thêm câu hỏi trắc nghiệm mới vào hệ thống.

---

### 🎒 2. 3 Tài Khoản Học Sinh (Làm bài, chơi game & tích lũy XP)

| STT | Mã Học Sinh (ID) | Tên Mặc Định | Mã PIN | Điểm Ban Đầu | Avatar |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | **`HS01`** | Học Sinh 1 | `1234` | 0 XP (Cấp 1) | 🦊 |
| 2 | **`HS02`** | Học Sinh 2 | `1234` | 0 XP (Cấp 1) | 🐼 |
| 3 | **`HS03`** | Học Sinh 3 | `1234` | 0 XP (Cấp 1) | 🐰 |

> 💡 **Cách tự đổi tên học sinh:**
> 1. Đăng nhập vào tài khoản **Cô Giáo** ➔ Vào mục **"3. Quản Lý Học Sinh"**.
> 2. Bấm vào biểu tượng cây bút **✏️ (Sửa tên)** bên cạnh học sinh cần đổi (ví dụ: đổi thành tên học sinh thật trong lớp).
> 3. Tên mới sẽ tự động cập nhật ngay trên toàn bộ giao diện học sinh và bảng vàng.
> 4. Có thể bấm **"+ Thêm Học Sinh Mới"** để tạo thêm học sinh bất kỳ.

---

## 🚀 Khởi Chạy Ứng Dụng Tại Máy Cục Bộ

```bash
# 1. Cài đặt thư viện (nếu chưa cài)
npm install

# 2. Chạy máy chủ phát triển
npm run dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Triển Khai Link Dùng 24/7 Miễn Phí (Vercel)

1. Đẩy mã nguồn lên GitHub:
   ```bash
   git push origin main
   ```
2. Truy cập [https://vercel.com](https://vercel.com) ➔ Chọn **"Continue with GitHub"**.
3. Bấm **"Add New..."** ➔ **"Project"** ➔ Chọn repo **`webTVie`** ➔ Bấm **"Deploy"**.
4. Vercel sẽ tự động cấp một đường link cố định 24/7 (ví dụ: `https://webtvie.vercel.app`) dùng được trên mọi thiết bị.
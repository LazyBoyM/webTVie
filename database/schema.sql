-- ====================================================================
-- EDUSPARK - CƠ SỞ DỮ LIỆU ÔN TẬP TIẾNG VIỆT (DÀNH CHO XAMPP MYSQL)
-- Bảng mã: utf8mb4 / utf8mb4_unicode_ci (Hỗ trợ hoàn hảo tiếng Việt có dấu)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `eduspark_db` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `eduspark_db`;

-- 1. BẢNG HỌC SINH (students)
CREATE TABLE IF NOT EXISTS `students` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `grade` INT DEFAULT 4,
  `avatar` VARCHAR(255) DEFAULT '🦊',
  `xp` INT DEFAULT 0,
  `streak` INT DEFAULT 1,
  `gems` INT DEFAULT 100,
  `stars` INT DEFAULT 10,
  `level` INT DEFAULT 1,
  `last_active` VARCHAR(50) DEFAULT 'Hôm nay',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG CHỦ ĐỀ TIẾNG VIỆT (topics)
CREATE TABLE IF NOT EXISTS `topics` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `grade` INT DEFAULT 4,
  `total_questions` INT DEFAULT 10,
  `icon` VARCHAR(10) DEFAULT '📖',
  `description` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG NGÂN HÀNG CÂU HỎI TIẾNG VIỆT (questions)
CREATE TABLE IF NOT EXISTS `questions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `subject` VARCHAR(50) DEFAULT 'tieng-viet',
  `grade` INT DEFAULT 4,
  `topic` VARCHAR(150) NOT NULL,
  `topic_id` VARCHAR(50) DEFAULT 'topic_tu_loai',
  `question` TEXT NOT NULL,
  `options` TEXT NOT NULL, -- Định dạng JSON Array: ["A", "B", "C", "D"]
  `correct_index` INT NOT NULL,
  `explanation` TEXT,
  `difficulty` ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`topic_id`) REFERENCES `topics`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG SỔ TAY NGÔN TỪ CỦA EM (vocabulary_notes)
CREATE TABLE IF NOT EXISTS `vocabulary_notes` (
  `id` VARCHAR(50) PRIMARY KEY,
  `word` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL, -- Từ loại, Chính tả, Thành ngữ, Từ đồng nghĩa
  `definition` TEXT NOT NULL,
  `example_sentence` TEXT,
  `date_learned` VARCHAR(50) DEFAULT 'Hôm nay',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG NHIỆM VỤ / BÀI TẬP VỀ NHÀ (assignments)
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` VARCHAR(50) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `grade` INT DEFAULT 4,
  `topic_id` VARCHAR(50) DEFAULT 'topic_tu_loai',
  `question_count` INT DEFAULT 10,
  `due_date` VARCHAR(50) NOT NULL,
  `status` ENUM('active', 'completed', 'draft') DEFAULT 'active',
  `completion_rate` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- NẠP DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ====================================================================

-- Dữ liệu mẫu Chủ đề
INSERT IGNORE INTO `topics` (`id`, `name`, `grade`, `total_questions`, `icon`, `description`) VALUES
('topic_tu_loai', 'Danh từ, Động từ & Tính từ', 4, 15, '🏷️', 'Nhận diện và phân loại từ loại trong câu Tiếng Việt'),
('topic_chinh_ta', 'Quy Tắc Chính Tả & Dấu Câu', 4, 12, '✍️', 'Rèn luyện phân biệt tr/ch, s/x, d/r/gi và quy tắc đặt dấu câu'),
('topic_thanh_ngu', 'Thành Ngữ & Tục Ngữ Dân Gian', 4, 10, '🎋', 'Khám phá kho tàng thành ngữ, ca dao tục ngữ Việt Nam'),
('topic_tu_dong_nghia', 'Từ Đồng Nghĩa & Trái Nghĩa', 5, 12, '🔄', 'Mở rộng vốn từ ngữ và cách lựa chọn từ chính xác'),
('topic_tu_tu', 'Biện Pháp Tu Từ (So Sánh, Nhân Hóa)', 5, 8, '✨', 'Cảm thụ cái hay cái đẹp của ngôn từ trong văn học');

-- Dữ liệu mẫu Học sinh
INSERT IGNORE INTO `students` (`id`, `name`, `grade`, `avatar`, `xp`, `streak`, `gems`, `stars`, `level`, `last_active`) VALUES
('stu_1', 'Nguyễn Minh Anh', 4, '🦊', 2450, 14, 320, 85, 8, 'Hôm nay'),
('stu_2', 'Trần Bảo Nam', 4, '🐼', 2180, 10, 280, 72, 7, 'Hôm nay'),
('stu_3', 'Lê Quỳnh Chi', 4, '🐱', 1950, 7, 210, 65, 6, 'Hôm qua'),
('stu_4', 'Phạm Đức Huy', 5, '🦁', 1720, 5, 180, 54, 5, '2 ngày trước'),
('stu_5', 'Hoàng Mai Linh', 5, '🐰', 1490, 4, 150, 48, 4, 'Hôm nay');

-- Dữ liệu mẫu Ngân hàng câu hỏi
INSERT IGNORE INTO `questions` (`id`, `subject`, `grade`, `topic`, `topic_id`, `question`, `options`, `correct_index`, `explanation`, `difficulty`) VALUES
('vn_q1', 'tieng-viet', 4, 'Danh từ, Động từ & Tính từ', 'topic_tu_loai', 'Từ nào dưới đây là Danh từ chỉ đồ vật phục vụ học tập?', '["Bút chì", "Chạy nhảy", "Xanh biếc", "Thông minh"]', 0, 'Bút chì là danh từ chỉ đồ vật học tập. Chạy nhảy là động từ, Xanh biếc và Thông minh là tính từ.', 'easy'),
('vn_q2', 'tieng-viet', 4, 'Danh từ, Động từ & Tính từ', 'topic_tu_loai', 'Trong câu: "Mặt trời tỏa ánh nắng rực rỡ xuống cánh đồng", từ nào là Tính từ?', '["Mặt trời", "Tỏa", "Rực rỡ", "Cánh đồng"]', 2, 'Rực rỡ là tính từ chỉ đặc điểm mức độ sáng mạnh của ánh nắng.', 'easy'),
('vn_q3', 'tieng-viet', 4, 'Quy Tắc Chính Tả & Dấu Câu', 'topic_chinh_ta', 'Chọn cách viết đúng chính tả trong các từ sau:', '["Chân thật", "Trân thật", "Chân thực", "Cả A và C đều đúng"]', 3, 'Cả chân thật và chân thực đều là từ ngữ đúng chuẩn chính tả tiếng Việt.', 'medium'),
('vn_q4', 'tieng-viet', 4, 'Thành Ngữ & Tục Ngữ Dân Gian', 'topic_thanh_ngu', 'Hoàn thành câu thành ngữ: "Học thầy không tày học ..."', '["Sách", "Bạn", "Trường", "Mẹ"]', 1, 'Học thầy không tày học bạn đề cao việc học hỏi từ bạn bè đồng trang lứa.', 'easy'),
('vn_q5', 'tieng-viet', 5, 'Từ Đồng Nghĩa & Trái Nghĩa', 'topic_tu_dong_nghia', 'Từ nào dưới đây KHÔNG đồng nghĩa với từ "bao la"?', '["Bát ngát", "Mênh mông", "Thênh thang", "Chật hẹp"]', 3, 'Chật hẹp là từ trái nghĩa với bao la, mênh mông.', 'easy'),
('vn_q6', 'tieng-viet', 5, 'Biện Pháp Tu Từ (So Sánh, Nhân Hóa)', 'topic_tu_tu', 'Câu thơ nào dưới đây sử dụng phép nhân hóa?', '["Trăng tròn như quả bóng", "Bác đồng hồ chăm chỉ chạy từng giây", "Cánh đồng vàng rực rỡ", "Mặt hồ phẳng như gương"]', 1, 'Gọi đồng hồ là Bác và gán hành động chăm chỉ là biện pháp nhân hóa.', 'medium');

-- Dữ liệu mẫu Sổ tay ngôn từ
INSERT IGNORE INTO `vocabulary_notes` (`id`, `word`, `category`, `definition`, `example_sentence`, `date_learned`) VALUES
('vocab_1', 'Cần cù bù thông minh', 'Thành ngữ', 'Sự chăm chỉ, kiên trì và nỗ lực có thể bù đắp cho những thiếu hụt về năng khiếu ban đầu.', 'Bạn ấy luôn tin rằng cần cù bù thông minh nên ngày nào cũng chăm chỉ làm bài.', 'Hôm nay'),
('vocab_2', 'Bao la', 'Từ đồng nghĩa', 'Rộng lớn vô cùng, không gian trải rộng tầm mắt (đồng nghĩa với bát ngát, mênh mông).', 'Cánh đồng lúa chín bao la bát ngát dưới nắng hè.', 'Hôm nay'),
('vocab_3', 'Chăm chỉ / Siêng năng', 'Từ loại', 'Tính từ chỉ đức tính kiên trì, nỗ lực hết mình trong học tập và lao động.', 'Minh là một học sinh rất chăm chỉ và chu đáo.', 'Hôm qua'),
('vocab_4', 'Sắp xếp vs Xắp xếp', 'Chính tả', 'Từ đúng chuẩn chính tả là \"Sắp xếp\" (âm s), không dùng \"xắp xếp\".', 'Chúng em cùng nhau sắp xếp lại kệ sách lớp học ngăn nắp.', '3 ngày trước');

-- Dữ liệu mẫu Nhiệm vụ bài tập
INSERT IGNORE INTO `assignments` (`id`, `title`, `grade`, `topic_id`, `question_count`, `due_date`, `status`, `completion_rate`) VALUES
('asg_1', 'Phiếu ôn tập: Nhận diện Danh từ - Động từ - Tính từ', 4, 'topic_tu_loai', 10, 'Tối nay (21:00)', 'active', 85),
('asg_2', 'Thử thách cuối tuần: Phân biệt chính tả ch/tr và s/x', 4, 'topic_chinh_ta', 12, 'Chủ Nhật (22:00)', 'active', 60),
('asg_3', 'Rèn luyện thành ngữ & giải nghĩa ca dao dân gian', 4, 'topic_thanh_ngu', 8, 'Hết hạn', 'completed', 95);

export interface VietnameseTopic {
  id: string;
  name: string;
  category: "tu-loai" | "cau-tao-tu" | "chinh-ta" | "tu-tu" | "thanh-ngu" | "cau-dau-cau" | "doc-hieu";
  categoryName: string;
  grade: number;
  description: string;
  isActive: boolean;
  icon: string;
  questionCount?: number;
}

export const SAMPLE_VIETNAMESE_TOPICS: VietnameseTopic[] = [
  {
    id: "topic_tu_loai",
    name: "Danh Từ, Động Từ & Tính Từ",
    category: "tu-loai",
    categoryName: "Từ Loại",
    grade: 4,
    description: "Nhận biết và phân biệt các từ chỉ sự vật, hoạt động, đặc điểm tính chất.",
    isActive: true,
    icon: "🏛️",
    questionCount: 8,
  },
  {
    id: "topic_dong_nghia",
    name: "Từ Đồng Nghĩa & Từ Trái Nghĩa",
    category: "cau-tao-tu",
    categoryName: "Cấu Tạo Từ",
    grade: 5,
    description: "Mở rộng vốn từ với các cặp từ cùng nghĩa hoặc đối lập nghĩa trong ngữ cảnh.",
    isActive: false,
    icon: "🔄",
    questionCount: 6,
  },
  {
    id: "topic_chinh_ta",
    name: "Chính Tả: Phân Biệt tr/ch, s/x & Dấu Hỏi/Ngã",
    category: "chinh-ta",
    categoryName: "Chính Tả Tiếng Việt",
    grade: 4,
    description: "Rèn luyện quy tắc chính tả, sửa lỗi phát âm và viết đúng chuẩn tiếng Việt.",
    isActive: false,
    icon: "✍️",
    questionCount: 6,
  },
  {
    id: "topic_tu_tu",
    name: "Biện Pháp Tu Từ: So Sánh & Nhân Hóa",
    category: "tu-tu",
    categoryName: "Biện Pháp Nghệ Thuật",
    grade: 4,
    description: "Cảm thụ vẻ đẹp của phép so sánh ngang bằng/không ngang bằng và nhân hóa sự vật.",
    isActive: false,
    icon: "🌸",
    questionCount: 5,
  },
  {
    id: "topic_thanh_ngu",
    name: "Thành Ngữ & Ca Dao Tục Ngữ Dân Gian",
    category: "thanh-ngu",
    categoryName: "Thành Ngữ & Tục Ngữ",
    grade: 4,
    description: "Hiểu sâu lời hay ý đẹp, bài học đạo đức qua kho tàng ca dao tục ngữ Việt Nam.",
    isActive: false,
    icon: "📜",
    questionCount: 6,
  },
  {
    id: "topic_cau_ghep",
    name: "Câu Đơn, Câu Ghép & Quy Tắc Dấu Câu",
    category: "cau-dau-cau",
    categoryName: "Câu & Dấu Câu",
    grade: 5,
    description: "Nối các vế câu ghép bằng quan hệ từ, sử dụng đúng dấu phẩy, dấu chấm phẩy.",
    isActive: false,
    icon: "📝",
    questionCount: 5,
  },
];

export interface Question {
  id: string;
  subject: "toan" | "tieng-viet" | "tieng-anh" | "khoa-hoc";
  grade: number; // 1 to 9
  topic: string;
  topicId?: string; // Links to VietnameseTopic.id
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface StudentProfile {
  studentId: string; // e.g. "HS01"
  pin: string;
  name: string;
  avatar: string;
  className: string;
  grade: number;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  completedQuizzes: number;
  accuracy: number;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

export const BADGES: Badge[] = [
  { id: "first_quiz", title: "Khởi Đầu Tươi Sáng", icon: "🌱", description: "Hoàn thành bài tập thử thách đầu tiên", color: "from-green-400 to-emerald-600" },
  { id: "streak_3", title: "Lửa Chiến Binh", icon: "🔥", description: "Duy trì chuỗi học tập 3 ngày liên tiếp", color: "from-amber-400 to-orange-600" },
  { id: "streak_7", title: "Siêu Siêng Năng", icon: "⚡", description: "Học tập kiên trì suốt 7 ngày liên tiếp", color: "from-yellow-400 to-amber-600" },
  { id: "vietnamese_master", title: "Trạng Nguyên Tiếng Việt", icon: "👑", description: "Đạt điểm tuyệt đối 10 câu Tiếng Việt liên tiếp", color: "from-amber-400 to-yellow-600" },
  { id: "speed_king", title: "Chớp Mắt Thần Tốc", icon: "🚀", description: "Trả lời đúng trong vòng dưới 3 giây", color: "from-purple-400 to-pink-600" },
  { id: "perfect_score", title: "Ngôi Sao Hoàn Hảo", icon: "⭐", description: "Đạt 100% điểm trong bất kỳ bài quiz nào", color: "from-yellow-300 to-yellow-500" },
];

export interface AvatarOption {
  id: string;
  icon: string;
  name: string;
  minXp: number;
  description: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "fox", icon: "🦊", name: "Cáo Thông Thái", minXp: 0, description: "Nhanh nhẹn và thông minh trong mọi thử thách ngôn từ" },
  { id: "panda", icon: "🐼", name: "Gấu Trúc Cần Mẫn", minXp: 0, description: "Kiên trì rèn chữ giữ vở và học bài mỗi ngày" },
  { id: "lion", icon: "🦁", name: "Sư Tử Dũng Mãnh", minXp: 500, description: "Bản lĩnh đứng đầu Bảng Vàng Tiếng Việt" },
  { id: "rabbit", icon: "🐰", name: "Thỏ Siêu Tốc", minXp: 1000, description: "Tốc độ làm bài nhanh như chớp" },
  { id: "tiger", icon: "🐯", name: "Cọp Chiến Binh", minXp: 1500, description: "Chinh phục những bài luyện từ & câu hóc búa nhất" },
  { id: "owl", icon: "🦉", name: "Cú Mèo Tri Thức", minXp: 2000, description: "Bậc thầy am tường thành ngữ và ca dao tục ngữ" },
  { id: "astronaut", icon: "🚀", name: "Phi Hành Gia Nhí", minXp: 3000, description: "Khám phá các chân trời kiến thức vô tận" },
  { id: "wizard", icon: "🧙‍♂️", name: "Pháp Sư Phép Thuật", minXp: 4000, description: "Biến mọi công thức phức tạp thành điều dễ hiểu" },
  { id: "robot", icon: "🤖", name: "Robot Tương Lai", minXp: 5000, description: "Tư duy logic đỉnh cao không tì vết" },
  { id: "unicorn", icon: "🦄", name: "Kỳ Lân Rực Rỡ", minXp: 6000, description: "Sáng tạo và bứt phá trong nghệ thuật & ngôn từ" },
];

export interface DailyQuest {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  icon: string;
  gameType: "speed-quiz" | "sorting-basket" | "laser-match" | "word-scramble" | "true-false" | "memory-flip" | "sentence-builder" | "lucky-wheel";
}

export const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  { id: "quest_1", title: "Vượt qua 1 bài Vua Tiếng Việt", targetCount: 1, currentCount: 0, rewardXp: 60, icon: "⚡", gameType: "speed-quiz" },
  { id: "quest_2", title: "Phân loại 10 từ vào đúng giỏ Từ Loại", targetCount: 1, currentCount: 0, rewardXp: 80, icon: "🧺", gameType: "sorting-basket" },
  { id: "quest_3", title: "Ghép đúng 2 câu hoàn chỉnh trong Bắt Chữ Hoàn Câu", targetCount: 2, currentCount: 0, rewardXp: 75, icon: "✍️", gameType: "sentence-builder" },
  { id: "quest_4", title: "Quay 1 lượt Vòng Quay Tri Thức điểm danh tối", targetCount: 1, currentCount: 0, rewardXp: 50, icon: "🎡", gameType: "lucky-wheel" },
];

export const WORD_SCRAMBLE_WORDS = [
  { word: "DUNGCAM", display: "DŨNG CẢM", hint: "Từ chỉ người gan dạ, không sợ hiểm nguy (phân biệt d/gi/r)", subject: "Tiếng Việt" },
  { word: "CHAMCHI", display: "CHĂM CHỈ", hint: "Đức tính siêng năng, cần cù học bài mỗi ngày", subject: "Tiếng Việt" },
  { word: "TRUNGTHUC", display: "TRUNG THỰC", hint: "Phẩm chất thật thà, không gian dối (phân biệt tr/ch)", subject: "Tiếng Việt" },
  { word: "XANHBIEC", display: "XANH BIẾC", hint: "Từ gợi tả sắc xanh trong trẻo của vòm trời (phân biệt s/x)", subject: "Tiếng Việt" },
  { word: "SUOINGUON", display: "SUỐI NGUỒN", hint: "Nơi khởi nguồn dòng nước ngọt ngào (phân biệt s/x)", subject: "Tiếng Việt" },
  { word: "RUONGDONG", display: "RUỘNG ĐỒNG", hint: "Nơi người nông dân một nắng hai sương cấy lúa", subject: "Tiếng Việt" },
  { word: "HOCTAP", display: "HỌC TẬP", hint: "Hành động tiếp thu kiến thức và rèn luyện đạo đức", subject: "Tiếng Việt" },
  { word: "THONGMINH", display: "THÔNG MINH", hint: "Trí óc sáng suốt, hiểu nhanh và tư duy sâu sắc", subject: "Tiếng Việt" },
];

export const TRUE_FALSE_QUESTIONS = [
  { question: "Từ 'Chạy nhảy' là một Tính từ chỉ cảm xúc vui vẻ.", isTrue: false, explanation: "Sai! 'Chạy nhảy' là Động từ chỉ hoạt động của con người hoặc động vật." },
  { question: "Trong câu: 'Mẹ em là cô giáo', từ 'là' dùng để nối vị ngữ với chủ ngữ.", isTrue: true, explanation: "Đúng! Đây là kiểu câu Ai là gì?" },
  { question: "Từ 'trân thật' viết đúng quy tắc chính tả tiếng Việt.", isTrue: false, explanation: "Sai! Phải viết đúng là 'chân thật' (âm đầu ch)." },
  { question: "Thành ngữ 'Lá lành đùm lá rách' ca ngợi tinh thần tương thân tương ái.", isTrue: true, explanation: "Đúng! Khuyên nhủ con người biết chở che, giúp đỡ lẫn nhau." },
  { question: "Từ 'Bác sĩ' và 'Kĩ sư' đều là các Danh từ chỉ con người và nghề nghiệp.", isTrue: true, explanation: "Đúng! Cả hai từ đều là danh từ chỉ người." },
  { question: "Biện pháp Nhân hóa là gán hành động, cảm xúc con người cho sự vật, loài vật.", isTrue: true, explanation: "Đúng! Đó là định nghĩa chuẩn của phép Nhân hóa trong Tiếng Việt." },
  { question: "Dấu chấm hỏi (?) được dùng ở cuối câu trần thuật kể lại sự việc.", isTrue: false, explanation: "Sai! Dấu chấm hỏi chỉ dùng ở cuối câu hỏi (câu nghi vấn)." },
  { question: "Từ 'Long lanh' và 'Róc rách' là các Từ láy tượng hình và tượng thanh.", isTrue: true, explanation: "Đúng! 'Long lanh' gợi hình ảnh ánh sáng, 'Róc rách' gợi tả âm thanh nước chảy." },
  { question: "Từ 'Can đảm' và 'Nhút nhát' là một cặp từ đồng nghĩa.", isTrue: false, explanation: "Sai! Đây là một cặp từ trái nghĩa hoàn toàn." },
  { question: "Trong câu cảm thán, người ta thường dùng các từ bộc lộ cảm xúc như: 'Ôi!', 'A!', 'Trời ơi!'.", isTrue: true, explanation: "Đúng! Câu cảm thán luôn có các thán từ bộc lộ cảm xúc." },
];

export interface SentenceBuilderItem {
  id: string;
  correctSentence: string;
  shuffledTokens: string[];
  hint: string;
  category: "Từ & Câu" | "Thành Ngữ" | "Biện Pháp Tu Từ";
}

export const SENTENCE_BUILDER_DATA: SentenceBuilderItem[] = [
  {
    id: "sent_1",
    correctSentence: "Em chăm chỉ học bài ở nhà mỗi tối.",
    shuffledTokens: ["ở nhà", "Em", "học bài", "chăm chỉ", "mỗi tối."],
    hint: "Sắp xếp theo thứ tự: Chủ ngữ -> Hoạt động -> Địa điểm -> Thời gian",
    category: "Từ & Câu",
  },
  {
    id: "sent_2",
    correctSentence: "Những bông hoa hồng tỏa hương thơm ngát dưới nắng mai.",
    shuffledTokens: ["dưới nắng mai.", "Những bông", "tỏa hương", "hoa hồng", "thơm ngát"],
    hint: "Miêu tả hương sắc của đóa hoa hồng trong buổi sớm mai",
    category: "Từ & Câu",
  },
  {
    id: "sent_3",
    correctSentence: "Có công mài sắt, có ngày nên kim.",
    shuffledTokens: ["mài sắt,", "Có công", "nên kim.", "có ngày"],
    hint: "Thành ngữ răn dạy lòng kiên trì, bền bỉ vượt khó",
    category: "Thành Ngữ",
  },
  {
    id: "sent_4",
    correctSentence: "Vì trời mưa to nên đường làng trở nên lầy lội.",
    shuffledTokens: ["mưa to", "Vì trời", "đường làng", "nên", "trở nên", "lầy lội."],
    hint: "Cặp quan hệ từ Vì ... nên ... biểu thị quan hệ nguyên nhân - kết quả",
    category: "Từ & Câu",
  },
  {
    id: "sent_5",
    correctSentence: "Bác đồng hồ cần mẫn tích tắc báo từng giây phút.",
    shuffledTokens: ["cần mẫn", "từng giây phút.", "báo", "Bác đồng hồ", "tích tắc"],
    hint: "Câu sử dụng biện pháp Nhân hóa gọi đồng hồ bằng Bác",
    category: "Biện Pháp Tu Từ",
  },
  {
    id: "sent_6",
    correctSentence: "Uống nước nhớ nguồn là truyền thống tốt đẹp của dân tộc.",
    shuffledTokens: ["nhớ nguồn", "Uống nước", "là truyền thống", "của dân tộc.", "tốt đẹp"],
    hint: "Câu tục ngữ nhắc nhở con cháu luôn nhớ về cội nguồn tổ tiên",
    category: "Thành Ngữ",
  },
];

export interface LuckyWheelSector {
  id: string;
  label: string;
  color: string;
  rewardXp: number;
  type: "quiz" | "bonus" | "double";
  description: string;
}

export const LUCKY_WHEEL_SECTORS: LuckyWheelSector[] = [
  { id: "sec_1", label: "Từ Loại +60 XP", color: "#6366f1", rewardXp: 60, type: "quiz", description: "Trả lời câu hỏi Danh/Động/Tính từ để nhận 60 XP" },
  { id: "sec_2", label: "Quà Tặng +50 XP", color: "#10b981", rewardXp: 50, type: "bonus", description: "May mắn nhận ngay 50 XP không cần làm bài!" },
  { id: "sec_3", label: "Chính Tả +80 XP", color: "#f59e0b", rewardXp: 80, type: "quiz", description: "Thử thách tr/ch, s/x để nhận 80 XP" },
  { id: "sec_4", label: "Rương Vàng +100 XP", color: "#ec4899", rewardXp: 100, type: "bonus", description: "Mở Rương Báu Hoàng Gia nhận 100 XP cực lớn!" },
  { id: "sec_5", label: "Ca Dao +70 XP", color: "#8b5cf6", rewardXp: 70, type: "quiz", description: "Điền thành ngữ ca dao để nhận 70 XP" },
  { id: "sec_6", label: "May Mắn +30 XP", color: "#06b6d4", rewardXp: 30, type: "bonus", description: "Nhận 30 XP điểm danh chăm chỉ" },
];

export interface VocabularyItem {
  id: string;
  word: string;
  category: "Từ loại" | "Chính tả" | "Thành ngữ" | "Biện pháp tu từ" | "Từ đồng nghĩa";
  definition: string;
  exampleSentence: string;
  dateLearned: string;
}

export const DEFAULT_VOCABULARY_NOTES: VocabularyItem[] = [
  {
    id: "vocab_1",
    word: "Cần cù",
    category: "Từ đồng nghĩa",
    definition: "Chăm chỉ, siêng năng làm việc hoặc học tập một cách kiên trì, không quản ngại khó khăn.",
    exampleSentence: "Bạn Minh Anh cần cù ôn bài mỗi tối nên đạt điểm 10 môn Tiếng Việt.",
    dateLearned: "Hôm nay",
  },
  {
    id: "vocab_2",
    word: "Lá lành đùm lá rách",
    category: "Thành ngữ",
    definition: "Tinh thần tương thân tương ái, người có điều kiện giúp đỡ người gặp khó khăn hoạn nạn.",
    exampleSentence: "Nhà trường phát động phong trào lá lành đùm lá rách ủng hộ đồng bào bão lũ.",
    dateLearned: "Hôm qua",
  },
  {
    id: "vocab_3",
    word: "Lung linh",
    category: "Từ loại",
    definition: "Từ láy tượng hình gợi tả ánh sáng phản chiếu lấp lánh, rung rinh mềm mại và đẹp mắt.",
    exampleSentence: "Những giọt sương mai đọng trên cánh hoa lung linh dưới ánh nắng sớm.",
    dateLearned: "3 ngày trước",
  },
  {
    id: "vocab_4",
    word: "Chân thật",
    category: "Chính tả",
    definition: "Phân biệt âm đầu ch/tr. 'Chân thật' viết bằng ch, biểu thị sự thật thà, không giả dối.",
    exampleSentence: "Đức tính chân thật luôn được thầy cô và bạn bè tin yêu quý trọng.",
    dateLearned: "4 ngày trước",
  },
];

export const SAMPLE_STUDENTS: StudentProfile[] = [
  {
    studentId: "HS01",
    pin: "1234",
    name: "Nguyễn Gia Bảo",
    avatar: "🦊",
    className: "Lớp 4A",
    grade: 4,
    xp: 2850,
    level: 7,
    streak: 6,
    badges: ["first_quiz", "streak_3", "vietnamese_master", "perfect_score"],
    completedQuizzes: 24,
    accuracy: 92,
  },
  {
    studentId: "HS02",
    pin: "1234",
    name: "Trần Minh Anh",
    avatar: "🐼",
    className: "Lớp 4A",
    grade: 4,
    xp: 3420,
    level: 9,
    streak: 12,
    badges: ["first_quiz", "streak_3", "streak_7", "speed_king", "perfect_score"],
    completedQuizzes: 32,
    accuracy: 96,
  },
  {
    studentId: "HS03",
    pin: "1234",
    name: "Lê Tuấn Kiệt",
    avatar: "🦁",
    className: "Lớp 4A",
    grade: 4,
    xp: 1950,
    level: 5,
    streak: 2,
    badges: ["first_quiz", "streak_3"],
    completedQuizzes: 16,
    accuracy: 84,
  },
  {
    studentId: "HS04",
    pin: "1234",
    name: "Phạm Hà Linh",
    avatar: "🐰",
    className: "Lớp 4A",
    grade: 4,
    xp: 2600,
    level: 6,
    streak: 5,
    badges: ["first_quiz", "streak_3", "perfect_score"],
    completedQuizzes: 20,
    accuracy: 89,
  },
  {
    studentId: "HS05",
    pin: "1234",
    name: "Đỗ Quốc Cường",
    avatar: "🐯",
    className: "Lớp 4A",
    grade: 4,
    xp: 1400,
    level: 4,
    streak: 1,
    badges: ["first_quiz"],
    completedQuizzes: 11,
    accuracy: 78,
  }
];

export const SAMPLE_QUESTIONS: Question[] = [
  // Tiếng Việt Lớp 4 - 5 & THCS
  {
    id: "q1",
    subject: "tieng-viet",
    grade: 4,
    topic: "Từ loại (Danh từ, Động từ, Tính từ)",
    question: "Trong câu: 'Những đóa hoa cúc nở rộ rực rỡ dưới ánh ban mai', từ 'rực rỡ' thuộc từ loại nào?",
    options: ["Danh từ", "Tính từ", "Động từ", "Đại từ"],
    correctIndex: 1,
    explanation: "'Rực rỡ' là tính từ miêu tả màu sắc, ánh sáng tươi sáng và nổi bật.",
    difficulty: "easy"
  },
  {
    id: "q2",
    subject: "tieng-viet",
    grade: 4,
    topic: "Chính tả phân biệt tr/ch, s/x",
    question: "Dòng nào dưới đây gồm các từ viết ĐÚNG chính tả tiếng Việt?",
    options: ["Chân thật, trung thực, sâu sắc", "Trân thật, trung thực, xâu sắc", "Chân thật, chung thực, sâu sắc", "Trân thật, chung thực, xâu sắc"],
    correctIndex: 0,
    explanation: "'Chân thật' viết bằng ch, 'trung thực' viết bằng tr, 'sâu sắc' viết bằng s.",
    difficulty: "medium"
  },
  {
    id: "q3",
    subject: "tieng-viet",
    grade: 4,
    topic: "Biện pháp tu từ: So sánh & Nhân hóa",
    question: "Câu nào dưới đây sử dụng biện pháp tu từ Nhân hóa?",
    options: [
      "Mặt trời như quả cầu lửa khổng lồ",
      "Bác đồng hồ tích tắc báo từng giây từng phút",
      "Dòng sông uốn lượn như một dải lụa đào",
      "Đôi mắt bé tròn xoe như hai hòn bi ve"
    ],
    correctIndex: 1,
    explanation: "Đồng hồ được gọi bằng 'Bác' và có hành động báo giờ như con người.",
    difficulty: "easy"
  },
  {
    id: "q4",
    subject: "tieng-viet",
    grade: 5,
    topic: "Thành ngữ & Tục ngữ dân gian",
    question: "Câu thành ngữ 'Học thầy không tày học bạn' khuyên chúng ta điều gì?",
    options: [
      "Không cần nghe lời thầy cô giáo",
      "Biết khiêm tốn học hỏi bạn bè bè bạn xung quanh",
      "Chỉ nên tự học một mình ở nhà",
      "Học bạn sẽ giỏi hơn thầy"
    ],
    correctIndex: 1,
    explanation: "Câu tục ngữ đề cao việc học hỏi từ bạn bè bè bạn trong cuộc sống và học tập.",
    difficulty: "easy"
  },
  {
    id: "q5",
    subject: "tieng-viet",
    grade: 5,
    topic: "Câu ghép & Cặp quan hệ từ",
    question: "Điền cặp quan hệ từ thích hợp vào câu: '... trời mưa to ... đường làng trở nên lầy lội.'",
    options: ["Vì ... nên ...", "Tuy ... nhưng ...", "Nếu ... thì ...", "Chẳng những ... mà còn ..."],
    correctIndex: 0,
    explanation: "Cặp quan hệ từ 'Vì ... nên ...' biểu thị mối quan hệ nguyên nhân - kết quả.",
    difficulty: "medium"
  },

  // Tiếng Việt
  {
    id: "q6",
    subject: "tieng-viet",
    grade: 4,
    topic: "Từ đồng nghĩa, từ trái nghĩa",
    question: "Từ nào dưới đây đồng nghĩa với từ 'Dũng cảm'?",
    options: ["Can đảm", "Nhút nhát", "Hiền lành", "Chăm chỉ"],
    correctIndex: 0,
    explanation: "'Can đảm' đồng nghĩa với 'Dũng cảm', đều chỉ sự quả cảm, không sợ gian nguy.",
    difficulty: "easy"
  },
  {
    id: "q7",
    subject: "tieng-viet",
    grade: 4,
    topic: "Thành ngữ & Tục ngữ",
    question: "Điền từ thích hợp vào chỗ trống: 'Uống nước nhớ ...'",
    options: ["bến", "nguồn", "sông", "đò"],
    correctIndex: 1,
    explanation: "Câu tục ngữ hoàn chỉnh là: 'Uống nước nhớ nguồn', răn dạy lòng biết ơn.",
    difficulty: "easy"
  },
  {
    id: "q8",
    subject: "tieng-viet",
    grade: 5,
    topic: "Biện pháp tu từ",
    question: "Câu: 'Mặt trời đội biển nhô màu mới' sử dụng biện pháp nghệ thuật nào?",
    options: ["So sánh", "Nhân hóa", "Điệp từ", "Ẩn dụ chuyển đổi cảm giác"],
    correctIndex: 1,
    explanation: "Mặt trời được gán hành động của con người là 'đội biển' -> Biện pháp Nhân hóa.",
    difficulty: "medium"
  },

  // Tiếng Anh
  {
    id: "q9",
    subject: "tieng-anh",
    grade: 4,
    topic: "Vocabulary & Daily Life",
    question: "What animal is known as the 'King of the Jungle'?",
    options: ["Elephant", "Tiger", "Lion", "Monkey"],
    correctIndex: 2,
    explanation: "The Lion (sư tử) is popularly known as the 'King of the Jungle'.",
    difficulty: "easy"
  },
  {
    id: "q10",
    subject: "tieng-anh",
    grade: 5,
    topic: "Grammar & Tenses",
    question: "She usually ______ to school by bus every morning.",
    options: ["go", "goes", "going", "went"],
    correctIndex: 1,
    explanation: "Thì hiện tại đơn với chủ ngữ ngôi thứ 3 số ít 'She' -> động từ thêm 'es' thành 'goes'.",
    difficulty: "easy"
  },

  // Khoa học & Tự nhiên
  {
    id: "q11",
    subject: "khoa-hoc",
    grade: 4,
    topic: "Vật chất và năng lượng",
    question: "Nước chuyển từ thể lỏng sang thể khí được gọi là hiện tượng gì?",
    options: ["Ngưng tụ", "Bay hơi", "Đông đặc", "Nóng chảy"],
    correctIndex: 1,
    explanation: "Quá trình nước chuyển từ thể lỏng sang thể khí (hơi) gọi là sự 'Bay hơi'.",
    difficulty: "easy"
  },
  {
    id: "q12",
    subject: "khoa-hoc",
    grade: 5,
    topic: "Thực vật và động vật",
    question: "Cây xanh quang hợp giải phóng ra khí gì cần thiết cho sự sống của con người?",
    options: ["Khí Cacbonic", "Khí Oxy (Oxygen)", "Khí Nitơ", "Khí Hydro"],
    correctIndex: 1,
    explanation: "Quá trình quang hợp hấp thụ khí Cacbonic và giải phóng ra khí Oxy.",
    difficulty: "easy"
  }
];

// Helper tính Level từ XP
export function calculateLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number; title: string } {
  const levels = [
    { level: 1, requiredXp: 0, title: "Mầm Non Tri Thức" },
    { level: 2, requiredXp: 300, title: "Học Giả Tí Hon" },
    { level: 3, requiredXp: 700, title: "Chiến Binh Sách Vở" },
    { level: 4, requiredXp: 1300, title: "Nhà Thám Hiểm Trẻ" },
    { level: 5, requiredXp: 2000, title: "Dũng Sĩ Kiến Thức" },
    { level: 6, requiredXp: 3000, title: "Cao Thủ Lớp Học" },
    { level: 7, requiredXp: 4500, title: "Bậc Thầy Tranh Biện" },
    { level: 8, requiredXp: 6500, title: "Bác Học Thông Thái" },
    { level: 9, requiredXp: 9000, title: "Huyền Thoại EduSpark" },
  ];

  let current = levels[0];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i].requiredXp) {
      current = levels[i];
      const next = levels[i + 1] || { requiredXp: levels[i].requiredXp + 3000, level: levels[i].level + 1 };
      const currentLevelBase = current.requiredXp;
      const progressInLevel = xp - currentLevelBase;
      const neededForNext = next.requiredXp - currentLevelBase;
      return {
        level: current.level,
        currentXp: progressInLevel,
        nextLevelXp: neededForNext,
        title: current.title,
      };
    }
  }

  return { level: 1, currentXp: xp, nextLevelXp: 300, title: "Mầm Non Tri Thức" };
}

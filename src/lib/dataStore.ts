import {
  StudentProfile,
  SAMPLE_STUDENTS,
  VietnameseTopic,
  SAMPLE_VIETNAMESE_TOPICS,
  Question,
  VocabularyItem,
  DEFAULT_VOCABULARY_NOTES,
} from "./data";

const CLASS_STORAGE_KEY = "eduspark_class_roster";
const TOPICS_STORAGE_KEY = "eduspark_vn_topics";
const QUESTIONS_STORAGE_KEY = "eduspark_vn_questions";

// Initial Vietnamese Questions Seed
export const INITIAL_VIETNAMESE_QUESTIONS: Question[] = [
  // Topic 1: Từ loại
  {
    id: "vn_q1",
    subject: "tieng-viet",
    grade: 4,
    topic: "Danh từ, Động từ & Tính từ",
    topicId: "topic_tu_loai",
    question: "Từ nào dưới đây là Danh từ chỉ đồ vật phục vụ học tập?",
    options: ["Bút chì", "Chạy nhảy", "Xanh biếc", "Thông minh"],
    correctIndex: 0,
    explanation: "'Bút chì' là danh từ chỉ đồ vật học tập. 'Chạy nhảy' là động từ, 'Xanh biếc' và 'Thông minh' là tính từ.",
    difficulty: "easy",
  },
  {
    id: "vn_q2",
    subject: "tieng-viet",
    grade: 4,
    topic: "Danh từ, Động từ & Tính từ",
    topicId: "topic_tu_loai",
    question: "Trong câu 'Bác sĩ ân cần khám bệnh cho em nhỏ', từ nào là Động từ?",
    options: ["Bác sĩ", "Ân cần", "Khám bệnh", "Em nhỏ"],
    correctIndex: 2,
    explanation: "'Khám bệnh' là động từ chỉ hoạt động chữa bệnh của bác sĩ.",
    difficulty: "medium",
  },
  {
    id: "vn_q3",
    subject: "tieng-viet",
    grade: 4,
    topic: "Danh từ, Động từ & Tính từ",
    topicId: "topic_tu_loai",
    question: "Từ nào dưới đây là Tính từ miêu tả vẻ đẹp êm đềm của dòng sông quê hương?",
    options: ["Thơ mộng", "Chảy xuôi", "Con đò", "Bơi lội"],
    correctIndex: 0,
    explanation: "'Thơ mộng' là tính từ gợi tả vẻ đẹp lãng mạn, êm đềm.",
    difficulty: "easy",
  },
  {
    id: "vn_q4",
    subject: "tieng-viet",
    grade: 4,
    topic: "Danh từ, Động từ & Tính từ",
    topicId: "topic_tu_loai",
    question: "Nhóm từ nào sau đây gồm toàn các Danh từ chỉ con người & nghề nghiệp?",
    options: [
      "Cô giáo, bác sĩ, kĩ sư, thợ may",
      "Sách vở, chăm chỉ, giảng bài, lớp học",
      "Đi đứng, bàn ghế, ngôi nhà, bạn bè",
      "Hiền lành, cần cù, tiến sĩ, phi công"
    ],
    correctIndex: 0,
    explanation: "Tất cả các từ trong nhóm: 'Cô giáo, bác sĩ, kĩ sư, thợ may' đều là danh từ chỉ người và nghề nghiệp.",
    difficulty: "medium",
  },

  // Topic 2: Từ đồng nghĩa & Trái nghĩa
  {
    id: "vn_q5",
    subject: "tieng-viet",
    grade: 5,
    topic: "Từ đồng nghĩa & Từ trái nghĩa",
    topicId: "topic_dong_nghia",
    question: "Từ nào dưới đây đồng nghĩa hoàn toàn với từ 'Dũng cảm'?",
    options: ["Can đảm", "Nhút nhát", "Hiền từ", "Cần cù"],
    correctIndex: 0,
    explanation: "'Can đảm' đồng nghĩa với 'Dũng cảm', đều chỉ khí phách không sợ gian nguy, hiểm trở.",
    difficulty: "easy",
  },
  {
    id: "vn_q6",
    subject: "tieng-viet",
    grade: 5,
    topic: "Từ đồng nghĩa & Từ trái nghĩa",
    topicId: "topic_dong_nghia",
    question: "Cặp từ nào dưới đây là cặp từ trái nghĩa chính xác?",
    options: ["Rộng rãi - Hẹp hòi", "Đẹp đẽ - Xinh xắn", "Chăm chỉ - Cần cù", "Yêu thương - Quý mến"],
    correctIndex: 0,
    explanation: "'Rộng rãi' và 'Hẹp hòi' là hai nét tính cách/không gian đối lập trái nghĩa nhau.",
    difficulty: "easy",
  },
  {
    id: "vn_q7",
    subject: "tieng-viet",
    grade: 5,
    topic: "Từ đồng nghĩa & Từ trái nghĩa",
    topicId: "topic_dong_nghia",
    question: "Từ trái nghĩa với từ 'Bình tĩnh' khi đối diện với thử thách là gì?",
    options: ["Hốt hoảng", "Điềm đạm", "Tự tin", "Vững vàng"],
    correctIndex: 0,
    explanation: "'Hốt hoảng' chỉ tâm trạng mất kiểm soát, đối lập hoàn toàn với 'Bình tĩnh'.",
    difficulty: "medium",
  },

  // Topic 3: Chính tả
  {
    id: "vn_q8",
    subject: "tieng-viet",
    grade: 4,
    topic: "Chính tả: Phân biệt tr/ch, s/x & Dấu Hỏi/Ngã",
    topicId: "topic_chinh_ta",
    question: "Từ nào dưới đây được viết ĐÚNG quy tắc chính tả tiếng Việt?",
    options: ["Chân thật", "Trân thật", "Chân thặt", "Trân thặt"],
    correctIndex: 0,
    explanation: "'Chân thật' viết đúng với âm đầu 'ch' (chân thành, chân thật).",
    difficulty: "easy",
  },
  {
    id: "vn_q9",
    subject: "tieng-viet",
    grade: 4,
    topic: "Chính tả: Phân biệt tr/ch, s/x & Dấu Hỏi/Ngã",
    topicId: "topic_chinh_ta",
    question: "Điền chữ cái thích hợp vào chỗ trống: 'Dòng ...ông quê hương nước chảy ...iết'?",
    options: ["s - x", "x - s", "s - s", "x - x"],
    correctIndex: 0,
    explanation: "Viết đúng là 'Dòng sông' (s) và 'chảy xiết' (x) -> s - x.",
    difficulty: "medium",
  },

  // Topic 4: Biện pháp tu từ
  {
    id: "vn_q10",
    subject: "tieng-viet",
    grade: 4,
    topic: "Biện pháp tu từ: So sánh & Nhân hóa",
    topicId: "topic_tu_tu",
    question: "Câu thơ: 'Trẻ em như búp trên cành / Biết ăn ngủ, biết học hành là ngoan' sử dụng biện pháp tu từ nào?",
    options: ["So sánh", "Nhân hóa", "Điệp ngữ", "Ẩn dụ"],
    correctIndex: 0,
    explanation: "Từ 'như' nối vế A 'Trẻ em' với vế B 'búp trên cành' là dấu hiệu của biện pháp So sánh.",
    difficulty: "easy",
  },
  {
    id: "vn_q11",
    subject: "tieng-viet",
    grade: 4,
    topic: "Biện pháp tu từ: So sánh & Nhân hóa",
    topicId: "topic_tu_tu",
    question: "Câu: 'Bác gà trống vỗ cánh phành phạch gọi mặt trời thức giấc' sử dụng biện pháp nghệ thuật nào?",
    options: ["Nhân hóa", "So sánh", "Nói quá", "Liệt kê"],
    correctIndex: 0,
    explanation: "Con gà trống được gọi bằng 'Bác' và có hành động 'gọi mặt trời' như con người -> Nhân hóa.",
    difficulty: "easy",
  },

  // Topic 5: Thành ngữ tục ngữ
  {
    id: "vn_q12",
    subject: "tieng-viet",
    grade: 4,
    topic: "Thành ngữ & Ca Dao Tục Ngữ Dân Gian",
    topicId: "topic_thanh_ngu",
    question: "Điền từ còn thiếu vào câu tục ngữ: 'Uống nước nhớ ...'?",
    options: ["nguồn", "sông", "suối", "bến"],
    correctIndex: 0,
    explanation: "'Uống nước nhớ nguồn' là câu tục ngữ nhắc nhở truyền thống biết ơn sâu sắc.",
    difficulty: "easy",
  },
  {
    id: "vn_q13",
    subject: "tieng-viet",
    grade: 4,
    topic: "Thành ngữ & Ca Dao Tục Ngữ Dân Gian",
    topicId: "topic_thanh_ngu",
    question: "Thành ngữ 'Học một biết mười' dùng để khen ngợi phẩm chất nào?",
    options: ["Người thông minh, nhạy bén", "Người hay khoe khoang", "Người học vẹt", "Người học chậm"],
    correctIndex: 0,
    explanation: "'Học một biết mười' ca ngợi những người thông minh, có năng khiếu tự học và suy rộng kiến thức.",
    difficulty: "easy",
  },
];

/* STUDENT ROSTER */
export function getClassStudents(): StudentProfile[] {
  if (typeof window === "undefined") return SAMPLE_STUDENTS;
  const saved = localStorage.getItem(CLASS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return SAMPLE_STUDENTS;
    }
  }
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(SAMPLE_STUDENTS));
  return SAMPLE_STUDENTS;
}

export function saveClassStudents(students: StudentProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify(students));
  window.dispatchEvent(new Event("eduspark_class_change"));
}

export function updateStudentProgress(studentId: string, xpGained: number) {
  const current = getClassStudents();
  const updated = current.map((st) => {
    if (st.studentId.toUpperCase() === studentId.toUpperCase()) {
      const newXp = st.xp + xpGained;
      const newLevel = Math.max(1, Math.floor(newXp / 500) + 1);
      return {
        ...st,
        xp: newXp,
        level: newLevel,
        completedQuizzes: st.completedQuizzes + 1,
      };
    }
    return st;
  });
  saveClassStudents(updated);
}

/* VIETNAMESE TOPICS */
export function getVietnameseTopics(): VietnameseTopic[] {
  if (typeof window === "undefined") return SAMPLE_VIETNAMESE_TOPICS;
  const saved = localStorage.getItem(TOPICS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return SAMPLE_VIETNAMESE_TOPICS;
    }
  }
  localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(SAMPLE_VIETNAMESE_TOPICS));
  return SAMPLE_VIETNAMESE_TOPICS;
}

export function saveVietnameseTopics(topics: VietnameseTopic[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics));
  window.dispatchEvent(new Event("eduspark_topics_change"));
}

export function addVietnameseTopic(newTopic: VietnameseTopic) {
  const topics = getVietnameseTopics();
  const updated = [newTopic, ...topics];
  saveVietnameseTopics(updated);
}

export function setActiveVietnameseTopic(topicId: string) {
  const topics = getVietnameseTopics();
  const updated = topics.map((t) => ({
    ...t,
    isActive: t.id === topicId,
  }));
  saveVietnameseTopics(updated);
}

export function getActiveVietnameseTopic(): VietnameseTopic | null {
  const topics = getVietnameseTopics();
  return topics.find((t) => t.isActive) || topics[0] || null;
}

/* VIETNAMESE QUESTIONS */
export function getVietnameseQuestions(): Question[] {
  if (typeof window === "undefined") return INITIAL_VIETNAMESE_QUESTIONS;
  const saved = localStorage.getItem(QUESTIONS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_VIETNAMESE_QUESTIONS;
    }
  }
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(INITIAL_VIETNAMESE_QUESTIONS));
  return INITIAL_VIETNAMESE_QUESTIONS;
}

export function saveVietnameseQuestions(questions: Question[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  window.dispatchEvent(new Event("eduspark_questions_change"));
}

export function addVietnameseQuestion(newQuestion: Question) {
  const current = getVietnameseQuestions();
  const updated = [newQuestion, ...current];
  saveVietnameseQuestions(updated);

  // Sync to MySQL in background
  if (typeof window !== "undefined") {
    fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    }).catch(() => {});
  }

  // Update questionCount in corresponding topic
  if (newQuestion.topicId) {
    const topics = getVietnameseTopics();
    const updatedTopics = topics.map((t) =>
      t.id === newQuestion.topicId ? { ...t, questionCount: (t.questionCount || 0) + 1 } : t
    );
    saveVietnameseTopics(updatedTopics);
  }
}

export function deleteVietnameseQuestion(id: string) {
  const current = getVietnameseQuestions();
  const updated = current.filter((q) => q.id !== id);
  saveVietnameseQuestions(updated);
}

/* VOCABULARY NOTEBOOK */
const VOCABULARY_STORAGE_KEY = "eduspark_vocabulary_notes";

export function getVocabularyNotes(): VocabularyItem[] {
  if (typeof window === "undefined") return DEFAULT_VOCABULARY_NOTES;
  const saved = localStorage.getItem(VOCABULARY_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_VOCABULARY_NOTES;
    }
  }
  localStorage.setItem(VOCABULARY_STORAGE_KEY, JSON.stringify(DEFAULT_VOCABULARY_NOTES));
  return DEFAULT_VOCABULARY_NOTES;
}

export function saveVocabularyNotes(notes: VocabularyItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VOCABULARY_STORAGE_KEY, JSON.stringify(notes));
  window.dispatchEvent(new Event("eduspark_vocabulary_change"));
}

export function addVocabularyNote(newNote: VocabularyItem) {
  const current = getVocabularyNotes();
  const exists = current.some((n) => n.word.toLowerCase() === newNote.word.toLowerCase());
  if (!exists) {
    const updated = [newNote, ...current];
    saveVocabularyNotes(updated);

    // Sync to MySQL in background
    if (typeof window !== "undefined") {
      fetch("/api/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNote),
      }).catch(() => {});
    }
  }
}

/**
 * Đồng bộ dữ liệu hai chiều giữa Local và MySQL XAMPP
 */
export async function syncFromMySql(): Promise<{ success: boolean; message: string }> {
  if (typeof window === "undefined") return { success: false, message: "Client only" };
  try {
    const resStatus = await fetch("/api/db/status");
    const statusData = await resStatus.json();
    if (!statusData.connected) {
      return { success: false, message: statusData.message || "Chưa kết nối MySQL XAMPP" };
    }

    // Fetch questions
    const qRes = await fetch("/api/questions");
    const qData = await qRes.json();
    if (qData.success && Array.isArray(qData.data)) {
      saveVietnameseQuestions(qData.data);
    }

    // Fetch vocabulary
    const vRes = await fetch("/api/vocabulary");
    const vData = await vRes.json();
    if (vData.success && Array.isArray(vData.data)) {
      saveVocabularyNotes(vData.data);
    }

    // Fetch students
    const sRes = await fetch("/api/students");
    const sData = await sRes.json();
    if (sData.success && Array.isArray(sData.data)) {
      saveClassStudents(sData.data);
    }

    return { success: true, message: "Đã đồng bộ thành công dữ liệu từ MySQL XAMPP!" };
  } catch (err: unknown) {
    const error = err as { message?: string };
    return { success: false, message: error.message || "Lỗi đồng bộ dữ liệu" };
  }
}



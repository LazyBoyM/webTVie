"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth, DEMO_TEACHER } from "@/lib/authStore";
import { SAMPLE_QUESTIONS, Question, StudentProfile, VietnameseTopic } from "@/lib/data";
import {
  getClassStudents,
  saveClassStudents,
  getVietnameseTopics,
  addVietnameseTopic,
  setActiveVietnameseTopic,
  getVietnameseQuestions,
  addVietnameseQuestion,
  deleteVietnameseQuestion
} from "@/lib/dataStore";
import { sound } from "@/lib/soundEffects";
import {
  Users,
  Sparkles,
  Printer,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  Trash2,
  BrainCircuit,
  Bot,
  Lock,
  ShieldCheck,
  BookOpen,
  Plus,
  Tag,
  Check
} from "lucide-react";

export default function TeacherPage() {
  const { teacher, loginAsTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState<"topics" | "students" | "ai-quiz" | "analytics">("topics");
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [questions, setQuestions] = useState<Question[]>(SAMPLE_QUESTIONS);

  // Vietnamese Topics & Questions state
  const [vnTopics, setVnTopics] = useState<VietnameseTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("topic_tu_loai");
  const [vnQuestions, setVnQuestions] = useState<Question[]>([]);

  // Create new topic modal
  const [createTopicModalOpen, setCreateTopicModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState<
    "tu-loai" | "cau-tao-tu" | "chinh-ta" | "tu-tu" | "thanh-ngu" | "cau-dau-cau"
  >("tu-loai");
  const [newTopicGrade, setNewTopicGrade] = useState(4);
  const [newTopicDesc, setNewTopicDesc] = useState("");

  // Manual Question Creator state
  const [manualQText, setManualQText] = useState("");
  const [manualOptA, setManualOptA] = useState("");
  const [manualOptB, setManualOptB] = useState("");
  const [manualOptC, setManualOptC] = useState("");
  const [manualOptD, setManualOptD] = useState("");
  const [manualCorrectIdx, setManualCorrectIdx] = useState(0);
  const [manualExplanation, setManualExplanation] = useState("");
  const [manualDifficulty, setManualDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  // AI Topic Question generator state
  const [aiTopicGenerating, setAiTopicGenerating] = useState(false);

  useEffect(() => {
    const updateStudents = () => setStudents(getClassStudents());
    const updateTopics = () => setVnTopics(getVietnameseTopics());
    const updateQuestions = () => setVnQuestions(getVietnameseQuestions());

    updateStudents();
    updateTopics();
    updateQuestions();

    window.addEventListener("eduspark_class_change", updateStudents);
    window.addEventListener("eduspark_topics_change", updateTopics);
    window.addEventListener("eduspark_questions_change", updateQuestions);

    return () => {
      window.removeEventListener("eduspark_class_change", updateStudents);
      window.removeEventListener("eduspark_topics_change", updateTopics);
      window.removeEventListener("eduspark_questions_change", updateQuestions);
    };
  }, []);

  // New student form
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentId, setNewStudentId] = useState("");

  // AI Quiz Generator states
  const [aiPrompt, setAiPrompt] = useState("Tiếng Việt 4: Phân biệt Từ đơn, Từ ghép và Từ láy");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[] | null>(null);

  // Print QR modal
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");



  // Topic Handlers
  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicName.trim()) return;
    sound.playClick();
    const newTopic: VietnameseTopic = {
      id: `topic_${Date.now()}`,
      name: newTopicName.trim(),
      category: newTopicCategory,
      categoryName:
        newTopicCategory === "tu-loai"
          ? "Từ Loại"
          : newTopicCategory === "cau-tao-tu"
          ? "Cấu Tạo Từ"
          : newTopicCategory === "chinh-ta"
          ? "Chính Tả"
          : newTopicCategory === "tu-tu"
          ? "Biện Pháp Tu Từ"
          : newTopicCategory === "thanh-ngu"
          ? "Thành Ngữ Tục Ngữ"
          : "Câu & Dấu Câu",
      grade: newTopicGrade,
      description:
        newTopicDesc.trim() || `Chuyên đề ôn tập ${newTopicName.trim()} cho học sinh lớp ${newTopicGrade}.`,
      isActive: false,
      icon: "📚",
      questionCount: 0,
    };
    addVietnameseTopic(newTopic);
    setSelectedTopicId(newTopic.id);
    setNewTopicName("");
    setNewTopicDesc("");
    setCreateTopicModalOpen(false);
    sound.playVictory();
  };

  const handleSetActiveTopic = (topicId: string) => {
    sound.playClick();
    setActiveVietnameseTopic(topicId);
    sound.playVictory();
  };

  const handleAddManualQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQText.trim() || !manualOptA.trim() || !manualOptB.trim() || !manualOptC.trim() || !manualOptD.trim()) {
      alert("Vui lòng điền đầy đủ câu hỏi và 4 phương án A, B, C, D!");
      return;
    }
    sound.playClick();
    const currentTopic = vnTopics.find((t) => t.id === selectedTopicId) || vnTopics[0];
    const newQ: Question = {
      id: `vn_custom_${Date.now()}`,
      subject: "tieng-viet",
      grade: currentTopic ? currentTopic.grade : 4,
      topic: currentTopic ? currentTopic.name : "Tiếng Việt",
      topicId: selectedTopicId,
      question: manualQText.trim(),
      options: [manualOptA.trim(), manualOptB.trim(), manualOptC.trim(), manualOptD.trim()],
      correctIndex: manualCorrectIdx,
      explanation:
        manualExplanation.trim() ||
        `Đáp án đúng là: ${[manualOptA, manualOptB, manualOptC, manualOptD][manualCorrectIdx]}.`,
      difficulty: manualDifficulty,
    };
    addVietnameseQuestion(newQ);
    setManualQText("");
    setManualOptA("");
    setManualOptB("");
    setManualOptC("");
    setManualOptD("");
    setManualExplanation("");
    sound.playCorrect();
  };

  const handleGenerateAiQuestionsForTopic = () => {
    const currentTopic = vnTopics.find((t) => t.id === selectedTopicId) || vnTopics[0];
    if (!currentTopic) return;
    sound.playClick();
    setAiTopicGenerating(true);

    setTimeout(() => {
      const topicName = currentTopic.name;
      const q1: Question = {
        id: `vn_ai_${Date.now()}_1`,
        subject: "tieng-viet",
        grade: currentTopic.grade,
        topic: topicName,
        topicId: currentTopic.id,
        question: `[AI Đề 1] Phân tích từ ngữ trong chủ đề '${topicName}': Từ nào dưới đây mang đặc điểm tiêu biểu nhất?`,
        options: ["Kiên định", "Hành động", "Xanh mướt", "Dòng suối"],
        correctIndex: 0,
        explanation: `Từ 'Kiên định' thể hiện ý chí vững vàng, phù hợp với kiến thức ôn tập chuyên đề '${topicName}'.`,
        difficulty: "medium",
      };
      const q2: Question = {
        id: `vn_ai_${Date.now()}_2`,
        subject: "tieng-viet",
        grade: currentTopic.grade,
        topic: topicName,
        topicId: currentTopic.id,
        question: `[AI Đề 2] Trong câu 'Tiếng chim hót rộn rã đón chào bình minh', hãy xác định tác dụng ngữ pháp chính:`,
        options: ["Gợi tả âm thanh sinh động", "Chỉ số lượng", "Nối hai vế câu", "Hỏi nguyên nhân"],
        correctIndex: 0,
        explanation: "Từ 'rộn rã' gợi tả âm thanh vui tươi, rộn ràng của đàn chim trong buổi sớm mai.",
        difficulty: "easy",
      };
      const q3: Question = {
        id: `vn_ai_${Date.now()}_3`,
        subject: "tieng-viet",
        grade: currentTopic.grade,
        topic: topicName,
        topicId: currentTopic.id,
        question: `[AI Đề 3] Điền từ thích hợp vào câu ca dao: 'Công cha như núi Thái Sơn / Nghĩa mẹ như nước trong ... chảy ra':`,
        options: ["nguồn", "sông", "biển", "suối"],
        correctIndex: 0,
        explanation: "Câu ca dao truyền thống nguyên văn là: 'Nghĩa mẹ như nước trong nguồn chảy ra'.",
        difficulty: "easy",
      };

      addVietnameseQuestion(q1);
      addVietnameseQuestion(q2);
      addVietnameseQuestion(q3);

      setAiTopicGenerating(false);
      sound.playVictory();
    }, 1200);
  };

  const handleExportCsv = () => {
    sound.playClick();
    const headers = ["Mã Học Sinh", "Họ và Tên", "Lớp", "Cấp Độ", "Điểm XP", "Chuỗi Học (Ngày)", "Độ Chính Xác (%)"];
    const rows = students.map((s) => [s.studentId, `"${s.name}"`, s.className, s.level, s.xp, s.streak, s.accuracy]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Bao_Cao_Tien_Do_Lop_4A_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sound.playVictory();
  };

  const handleImportCsv = () => {
    if (!csvInput.trim()) return;
    sound.playClick();
    const lines = csvInput.trim().split("\n");
    const newOnes: StudentProfile[] = [];
    lines.forEach((line) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      if (parts.length >= 2) {
        const id = parts[0].toUpperCase();
        const name = parts[1].replace(/["']/g, "");
        if (id && name) {
          newOnes.push({
            studentId: id,
            pin: "1234",
            name: name,
            avatar: "🎓",
            className: "Lớp 4A",
            grade: 4,
            xp: 0,
            level: 1,
            streak: 0,
            badges: [],
            completedQuizzes: 0,
            accuracy: 100,
          });
        }
      }
    });
    if (newOnes.length > 0) {
      saveClassStudents([...students, ...newOnes]);
      setCsvInput("");
      setImportModalOpen(false);
      sound.playVictory();
      alert(`Đã nhập thành công ${newOnes.length} học sinh vào lớp!`);
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentId.trim()) return;
    sound.playClick();
    const newStudent: StudentProfile = {
      studentId: newStudentId.toUpperCase(),
      pin: "1234",
      name: newStudentName.trim(),
      avatar: "🎓",
      className: "Lớp 4A",
      grade: 4,
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      completedQuizzes: 0,
      accuracy: 100,
    };
    saveClassStudents([...students, newStudent]);
    setNewStudentName("");
    setNewStudentId("");
    sound.playCorrect();
  };

  const handleDeleteStudent = (id: string) => {
    sound.playClick();
    saveClassStudents(students.filter((s) => s.studentId !== id));
  };

  // Simulate AI Quiz Generation
  const handleGenerateAiQuiz = () => {
    sound.playClick();
    setAiGenerating(true);

    setTimeout(() => {
      setAiGenerating(false);
      const generated: Question[] = [
        {
          id: `ai_${Date.now()}_1`,
          subject: "tieng-viet",
          grade: 4,
          topic: aiPrompt,
          question: `[AI Đề 1] Theo chủ đề '${aiPrompt}': Trong câu 'Những giọt sương sớm đọng lung linh trên ngọn cỏ', từ 'lung linh' thuộc loại từ nào?`,
          options: ["Từ láy tượng hình", "Từ ghép đẳng lập", "Từ ghép chính phụ", "Từ đơn"],
          correctIndex: 0,
          explanation: "'Lung linh' là từ láy tượng hình gợi tả vẻ sáng ngời, lấp lánh của giọt sương mai.",
          difficulty: "easy",
        },
        {
          id: `ai_${Date.now()}_2`,
          subject: "tieng-viet",
          grade: 4,
          topic: aiPrompt,
          question: `[AI Đề 2] Cặp từ nào dưới đây là cặp từ ĐỒNG NGHĨA chuẩn xác trong tiếng Việt?`,
          options: ["Can đảm — Dũng cảm", "Chăm chỉ — Lười biếng", "Gọn gàng — Bừa bãi", "Cao thượng — Hèn hạ"],
          correctIndex: 0,
          explanation: "'Can đảm' và 'Dũng cảm' đều mang ý nghĩa gan dạ, không sợ gian nguy.",
          difficulty: "medium",
        },
        {
          id: `ai_${Date.now()}_3`,
          subject: "tieng-viet",
          grade: 4,
          topic: aiPrompt,
          question: `[AI Đề 3] Câu thơ 'Trăng ơi... từ đâu đến? Hay từ cánh rừng xa' sử dụng biện pháp tu từ nào?`,
          options: ["Nhân hóa", "So sánh", "Điệp từ", "Ẩn dụ"],
          correctIndex: 0,
          explanation: "Tác giả trò chuyện, gọi 'Trăng ơi' như một người bạn thân thiết (Biện pháp Nhân hóa).",
          difficulty: "medium",
        },
      ];
      setGeneratedQuestions(generated);
      sound.playVictory();
    }, 1500);
  };

  const handleSaveAiQuestions = () => {
    if (!generatedQuestions) return;
    sound.playClick();
    setQuestions([...generatedQuestions, ...questions]);
    setGeneratedQuestions(null);
    sound.playCorrect();
    alert("Đã lưu 3 câu hỏi của AI vào ngân hàng đề thi lớp học thành công!");
  };

  // ROUTE GUARD: If user is not authenticated as Teacher
  if (!teacher) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50/60">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border-4 border-emerald-200 shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black font-heading text-slate-800">
                Khu Vực Quản Trị Giáo Viên
              </h2>
              <p className="text-xs text-slate-500 font-bold mt-1">
                Khu vực này yêu cầu xác thực tài khoản giáo viên để quản lý danh sách lớp, in thẻ QR và sử dụng AI soạn đề.
              </p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-2.5">
              <div>
                <span className="block text-[10px] font-black uppercase text-slate-400">Giáo viên phụ trách</span>
                <span className="text-xs font-black text-slate-800">{DEMO_TEACHER.name}</span>
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase text-slate-400">Email quản nhiệm</span>
                <span className="text-xs font-extrabold text-emerald-800">{DEMO_TEACHER.email}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  sound.playClick();
                  loginAsTeacher();
                  sound.playVictory();
                }}
                className="w-full py-4 text-white font-black text-base rounded-2xl btn-game-green shadow-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" /> Đăng Nhập Giáo Viên (1-Click)
              </button>
              <Link
                href="/"
                onClick={() => sound.playClick()}
                className="block w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition text-center"
              >
                ← Quay Về Góc Học Sinh
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Teacher Top */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-spark-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8">
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                👩‍🏫
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Bảng Điều Khiển Giáo Viên
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-heading">
                  {teacher.name}
                </h1>
                <p className="text-emerald-100 text-sm font-medium">
                  {teacher.schoolName} • Chủ Nhiệm Lớp 4A
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setPrintModalOpen(true);
                }}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition text-sm flex items-center gap-2 backdrop-blur-sm"
              >
                <Printer className="w-4 h-4" /> In Thẻ QR Học Sinh
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("topics");
            }}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "topics"
                ? "bg-purple-600 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-500" /> 🇻🇳 Soạn Đề Theo Chủ Đề ({vnTopics.length})
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("students");
            }}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "students"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" /> Quản Lý Lớp & Học Sinh ({students.length})
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("ai-quiz");
            }}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "ai-quiz"
                ? "bg-spark-600 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-spark-500" /> 🤖 Trợ Lý AI Soạn Đề
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("analytics");
            }}
            className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "analytics"
                ? "bg-slate-800 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Báo Cáo & Xuất File
          </button>
        </div>

        {/* TAB: SOẠN ĐỀ & QUẢN LÝ CHỦ ĐỀ TIẾNG VIỆT */}
        {activeTab === "topics" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header section with Active Topic Banner */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-2xl shadow-md">
                  📖
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Chuyên Đề Đang Giao Cho Lớp Ôn Tập
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                    {vnTopics.find((t) => t.isActive)?.name || "Chưa chọn chủ đề"}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    {vnTopics.find((t) => t.isActive)?.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setCreateTopicModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm transition flex items-center gap-2 shadow-md shrink-0"
              >
                <Plus className="w-4 h-4" /> Tạo Chủ Đề Mới
              </button>
            </div>

            {/* Grid of Topics */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black font-heading text-slate-800 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-purple-600" /> Danh Sách Chuyên Đề Tiếng Việt ({vnTopics.length})
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  Bấm &quot;Giao Lớp&quot; để học sinh ưu tiên ôn tập chuyên đề đó
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vnTopics.map((topic) => {
                  const topicQuestions = vnQuestions.filter((q) => q.topicId === topic.id);
                  const isSelectedForEdit = selectedTopicId === topic.id;

                  return (
                    <div
                      key={topic.id}
                      className={`p-5 rounded-3xl border-2 transition-all shadow-sm flex flex-col justify-between ${
                        isSelectedForEdit
                          ? "bg-purple-50/50 border-purple-500 ring-4 ring-purple-100"
                          : "bg-white border-slate-200 hover:border-purple-300 hover:shadow-md"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{topic.icon}</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                              Lớp {topic.grade}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-bold">
                              {topic.categoryName}
                            </span>
                          </div>

                          {topic.isActive ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black flex items-center gap-1">
                              <Check className="w-3 h-3 stroke-[3]" /> Đang Giao
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetActiveTopic(topic.id)}
                              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 text-[11px] font-bold transition"
                            >
                              Giao Lớp
                            </button>
                          )}
                        </div>

                        <h4 className="text-base font-black font-heading text-slate-800 mb-1.5">
                          {topic.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3 line-clamp-2">
                          {topic.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">
                          📚 {topicQuestions.length} câu hỏi
                        </span>
                        <button
                          onClick={() => {
                            sound.playClick();
                            setSelectedTopicId(topic.id);
                          }}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                            isSelectedForEdit
                              ? "bg-purple-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-700"
                          }`}
                        >
                          {isSelectedForEdit ? "Đang Soạn Đề ✍️" : "Soạn Câu Hỏi"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STUDIO SOẠN CÂU HỎI CHO CHỦ ĐỀ ĐƯỢC CHỌN */}
            {selectedTopicId && (
              <div className="bg-white rounded-3xl border-2 border-purple-200 p-6 sm:p-8 shadow-lg space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-purple-600 block">
                      Studio Soạn Câu Hỏi Cho Chủ Đề
                    </span>
                    <h3 className="text-2xl font-black font-heading text-slate-900">
                      {vnTopics.find((t) => t.id === selectedTopicId)?.name}
                    </h3>
                  </div>

                  <button
                    onClick={handleGenerateAiQuestionsForTopic}
                    disabled={aiTopicGenerating}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-spark-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-extrabold text-sm transition flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    {aiTopicGenerating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        AI Đang Soạn 3 Câu Hỏi...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" /> 🤖 AI Soạn 3 Câu Hỏi Cho Chủ Đề Này
                      </>
                    )}
                  </button>
                </div>

                {/* FORM SOẠN THỦ CÔNG */}
                <form onSubmit={handleAddManualQuestion} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                    <span>✍️</span>
                    <span>Thêm Câu Hỏi Mới Thủ Công (Giáo Viên Tự Nhập)</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                      Nội dung câu hỏi:
                    </label>
                    <input
                      type="text"
                      required
                      value={manualQText}
                      onChange={(e) => setManualQText(e.target.value)}
                      placeholder="Ví dụ: Trong câu 'Những cánh diều bay lượn trên bầu trời', từ nào là Động từ?"
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-600">Phương án A:</label>
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={manualCorrectIdx === 0}
                          onChange={() => setManualCorrectIdx(0)}
                        />
                      </div>
                      <input
                        type="text"
                        required
                        value={manualOptA}
                        onChange={(e) => setManualOptA(e.target.value)}
                        placeholder="Đáp án A"
                        className={`w-full px-3.5 py-2.5 bg-white border-2 rounded-xl text-xs font-medium focus:outline-none ${manualCorrectIdx === 0 ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200"}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-600">Phương án B:</label>
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={manualCorrectIdx === 1}
                          onChange={() => setManualCorrectIdx(1)}
                        />
                      </div>
                      <input
                        type="text"
                        required
                        value={manualOptB}
                        onChange={(e) => setManualOptB(e.target.value)}
                        placeholder="Đáp án B"
                        className={`w-full px-3.5 py-2.5 bg-white border-2 rounded-xl text-xs font-medium focus:outline-none ${manualCorrectIdx === 1 ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200"}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-600">Phương án C:</label>
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={manualCorrectIdx === 2}
                          onChange={() => setManualCorrectIdx(2)}
                        />
                      </div>
                      <input
                        type="text"
                        required
                        value={manualOptC}
                        onChange={(e) => setManualOptC(e.target.value)}
                        placeholder="Đáp án C"
                        className={`w-full px-3.5 py-2.5 bg-white border-2 rounded-xl text-xs font-medium focus:outline-none ${manualCorrectIdx === 2 ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200"}`}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-slate-600">Phương án D:</label>
                        <input
                          type="radio"
                          name="correctOpt"
                          checked={manualCorrectIdx === 3}
                          onChange={() => setManualCorrectIdx(3)}
                        />
                      </div>
                      <input
                        type="text"
                        required
                        value={manualOptD}
                        onChange={(e) => setManualOptD(e.target.value)}
                        placeholder="Đáp án D"
                        className={`w-full px-3.5 py-2.5 bg-white border-2 rounded-xl text-xs font-medium focus:outline-none ${manualCorrectIdx === 3 ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200"}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Lời giải thích chi tiết vì sao đúng:
                      </label>
                      <input
                        type="text"
                        value={manualExplanation}
                        onChange={(e) => setManualExplanation(e.target.value)}
                        placeholder="Ví dụ: 'Bay lượn' là động từ chỉ hoạt động của cánh diều."
                        className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Độ khó:</label>
                      <select
                        value={manualDifficulty}
                        onChange={(e) => setManualDifficulty(e.target.value as "easy" | "medium" | "hard")}
                        className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                      >
                        <option value="easy">Dễ (Nhận biết)</option>
                        <option value="medium">Trung bình (Thông hiểu)</option>
                        <option value="hard">Khó (Vận dụng)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition flex items-center gap-2 shadow-md"
                    >
                      <PlusCircle className="w-4 h-4" /> Thêm Câu Hỏi Này Vào Chủ Đề
                    </button>
                  </div>
                </form>

                {/* DANH SÁCH CÂU HỎI HIỆN CÓ CỦA CHỦ ĐỀ */}
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-3">
                    Các Câu Hỏi Trong Chủ Đề Này ({vnQuestions.filter((q) => q.topicId === selectedTopicId).length})
                  </h4>

                  <div className="space-y-3">
                    {vnQuestions
                      .filter((q) => q.topicId === selectedTopicId)
                      .map((q, idx) => (
                        <div key={q.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-purple-200 transition flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xs">
                                {idx + 1}
                              </span>
                              <h5 className="font-extrabold text-sm text-slate-800">{q.question}</h5>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                              {q.options.map((opt, oIdx) => (
                                <span
                                  key={oIdx}
                                  className={`px-2.5 py-1.5 rounded-lg border font-medium ${
                                    oIdx === q.correctIndex
                                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                                      : "bg-slate-50 border-slate-100 text-slate-600"
                                  }`}
                                >
                                  {["A", "B", "C", "D"][oIdx]}. {opt}
                                  {oIdx === q.correctIndex && " ✓"}
                                </span>
                              ))}
                            </div>

                            {q.explanation && (
                              <p className="text-xs text-slate-500 italic">
                                💡 Giải thích: {q.explanation}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              sound.playClick();
                              deleteVietnameseQuestion(q.id);
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                            title="Xóa câu hỏi này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                    {vnQuestions.filter((q) => q.topicId === selectedTopicId).length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-xs font-bold">
                        Chưa có câu hỏi nào trong chủ đề này. Hãy bấm nút AI hoặc nhập câu hỏi ở trên nhé!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: Quản lý học sinh */}
        {activeTab === "students" && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick Add Form */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" /> Thêm Nhanh Học Sinh Vào Lớp 4A
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setImportModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-black rounded-xl border border-emerald-200 transition flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Nhập Hàng Loạt Từ File Excel/CSV
                </button>
              </div>
              <form onSubmit={handleAddStudent} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Mã HS (VD: HS06)"
                  value={newStudentId}
                  onChange={(e) => setNewStudentId(e.target.value)}
                  className="px-4 py-2.5 border-2 border-slate-200 rounded-xl font-bold uppercase text-sm focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Họ và tên học sinh (VD: Hoàng Nhật Nam)"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-200 rounded-xl font-medium text-sm focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition text-sm shadow-sm flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Thêm Vào Lớp
                </button>
              </form>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-black uppercase text-slate-500 tracking-wider">
                    <tr>
                      <th className="p-4">Mã Học Sinh</th>
                      <th className="p-4">Họ và Tên</th>
                      <th className="p-4 text-center">Cấp Độ</th>
                      <th className="p-4 text-center">Điểm XP</th>
                      <th className="p-4 text-center">Chuỗi Học 🔥</th>
                      <th className="p-4 text-center">Độ Chính Xác</th>
                      <th className="p-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((st) => (
                      <tr key={st.studentId} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-black text-spark-700">{st.studentId}</td>
                        <td className="p-4 font-bold text-slate-800 flex items-center gap-2.5">
                          <span className="text-xl">{st.avatar}</span>
                          {st.name}
                        </td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-1 bg-spark-100 text-spark-800 font-extrabold rounded-lg text-xs">
                            Cấp {st.level}
                          </span>
                        </td>
                        <td className="p-4 text-center font-extrabold text-amber-600">
                          {st.xp} XP
                        </td>
                        <td className="p-4 text-center font-black text-orange-500">
                          {st.streak} ngày
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-emerald-600">{st.accuracy}%</span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteStudent(st.studentId)}
                            title="Xóa học sinh"
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI Quiz Generator */}
        {activeTab === "ai-quiz" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-spark-200 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-spark-100 rounded-2xl text-spark-600">
                  <Bot className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-heading text-slate-800">
                    Trợ Lý AI Tạo Đề Trắc Nghiệm Tự Động
                  </h3>
                  <p className="text-slate-500 text-xs font-bold">
                    Tiết kiệm hàng giờ soạn bài: AI phân tích sách giáo khoa và tạo bộ câu hỏi kèm lời giải chi tiết.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Chủ đề bài học hoặc dán đoạn văn SGK:
                  </label>
                  <textarea
                    rows={3}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ví dụ: Tiếng Việt 4 - Phân biệt từ đơn và từ láy, hoặc Biện pháp tu từ so sánh trong thơ ca..."
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl font-medium text-sm focus:outline-none focus:border-spark-500"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Chủ đề gợi ý nhanh:</span>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Tiếng Việt 4: Phân biệt Từ đơn, Từ ghép và Từ láy")}
                    className="px-3 py-1 bg-slate-100 hover:bg-spark-50 text-slate-700 text-xs font-bold rounded-lg transition"
                  >
                    TV 4: Từ đơn & Từ láy
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Tiếng Việt 5: Từ đồng nghĩa và từ trái nghĩa")}
                    className="px-3 py-1 bg-slate-100 hover:bg-spark-50 text-slate-700 text-xs font-bold rounded-lg transition"
                  >
                    TV 5: Từ đồng nghĩa
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Tiếng Việt 4: Biện pháp tu từ So sánh & Nhân hóa")}
                    className="px-3 py-1 bg-slate-100 hover:bg-spark-50 text-slate-700 text-xs font-bold rounded-lg transition"
                  >
                    TV 4: So sánh & Nhân hóa
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Tiếng Việt 5: Thành ngữ và Tục ngữ ca dao")}
                    className="px-3 py-1 bg-slate-100 hover:bg-spark-50 text-slate-700 text-xs font-bold rounded-lg transition"
                  >
                    TV 5: Thành ngữ tục ngữ
                  </button>
                </div>

                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={handleGenerateAiQuiz}
                  className="w-full py-4 text-white font-black text-base rounded-2xl btn-game-purple flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      AI Đang Phân Tích & Sinh Bộ Đề...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300" /> 🤖 Bấm Vào Đây Để AI Tự Động Tạo 3 Câu Hỏi Kèm Lời Giải
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated results */}
            {generatedQuestions && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-spark-300 shadow-lg space-y-6 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-black text-slate-800 font-heading flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Kết Quả Bộ Đề AI Vừa Tạo:
                  </h4>
                  <button
                    onClick={handleSaveAiQuestions}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition shadow-sm flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Lưu Tất Cả Vào Ngân Hàng Đề
                  </button>
                </div>

                <div className="space-y-4">
                  {generatedQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-spark-50/50 border border-spark-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-xs uppercase text-spark-700">Câu hỏi {idx + 1}</span>
                        <span className="px-2 py-0.5 bg-spark-200 text-spark-900 rounded-md text-[11px] font-bold">
                          Độ khó: {q.difficulty}
                        </span>
                      </div>
                      <p className="font-black text-base text-slate-800 mb-3">{q.question}</p>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl text-xs font-bold ${
                              oIdx === q.correctIndex
                                ? "bg-emerald-100 border border-emerald-400 text-emerald-900 font-black"
                                : "bg-white border border-slate-200 text-slate-600"
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </div>
                        ))}
                      </div>
                      <div className="text-xs bg-white p-3 rounded-xl border border-slate-200 text-slate-600">
                        <span className="font-extrabold text-amber-700">💡 Lời giải chi tiết:</span> {q.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question Bank Explorer */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-lg font-black text-slate-800 font-heading">
                    Ngân Hàng Đề & Câu Hỏi Lớp Học ({questions.length} câu)
                  </h4>
                  <p className="text-xs text-slate-500">Xem và lọc câu hỏi theo từng môn học</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "all", label: "Tất Cả Đề" },
                    { id: "tieng-viet", label: "Tiếng Việt 🇻🇳" },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedSubjectFilter(sub.id);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        selectedSubjectFilter === sub.id
                          ? "bg-spark-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pt-2">
                {questions
                  .filter((q) => selectedSubjectFilter === "all" || q.subject === selectedSubjectFilter)
                  .map((q) => (
                    <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-slate-400 font-bold mb-1">
                          <span className="uppercase text-[10px] text-spark-600 font-black">{q.subject}</span>
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                            Lớp {q.grade}
                          </span>
                        </div>
                        <p className="font-extrabold text-slate-800 text-sm mb-1.5">{q.question}</p>
                      </div>
                      <p className="text-emerald-700 font-bold mt-2 bg-emerald-50/70 p-2 rounded-xl border border-emerald-200">
                        ✓ Đáp án đúng: {q.options[q.correctIndex]}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}



        {/* TAB 4: Báo cáo & Thống kê */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Tỷ Lệ Tham Gia Luyện Tập</span>
                <div className="text-3xl font-black text-emerald-600 mt-1">92.5%</div>
                <span className="text-xs text-slate-500">28/30 học sinh làm bài trong tuần</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Độ Chính Xác Trung Bình</span>
                <div className="text-3xl font-black text-spark-600 mt-1">87.8%</div>
                <span className="text-xs text-slate-500">Tăng +8% so với tuần trước</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Chủ Đề Cần Ôn Tập Lại</span>
                <div className="text-xl font-black text-amber-600 mt-2">Phân số thập phân</div>
                <span className="text-xs text-slate-500">Tỉ lệ đúng 58%</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">Báo Cáo Tiến Độ Lớp Học Tuần Này</h4>
                <p className="text-xs text-slate-500">Xuất file Excel tổng hợp điểm số, thời gian học để gửi cho phụ huynh.</p>
              </div>
              <button
                onClick={handleExportCsv}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" /> Tải Xuất File Excel (.csv)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Import CSV Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border-4 border-emerald-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black font-heading text-slate-800">
                    Nhập Danh Sách Học Sinh (Excel/CSV)
                  </h3>
                  <p className="text-xs text-slate-500">Dán danh sách từ Excel hoặc nhập định dạng: Mã HS, Họ và Tên</p>
                </div>
              </div>
              <button
                onClick={() => setImportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Dán nội dung từ bảng Excel vào đây:
                </label>
                <textarea
                  rows={6}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder={`HS06,Vũ Minh Quân\nHS07,Lê Thùy Dung\nHS08,Đỗ Bảo Trâm\nHS09,Nguyễn Hoàng Phúc`}
                  className="w-full p-3 font-mono text-xs bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                💡 <strong>Mẹo nhanh:</strong> Bạn có thể copy 2 cột (Cột A là Mã Học Sinh, Cột B là Họ và Tên) từ Excel và dán trực tiếp vào ô trên!
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleImportCsv}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Xác Nhận Thêm Học Sinh
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print QR Code Modal */}
      {printModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-4 border-emerald-200">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="text-xl font-black font-heading text-slate-800">
                  Thẻ Đăng Nhập Học Sinh — Lớp 4A
                </h3>
                <p className="text-xs text-slate-500">In ra giấy để phát cho các em dán vào bìa vở bài tập</p>
              </div>
              <button
                onClick={() => setPrintModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {students.map((st) => (
                <div key={st.studentId} className="p-4 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center">
                  <div className="text-2xl mb-1">{st.avatar}</div>
                  <h5 className="font-black text-slate-800 text-sm">{st.name}</h5>
                  <p className="text-xs font-bold text-emerald-700">Mã HS: {st.studentId}</p>
                  <p className="text-[11px] text-slate-400">PIN: 1234</p>
                  <div className="w-20 h-20 bg-white border border-slate-300 mx-auto my-2 rounded-xl flex items-center justify-center text-xs text-slate-400 font-mono">
                    [QR {st.studentId}]
                  </div>
                  <span className="text-[10px] text-slate-400 block">EduSpark • Lớp 4A</span>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  sound.playClick();
                  window.print();
                }}
                className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Bấm Lệnh In Thẻ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TẠO CHỦ ĐỀ MỚI */}
      {createTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-purple-700 font-black font-heading text-lg">
                <BookOpen className="w-5 h-5" /> Tạo Chuyên Đề Tiếng Việt Mới
              </div>
              <button
                onClick={() => setCreateTopicModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Tên chủ đề:
                </label>
                <input
                  type="text"
                  required
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="Ví dụ: Từ láy tượng thanh & tượng hình"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Mạch kiến thức:</label>
                  <select
                    value={newTopicCategory}
                    onChange={(e) =>
                      setNewTopicCategory(
                        e.target.value as "tu-loai" | "cau-tao-tu" | "chinh-ta" | "tu-tu" | "thanh-ngu" | "cau-dau-cau"
                      )
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value="tu-loai">Từ Loại</option>
                    <option value="cau-tao-tu">Cấu Tạo Từ</option>
                    <option value="chinh-ta">Chính Tả</option>
                    <option value="tu-tu">Biện Pháp Tu Từ</option>
                    <option value="thanh-ngu">Thành Ngữ Tục Ngữ</option>
                    <option value="cau-dau-cau">Câu & Dấu Câu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Khối lớp:</label>
                  <select
                    value={newTopicGrade}
                    onChange={(e) => setNewTopicGrade(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((g) => (
                      <option key={g} value={g}>
                        Lớp {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Mô tả mục tiêu ôn tập:</label>
                <textarea
                  rows={2}
                  value={newTopicDesc}
                  onChange={(e) => setNewTopicDesc(e.target.value)}
                  placeholder="Mô tả ngắn kiến thức cốt lõi giúp học sinh nắm chắc..."
                  className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateTopicModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md"
                >
                  Tạo Chủ Đề Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

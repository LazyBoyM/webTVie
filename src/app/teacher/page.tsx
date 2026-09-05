"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth, DEMO_TEACHER } from "@/lib/authStore";
import { Question, StudentProfile, VietnameseTopic } from "@/lib/data";
import { syncFromMySql } from "@/lib/dataStore";
import { sound } from "@/lib/soundEffects";
import {
  Users,
  Sparkles,
  CheckCircle2,
  Trash2,
  BookOpen,
  Plus,
  Check,
  Database,
  RefreshCw,
  HelpCircle,
  FolderPlus,
  ShieldCheck,
  UserPlus
} from "lucide-react";

export default function TeacherPage() {
  const { teacher, loginAsTeacher } = useAuth();
  const [activeTab, setActiveTab] = useState<"topics" | "questions" | "students">("topics");

  // State dữ liệu
  const [topics, setTopics] = useState<VietnameseTopic[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all");

  // State trạng thái CSDL SQLite
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; message: string; databasePath?: string } | null>(null);
  const [dbLoading, setDbLoading] = useState(false);

  // Modal tạo đề ôn tập
  const [createTopicModalOpen, setCreateTopicModalOpen] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [topicGrade, setTopicGrade] = useState(4);
  const [topicDesc, setTopicDesc] = useState("");

  // Modal tạo câu hỏi
  const [createQModalOpen, setCreateQModalOpen] = useState(false);
  const [qTargetTopicId, setQTargetTopicId] = useState("");
  const [qText, setQText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctIdx, setCorrectIdx] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  // Modal tạo học sinh
  const [createStudentModalOpen, setCreateStudentModalOpen] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentGrade, setStudentGrade] = useState(4);
  const [studentAvatar, setStudentAvatar] = useState("🦊");

  const avatarOptions = ["🦊", "🐼", "🐱", "🦁", "🐰", "🐻", "🦄", "🐶", "🐨", "🐯"];

  // Tải dữ liệu từ API SQLite
  const loadData = async () => {
    try {
      // Status
      const stRes = await fetch("/api/db/status");
      const stData = await stRes.json();
      setDbStatus(stData);

      // Topics
      const tRes = await fetch("/api/topics");
      const tData = await tRes.json();
      if (tData.success && Array.isArray(tData.data)) {
        setTopics(tData.data);
      }

      // Questions
      const qRes = await fetch("/api/questions");
      const qData = await qRes.json();
      if (qData.success && Array.isArray(qData.data)) {
        setQuestions(qData.data);
      }

      // Students
      const sRes = await fetch("/api/students");
      const sData = await sRes.json();
      if (sData.success && Array.isArray(sData.data)) {
        setStudents(sData.data);
      }
    } catch {
      setDbStatus({
        connected: false,
        message: "Lỗi kết nối API SQLite",
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Xử lý tạo Đề Ôn Tập mới
  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;
    sound.playClick();
    setDbLoading(true);

    try {
      const res = await fetch("/api/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: topicName.trim(),
          grade: topicGrade,
          description: topicDesc.trim() || `Chuyên đề ôn tập ${topicName.trim()} cho học sinh lớp ${topicGrade}.`,
          icon: "📚",
        }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playVictory();
        alert("Đã tạo đề ôn tập mới thành công vào CSDL SQLite!");
        setTopicName("");
        setTopicDesc("");
        setCreateTopicModalOpen(false);
        await loadData();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert("Lỗi: " + error.message);
    } finally {
      setDbLoading(false);
    }
  };

  // Xử lý Giao đề cho cả lớp
  const handleAssignTopic = async (topicId: string) => {
    sound.playClick();
    setDbLoading(true);
    try {
      const res = await fetch("/api/topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topicId }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playVictory();
        alert("Đã giao đề ôn tập này cho cả lớp! Học sinh ở nhà mở web sẽ thấy bài này ngay.");
        await loadData();
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert("Lỗi giao đề: " + error.message);
    } finally {
      setDbLoading(false);
    }
  };

  // Xử lý Thêm Câu Hỏi Mới
  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qText.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      alert("Vui lòng nhập đầy đủ nội dung câu hỏi và 4 đáp án A, B, C, D!");
      return;
    }
    sound.playClick();
    setDbLoading(true);

    const targetTopic = topics.find((t) => t.id === qTargetTopicId) || topics[0];

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "tieng-viet",
          grade: targetTopic ? targetTopic.grade : 4,
          topic: targetTopic ? targetTopic.name : "Tiếng Việt",
          topicId: targetTopic ? targetTopic.id : "topic_tu_loai",
          question: qText.trim(),
          options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
          correctIndex: correctIdx,
          explanation: explanation.trim() || `Đáp án đúng là: ${[optA, optB, optC, optD][correctIdx]}.`,
          difficulty,
        }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playVictory();
        alert("Đã thêm câu hỏi mới thành công vào ngân hàng SQLite!");
        setQText("");
        setOptA("");
        setOptB("");
        setOptC("");
        setOptD("");
        setExplanation("");
        setCreateQModalOpen(false);
        await loadData();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert("Lỗi: " + error.message);
    } finally {
      setDbLoading(false);
    }
  };

  // Xử lý Xóa Câu Hỏi
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Cô có chắc chắn muốn xóa câu hỏi này khỏi đề thi không?")) return;
    sound.playClick();
    try {
      const res = await fetch(`/api/questions?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        sound.playCorrect();
        await loadData();
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert("Lỗi xóa: " + error.message);
    }
  };

  // Xử lý Thêm Học Sinh Mới
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;
    sound.playClick();
    setDbLoading(true);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName.trim(),
          grade: studentGrade,
          avatar: studentAvatar,
        }),
      });
      const data = await res.json();
      if (data.success) {
        sound.playVictory();
        alert(`Đã thêm học sinh "${studentName.trim()}" vào danh sách lớp thành công!`);
        setStudentName("");
        setCreateStudentModalOpen(false);
        await loadData();
      } else {
        alert("Lỗi: " + data.message);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert("Lỗi: " + error.message);
    } finally {
      setDbLoading(false);
    }
  };

  // Xử lý Xóa Học Sinh
  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Cô có chắc chắn muốn xóa học sinh "${name}" khỏi lớp không?`)) return;
    sound.playClick();
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        sound.playCorrect();
        await loadData();
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert("Lỗi xóa học sinh: " + error.message);
    }
  };

  // Đồng bộ lại dữ liệu
  const handleSyncData = async () => {
    sound.playClick();
    setDbLoading(true);
    await syncFromMySql();
    await loadData();
    sound.playVictory();
    setDbLoading(false);
    alert("Đã làm mới dữ liệu từ CSDL SQLite thành công!");
  };

  // Nếu chưa đăng nhập cô giáo
  if (!teacher) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-4xl mx-auto shadow-inner">
              👩‍🏫
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 font-heading">Cổng Quản Trị Của Cô Giáo</h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Tạo đề ôn tập, quản lý ngân hàng câu hỏi Tiếng Việt và theo dõi bảng thành tích của học sinh.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Giáo viên:</span>
                <span>{DEMO_TEACHER.name}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Chủ nhiệm:</span>
                <span>{DEMO_TEACHER.className}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Trường học:</span>
                <span>{DEMO_TEACHER.schoolName}</span>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  sound.playClick();
                  loginAsTeacher();
                  sound.playVictory();
                }}
                className="w-full py-3.5 text-white font-bold text-sm rounded-xl bg-emerald-600 hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> Đăng Nhập Cô Giáo (1-Click)
              </button>
              <Link
                href="/"
                onClick={() => sound.playClick()}
                className="block w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition text-center"
              >
                ← Quay Về Góc Học Sinh
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lọc câu hỏi theo đề được chọn
  const filteredQuestions =
    selectedTopicId === "all" ? questions : questions.filter((q) => q.topicId === selectedTopicId);

  const activeTopic = topics.find((t) => t.isActive);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Banner Teacher Top */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner">
                👩‍🏫
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-amber-300" /> Cổng Quản Trị Dạy & Học
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-heading">{teacher.name}</h1>
                <p className="text-emerald-100 text-xs font-medium">
                  {teacher.schoolName} • Chủ Nhiệm {teacher.className}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition backdrop-blur-sm"
              >
                Xem Trang Học Sinh →
              </Link>
            </div>
          </div>
        </div>

        {/* SQLite Database Management Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">CSDL SQLite Cục Bộ</h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  dbStatus?.connected ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dbStatus?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  {dbStatus?.connected ? "SQLite Sẵn Sàng" : "Đang kiểm tra CSDL"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {dbStatus?.message || "Tự động lưu trữ vào: database/eduspark.db (Không cần cài đặt XAMPP)"}
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncData}
            disabled={dbLoading}
            className="w-full sm:w-auto px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dbLoading ? "animate-spin" : ""}`} />
            Làm Mới / Đồng Bộ
          </button>
        </div>

        {/* 3 Core Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("topics");
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "topics"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <BookOpen className="w-4 h-4" /> 1. Đề Ôn Tập & Giao Bài ({topics.length})
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("questions");
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "questions"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <HelpCircle className="w-4 h-4" /> 2. Ngân Hàng Câu Hỏi ({questions.length})
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab("students");
            }}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition whitespace-nowrap ${
              activeTab === "students"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" /> 3. Quản Lý Học Sinh ({students.length})
          </button>
        </div>

        {/* ========================================================
            TAB 1: ĐỀ ÔN TẬP & GIAO BÀI CHO LỚP
        ======================================================== */}
        {activeTab === "topics" && (
          <div className="space-y-6 animate-fade-in">
            {/* Banner đề đang được giao */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-sm">
                  📢
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                    Đề Đang Được Giao Cho Cả Lớp Tự Ôn Tập Tối Nay:
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                    {activeTopic?.name || "Chưa giao đề nào"}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {activeTopic?.description || "Cô hãy bấm 'Giao Đề Này Cho Cả Lớp' ở danh sách bên dưới."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setCreateTopicModalOpen(true);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow-xs flex items-center gap-2 shrink-0"
              >
                <FolderPlus className="w-4 h-4" /> Thêm Đề Ôn Tập Mới
              </button>
            </div>

            {/* Grid danh sách các đề */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((t) => (
                <div
                  key={t.id}
                  className={`bg-white rounded-2xl p-5 border transition flex flex-col justify-between space-y-4 ${
                    t.isActive
                      ? "border-emerald-500 shadow-sm ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{t.icon || "📖"}</span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{t.name}</h4>
                          <span className="text-[11px] font-semibold text-slate-400">Khối Lớp {t.grade}</span>
                        </div>
                      </div>
                      {t.isActive && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" /> Đang Giao
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{t.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {questions.filter((q) => q.topicId === t.id).length} câu hỏi
                    </span>

                    {t.isActive ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Đang hiển thị ở nhà học sinh
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAssignTopic(t.id)}
                        disabled={dbLoading}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition"
                      >
                        Giao Đề Này Cho Cả Lớp
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: NGÂN HÀNG CÂU HỎI
        ======================================================== */}
        {activeTab === "questions" && (
          <div className="space-y-5 animate-fade-in">
            {/* Header & Bộ lọc đề */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500 shrink-0">Lọc theo đề:</span>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                >
                  <option value="all">Tất Cả Các Đề ({questions.length} câu)</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({questions.filter((q) => q.topicId === t.id).length} câu)
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setQTargetTopicId(selectedTopicId !== "all" ? selectedTopicId : topics[0]?.id || "");
                  setCreateQModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm Câu Hỏi Mới
              </button>
            </div>

            {/* Danh sách câu hỏi */}
            <div className="space-y-3">
              {filteredQuestions.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-3xl block text-slate-300">📝</span>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Chưa có câu hỏi nào trong đề ôn tập này.
                  </p>
                  <button
                    onClick={() => {
                      setQTargetTopicId(selectedTopicId !== "all" ? selectedTopicId : topics[0]?.id || "");
                      setCreateQModalOpen(true);
                    }}
                    className="text-xs text-indigo-600 font-bold hover:underline"
                  >
                    Bấm vào đây để thêm câu hỏi đầu tiên
                  </button>
                </div>
              ) : (
                filteredQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md mr-2">
                            {q.topic}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-1 leading-snug">
                            {q.question}
                          </h4>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* 4 phương án */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-9">
                      {q.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === q.correctIndex;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl text-xs font-medium border flex items-center justify-between ${
                              isCorrect
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                : "bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                          >
                            <span>
                              <span className="font-bold mr-1.5">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              {opt}
                            </span>
                            {isCorrect && (
                              <span className="text-[10px] text-emerald-700 font-bold">Đáp án đúng ✓</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Lời giải */}
                    {q.explanation && (
                      <div className="pl-9 pt-1">
                        <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                          <strong>💡 Lời giải cô hướng dẫn:</strong> {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: QUẢN LÝ HỌC SINH & ĐIỂM SỐ
        ======================================================== */}
        {activeTab === "students" && (
          <div className="space-y-5 animate-fade-in">
            {/* Header Thao Tác */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Danh Sách Học Sinh Trong Lớp</h3>
                <p className="text-xs text-slate-500">
                  Tổng số: <strong>{students.length} học sinh</strong> • Điểm số lưu trực tiếp vào CSDL SQLite
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setCreateStudentModalOpen(true);
                }}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" /> Thêm Học Sinh Mới
              </button>
            </div>

            {/* Bảng Danh Sách Học Sinh */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Học Sinh</th>
                      <th className="py-3 px-4">Khối Lớp</th>
                      <th className="py-3 px-4">Điểm Tích Lũy (XP)</th>
                      <th className="py-3 px-4">Cấp Độ</th>
                      <th className="py-3 px-4">Chuỗi Học (Streak)</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {students.map((st, idx) => (
                      <tr key={st.studentId} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{st.avatar || "🦊"}</span>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                              <span className="text-[10px] text-slate-400 font-mono">{st.studentId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">Lớp {st.grade}</td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-amber-600 text-sm">+{st.xp} XP</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold text-[11px]">
                            Cấp {st.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-amber-500 font-bold">🔥 {st.streak} ngày</span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteStudent(st.studentId, st.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Xóa học sinh khỏi lớp"
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
      </main>

      {/* ========================================================
          MODAL: THÊM ĐỀ ÔN TẬP MỚI
      ======================================================== */}
      {createTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FolderPlus className="w-4 h-4" /> Tạo Đề Ôn Tập Mới Cho Lớp
              </h3>
              <button
                onClick={() => setCreateTopicModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Đề Ôn Tập / Chuyên Đề:</label>
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="Ví dụ: Luyện Từ Loại: Danh Từ - Động Từ - Tính Từ"
                  required
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Khối Lớp:</label>
                <select
                  value={topicGrade}
                  onChange={(e) => setTopicGrade(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                >
                  <option value={4}>Lớp 4 (Tiểu học)</option>
                  <option value={5}>Lớp 5 (Tiểu học)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả hướng dẫn học sinh ôn tập:</label>
                <textarea
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                  rows={3}
                  placeholder="Ví dụ: Các em ôn lại định nghĩa danh từ, động từ và hoàn thành đầy đủ các câu đố."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateTopicModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={dbLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  {dbLoading ? "Đang lưu..." : "Lưu Đề Vào CSDL SQLite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: THÊM CÂU HỎI MỚI
      ======================================================== */}
      {createQModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between shrink-0">
              <h3 className="font-bold text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Thêm Câu Hỏi Mới Vào Ngân Hàng
              </h3>
              <button
                onClick={() => setCreateQModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 space-y-4 text-xs flex-1 overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Thuộc Đề Ôn Tập:</label>
                <select
                  value={qTargetTopicId}
                  onChange={(e) => setQTargetTopicId(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Lớp {t.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội Dung Câu Hỏi:</label>
                <textarea
                  value={qText}
                  onChange={(e) => setQText(e.target.value)}
                  rows={2}
                  placeholder="Ví dụ: Trong câu 'Bác nông dân chăm chỉ cày ruộng', từ nào là Động từ?"
                  required
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">4 Phương Án Trắc Nghiệm (Chọn nút tròn đáp án đúng):</label>
                {[
                  { label: "A", val: optA, set: setOptA, idx: 0 },
                  { label: "B", val: optB, set: setOptB, idx: 1 },
                  { label: "C", val: optC, set: setOptC, idx: 2 },
                  { label: "D", val: optD, set: setOptD, idx: 3 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={correctIdx === item.idx}
                      onChange={() => setCorrectIdx(item.idx)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      title="Chọn đây là đáp án đúng"
                    />
                    <span className="font-bold text-slate-500 w-4">{item.label}.</span>
                    <input
                      type="text"
                      value={item.val}
                      onChange={(e) => item.set(e.target.value)}
                      placeholder={`Nội dung phương án ${item.label}`}
                      required
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lời giải thích cho học sinh:</label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Ví dụ: 'Cày' là động từ chỉ hoạt động lao động trên đồng ruộng."
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mức Độ:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 font-medium"
                >
                  <option value="easy">Dễ (Nhận biết)</option>
                  <option value="medium">Vừa (Thông hiểu)</option>
                  <option value="hard">Khó (Vận dụng)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateQModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={dbLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  {dbLoading ? "Đang lưu..." : "Lưu Câu Hỏi Vào CSDL SQLite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: THÊM HỌC SINH MỚI
      ======================================================== */}
      {createStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-emerald-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <UserPlus className="w-4 h-4" /> Thêm Học Sinh Mới Vào Lớp
              </h3>
              <button
                onClick={() => setCreateStudentModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ Và Tên Học Sinh:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Minh Châu"
                  required
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Khối Lớp:</label>
                <select
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(Number(e.target.value))}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 font-medium"
                >
                  <option value={4}>Lớp 4A</option>
                  <option value={5}>Lớp 5A</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">Chọn Linh Vật Đại Diện (Avatar):</label>
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setStudentAvatar(av)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition ${
                        studentAvatar === av
                          ? "bg-emerald-100 border-2 border-emerald-500 scale-110"
                          : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={dbLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  {dbLoading ? "Đang lưu..." : "Thêm Vào CSDL SQLite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

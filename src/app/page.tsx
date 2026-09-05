"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/authStore";
import { sound } from "@/lib/soundEffects";
import { BADGES, calculateLevel, StudentProfile, VietnameseTopic } from "@/lib/data";
import { getClassStudents, getActiveVietnameseTopic } from "@/lib/dataStore";
import SpeedQuizGame from "@/components/games/SpeedQuizGame";
import MemoryFlipGame from "@/components/games/MemoryFlipGame";
import WordScrambleGame from "@/components/games/WordScrambleGame";
import TrueFalseGame from "@/components/games/TrueFalseGame";
import SortingBasketGame from "@/components/games/SortingBasketGame";
import LaserMatchGame from "@/components/games/LaserMatchGame";
import SentenceBuilderGame from "@/components/games/SentenceBuilderGame";
import VocabularyNotebookModal from "@/components/VocabularyNotebookModal";
import AuthModal from "@/components/AuthModal";
import AvatarModal from "@/components/AvatarModal";
import {
  Sparkles,
  Trophy,
  Flame,
  BookOpen,
  ArrowRight,
  Play
} from "lucide-react";

type GameType =
  | "speed-quiz"
  | "sorting-basket"
  | "laser-match"
  | "word-scramble"
  | "true-false"
  | "memory-flip"
  | "sentence-builder";

type CategoryFilter = "all" | "speed" | "classify" | "match" | "sentence";

export default function HomePage() {
  const { student } = useAuth();
  const [classList, setClassList] = useState<StudentProfile[]>([]);
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [vocabModalOpen, setVocabModalOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<VietnameseTopic | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

  // Nạp dữ liệu học sinh & chuyên đề từ SQLite
  const loadData = async () => {
    try {
      // 1. Học sinh
      const sRes = await fetch("/api/students");
      const sData = await sRes.json();
      if (sData.success && Array.isArray(sData.data)) {
        setClassList(sData.data);
      } else {
        setClassList(getClassStudents());
      }

      // 2. Chuyên đề đang kích hoạt
      const tRes = await fetch("/api/topics");
      const tData = await tRes.json();
      if (tData.success && Array.isArray(tData.data)) {
        const foundActive = (tData.data as VietnameseTopic[]).find((t) => t.isActive);
        setActiveTopic(foundActive || tData.data[0] || getActiveVietnameseTopic());
      } else {
        setActiveTopic(getActiveVietnameseTopic());
      }
    } catch {
      setClassList(getClassStudents());
      setActiveTopic(getActiveVietnameseTopic());
    }
  };

  useEffect(() => {
    loadData();

    const handleClassChange = () => loadData();
    const handleTopicChange = () => loadData();

    window.addEventListener("eduspark_class_change", handleClassChange);
    window.addEventListener("eduspark_topics_change", handleTopicChange);

    return () => {
      window.removeEventListener("eduspark_class_change", handleClassChange);
      window.removeEventListener("eduspark_topics_change", handleTopicChange);
    };
  }, []);

  const sortedStudents = [...classList].sort((a, b) => b.xp - a.xp);
  const studentLevelData = student ? calculateLevel(student.xp) : null;

  const handleStartGame = (game: GameType) => {
    sound.playClick();
    if (!student) {
      sound.playWrong();
      setAuthModalOpen(true);
      return;
    }
    setActiveGame(game);
  };

  // Danh sách các bài tập ôn luyện trọng tâm
  const gamesList = [
    {
      id: "speed-quiz" as GameType,
      category: "speed" as CategoryFilter,
      title: "Vua Tiếng Việt",
      subtitle: "Trắc nghiệm đề cô giao • 15s/câu",
      description: "Thử thách trắc nghiệm nhanh theo đúng ngân hàng câu hỏi cô giáo vừa biên soạn và giao cho lớp.",
      icon: "⚡",
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
      tag: "Trắc nghiệm tốc độ",
      badge: "Cô Giao Ôn Tập",
      reward: "+60 XP",
    },
    {
      id: "sorting-basket" as GameType,
      category: "classify" as CategoryFilter,
      title: "Kéo Thả Phân Loại",
      subtitle: "Danh từ, Động từ, Tính từ",
      description: "Phân loại trực quan các từ ngữ vào đúng giỏ học tập (từ đơn/ghép/láy, biện pháp tu từ so sánh/nhân hóa).",
      icon: "🧺",
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      tag: "Kéo thả từ loại",
      badge: "Hiểu sâu ngữ pháp",
      reward: "+80 XP",
    },
    {
      id: "sentence-builder" as GameType,
      category: "sentence" as CategoryFilter,
      title: "Bắt Chữ Hoàn Câu",
      subtitle: "Trật tự câu & Dấu câu",
      description: "Sắp xếp các cụm từ bị đảo lộn thành câu văn chuẩn mực, đúng ngữ pháp và cách đặt dấu câu.",
      icon: "✍️",
      iconBg: "bg-sky-50 text-sky-600 border-sky-100",
      tag: "Ghép câu hoàn chỉnh",
      badge: "Luyện kỹ năng viết",
      reward: "+75 XP",
    },
    {
      id: "laser-match" as GameType,
      category: "match" as CategoryFilter,
      title: "Nối Cột Từ Ngữ Laser",
      subtitle: "Đồng nghĩa, Trái nghĩa & Ca dao",
      description: "Nối cặp khái niệm tương ứng: từ đồng nghĩa, từ trái nghĩa, giải nghĩa thành ngữ và tục ngữ dân gian.",
      icon: "🔗",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      tag: "Nối cặp ngữ nghĩa",
      badge: "Mở rộng vốn từ",
      reward: "+70 XP",
    },
    {
      id: "word-scramble" as GameType,
      category: "sentence" as CategoryFilter,
      title: "Thánh Chính Tả",
      subtitle: "Phân biệt tr/ch, s/x, d/gi/r",
      description: "Nhận biết và sửa các lỗi chính tả phổ biến trong tiếng Việt, rèn thói quen viết đúng âm vần.",
      icon: "🔤",
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      tag: "Rèn chữ & chính tả",
      badge: "Chuẩn ngữ âm",
      reward: "+70 XP",
    },
    {
      id: "true-false" as GameType,
      category: "speed" as CategoryFilter,
      title: "Đúng Hay Sai Tiếng Việt",
      subtitle: "Thử thách 10 giây phản xạ",
      description: "Đánh giá tính đúng/sai của câu văn, cấu trúc ngữ pháp và cách dùng từ ngữ trong thời gian ngắn.",
      icon: "❓",
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      tag: "Phán đoán siêu tốc",
      badge: "Phản xạ nhanh",
      reward: "+90 XP",
    },
    {
      id: "memory-flip" as GameType,
      category: "match" as CategoryFilter,
      title: "Lật Thẻ Trí Nhớ Từ Ngữ",
      subtitle: "Ghi nhớ từ vựng lâu dài",
      description: "Lật các thẻ bài để ghép đúng cặp từ đồng nghĩa, trái nghĩa. Rèn luyện trí nhớ và sự tập trung.",
      icon: "🃏",
      iconBg: "bg-teal-50 text-teal-600 border-teal-100",
      tag: "Trí nhớ thị giác",
      badge: "Ghi nhớ bền vững",
      reward: "+65 XP",
    },
  ];

  const filteredGames = gamesList.filter(
    (g) => selectedCategory === "all" || g.category === selectedCategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40 text-slate-800 selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 space-y-10 pb-16">
        {/* ========================================================
            PHẦN 1: HERO & ĐỀ ÔN TẬP CÔ GIAO
        ======================================================== */}
        <section className="pt-8 pb-10 border-b border-slate-200/60 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Cột trái: Giới thiệu & Đề ôn tập */}
              <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Nền tảng tự học & ôn tập Tiếng Việt chuẩn mực tại nhà</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                  Ôn Tập Tiếng Việt Theo Đề Cô Giao, <br />
                  <span className="text-indigo-600">Thi Đua Bảng Vàng</span> Mỗi Tối
                </h1>

                {/* THẺ ĐỀ CÔ GIAO TRỌNG TÂM */}
                {activeTopic && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border-2 border-indigo-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-2xl shadow-sm shrink-0">
                        {activeTopic.icon || "📖"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                            Cô Giáo Đang Giao Ôn Tập
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            Khối Lớp {activeTopic.grade}
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                          {activeTopic.name}
                        </h2>
                        <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                          {activeTopic.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartGame("speed-quiz")}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 shrink-0"
                    >
                      <Play className="w-4 h-4 fill-white" /> Vào Ôn Đề Này Ngay
                    </button>
                  </div>
                )}
              </div>

              {/* Cột phải: Thẻ cá nhân học sinh */}
              <div className="lg:col-span-4">
                {student ? (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 text-center sm:text-left">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                        {student.avatar || "🦊"}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{student.name}</h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {student.className} • Cấp độ {studentLevelData?.level || 1} ({studentLevelData?.title || "Mầm Non"})
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Điểm Tích Lũy</span>
                        <span className="text-base font-black text-amber-600">+{student.xp} XP</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Chuỗi Học Tập</span>
                        <span className="text-base font-black text-rose-600 flex items-center justify-center gap-1">
                          <Flame className="w-4 h-4 fill-rose-500" /> {student.streak} Ngày
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setVocabModalOpen(true);
                        }}
                        className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Sổ Tay Từ Vựng
                      </button>
                      <button
                        onClick={() => {
                          sound.playClick();
                          setAvatarModalOpen(true);
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
                      >
                        Đổi Avatar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-3">
                    <span className="text-3xl block">👋</span>
                    <h3 className="font-bold text-slate-900 text-base">Em Chưa Đăng Nhập</h3>
                    <p className="text-xs text-slate-500">
                      Đăng nhập nhanh để lưu lại điểm thưởng XP và ghi danh lên Bảng Vàng của lớp nhé!
                    </p>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setAuthModalOpen(true);
                      }}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      Đăng Nhập Ngay (1-Click)
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            PHẦN 2: CÁC BÀI TẬP ÔN LUYỆN TIẾNG VIỆT
        ======================================================== */}
        <section id="games" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Kho Bài Luyện Ôn Tập Tiếng Việt
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chọn hình thức ôn tập phù hợp với chuyên đề cô giáo đang giao
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-200/50 rounded-xl border border-slate-200">
              {[
                { id: "all" as CategoryFilter, label: "Tất Cả" },
                { id: "speed" as CategoryFilter, label: "Phản Xạ Nhanh" },
                { id: "classify" as CategoryFilter, label: "Phân Loại Từ" },
                { id: "sentence" as CategoryFilter, label: "Ghép Câu & Chữ" },
                { id: "match" as CategoryFilter, label: "Nối Cặp Khái Niệm" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedCategory === cat.id
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Games */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGames.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-xl font-bold ${g.iconBg}`}>
                      {g.icon}
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {g.reward}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                    {g.tag}
                  </span>

                  <h3 className="text-base font-bold text-slate-900">{g.title}</h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5 mb-2">{g.subtitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-normal">
                    {g.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">{g.badge}</span>
                  <button
                    onClick={() => handleStartGame(g.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    Bắt Đầu <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================
            PHẦN 3: BẢNG THÀNH TÍCH THI ĐUA CẢ LỚP (LEADERBOARD)
        ======================================================== */}
        <section id="leaderboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-600" /> Bảng Thành Tích Thi Đua Cả Lớp
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Bảng Vàng Danh Dự Lớp 4A
            </h2>
            <p className="text-xs text-slate-500">
              Điểm số được đồng bộ trực tiếp từ kết quả làm bài tập của học sinh trong CSDL SQLite
            </p>
          </div>

          {/* Top 3 Podium Cards */}
          {sortedStudents.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto items-end pt-2">
              {/* Hạng 2 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center order-2 md:order-1">
                <span className="text-2xl mb-1 block">🥈 Hạng Nhì</span>
                <span className="text-4xl block mb-1.5">{sortedStudents[1]?.avatar || "🐼"}</span>
                <h4 className="font-bold text-slate-900 text-sm">{sortedStudents[1]?.name}</h4>
                <span className="text-[11px] text-slate-400 block font-mono">{sortedStudents[1]?.studentId}</span>
                <div className="mt-3 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
                  +{sortedStudents[1]?.xp} XP
                </div>
              </div>

              {/* Hạng 1 */}
              <div className="bg-gradient-to-b from-amber-50 to-white p-6 rounded-2xl border-2 border-amber-300 shadow-sm text-center order-1 md:order-2 transform md:-translate-y-2">
                <span className="text-3xl mb-1 block">👑 Thủ Khoa Tuần</span>
                <span className="text-5xl block mb-2">{sortedStudents[0]?.avatar || "🦊"}</span>
                <h4 className="font-bold text-slate-900 text-base">{sortedStudents[0]?.name}</h4>
                <span className="text-xs font-bold text-amber-700 block font-mono">{sortedStudents[0]?.studentId}</span>
                <div className="mt-3 px-3 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-black">
                  +{sortedStudents[0]?.xp} XP
                </div>
              </div>

              {/* Hạng 3 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center order-3">
                <span className="text-2xl mb-1 block">🥉 Hạng Ba</span>
                <span className="text-4xl block mb-1.5">{sortedStudents[2]?.avatar || "🦁"}</span>
                <h4 className="font-bold text-slate-900 text-sm">{sortedStudents[2]?.name}</h4>
                <span className="text-[11px] text-slate-400 block font-mono">{sortedStudents[2]?.studentId}</span>
                <div className="mt-3 px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-bold text-slate-700">
                  +{sortedStudents[2]?.xp} XP
                </div>
              </div>
            </div>
          )}

          {/* Bảng Danh Sách Xếp Hạng Đầy Đủ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden max-w-4xl mx-auto">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-700">Toàn Bộ Danh Sách Thi Đua ({sortedStudents.length} bạn)</span>
              <span className="text-[11px] text-slate-400">Cập nhật theo thời gian thực từ CSDL</span>
            </div>

            <div className="divide-y divide-slate-100">
              {sortedStudents.map((st, idx) => (
                <div
                  key={st.studentId}
                  className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-6 text-center font-bold text-xs ${
                      idx === 0 ? "text-amber-500 text-sm font-black" : idx === 1 ? "text-slate-400 font-bold" : idx === 2 ? "text-amber-700 font-bold" : "text-slate-400"
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="text-2xl">{st.avatar || "🦊"}</span>
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{st.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{st.studentId} • Lớp {st.grade}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs text-rose-500 font-bold hidden sm:inline">
                      🔥 {st.streak} ngày
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
                      +{st.xp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Danh mục Huy Hiệu */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs max-w-4xl mx-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Huy Hiệu Thi Đua Có Thể Chinh Phục:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {BADGES.map((b) => (
                <div
                  key={b.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center hover:bg-slate-100/80 transition"
                >
                  <span className="text-2xl block mb-1">{b.icon}</span>
                  <span className="font-bold text-xs text-slate-800 block">{b.title}</span>
                  <span className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 font-normal">
                    {b.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <span className="font-bold text-slate-800">EduSpark Tiếng Việt</span>
            <span>— Nền tảng tự học & ôn tập tại nhà chuẩn Cấp 1 & 2</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#games" className="hover:text-indigo-600 transition">Bài Ôn Tập</a>
            <a href="#leaderboard" className="hover:text-indigo-600 transition">Bảng Thành Tích</a>
          </div>

          <p className="text-slate-400">© 2026 EduSpark. Chuẩn sư phạm & công nghệ giáo dục hiện đại.</p>
        </div>
      </footer>

      {/* OVERLAY GAME MODALS */}
      {activeGame === "speed-quiz" && (
        <SpeedQuizGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "sorting-basket" && (
        <SortingBasketGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "sentence-builder" && (
        <SentenceBuilderGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "laser-match" && (
        <LaserMatchGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "word-scramble" && (
        <WordScrambleGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "true-false" && (
        <TrueFalseGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "memory-flip" && (
        <MemoryFlipGame onClose={() => setActiveGame(null)} />
      )}

      {/* SỔ TAY NGÔN TỪ */}
      <VocabularyNotebookModal
        isOpen={vocabModalOpen}
        onClose={() => setVocabModalOpen(false)}
      />

      {/* ĐỔI AVATAR */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />

      {/* ĐĂNG NHẬP NHANH */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="student"
      />
    </div>
  );
}

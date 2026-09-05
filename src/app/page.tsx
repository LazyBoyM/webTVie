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
import LuckyWheelGame from "@/components/games/LuckyWheelGame";
import VocabularyNotebookModal from "@/components/VocabularyNotebookModal";
import AuthModal from "@/components/AuthModal";
import AvatarModal from "@/components/AvatarModal";
import {
  Sparkles,
  Trophy,
  Flame,
  Gamepad2,
  BookOpen,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

type GameType =
  | "speed-quiz"
  | "sorting-basket"
  | "laser-match"
  | "word-scramble"
  | "true-false"
  | "memory-flip"
  | "sentence-builder"
  | "lucky-wheel";

type CategoryFilter = "all" | "speed" | "classify" | "match" | "sentence" | "wheel";

export default function HomePage() {
  const { student } = useAuth();
  const [classList, setClassList] = useState<StudentProfile[]>([]);
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [vocabModalOpen, setVocabModalOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<VietnameseTopic | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

  useEffect(() => {
    const update = () => setClassList(getClassStudents());
    const updateTopic = () => setActiveTopic(getActiveVietnameseTopic());

    update();
    updateTopic();

    window.addEventListener("eduspark_class_change", update);
    window.addEventListener("eduspark_topics_change", updateTopic);

    return () => {
      window.removeEventListener("eduspark_class_change", update);
      window.removeEventListener("eduspark_topics_change", updateTopic);
    };
  }, []);

  const sortedStudents = [...classList].sort((a, b) => b.xp - a.xp);
  const studentLevelData = student ? calculateLevel(student.xp) : null;

  const handleStartGame = (game: GameType) => {
    sound.playClick();
    setActiveGame(game);
  };

  // Game List Metadata
  const gamesList = [
    {
      id: "speed-quiz" as GameType,
      category: "speed",
      title: "Vua Tiếng Việt",
      subtitle: "Luyện Từ & Câu • 15s/câu",
      description: "Trắc nghiệm phản xạ kiến thức theo đúng chuyên đề cô giáo đang giao. Rèn luyện sự tập trung và tư duy ngôn ngữ nhanh.",
      icon: "⚡",
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
      tag: "Trắc nghiệm tốc độ",
      badge: "Cô Giao Ôn Tập",
      reward: "+60 XP",
    },
    {
      id: "sorting-basket" as GameType,
      category: "classify",
      title: "Kéo Thả Từ Loại",
      subtitle: "Danh từ, Động từ, Tính từ",
      description: "Thao tác kéo thả trực quan để phân loại từ ngữ vào đúng giỏ tri thức (từ đơn/ghép/láy, tu từ so sánh/nhân hóa).",
      icon: "🧺",
      iconBg: "bg-purple-50 text-purple-600 border-purple-100",
      tag: "Tương tác kéo thả",
      badge: "Hiểu sâu bản chất",
      reward: "+80 XP",
    },
    {
      id: "sentence-builder" as GameType,
      category: "sentence",
      title: "Bắt Chữ Hoàn Câu",
      subtitle: "Trật tự câu & Dấu câu",
      description: "Sắp xếp các cụm từ bị xáo trộn thành câu văn hoàn chỉnh, đúng trật tự ngữ pháp và quy tắc dấu câu tiếng Việt.",
      icon: "✍️",
      iconBg: "bg-sky-50 text-sky-600 border-sky-100",
      tag: "Ghép câu hoàn chỉnh",
      badge: "Kỹ năng đặt câu",
      reward: "+75 XP",
    },
    {
      id: "laser-match" as GameType,
      category: "match",
      title: "Nối Cột Từ Ngữ Laser",
      subtitle: "Đồng nghĩa, Trái nghĩa & Ca dao",
      description: "Nối 2 cột khái niệm tương ứng: cặp từ đồng nghĩa, trái nghĩa, thành ngữ tục ngữ dân gian và từ Hán - Việt.",
      icon: "🔗",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      tag: "Nối cặp khái niệm",
      badge: "Mở rộng vốn từ",
      reward: "+70 XP",
    },
    {
      id: "word-scramble" as GameType,
      category: "sentence",
      title: "Thánh Chính Tả",
      subtitle: "Phân biệt tr/ch, s/x, d/gi",
      description: "Khôi phục lại các từ ngữ bị xáo trộn chữ cái, rèn luyện thói quen viết đúng chính tả các âm vần dễ lẫn.",
      icon: "🔤",
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      tag: "Rèn chữ & chính tả",
      badge: "Quy tắc ngữ âm",
      reward: "+70 XP",
    },
    {
      id: "true-false" as GameType,
      category: "speed",
      title: "Đúng Hay Sai Tiếng Việt",
      subtitle: "Thử thách 45 giây phản xạ",
      description: "Nhận định nhanh các quy tắc ngữ pháp, dấu câu và cấu trúc câu tiếng Việt trong nhịp độ hồi hộp, cuốn hút.",
      icon: "❓",
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      tag: "Phán đoán siêu tốc",
      badge: "Kiểm tra phản xạ",
      reward: "+90 XP",
    },
    {
      id: "memory-flip" as GameType,
      category: "match",
      title: "Lật Thẻ Ghép Đôi Từ Ngữ",
      subtitle: "Rèn luyện trí nhớ lâu dài",
      description: "Lật thẻ tìm cặp từ đồng nghĩa, từ trái nghĩa hoặc ghép tranh minh họa tương ứng. Tăng khả năng ghi nhớ dài hạn.",
      icon: "🃏",
      iconBg: "bg-teal-50 text-teal-600 border-teal-100",
      tag: "Trí nhớ thị giác",
      badge: "Ghi nhớ sâu",
      reward: "+65 XP",
    },
    {
      id: "lucky-wheel" as GameType,
      category: "wheel",
      title: "Vòng Quay Tri Thức",
      subtitle: "Thử thách điểm danh mỗi tối",
      description: "Quay ngẫu nhiên các ô câu hỏi chuyên đề để mở rương điểm thưởng XP và nhận quà tặng may mắn.",
      icon: "🎡",
      iconBg: "bg-orange-50 text-orange-600 border-orange-100",
      tag: "Quà tặng may mắn",
      badge: "Điểm danh hàng ngày",
      reward: "Đến +100 XP",
    },
  ];

  const filteredGames = gamesList.filter(
    (g) => selectedCategory === "all" || g.category === selectedCategory
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/40 text-slate-800 selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="pt-8 pb-14 lg:pt-14 lg:pb-20 border-b border-slate-200/60 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Heading & Value Proposition */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Nền tảng tự học Gamified môn Tiếng Việt dành cho học sinh Cấp 1 & 2</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.2]">
                  Tự Học Tiếng Việt Chủ Động, <br />
                  <span className="text-indigo-600">Vững Vàng Ngữ Pháp</span> Mỗi Tối Tại Nhà
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
                  Hệ thống bài tập cô giáo giao kết hợp 8 trò chơi tương tác giúp các em ghi nhớ sâu từ loại, cấu tạo từ, phân biệt chuẩn chính tả và làm chủ thành ngữ tục ngữ mà không hề nhàm chán.
                </p>

                {/* TEACHER ASSIGNED TOPIC NOTIFICATION CARD */}
                {activeTopic && (
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-xs border border-indigo-100">
                        {activeTopic.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white">
                            Cô Mai Lan Giao Ôn Tập
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            Lớp {activeTopic.grade} • {activeTopic.categoryName}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                          {activeTopic.name}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-1">
                          {activeTopic.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartGame("speed-quiz")}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
                    >
                      Vào Ôn Tập Ngay <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <a
                    href="#games"
                    onClick={() => sound.playClick()}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition flex items-center gap-2"
                  >
                    <Gamepad2 className="w-4 h-4" /> Khám Phá 8 Trò Chơi
                  </a>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setVocabModalOpen(true);
                    }}
                    className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" /> Sổ Tay Từ Vựng
                  </button>
                </div>
              </div>

              {/* Right Column: Clean Interactive Preview Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4 max-w-md mx-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        ⚡
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">Vua Tiếng Việt</h4>
                        <span className="text-[11px] text-slate-400">Câu hỏi luyện tập mẫu</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      Chuyên đề tuần
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <span>Câu 1/6 • Phân loại từ</span>
                      <span className="text-indigo-600 font-bold">15s</span>
                    </div>
                    <p className="font-bold text-slate-800 text-sm leading-snug">
                      Trong câu &ldquo;Những cánh chim bay lượn trên bầu trời xanh&rdquo;, từ &ldquo;bay lượn&rdquo; thuộc từ loại nào?
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold pt-1">
                      <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-between">
                        <span>A. Động từ</span>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600">
                        <span>B. Danh từ</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600">
                        <span>C. Tính từ</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600">
                        <span>D. Quan hệ từ</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartGame("speed-quiz")}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    Bắt Đầu Thử Thách Ngay <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STUDENT STATUS BAR (When logged in) */}
        {student && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl">
                  {student.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">{student.name}</h3>
                    <span className="px-2 py-0.2 rounded bg-indigo-600 text-white text-[10px] font-bold">
                      {student.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {student.className} • Cấp độ {student.level} ({studentLevelData?.title})
                  </p>
                </div>
              </div>

              {/* Progress & Stats */}
              <div className="flex items-center gap-6 text-xs font-semibold">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Điểm tích lũy</span>
                  <span className="text-amber-600 font-bold text-sm">⚡ {student.xp} XP</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Chuỗi ngày học</span>
                  <span className="text-orange-500 font-bold text-sm flex items-center">
                    <Flame className="w-3.5 h-3.5 mr-0.5" /> {student.streak} ngày
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setAvatarModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Đổi Linh Vật
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 8 VIETNAMESE GAMES HUB */}
        <section id="games" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
              <Gamepad2 className="w-3.5 h-3.5" /> Kho Trò Chơi Tự Học Tiếng Việt
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              8 Trò Chơi Ôn Tập Ngôn Từ Mỗi Tối
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Được thiết kế chuẩn mực: Từ loại, Chính tả, Đặt câu, Từ đồng nghĩa - trái nghĩa & Ca dao tục ngữ.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-8">
            {[
              { id: "all", label: "Tất Cả (8)" },
              { id: "speed", label: "Phản Xạ Nhanh" },
              { id: "classify", label: "Kéo Thả Phân Loại" },
              { id: "sentence", label: "Luyện Chữ & Câu" },
              { id: "match", label: "Nối Cột & Trí Nhớ" },
              { id: "wheel", label: "Vòng Quay May Mắn" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat.id as CategoryFilter);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedCategory === cat.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredGames.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl font-bold shadow-xs ${g.iconBg}`}>
                      {g.icon}
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {g.reward}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                    {g.tag}
                  </span>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {g.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-400 mt-0.5 mb-2">
                    {g.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 font-normal">
                    {g.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {g.badge}
                  </span>
                  <button
                    onClick={() => handleStartGame(g.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-bold transition flex items-center gap-1"
                  >
                    Bắt Đầu <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STUDY HABIT & VOCABULARY NOTEBOOK SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-3.5 text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 font-semibold text-xs">
                  <BookOpen className="w-3.5 h-3.5" /> Bí Quyết Tự Học Tiếng Việt 15 Phút Mỗi Tối
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Tích Lũy Vốn Từ & Ghi Nhớ Bền Lâu
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl font-normal">
                  Mỗi lần làm bài tập hoặc chơi mini-game, những từ ngữ hay, quy tắc chính tả và thành ngữ ca dao mới sẽ được tự động lưu vào <strong>Sổ Tay Ngôn Từ</strong> của em để ôn tập lại bất kỳ lúc nào.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setVocabModalOpen(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                  >
                    <BookOpen className="w-4 h-4" /> Mở Sổ Tay Ngôn Từ Của Em
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 max-w-xs w-full text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mx-auto font-bold">
                    📖
                  </div>
                  <h4 className="font-bold text-sm text-white">Sổ Tay Ngôn Từ</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Đã có sẵn danh mục từ đồng nghĩa, từ loại, chính tả và thành ngữ ca dao giúp em tự tra cứu tại nhà.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLASS LEADERBOARD SECTION */}
        <section id="leaderboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-600" /> Bảng Vàng Vinh Danh
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Top Học Sinh Lớp 4A Tuần Này
            </h2>
            <p className="text-xs text-slate-500">
              Điểm số được tính tự động từ kết quả làm bài tập và chơi mini-game tại nhà
            </p>
          </div>

          {/* Top 3 Podium Cards */}
          {sortedStudents.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 items-end">
              {/* 2nd place */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center order-2 md:order-1">
                <span className="text-2xl mb-1 block">🥈</span>
                <span className="text-3xl block mb-1">{sortedStudents[1]?.avatar || "🐼"}</span>
                <h4 className="font-bold text-slate-900 text-sm">{sortedStudents[1]?.name}</h4>
                <span className="text-[11px] text-slate-400 block">{sortedStudents[1]?.studentId}</span>
                <div className="mt-2.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                  {sortedStudents[1]?.xp} XP
                </div>
              </div>

              {/* 1st place */}
              <div className="bg-gradient-to-b from-amber-50/70 to-white p-6 rounded-2xl border-2 border-amber-300 shadow-sm text-center order-1 md:order-2 transform md:-translate-y-2">
                <span className="text-3xl mb-1 block">👑</span>
                <span className="text-4xl block mb-1">{sortedStudents[0]?.avatar || "🦊"}</span>
                <h4 className="font-bold text-slate-900 text-base">{sortedStudents[0]?.name}</h4>
                <span className="text-xs font-bold text-amber-700 block">{sortedStudents[0]?.studentId}</span>
                <div className="mt-2.5 px-3 py-1 bg-amber-400 text-slate-950 rounded-lg text-xs font-bold">
                  {sortedStudents[0]?.xp} XP
                </div>
              </div>

              {/* 3rd place */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs text-center order-3">
                <span className="text-2xl mb-1 block">🥉</span>
                <span className="text-3xl block mb-1">{sortedStudents[2]?.avatar || "🦁"}</span>
                <h4 className="font-bold text-slate-900 text-sm">{sortedStudents[2]?.name}</h4>
                <span className="text-[11px] text-slate-400 block">{sortedStudents[2]?.studentId}</span>
                <div className="mt-2.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                  {sortedStudents[2]?.xp} XP
                </div>
              </div>
            </div>
          )}

          {/* Badges Showcase */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs max-w-4xl mx-auto">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Huy Hiệu Có Thể Mở Khóa:
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
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <span className="font-bold text-slate-800">EduSpark Tiếng Việt</span>
            <span>— Nền tảng tự học & ôn tập tại nhà chuẩn Cấp 1 & 2</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#games" className="hover:text-indigo-600 transition">Trò Chơi</a>
            <a href="#leaderboard" className="hover:text-indigo-600 transition">Bảng Vàng</a>
            <a href="/teacher" className="hover:text-indigo-600 transition">Cổng Giáo Viên</a>
          </div>

          <p className="text-slate-400">© 2026 EduSpark. Chuẩn sư phạm & công nghệ giáo dục hiện đại.</p>
        </div>
      </footer>

      {/* GAME MODAL OVERLAYS */}
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
      {activeGame === "lucky-wheel" && (
        <LuckyWheelGame onClose={() => setActiveGame(null)} />
      )}

      {/* VOCABULARY NOTEBOOK MODAL */}
      <VocabularyNotebookModal
        isOpen={vocabModalOpen}
        onClose={() => setVocabModalOpen(false)}
      />

      {/* AVATAR WARDROBE MODAL */}
      <AvatarModal
        isOpen={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
      />

      {/* AUTH MODAL */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="student"
      />
    </div>
  );
}

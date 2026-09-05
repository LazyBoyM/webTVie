"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/authStore";
import { sound } from "@/lib/soundEffects";
import { BADGES, calculateLevel, DEFAULT_DAILY_QUESTS, StudentProfile, VietnameseTopic } from "@/lib/data";
import { getClassStudents, getActiveVietnameseTopic } from "@/lib/dataStore";
import SpeedQuizGame from "@/components/games/SpeedQuizGame";
import MemoryFlipGame from "@/components/games/MemoryFlipGame";
import WordScrambleGame from "@/components/games/WordScrambleGame";
import TrueFalseGame from "@/components/games/TrueFalseGame";
import SortingBasketGame from "@/components/games/SortingBasketGame";
import LaserMatchGame from "@/components/games/LaserMatchGame";
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
  QrCode,
  CheckCircle2,
  Gift
} from "lucide-react";

type GameType =
  | "speed-quiz"
  | "sorting-basket"
  | "laser-match"
  | "word-scramble"
  | "true-false"
  | "memory-flip";

export default function HomePage() {
  const { student, addStudentXp } = useAuth();
  const [classList, setClassList] = useState<StudentProfile[]>([]);
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [quests] = useState(DEFAULT_DAILY_QUESTS);
  const [claimedQuests, setClaimedQuests] = useState<string[]>([]);
  const [activeTopic, setActiveTopic] = useState<VietnameseTopic | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col selection:bg-spark-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spark-100 border border-spark-200 text-spark-800 text-xs sm:text-sm font-extrabold shadow-sm animate-pulse-glow">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>🇻🇳 Vũ Trụ Ôn Tập Tiếng Việt & Ngữ Văn Gamified Cấp 1 & 2</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black font-heading text-slate-900 tracking-tight leading-[1.15]">
                  Học Tốt Tiếng Việt, <br />
                  <span className="bg-gradient-to-r from-spark-600 via-indigo-600 to-berry-500 bg-clip-text text-transparent">
                    Đua Top Tri Thức
                  </span>{" "}
                  Mỗi Ngày! ⚡
                </h1>

                <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto lg:mx-0">
                  Nắm chắc từ loại, cấu tạo từ, mở rộng vốn từ đồng nghĩa - trái nghĩa, sửa lỗi chính tả và làm chủ thành ngữ tục ngữ qua hệ thống mini-games vui nhộn chuẩn SGK!
                </p>

                {/* ASSIGNED VIETNAMESE TOPIC BANNER */}
                {activeTopic && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-spark-700 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-2 border-purple-300">
                    <div className="flex items-center gap-3 text-left">
                      <span className="text-3xl">{activeTopic.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider">
                            Cô Mai Lan Giao Ôn Tập
                          </span>
                          <span className="text-xs font-bold text-purple-200">
                            Lớp {activeTopic.grade} • {activeTopic.categoryName}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black font-heading text-white">
                          {activeTopic.name}
                        </h4>
                        <p className="text-xs text-purple-100 line-clamp-1">
                          {activeTopic.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartGame("speed-quiz")}
                      className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shrink-0"
                    >
                      Ôn Tập Ngay ⚡
                    </button>
                  </div>
                )}

                {/* Call to action buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <button
                    onClick={() => handleStartGame("speed-quiz")}
                    className="px-7 py-4 text-white font-black text-lg rounded-2xl btn-game-purple flex items-center gap-2.5 shadow-xl"
                  >
                    <Gamepad2 className="w-6 h-6" /> Vào Chơi Ngay
                  </button>

                  <a
                    href="#games"
                    onClick={() => sound.playClick()}
                    className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-base rounded-2xl border-2 border-slate-200 shadow-md transition flex items-center gap-2"
                  >
                    <BookOpen className="w-5 h-5 text-purple-600" /> Chọn Trò Chơi Ôn Tập
                  </a>
                </div>

                {/* Key badges row */}
                <div className="grid grid-cols-3 gap-3 pt-6 max-w-lg mx-auto lg:mx-0">
                  <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm text-center">
                    <span className="text-xl sm:text-2xl block mb-0.5">🇻🇳</span>
                    <span className="text-xs font-bold text-slate-800 block">Tiếng Việt SGK</span>
                    <span className="text-[10px] text-slate-400">Lớp 1 đến Lớp 9</span>
                  </div>
                  <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm text-center">
                    <span className="text-xl sm:text-2xl block mb-0.5">🪪</span>
                    <span className="text-xs font-bold text-slate-800 block">Mã Học Sinh</span>
                    <span className="text-[10px] text-slate-400">Không lo quên pass</span>
                  </div>
                  <div className="p-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-sm text-center">
                    <span className="text-xl sm:text-2xl block mb-0.5">🤖</span>
                    <span className="text-xs font-bold text-slate-800 block">Trợ Lý AI</span>
                    <span className="text-[10px] text-slate-400">Cô soạn đề theo chủ đề</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Game Showcase Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border-4 border-spark-200">
                  {/* Badge floating */}
                  <div className="absolute -top-4 -right-3 bg-amber-400 text-amber-950 font-black text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1 animate-wiggle">
                    <Flame className="w-4 h-4 fill-amber-500" /> HOT TRONG TUẦN
                  </div>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-spark-100 flex items-center justify-center text-2xl">
                      ⚡
                    </div>
                    <div>
                      <h3 className="text-lg font-black font-heading text-slate-900">
                        Vua Tiếng Việt: Luyện Từ & Câu
                      </h3>
                      <p className="text-xs text-slate-500 font-bold">
                        Chuyên đề: {activeTopic?.name || "Từ Loại Tiếng Việt"}
                      </p>
                    </div>
                  </div>

                  {/* Sample Interactive Question Card */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                      <span>Câu 1/6 • Phân Loại Từ</span>
                      <span className="text-spark-600 font-black">15s</span>
                    </div>
                    <p className="font-extrabold text-slate-800 text-base">
                      Trong câu &ldquo;Những cánh chim bay lượn trên bầu trời xanh&rdquo;, từ &ldquo;bay lượn&rdquo; thuộc từ loại nào?
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <div className="p-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-400 text-emerald-900 flex items-center justify-between">
                        <span>A. Động từ</span>
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600">
                        <span>B. Danh từ</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600">
                        <span>C. Tính từ</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600">
                        <span>D. Quan hệ từ</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartGame("speed-quiz")}
                    className="w-full py-3.5 text-white font-black text-base rounded-2xl btn-game-purple flex items-center justify-center gap-2 shadow-md"
                  >
                    Bắt Đầu Ôn Tập Ngay ⚡ <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STUDENT STATUS OR QUICK LOGIN BAR */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          {student ? (
            <div className="bg-gradient-to-r from-spark-600 via-indigo-600 to-berry-600 rounded-3xl p-6 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-inner">
                  {student.avatar}
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl sm:text-2xl font-black font-heading">{student.name}</h3>
                    <span className="px-2 py-0.5 bg-amber-400 text-amber-950 text-xs font-black rounded-md">
                      Mã: {student.studentId}
                    </span>
                  </div>
                  <p className="text-spark-100 text-xs sm:text-sm font-medium mt-0.5">
                    {student.className} • {studentLevelData?.title} (Cấp {student.level})
                  </p>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="flex-1 max-w-md w-full bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-spark-100">Tiến Độ Lên Cấp Kế Tiếp</span>
                  <span className="text-amber-300 font-extrabold">{student.xp} XP</span>
                </div>
                <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (studentLevelData?.currentXp || 50) / ((studentLevelData?.nextLevelXp || 500) / 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Streak info & Avatar Customize */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
                  <Flame className="w-8 h-8 text-amber-400 fill-amber-400 animate-bounce" />
                  <div className="text-left">
                    <span className="block text-2xl font-black leading-none">{student.streak} Ngày</span>
                    <span className="text-[11px] font-bold text-amber-200 uppercase">Chuỗi Giữ Vững</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playClick();
                    setAvatarModalOpen(true);
                  }}
                  className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-2xl text-xs font-black transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                >
                  <span>🎨</span> Đổi Avatar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-spark-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-spark-100 text-spark-600 flex items-center justify-center text-2xl">
                  🦊
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black font-heading text-slate-800">
                    Em Chưa Đăng Nhập Tài Khoản Học Sinh?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Nhập mã học sinh để lưu điểm thi đua, nhận huy hiệu và thăng cấp!
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sound.playClick();
                    setAuthModalOpen(true);
                  }}
                  className="px-6 py-3 text-white font-black text-sm rounded-xl btn-game-purple shadow-md flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" /> Đăng Nhập Mã HS / Quét QR
                </button>
              </div>
            </div>
          )}

          {/* DAILY QUESTS CHECKLIST */}
          {student && (
            <div className="mt-6 bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-800 font-heading">
                      Thử Thách Hàng Ngày (Daily Quests)
                    </h4>
                    <p className="text-xs text-slate-400 font-bold">
                      Hoàn thành thử thách để nhận thêm điểm thưởng XP tăng cấp nhanh!
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {quests.map((q) => {
                  const isClaimed = claimedQuests.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-spark-200 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-2xl">{q.icon}</span>
                          <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                            +{q.rewardXp} XP
                          </span>
                        </div>
                        <h5 className="font-extrabold text-xs text-slate-800 leading-snug">
                          {q.title}
                        </h5>
                      </div>

                      <button
                        disabled={isClaimed}
                        onClick={() => {
                          if (isClaimed) return;
                          sound.playVictory();
                          addStudentXp(q.rewardXp);
                          setClaimedQuests([...claimedQuests, q.id]);
                        }}
                        className={`mt-4 py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                          isClaimed
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "btn-game-purple text-white shadow-sm"
                        }`}
                      >
                        {isClaimed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Đã Nhận Thưởng
                          </>
                        ) : (
                          "Bấm Nhận Thưởng 🎁"
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* 6 VIETNAMESE REVIEW GAMES HUB */}
        <section id="games" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-wider mb-2">
              <Gamepad2 className="w-4 h-4 text-purple-600" /> VŨ TRỤ TRÒ CHƠI ÔN TẬP TIẾNG VIỆT
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">
              Góc Tự Học & Luyện Tập Tại Nhà
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-2">
              Bao quát toàn diện: Từ loại, Chính tả, Từ đồng nghĩa - trái nghĩa, Thành ngữ tục ngữ & Biện pháp tu từ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Game 1: Vua Tiếng Việt (Speed Quiz) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-spark-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-spark-600 to-indigo-500 text-white flex items-center justify-center text-3xl shadow-md mb-4 group-hover:scale-105 transition">
                  ⚡
                </div>
                <span className="text-xs font-black text-spark-600 uppercase tracking-wider block mb-1">
                  Đọc Hiểu & Ngữ Pháp • Lớp 1 - 9
                </span>
                <h3 className="text-2xl font-black font-heading text-slate-800 mb-2">
                  Vua Tiếng Việt
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                  Trắc nghiệm 15 giây theo đúng chuyên đề cô giáo giao. Tích hợp giọng đọc tự động và lời giải thích ngữ pháp chi tiết!
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 bg-spark-50 text-spark-700 rounded-lg text-xs font-bold">
                    ⏱️ 15s/câu
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">
                    🔥 Combo Streak
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                    🔊 Đọc đề tự động
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStartGame("speed-quiz")}
                className="w-full py-3.5 text-white font-black text-base rounded-2xl btn-game-purple shadow-md flex items-center justify-center gap-2"
              >
                Chơi Ngay ⚡
              </button>
            </div>

            {/* Game 2: Sorting Basket (Kéo Thả Phân Loại Từ Loại) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-black uppercase tracking-wider">
                Yêu Thích 🌟
              </div>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 text-white flex items-center justify-center text-3xl shadow-md mb-4 group-hover:scale-105 transition">
                  🧺
                </div>
                <span className="text-xs font-black text-purple-600 uppercase tracking-wider block mb-1">
                  Ngữ Pháp • Vận Động Trí Tuệ
                </span>
                <h3 className="text-2xl font-black font-heading text-slate-800 mb-2">
                  Kéo Thả Từ Loại
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                  Phân loại từ ngữ vào đúng các giỏ: Danh từ, Động từ, Tính từ, Từ láy, Từ ghép... Rèn khả năng nhận diện từ loại siêu tốc!
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold">
                    🧺 3 Giỏ phân loại
                  </span>
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                    🏛️ Danh/Động/Tính
                  </span>
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                    ⚡ Vận động vui mắt
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStartGame("sorting-basket")}
                className="w-full py-3.5 text-white font-black text-base rounded-2xl btn-game-purple shadow-md flex items-center justify-center gap-2"
              >
                Chơi Ngay 🧺
              </button>
            </div>

            {/* Game 3: Laser Match (Nối Cột Từ Ngữ Laser) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-wider">
                Mới Lạ ⚡
              </div>
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-600 to-teal-500 text-white flex items-center justify-center text-3xl shadow-md mb-4 group-hover:scale-105 transition">
                  🔗
                </div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-wider block mb-1">
                  Vốn Từ & Thành Ngữ • Liên Tưởng Sâu
                </span>
                <h3 className="text-2xl font-black font-heading text-slate-800 mb-2">
                  Nối Cột Từ Ngữ Laser
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                  Bắn tia laser nối 2 cột: Cặp từ đồng nghĩa, cặp từ trái nghĩa, và ghép các vế câu thành ngữ ca dao với ý nghĩa tương ứng!
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold">
                    ⚡ Tia laser neon
                  </span>
                  <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-bold">
                    🔄 Đồng nghĩa - Trái nghĩa
                  </span>
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold">
                    📜 Thành ngữ dân gian
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStartGame("laser-match")}
                className="w-full py-3.5 text-white font-black text-base rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md flex items-center justify-center gap-2"
              >
                Chơi Ngay 🔗
              </button>
            </div>

            {/* Game 4: Word Scramble (Thánh Chính Tả) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-pink-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-berry-600 text-white flex items-center justify-center text-3xl shadow-md mb-4 group-hover:scale-105 transition">
                  🔤
                </div>
                <span className="text-xs font-black text-pink-600 uppercase tracking-wider block mb-1">
                  Chính Tả & Vốn Từ • Rèn Luyện Chữ
                </span>
                <h3 className="text-2xl font-black font-heading text-slate-800 mb-2">
                  Thánh Chính Tả
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                  Sắp xếp các chữ cái xáo trộn thành từ ngữ chuẩn tiếng Việt. Phân biệt phụ âm đầu tr/ch, s/x, d/r/gi và dấu hỏi - ngã!
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 bg-pink-50 text-pink-700 rounded-lg text-xs font-bold">
                    ✍️ Chuẩn chính tả
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">
                    💡 Gợi ý ngữ nghĩa
                  </span>
                  <span className="px-2.5 py-1 bg-spark-50 text-spark-700 rounded-lg text-xs font-bold">
                    🇻🇳 100% Tiếng Việt
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStartGame("word-scramble")}
                className="w-full py-3.5 text-white font-black text-base rounded-2xl btn-game-pink shadow-md flex items-center justify-center gap-2"
              >
                Chơi Ngay 🔤
              </button>
            </div>

            {/* Game 5: True or False Blitz (Đúng Hay Sai Tiếng Việt) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-spark-600 text-white flex items-center justify-center text-3xl shadow-md mb-4 group-hover:scale-105 transition">
                  ❓
                </div>
                <span className="text-xs font-black text-indigo-600 uppercase tracking-wider block mb-1">
                  Tư Duy Ngôn Ngữ • Phản Xạ 45s
                </span>
                <h3 className="text-2xl font-black font-heading text-slate-800 mb-2">
                  Đúng Hay Sai Tiếng Việt
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                  45 giây phản xạ chớp nhoáng: Nhận diện câu đúng ngữ pháp, quy tắc đặt dấu câu và biện pháp nghệ thuật So sánh - Nhân hóa!
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                    ⏱️ 45s dồn dập
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                    ✅ 2 Lựa chọn
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">
                    ⚡ Combo siêu cao
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStartGame("true-false")}
                className="w-full py-3.5 text-white font-black text-base rounded-2xl btn-game-purple shadow-md flex items-center justify-center gap-2"
              >
                Chơi Ngay ❓
              </button>
            </div>

            {/* Game 6: Memory Flip (Lật Thẻ Ghép Đôi Từ Vựng) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-mint-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-3xl shadow-md mb-4 group-hover:scale-105 transition">
                  🃏
                </div>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider block mb-1">
                  Trí Nhớ Dài Hạn • Cặp Kiến Thức
                </span>
                <h3 className="text-2xl font-black font-heading text-slate-800 mb-2">
                  Lật Thẻ Ghép Đôi Từ Ngữ
                </h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4">
                  Lật thẻ ghép đôi các cặp từ đồng nghĩa, từ trái nghĩa, hoặc ghép hình ảnh nghệ thuật tương ứng. Rèn luyện trí nhớ ngôn từ lâu dài!
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                    🧠 Ghi nhớ từ ngữ
                  </span>
                  <span className="px-2.5 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold">
                    ⏱️ Bấm giờ kỷ lục
                  </span>
                  <span className="px-2.5 py-1 bg-mint-50 text-mint-700 rounded-lg text-xs font-bold">
                    ⭐ Đánh giá sao
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleStartGame("memory-flip")}
                className="w-full py-3.5 text-white font-black text-base rounded-2xl btn-game-green shadow-md flex items-center justify-center gap-2"
              >
                Chơi Ngay 🃏
              </button>
            </div>
          </div>
        </section>

        {/* HOME SELF-STUDY SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border-4 border-purple-400 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-400/20 text-purple-300 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-amber-300" /> BÍ QUYẾT TỰ HỌC TIẾNG VIỆT TẠI NHÀ HIỆU QUẢ
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-heading text-white">
                  15 Phút Mỗi Ngày, <br />
                  <span className="text-amber-300">Vững Vàng Tiếng Việt!</span>
                </h2>
                <p className="text-slate-300 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                  Không cần học thêm căng thẳng: Học sinh chỉ cần mở app ở nhà mỗi tối, ôn đúng chuyên đề cô giao, chơi các trò chơi ngôn từ để ghi nhớ sâu ngữ pháp và chính tả!
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                    <span className="text-2xl block mb-1">📖</span>
                    <h5 className="font-black text-white text-xs">1. Ôn Chuyên Đề</h5>
                    <p className="text-[11px] text-slate-300">Hoàn thành bài tập cô Mai Lan vừa giao</p>
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                    <span className="text-2xl block mb-1">🎮</span>
                    <h5 className="font-black text-white text-xs">2. Chơi Mini-Game</h5>
                    <p className="text-[11px] text-slate-300">Luyện từ loại, chính tả, ca dao tục ngữ</p>
                  </div>
                  <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                    <span className="text-2xl block mb-1">🔥</span>
                    <h5 className="font-black text-white text-xs">3. Giữ Chuỗi Lửa</h5>
                    <p className="text-[11px] text-slate-300">Nhận điểm XP và thăng hạng Bảng Vàng</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 text-center">
                <div className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 inline-block max-w-sm w-full shadow-inner">
                  <div className="text-5xl mb-3">🏡</div>
                  <h4 className="font-black text-xl text-white">Góc Học Tập Nhỏ</h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Dán thẻ QR của cô phát lên góc bàn học. Mỗi tối chỉ cần quét một chạm là vào học ngay!
                  </p>
                  <div className="mt-5 pt-4 border-t border-white/10 flex justify-center items-center gap-4">
                    <span className="text-xs font-bold text-emerald-300">✓ Không quên mật khẩu</span>
                    <span className="text-xs font-bold text-amber-300">✓ 100% Tiếng Việt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLASS LEADERBOARD SECTION */}
        <section id="leaderboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4 text-amber-600" /> Bảng Vàng Vinh Danh
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-slate-900">
              Top Học Sinh Lớp 4A Tuần Này
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-2">
              Điểm số được cập nhật tự động sau mỗi lượt chơi mini-game và làm bài tập
            </p>
          </div>

          {/* Leaderboard Podium Top 3 */}
          {sortedStudents.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8 items-end">
              {/* 2nd place */}
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md text-center order-2 md:order-1">
                <div className="text-3xl mb-1">🥈</div>
                <div className="text-4xl mb-2">{sortedStudents[1]?.avatar || "🐼"}</div>
                <h4 className="font-black text-slate-800 text-base">{sortedStudents[1]?.name}</h4>
                <span className="text-xs font-bold text-slate-400 block">{sortedStudents[1]?.studentId}</span>
                <div className="mt-3 px-3 py-1.5 bg-slate-100 rounded-xl font-extrabold text-sm text-slate-700">
                  {sortedStudents[1]?.xp} XP
                </div>
              </div>

              {/* 1st place */}
              <div className="bg-gradient-to-b from-amber-50 to-white p-7 rounded-3xl border-4 border-amber-300 shadow-xl text-center order-1 md:order-2 transform md:-translate-y-4">
                <div className="text-4xl mb-1 animate-bounce">👑</div>
                <div className="text-5xl mb-2">{sortedStudents[0]?.avatar || "🦊"}</div>
                <h4 className="font-black text-slate-900 text-lg">{sortedStudents[0]?.name}</h4>
                <span className="text-xs font-extrabold text-amber-600 block">{sortedStudents[0]?.studentId}</span>
                <div className="mt-3 px-4 py-2 bg-amber-400 text-amber-950 rounded-xl font-black text-base shadow-sm">
                  {sortedStudents[0]?.xp} XP ⚡
                </div>
              </div>

              {/* 3rd place */}
              <div className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-md text-center order-3">
                <div className="text-3xl mb-1">🥉</div>
                <div className="text-4xl mb-2">{sortedStudents[2]?.avatar || "🦁"}</div>
                <h4 className="font-black text-slate-800 text-base">{sortedStudents[2]?.name}</h4>
                <span className="text-xs font-bold text-slate-400 block">{sortedStudents[2]?.studentId}</span>
                <div className="mt-3 px-3 py-1.5 bg-amber-50 rounded-xl font-extrabold text-sm text-amber-700">
                  {sortedStudents[2]?.xp} XP
                </div>
              </div>
            </div>
          )}

          {/* Badges Showcase */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
            <h4 className="text-base font-extrabold text-slate-800 mb-4 flex items-center gap-2">
              🏅 Bộ Huy Hiệu Danh Dự Có Thể Mở Khóa:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {BADGES.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center hover:scale-105 transition"
                >
                  <span className="text-3xl block mb-1">{b.icon}</span>
                  <span className="font-black text-xs text-slate-800 block">{b.title}</span>
                  <span className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">{b.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-spark-600 flex items-center justify-center text-white font-black text-base">
              ⚡
            </div>
            <div>
              <span className="font-black text-slate-900">EduSpark</span>
              <span className="text-xs text-slate-400 block">Nền tảng học tập gamified cho học sinh Cấp 1 & 2</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <a href="#games" className="hover:text-spark-600 transition">Mini-Games</a>
            <a href="#leaderboard" className="hover:text-spark-600 transition">Bảng Vàng</a>
            <a href="/teacher" className="hover:text-spark-600 transition">Cổng Giáo Viên</a>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 EduSpark. Thiết kế hiện đại & chuẩn sư phạm.
          </p>
        </div>
      </footer>

      {/* GAME MODAL OVERLAYS */}
      {activeGame === "speed-quiz" && (
        <SpeedQuizGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "memory-flip" && (
        <MemoryFlipGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "word-scramble" && (
        <WordScrambleGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "true-false" && (
        <TrueFalseGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "sorting-basket" && (
        <SortingBasketGame onClose={() => setActiveGame(null)} />
      )}
      {activeGame === "laser-match" && (
        <LaserMatchGame onClose={() => setActiveGame(null)} />
      )}

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

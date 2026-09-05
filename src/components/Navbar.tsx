"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authStore";
import { sound } from "@/lib/soundEffects";
import { Sparkles, Trophy, Gamepad2, GraduationCap, Volume2, VolumeX, LogOut, Flame } from "lucide-react";
import AuthModal from "./AuthModal";

export default function Navbar() {
  const { student, teacher, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"student" | "teacher">("student");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    sound.playClick();
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  const openStudentLogin = () => {
    sound.playClick();
    setAuthTab("student");
    setAuthModalOpen(true);
  };

  const openTeacherLogin = () => {
    sound.playClick();
    setAuthTab("teacher");
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b-2 border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={() => sound.playClick()}
            className="flex items-center gap-3 group transition"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-spark-600 via-spark-500 to-amber-400 p-0.5 shadow-md group-hover:scale-105 transition">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-spark-600 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black font-heading tracking-tight bg-gradient-to-r from-spark-700 via-spark-600 to-berry-600 bg-clip-text text-transparent">
                EduSpark
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-amber-600 -mt-1">
                Ôn Tập Tiếng Việt 🇻🇳
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <Link
              href="/"
              onClick={() => sound.playClick()}
              className="px-3.5 py-2 rounded-xl font-bold text-sm text-slate-700 hover:text-spark-600 hover:bg-spark-50 transition"
            >
              Trang Chủ
            </Link>
            <Link
              href="#games"
              onClick={() => sound.playClick()}
              className="px-3.5 py-2 rounded-xl font-bold text-sm text-slate-700 hover:text-spark-600 hover:bg-spark-50 transition flex items-center gap-1.5"
            >
              <Gamepad2 className="w-4 h-4 text-spark-500" />
              6 Trò Chơi Ôn Tập
            </Link>
            <Link
              href="#leaderboard"
              onClick={() => sound.playClick()}
              className="px-3.5 py-2 rounded-xl font-bold text-sm text-slate-700 hover:text-spark-600 hover:bg-spark-50 transition flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              Bảng Vàng Thi Đua
            </Link>
            <Link
              href="/teacher"
              onClick={() => sound.playClick()}
              className="px-3.5 py-2 rounded-xl font-bold text-sm text-slate-700 hover:text-spark-600 hover:bg-spark-50 transition flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Góc Giáo Viên (Soạn Bài)
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              className={`p-2.5 rounded-xl border transition ${
                soundEnabled
                  ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                  : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Profile State */}
            {student ? (
              <div className="flex items-center gap-3 bg-spark-50 border-2 border-spark-200 rounded-2xl p-1.5 pr-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-xl shadow-inner border border-spark-200">
                  {student.avatar}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-spark-900">{student.name}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-black bg-spark-600 text-white rounded-md">
                      Lv.{student.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold mt-0.5">
                    <span className="text-amber-600">⚡ {student.xp} XP</span>
                    <span className="flex items-center text-orange-500 font-black">
                      <Flame className="w-3.5 h-3.5 mr-0.5" /> {student.streak} ngày
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    logout();
                  }}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : teacher ? (
              <div className="flex items-center gap-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-1.5 pr-3 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-inner">
                  👩‍🏫
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <span className="font-extrabold text-sm text-emerald-900">{teacher.name}</span>
                  <span className="block text-[11px] font-bold text-emerald-700">Giáo viên quản nhiệm</span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    logout();
                  }}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openStudentLogin}
                  className="px-4 py-2.5 text-sm font-extrabold text-white rounded-xl btn-game-purple shadow-sm"
                >
                  Học Sinh Đăng Nhập
                </button>
                <button
                  onClick={openTeacherLogin}
                  className="hidden sm:inline-flex px-3.5 py-2.5 text-sm font-bold text-slate-700 hover:text-spark-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
                >
                  Giáo Viên
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
      />
    </>
  );
}

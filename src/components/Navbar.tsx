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
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            onClick={() => sound.playClick()}
            className="flex items-center gap-3 group transition"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-indigo-700 transition">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                EduSpark
              </span>
              <span className="block text-[11px] font-semibold text-indigo-600 tracking-wide">
                Tiếng Việt Cấp 1 & 2
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              onClick={() => sound.playClick()}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition"
            >
              Trang Chủ
            </Link>
            <Link
              href="#games"
              onClick={() => sound.playClick()}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition flex items-center gap-1.5"
            >
              <Gamepad2 className="w-4 h-4 text-indigo-500" />
              Bài Ôn Tập
            </Link>
            <Link
              href="/#leaderboard"
              onClick={() => sound.playClick()}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 transition flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              Bảng Thành Tích
            </Link>
            <Link
              href="/teacher"
              onClick={() => sound.playClick()}
              className="px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/60 transition flex items-center gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Góc Giáo Viên
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              className={`p-2 rounded-xl border transition ${
                soundEnabled
                  ? "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
                  : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Profile State */}
            {student ? (
              <div className="flex items-center gap-2.5 bg-indigo-50/80 border border-indigo-200 rounded-xl p-1.5 pr-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-lg shadow-xs border border-indigo-100">
                  {student.avatar}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">{student.name}</span>
                    <span className="px-1.5 py-0.2 bg-indigo-600 text-white text-[10px] font-bold rounded">
                      Lv.{student.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mt-0.5">
                    <span className="text-amber-600 font-bold">⚡ {student.xp} XP</span>
                    <span className="flex items-center text-orange-500 font-bold">
                      <Flame className="w-3 h-3 mr-0.5" /> {student.streak} ngày
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    logout();
                  }}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : teacher ? (
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl p-1.5 pr-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-xs">
                  Cô
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <span className="font-bold text-xs text-emerald-950 block">{teacher.name}</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Giáo viên</span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    logout();
                  }}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openStudentLogin}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition"
                >
                  Đăng Nhập Học Sinh
                </button>
                <button
                  onClick={openTeacherLogin}
                  className="hidden sm:inline-flex px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
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

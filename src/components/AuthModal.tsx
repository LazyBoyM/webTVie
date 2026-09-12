"use client";

import { useState } from "react";
import { useAuth } from "@/lib/authStore";
import { sound } from "@/lib/soundEffects";
import { Sparkles, User, LogIn, KeyRound, AlertCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "student" | "teacher";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "student" }: AuthModalProps) {
  const [tab, setTab] = useState<"student" | "teacher">(defaultTab);

  // Student Form
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");

  // Teacher Form
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");

  // Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { loginAsStudent, loginAsTeacher } = useAuth();

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!studentId.trim()) {
      setErrorMsg("Vui lòng nhập mã học sinh!");
      sound.playWrong();
      return;
    }

    if (!pin.trim()) {
      setErrorMsg("Vui lòng nhập mã PIN bảo vệ!");
      sound.playWrong();
      return;
    }

    sound.playClick();
    const result = loginAsStudent(studentId.trim(), pin.trim());
    if (!result.success) {
      setErrorMsg(result.message || "Đăng nhập thất bại!");
      sound.playWrong();
      return;
    }

    sound.playVictory();
    onClose();
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!teacherEmail.trim() || !teacherPassword.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ email và mật khẩu!");
      sound.playWrong();
      return;
    }

    sound.playClick();
    const result = loginAsTeacher(teacherEmail.trim(), teacherPassword.trim());
    if (!result.success) {
      setErrorMsg(result.message || "Email hoặc mật khẩu không chính xác!");
      sound.playWrong();
      return;
    }

    sound.playVictory();
    onClose();
    window.location.href = "/teacher";
  };

  const switchTab = (newTab: "student" | "teacher") => {
    sound.playClick();
    setTab(newTab);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 text-white text-center relative">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
          <div className="inline-flex p-2.5 bg-white/10 rounded-2xl mb-2 backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h3 className="text-xl font-bold font-heading">
            {tab === "student" ? "Đăng Nhập Học Sinh" : "Cổng Quản Trị Giáo Viên"}
          </h3>
          <p className="text-indigo-100 text-xs mt-1">
            {tab === "student"
              ? "Nhập mã học sinh và mã PIN để vào học"
              : "Đăng nhập tài khoản giáo viên để quản lý lớp"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => switchTab("student")}
            className={`flex-1 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              tab === "student"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="w-4 h-4" /> Học Sinh
          </button>
          <button
            type="button"
            onClick={() => switchTab("teacher")}
            className={`flex-1 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
              tab === "teacher"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <KeyRound className="w-4 h-4" /> Cô Giáo
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {tab === "student" ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mã Học Sinh (ID Thẻ)
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ví dụ: HS01, HS02..."
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-2.5 text-base font-bold text-slate-800 uppercase bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mã PIN Bảo Vệ
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  placeholder="Nhập mã PIN..."
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full px-4 py-2.5 text-base bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white font-bold text-base rounded-xl bg-indigo-600 hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Đăng Nhập
              </button>
            </form>
          ) : (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Giáo Viên
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="email@example.com"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Mật Khẩu
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu..."
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white font-bold text-base rounded-xl bg-emerald-600 hover:bg-emerald-700 transition shadow-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Đăng Nhập Quản Trị
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

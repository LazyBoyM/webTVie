"use client";

import { useState } from "react";
import { useAuth } from "@/lib/authStore";
import { sound } from "@/lib/soundEffects";
import { Sparkles, QrCode, User, LogIn, KeyRound, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "student" | "teacher";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "student" }: AuthModalProps) {
  const [tab, setTab] = useState<"student" | "teacher">(defaultTab);
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const { loginAsStudent, loginAsTeacher } = useAuth();

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim()) return;
    sound.playClick();
    loginAsStudent(studentId, pin);
    sound.playVictory();
    onClose();
  };

  const handleQuickStudent = (id: string) => {
    sound.playClick();
    loginAsStudent(id);
    sound.playVictory();
    onClose();
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    loginAsTeacher();
    sound.playVictory();
    onClose();
  };

  const simulateQrScan = (id: string) => {
    setScannerOpen(false);
    handleQuickStudent(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-spark-200 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-spark-600 via-spark-500 to-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-lg transition"
          >
            ✕
          </button>
          <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-2 backdrop-blur-md">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-wiggle" />
          </div>
          <h3 className="text-2xl font-black font-heading tracking-wide">
            {tab === "student" ? "Chào Bạn Nhỏ! 🎮" : "Cổng Đăng Nhập Giáo Viên 👩‍🏫"}
          </h3>
          <p className="text-spark-100 text-sm mt-1">
            {tab === "student"
              ? "Nhập mã học sinh để lưu điểm và nhận thưởng"
              : "Quản lý bài giảng, tạo quiz AI và xem tiến độ"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 p-2 bg-slate-50">
          <button
            onClick={() => {
              sound.playClick();
              setTab("student");
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              tab === "student"
                ? "bg-white text-spark-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <User className="w-4 h-4" /> Dành Cho Học Sinh
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTab("teacher");
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
              tab === "teacher"
                ? "bg-white text-spark-600 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <KeyRound className="w-4 h-4" /> Dành Cho Giáo Viên
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {tab === "student" ? (
            <div className="space-y-4">
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Mã Học Sinh Của Em
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: HS01, HS02, HS03..."
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full px-4 py-3 text-lg font-bold text-spark-900 uppercase bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-spark-500 focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setScannerOpen(!scannerOpen)}
                      title="Quét mã thẻ học sinh"
                      className="absolute right-2.5 top-2.5 p-2 text-spark-600 hover:bg-spark-50 rounded-xl transition"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {scannerOpen && (
                  <div className="p-4 bg-spark-50 rounded-2xl border-2 border-dashed border-spark-300 text-center animate-fade-in">
                    <QrCode className="w-10 h-10 text-spark-600 mx-auto mb-2 animate-bounce" />
                    <p className="text-xs font-bold text-spark-700 mb-2">
                      Mô phỏng quét mã thẻ học sinh bằng camera:
                    </p>
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => simulateQrScan("HS01")}
                        className="px-3 py-1 bg-spark-600 text-white text-xs font-bold rounded-lg hover:bg-spark-700"
                      >
                        Quét Thẻ HS01
                      </button>
                      <button
                        type="button"
                        onClick={() => simulateQrScan("HS02")}
                        className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700"
                      >
                        Quét Thẻ HS02
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Mã PIN bảo vệ (mặc định: 1234)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="1234"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full px-4 py-2.5 text-base bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-spark-500 focus:outline-none transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 text-white font-black text-lg rounded-2xl btn-game-purple flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" /> Bắt Đầu Học & Nhận XP
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center mb-2.5">
                  ⚡ Chọn nhanh học sinh mẫu:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickStudent("HS01")}
                    className="p-2 text-center bg-slate-50 hover:bg-spark-50 rounded-xl border border-slate-200 hover:border-spark-300 transition group"
                  >
                    <span className="text-xl block mb-1">🦊</span>
                    <span className="block text-xs font-bold text-slate-700 group-hover:text-spark-600">Gia Bảo</span>
                    <span className="block text-[10px] text-slate-400">Mã: HS01</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStudent("HS02")}
                    className="p-2 text-center bg-slate-50 hover:bg-spark-50 rounded-xl border border-slate-200 hover:border-spark-300 transition group"
                  >
                    <span className="text-xl block mb-1">🐼</span>
                    <span className="block text-xs font-bold text-slate-700 group-hover:text-spark-600">Minh Anh</span>
                    <span className="block text-[10px] text-slate-400">Mã: HS02</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickStudent("HS03")}
                    className="p-2 text-center bg-slate-50 hover:bg-spark-50 rounded-xl border border-slate-200 hover:border-spark-300 transition group"
                  >
                    <span className="text-xl block mb-1">🦁</span>
                    <span className="block text-xs font-bold text-slate-700 group-hover:text-spark-600">Tuấn Kiệt</span>
                    <span className="block text-[10px] text-slate-400">Mã: HS03</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleTeacherSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Giáo Viên
                  </label>
                  <input
                    type="email"
                    defaultValue="mailan.edu@gmail.com"
                    className="w-full px-4 py-2.5 text-base bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-spark-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Mật Khẩu
                  </label>
                  <input
                    type="password"
                    defaultValue="teacher123"
                    className="w-full px-4 py-2.5 text-base bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-spark-500 focus:outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 text-white font-black text-lg rounded-2xl btn-game-green flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Vào Bảng Điều Khiển Giáo Viên
                </button>
              </form>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
                💡 <strong>Dành cho trải nghiệm thử:</strong> Bạn có thể bấm nút trên để đăng nhập ngay vào tài khoản mẫu của <strong>Cô Nguyễn Mai Lan</strong>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

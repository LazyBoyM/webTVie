"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/authStore";
import { sound } from "@/lib/soundEffects";
import { Sparkles, LogIn, AlertCircle, GraduationCap } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "student" | "teacher";
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [studentId, setStudentId] = useState("");
  const [pin, setPin] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { loginAsStudent } = useAuth();

  if (!isOpen) return null;

  const handleStudentSubmit = async (e: React.FormEvent) => {
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
    setLoading(true);

    try {
      const result = await loginAsStudent(studentId.trim(), pin.trim());
      if (!result.success) {
        setErrorMsg(result.message || "Đăng nhập thất bại!");
        sound.playWrong();
        setLoading(false);
        return;
      }

      sound.playVictory();
      setStudentId("");
      setPin("");
      onClose();
    } catch {
      setErrorMsg("Lỗi kết nối CSDL, vui lòng thử lại!");
      sound.playWrong();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
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
          <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-2 backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h3 className="text-xl font-bold font-heading">Đăng Nhập Học Sinh</h3>
          <p className="text-indigo-100 text-xs mt-1">
            Nhập mã thẻ học sinh và mã PIN để vào ôn tập và tích lũy điểm thưởng
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Mã Thẻ Học Sinh
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Ví dụ: HS01, HS02, HS03..."
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-2.5 text-base font-bold text-slate-800 uppercase bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Mã PIN Bảo Vệ</span>
                <span className="text-[10px] text-slate-400 font-normal">Mặc định: 1234</span>
              </label>
              <input
                type="password"
                required
                maxLength={6}
                placeholder="Nhập mã PIN (1234)..."
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-2.5 text-base bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-white font-bold text-base rounded-xl bg-indigo-600 hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" /> {loading ? "Đang xác thực..." : "Vào Học Ngay"}
            </button>
          </form>

          {/* Dành cho giáo viên - Link chuyển tiếp duy nhất sang Cổng Quản Trị */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Cô giáo quản lý lớp học?</span>
              <Link
                href="/teacher"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="font-bold text-emerald-600 hover:text-emerald-800 hover:underline"
              >
                Đến Cổng Giáo Viên →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

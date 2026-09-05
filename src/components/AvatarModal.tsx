"use client";

import { useAuth } from "@/lib/authStore";
import { AVATAR_OPTIONS } from "@/lib/data";
import { sound } from "@/lib/soundEffects";
import { Lock, Check, Sparkles } from "lucide-react";

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvatarModal({ isOpen, onClose }: AvatarModalProps) {
  const { student, updateStudentAvatar } = useAuth();

  if (!isOpen || !student) return null;

  const handleSelectAvatar = (icon: string, minXp: number) => {
    if (student.xp < minXp) {
      sound.playWrong();
      return;
    }

    sound.playClick();
    updateStudentAvatar(icon);
    sound.playVictory();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-spark-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-spark-600 via-indigo-600 to-berry-600 p-6 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              🎨
            </div>
            <div>
              <h3 className="text-2xl font-black font-heading tracking-tight leading-tight">
                Bộ Sưu Tập Avatar Nhân Vật
              </h3>
              <p className="text-spark-100 text-xs font-bold mt-0.5">
                Mở khóa bằng điểm tích lũy XP học tập của em (Hiện có: <strong>{student.xp} XP</strong>)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Avatars Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {AVATAR_OPTIONS.map((av) => {
              const isUnlocked = student.xp >= av.minXp;
              const isEquipped = student.avatar === av.icon;

              return (
                <button
                  key={av.id}
                  disabled={!isUnlocked}
                  onClick={() => handleSelectAvatar(av.icon, av.minXp)}
                  className={`p-4 rounded-2xl border-2 text-center transition flex flex-col items-center justify-between relative group ${
                    isEquipped
                      ? "bg-spark-50 border-spark-500 ring-2 ring-spark-400 shadow-md"
                      : isUnlocked
                      ? "bg-white border-slate-200 hover:border-spark-300 hover:shadow-md hover:scale-105"
                      : "bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  {/* Status Badge */}
                  {isEquipped ? (
                    <span className="absolute top-2 right-2 p-1 bg-spark-600 text-white rounded-full">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  ) : !isUnlocked ? (
                    <span className="absolute top-2 right-2 p-1 bg-slate-300 text-slate-600 rounded-full">
                      <Lock className="w-3 h-3" />
                    </span>
                  ) : null}

                  <div className="text-4xl sm:text-5xl my-2 transform group-hover:scale-110 transition">
                    {av.icon}
                  </div>

                  <div>
                    <h5 className="font-extrabold text-xs text-slate-800 line-clamp-1">{av.name}</h5>
                    <span
                      className={`text-[10px] font-black uppercase mt-1 block ${
                        isUnlocked ? "text-emerald-600" : "text-amber-600"
                      }`}
                    >
                      {isUnlocked ? "Đã mở khóa" : `Cần ${av.minXp} XP`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Chăm chỉ làm bài tập và chơi mini-game mỗi ngày để gom thật nhiều XP mở khóa toàn bộ avatar nhé!
        </div>
      </div>
    </div>
  );
}

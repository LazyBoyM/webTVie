"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { NUMBER_PUZZLE_EQUATIONS } from "@/lib/data";
import { Trophy, RotateCcw, Lightbulb, ArrowRight, Zap } from "lucide-react";

interface NumberPuzzleGameProps {
  onClose: () => void;
}

export default function NumberPuzzleGame({ onClose }: NumberPuzzleGameProps) {
  const { addStudentXp } = useAuth();
  const [index, setIndex] = useState(0);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentItem = NUMBER_PUZZLE_EQUATIONS[index];

  const handleSelect = (num: number) => {
    if (isAnswered) return;

    sound.playClick();
    setSelectedNum(num);
    setIsAnswered(true);

    if (num === currentItem.missing) {
      sound.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      sound.playCombo(nextStreak);
      setScore((s) => s + 100 + nextStreak * 25);
    } else {
      sound.playWrong();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (index + 1 < NUMBER_PUZZLE_EQUATIONS.length) {
      setIndex((i) => i + 1);
      setSelectedNum(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setIsGameOver(true);
      sound.playVictory();
      addStudentXp(Math.max(score, 180));
      confetti({ particleCount: 100, spread: 70 });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setIndex(0);
    setSelectedNum(null);
    setIsAnswered(false);
    setShowHint(false);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-mint-300 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-teal-600 via-mint-600 to-emerald-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
              🧩
            </div>
            <div>
              <h3 className="font-black font-heading text-lg sm:text-xl tracking-tight leading-tight">
                Number Puzzle — Điền Số Logic
              </h3>
              <p className="text-teal-100 text-xs font-bold">
                Câu {index + 1} / {NUMBER_PUZZLE_EQUATIONS.length} • Toán tư duy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-right">
              <span className="block text-[10px] uppercase font-bold text-teal-100">Điểm</span>
              <span className="text-lg font-black leading-none">{score}</span>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        {!isGameOver ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Streak & Hint bar */}
            <div className="flex items-center justify-between">
              <div>
                {streak > 1 && (
                  <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-black text-xs inline-flex items-center gap-1 animate-bounce">
                    <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> COMBO x{streak}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowHint(!showHint);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5 transition"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                {showHint ? "Ẩn Gợi Ý" : "Gợi Ý Tư Duy"}
              </button>
            </div>

            {/* Hint box */}
            {showHint && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900 animate-fade-in">
                💡 <strong>Gợi ý:</strong> {currentItem.hint}
              </div>
            )}

            {/* Equation Board */}
            <div className="p-8 rounded-3xl bg-slate-50 border-4 border-dashed border-mint-200 text-center">
              <span className="block text-xs uppercase font-bold text-slate-400 mb-2">
                Tìm số thích hợp điền vào dấu hỏi:
              </span>
              <div className="text-3xl sm:text-5xl font-black font-heading text-slate-800 tracking-wider">
                {isAnswered && selectedNum !== null ? (
                  currentItem.template.replace("[ ? ]", selectedNum.toString())
                ) : (
                  currentItem.template
                )}
              </div>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-2 gap-3.5">
              {currentItem.options.map((opt, i) => {
                const isSelected = selectedNum === opt;
                const isRight = opt === currentItem.missing;

                let style = "bg-white border-2 border-slate-200 hover:border-mint-400 hover:bg-mint-50/50 text-slate-800";
                if (isAnswered) {
                  if (isRight) {
                    style = "bg-emerald-500 border-emerald-600 text-white shadow-lg animate-bounce";
                  } else if (isSelected) {
                    style = "bg-red-50 border-red-400 text-red-700";
                  } else {
                    style = "opacity-40 bg-slate-50 border-slate-200 text-slate-400";
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswered}
                    onClick={() => handleSelect(opt)}
                    className={`py-4 px-3 rounded-2xl font-black text-2xl font-heading shadow-sm transition active:scale-95 ${style}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <div className="pt-2 animate-fade-in">
                <button
                  onClick={handleNext}
                  className="w-full py-4 text-white font-black text-lg rounded-2xl btn-game-green shadow-lg flex items-center justify-center gap-2"
                >
                  Câu Tiếp Theo <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Summary */
          <div className="p-8 text-center space-y-6 animate-fade-in">
            <div className="inline-block p-4 bg-mint-100 rounded-3xl animate-bounce">
              <span className="text-5xl">🧩</span>
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-800 font-heading">
                Hoàn Thành Thử Thách Logic!
              </h2>
              <p className="text-slate-500 font-bold mt-1">
                Tư duy logic và khả năng tính nhẩm của em rất chuẩn xác!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-mint-50 rounded-2xl border border-mint-200">
                <span className="block text-xs font-bold text-mint-700 uppercase">Điểm Số</span>
                <span className="text-3xl font-black text-mint-950">{score}</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="block text-xs font-bold text-emerald-600 uppercase">XP Nhận Được</span>
                <span className="text-3xl font-black text-emerald-950">+{Math.max(score, 180)} ⚡</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Chơi Lại
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex-1 py-3.5 text-white font-black rounded-2xl btn-game-green flex items-center justify-center gap-2 shadow-md"
              >
                <Trophy className="w-5 h-5" /> Về Hub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

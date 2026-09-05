"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { TRUE_FALSE_QUESTIONS } from "@/lib/data";
import { Clock, Check, X, Trophy, RotateCcw, Zap } from "lucide-react";

interface TrueFalseGameProps {
  onClose: () => void;
}

export default function TrueFalseGame({ onClose }: TrueFalseGameProps) {
  const { addStudentXp } = useAuth();
  const [questions, setQuestions] = useState(TRUE_FALSE_QUESTIONS);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Shuffle questions on mount
  useEffect(() => {
    setQuestions([...TRUE_FALSE_QUESTIONS].sort(() => 0.5 - Math.random()));
  }, []);

  const handleFinish = useCallback(() => {
    setIsGameOver(true);
    sound.playVictory();
    addStudentXp(Math.max(score, 120));
    confetti({ particleCount: 100, spread: 70 });
  }, [score, addStudentXp]);

  // 45s Countdown
  useEffect(() => {
    if (isGameOver) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleFinish();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, handleFinish]);

  const handleAnswer = (userChoice: boolean) => {
    if (feedback || isGameOver) return;

    const currentQ = questions[index];
    const isRight = userChoice === currentQ.isTrue;

    if (isRight) {
      sound.playCorrect();
      setFeedback("correct");
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      sound.playCombo(nextStreak);

      setScore((s) => s + 50 + nextStreak * 15);
    } else {
      sound.playWrong();
      setFeedback("wrong");
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 < questions.length) {
        setIndex((i) => i + 1);
      } else {
        handleFinish();
      }
    }, 350);
  };

  const handleRestart = () => {
    sound.playClick();
    setQuestions([...TRUE_FALSE_QUESTIONS].sort(() => 0.5 - Math.random()));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setTimeLeft(45);
    setIsGameOver(false);
  };

  const currentQ = questions[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-indigo-300 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-indigo-600 via-spark-600 to-berry-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
              ❓
            </div>
            <div>
              <h3 className="font-black font-heading text-lg sm:text-xl tracking-tight leading-tight">
                True or False Blitz
              </h3>
              <p className="text-indigo-100 text-xs font-bold">Đúng hay Sai? Quyết định siêu tốc!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-center">
              <span className="block text-[10px] uppercase font-bold text-indigo-100">Thời Gian</span>
              <span className="text-base font-black flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {timeLeft}s
              </span>
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
        {!isGameOver && currentQ ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Score & Combo */}
            <div className="flex items-center justify-between text-sm font-bold text-slate-500">
              <span className="text-indigo-600 font-extrabold text-lg">Điểm: {score}</span>
              {streak > 1 && (
                <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-black text-xs flex items-center gap-1 animate-bounce">
                  <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> COMBO x{streak}!
                </div>
              )}
            </div>

            {/* Question Statement Box */}
            <div
              className={`p-8 rounded-3xl border-4 text-center min-h-[160px] flex items-center justify-center transition-all ${
                feedback === "correct"
                  ? "bg-emerald-50 border-emerald-400 scale-105"
                  : feedback === "wrong"
                  ? "bg-red-50 border-red-400 animate-shake"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <p className="text-xl sm:text-2xl font-black text-slate-800 font-heading leading-snug">
                &ldquo;{currentQ.question}&rdquo;
              </p>
            </div>

            {/* Big 2 Choice Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="py-6 px-4 rounded-3xl btn-game-green text-white font-black text-2xl font-heading flex flex-col items-center justify-center gap-1 shadow-xl"
              >
                <Check className="w-8 h-8 stroke-[3]" />
                <span>ĐÚNG</span>
              </button>

              <button
                onClick={() => handleAnswer(false)}
                className="py-6 px-4 rounded-3xl btn-game-pink text-white font-black text-2xl font-heading flex flex-col items-center justify-center gap-1 shadow-xl"
              >
                <X className="w-8 h-8 stroke-[3]" />
                <span>SAI</span>
              </button>
            </div>
          </div>
        ) : (
          /* Summary */
          <div className="p-8 text-center space-y-6 animate-fade-in">
            <div className="inline-block p-4 bg-indigo-100 rounded-3xl animate-bounce">
              <span className="text-5xl">⚡</span>
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-800 font-heading">Hết Giờ Blitz!</h2>
              <p className="text-slate-500 font-bold mt-1">
                Khả năng phán đoán siêu tốc của em thật đáng nể!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                <span className="block text-xs font-bold text-indigo-600 uppercase">Tổng Điểm</span>
                <span className="text-3xl font-black text-indigo-950">{score}</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="block text-xs font-bold text-emerald-600 uppercase">XP Nhận Được</span>
                <span className="text-3xl font-black text-emerald-950">+{Math.max(score, 120)} ⚡</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Thử Lại
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex-1 py-3.5 text-white font-black rounded-2xl btn-game-purple flex items-center justify-center gap-2 shadow-md"
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

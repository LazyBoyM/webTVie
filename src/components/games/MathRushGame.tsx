"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { Heart, Trophy, RotateCcw, Zap } from "lucide-react";

interface MathRushGameProps {
  onClose: () => void;
}

interface MathProblem {
  num1: number;
  num2: number;
  operator: "+" | "-" | "×" | "÷";
  answer: number;
  options: number[];
}

export default function MathRushGame({ onClose }: MathRushGameProps) {
  const { addStudentXp } = useAuth();
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random math problem appropriate for Grades 3-5
  const generateProblem = useCallback((): MathProblem => {
    const operators: Array<"+" | "-" | "×" | "÷"> = ["+", "-", "×", "÷"];
    const op = operators[Math.floor(Math.random() * operators.length)];

    let num1 = 0;
    let num2 = 0;
    let answer = 0;

    if (op === "+") {
      num1 = Math.floor(Math.random() * 50) + 10;
      num2 = Math.floor(Math.random() * 50) + 5;
      answer = num1 + num2;
    } else if (op === "-") {
      answer = Math.floor(Math.random() * 40) + 5;
      num2 = Math.floor(Math.random() * 30) + 5;
      num1 = answer + num2;
    } else if (op === "×") {
      num1 = Math.floor(Math.random() * 9) + 2;
      num2 = Math.floor(Math.random() * 9) + 2;
      answer = num1 * num2;
    } else {
      num2 = Math.floor(Math.random() * 8) + 2;
      answer = Math.floor(Math.random() * 9) + 2;
      num1 = num2 * answer;
    }

    // Generate 3 distractors
    const optionsSet = new Set<number>([answer]);
    while (optionsSet.size < 4) {
      const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = Math.max(1, answer + offset);
      optionsSet.add(wrong);
    }

    const options = Array.from(optionsSet).sort(() => 0.5 - Math.random());
    return { num1, num2, operator: op, answer, options };
  }, []);

  const handleNextProblem = useCallback(() => {
    setFeedback(null);
    setProblem(generateProblem());
    setTimeLeft(8);
  }, [generateProblem]);

  const handleWrong = useCallback(() => {
    sound.playWrong();
    setFeedback("wrong");
    setStreak(0);
    setLives((prev) => {
      if (prev <= 1) {
        setIsGameOver(true);
        return 0;
      }
      return prev - 1;
    });

    setTimeout(() => {
      handleNextProblem();
    }, 600);
  }, [handleNextProblem]);

  // Initial problem setup
  useEffect(() => {
    handleNextProblem();
  }, [handleNextProblem]);

  // Timer logic
  useEffect(() => {
    if (isGameOver) return;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleWrong();
          return 8;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameOver, handleWrong]);

  const handleSelect = (val: number) => {
    if (feedback || isGameOver || !problem) return;

    if (val === problem.answer) {
      sound.playCorrect();
      setFeedback("correct");
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);
      sound.playCombo(nextStreak);

      const bonus = 100 + nextStreak * 25 + timeLeft * 10;
      setScore((s) => s + bonus);

      setTimeout(() => {
        handleNextProblem();
      }, 400);
    } else {
      handleWrong();
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setScore(0);
    setLives(3);
    setStreak(0);
    setMaxStreak(0);
    setIsGameOver(false);
    handleNextProblem();
  };

  useEffect(() => {
    if (isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      sound.playVictory();
      const xp = Math.max(score, 100);
      addStudentXp(xp);
      confetti({ particleCount: 100, spread: 70 });
    }
  }, [isGameOver, score, addStudentXp]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col">
        {/* Game Top Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
              🌟
            </div>
            <div>
              <h3 className="font-black font-heading text-lg sm:text-xl tracking-tight leading-tight">
                Math Rush — Phản Xạ Toán Học
              </h3>
              <p className="text-amber-100 text-xs font-bold">Tính nhanh đáp án trước khi hết giờ!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Lives */}
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-2.5 py-1.5 rounded-xl">
              {[1, 2, 3].map((heart) => (
                <Heart
                  key={heart}
                  className={`w-5 h-5 transition ${
                    heart <= lives ? "text-red-300 fill-red-400" : "text-white/30"
                  }`}
                />
              ))}
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

        {/* Timer Bar */}
        {!isGameOver && (
          <div className="w-full bg-slate-100 h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeLeft <= 3 ? "bg-red-500 animate-pulse" : "bg-amber-500"
              }`}
              style={{ width: `${(timeLeft / 8) * 100}%` }}
            />
          </div>
        )}

        {/* Game Content */}
        {!isGameOver && problem ? (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Score & Streak bar */}
            <div className="flex items-center justify-between text-sm font-bold text-slate-500">
              <span className="text-amber-600 font-extrabold text-lg">Điểm: {score}</span>
              {streak > 1 && (
                <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-black text-xs flex items-center gap-1 animate-bounce">
                  <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> COMBO x{streak}!
                </div>
              )}
            </div>

            {/* Problem Display Board */}
            <div
              className={`p-8 rounded-3xl border-4 text-center transition-all ${
                feedback === "correct"
                  ? "bg-emerald-50 border-emerald-400 scale-105"
                  : feedback === "wrong"
                  ? "bg-red-50 border-red-400 animate-shake"
                  : "bg-amber-50/60 border-amber-200"
              }`}
            >
              <span className="text-4xl sm:text-6xl font-black font-heading tracking-wider text-slate-800">
                {problem.num1} {problem.operator} {problem.num2} = ?
              </span>
            </div>

            {/* 4 Choices */}
            <div className="grid grid-cols-2 gap-4">
              {problem.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className="py-5 px-4 text-2xl sm:text-3xl font-black font-heading rounded-2xl bg-white border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 shadow-md active:scale-95 transition text-slate-800"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Game Over Summary */
          <div className="p-8 text-center space-y-6 animate-fade-in">
            <div className="inline-block p-4 bg-amber-100 rounded-3xl animate-bounce">
              <span className="text-5xl">🎯</span>
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-800 font-heading">Hết Lượt Chơi!</h2>
              <p className="text-slate-500 font-bold mt-1">Phản xạ của em rất tuyệt vời!</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="block text-xs font-bold text-amber-600 uppercase">Điểm Kỷ Lục</span>
                <span className="text-3xl font-black text-amber-950">{score}</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="block text-xs font-bold text-emerald-600 uppercase">XP Nhận Được</span>
                <span className="text-3xl font-black text-emerald-950">+{Math.max(score, 100)} ⚡</span>
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
                className="flex-1 py-3.5 text-white font-black rounded-2xl btn-game-yellow flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5" /> Về Hub Mini-Game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

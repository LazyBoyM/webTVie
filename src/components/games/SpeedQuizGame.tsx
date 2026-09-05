"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { Question } from "@/lib/data";
import { getVietnameseQuestions, getActiveVietnameseTopic } from "@/lib/dataStore";
import { Clock, Zap, Volume2, Trophy, ArrowRight, RotateCcw, CheckCircle2, XCircle } from "lucide-react";

interface SpeedQuizGameProps {
  onClose: () => void;
  selectedSubject?: "toan" | "tieng-viet" | "tieng-anh" | "khoa-hoc";
}

export default function SpeedQuizGame({ onClose, selectedSubject }: SpeedQuizGameProps) {
  const { student, addStudentXp } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isFinished, setIsFinished] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize questions from Vietnamese topic store
  useEffect(() => {
    const vnQuestions = getVietnameseQuestions();
    const activeTopic = getActiveVietnameseTopic();

    let pool = [...vnQuestions];
    if (activeTopic) {
      const topicPool = pool.filter((q) => q.topicId === activeTopic.id);
      if (topicPool.length > 0) {
        pool = topicPool;
      }
    } else if (selectedSubject) {
      pool = pool.filter((q) => q.subject === selectedSubject);
    }
    // Shuffle and pick 6 questions
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, 6);
    setQuestions(shuffled);
  }, [selectedSubject]);

  const currentQ = questions[currentIndex];

  // Timer effect per question
  useEffect(() => {
    if (isAnswered || isFinished || !currentQ) return;

    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, isFinished, currentQ]);

  const handleTimeOut = () => {
    setIsAnswered(true);
    setSelectedOption(-1); // Timed out
    setCombo(0);
    sound.playWrong();
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !currentQ) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);
    setSelectedOption(idx);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);

      const points = 100 + newCombo * 20 + Math.round(timeLeft * 5);
      setScore((s) => s + points);

      sound.playCorrect();
      sound.playCombo(newCombo);
    } else {
      setCombo(0);
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Game over!
      finishGame();
    }
  };

  const finishGame = () => {
    setIsFinished(true);
    const earned = Math.max(score, 120);
    setXpEarned(earned);
    addStudentXp(earned);
    sound.playVictory();

    // Trigger celebratory confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const restartGame = () => {
    sound.playClick();
    const vnQuestions = getVietnameseQuestions();
    const activeTopic = getActiveVietnameseTopic();
    let pool = [...vnQuestions];
    if (activeTopic) {
      const topicPool = pool.filter((q) => q.topicId === activeTopic.id);
      if (topicPool.length > 0) pool = topicPool;
    }
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, 6);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setIsFinished(false);
  };

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
        <div className="bg-white p-8 rounded-3xl text-center shadow-xl">
          <div className="w-12 h-12 border-4 border-spark-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-bold text-slate-700">Đang nạp câu hỏi thử thách...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-spark-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Game Top Bar */}
        <div className="bg-gradient-to-r from-spark-600 via-indigo-600 to-berry-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
              ⚡
            </div>
            <div>
              <h3 className="font-black font-heading text-lg sm:text-xl tracking-tight leading-tight">
                Speed Quiz — Đấu Trường Tốc Độ
              </h3>
              <p className="text-spark-100 text-xs font-bold">
                Câu {currentIndex + 1} / {questions.length} • {currentQ?.topic}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Combo indicator */}
            {combo > 1 && (
              <div className="bg-amber-400 text-amber-950 font-black px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 animate-bounce">
                <Zap className="w-3.5 h-3.5 fill-current" /> COMBO x{combo}
              </div>
            )}

            {/* Score */}
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-right">
              <span className="block text-[10px] uppercase font-bold text-spark-200">Điểm Số</span>
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

        {/* Timer Bar */}
        {!isFinished && (
          <div className="w-full bg-slate-100 h-2.5 relative overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeLeft <= 5 ? "bg-red-500 animate-pulse" : "bg-spark-500"
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>
        )}

        {/* Game Main Body */}
        {!isFinished ? (
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col justify-between space-y-6">
            {/* Question Header & Speech button */}
            <div>
              <div className="flex items-center justify-between mb-3 text-slate-400 text-xs font-black uppercase tracking-wider">
                <span>Chủ đề: {currentQ.topic}</span>
                <span className="flex items-center gap-1 text-slate-600 font-bold">
                  <Clock className="w-3.5 h-3.5" /> Còn {timeLeft}s
                </span>
              </div>

              <div className="flex items-start gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-heading leading-snug flex-1">
                  {currentQ.question}
                </h2>
                <button
                  onClick={() => sound.speakText(currentQ.question)}
                  title="Đọc to câu hỏi"
                  className="p-2.5 rounded-xl bg-spark-50 hover:bg-spark-100 text-spark-600 transition flex-shrink-0"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:border-spark-300 hover:bg-spark-50";

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500 shadow-md";
                  } else if (isSelected) {
                    btnStyle = "bg-red-50 border-red-500 text-red-900 ring-2 ring-red-400";
                  } else {
                    btnStyle = "opacity-40 bg-slate-50 border-slate-200 text-slate-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border-2 text-left font-bold text-base transition relative flex items-center justify-between ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-xs text-slate-500 shadow-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-scale-in" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600 animate-scale-in" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 animate-fade-in text-sm">
                <p className="font-extrabold text-amber-900 mb-1 flex items-center gap-1.5">
                  💡 <strong>Giải thích chi tiết:</strong>
                </p>
                <p className="text-amber-800 font-medium">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next Question / Finish Button */}
            {isAnswered && (
              <div className="pt-2">
                <button
                  onClick={handleNext}
                  className="w-full py-4 text-white font-black text-lg rounded-2xl btn-game-green flex items-center justify-center gap-2 shadow-lg"
                >
                  {currentIndex + 1 < questions.length ? (
                    <>
                      Câu Tiếp Theo <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Xem Kết Quả & Nhận Thưởng <Trophy className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Victory / Results View */
          <div className="p-8 text-center space-y-6 animate-fade-in flex-1 flex flex-col justify-center">
            <div className="inline-block p-4 bg-amber-100 rounded-3xl animate-bounce">
              <span className="text-5xl">🏆</span>
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-800 font-heading">
                Hoàn Thành Xuất Sắc!
              </h2>
              <p className="text-slate-500 font-bold mt-1">
                Em đã vượt qua tất cả câu hỏi của bài thử thách này!
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 bg-spark-50 rounded-2xl border border-spark-200">
                <span className="block text-xs font-bold text-spark-600 uppercase">Tổng Điểm</span>
                <span className="text-2xl font-black text-spark-900">{score}</span>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <span className="block text-xs font-bold text-amber-600 uppercase">Combo Tối Đa</span>
                <span className="text-2xl font-black text-amber-900">x{maxCombo}</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="block text-xs font-bold text-emerald-600 uppercase">XP Nhận Được</span>
                <span className="text-2xl font-black text-emerald-900">+{xpEarned} ⚡</span>
              </div>
            </div>

            {student && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600">
                👤 Điểm đã được cộng thẳng vào hồ sơ của học sinh: <strong>{student.name} ({student.studentId})</strong>!
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={restartGame}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Chơi Lại
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex-1 py-3.5 text-white font-black rounded-2xl btn-game-purple flex items-center justify-center gap-2 shadow-md"
              >
                Về Trang Chủ 🏠
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

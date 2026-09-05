"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { WORD_SCRAMBLE_WORDS } from "@/lib/data";
import { Lightbulb, RotateCcw, Trophy, ArrowRight, Volume2 } from "lucide-react";

interface WordScrambleGameProps {
  onClose: () => void;
}

export default function WordScrambleGame({ onClose }: WordScrambleGameProps) {
  const { addStudentXp } = useAuth();
  const [wordIndex, setWordIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<{ char: string; id: number; used: boolean }[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<{ char: string; originalId: number }[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentWordObj = WORD_SCRAMBLE_WORDS[wordIndex];

  // Initialize and scramble letters
  useEffect(() => {
    if (!currentWordObj) return;

    const chars = currentWordObj.word.split("");
    // Shuffle
    const shuffled = chars
      .map((c, i) => ({ char: c, id: i, sort: Math.random(), used: false }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ char, id, used }) => ({ char, id, used }));

    setScrambledLetters(shuffled);
    setSelectedLetters([]);
    setShowHint(false);
    setIsCorrect(false);
  }, [wordIndex, currentWordObj]);

  const handlePickLetter = (item: { char: string; id: number; used: boolean }) => {
    if (item.used || isCorrect) return;

    sound.playClick();
    setScrambledLetters((prev) =>
      prev.map((l) => (l.id === item.id ? { ...l, used: true } : l))
    );
    const nextSelected = [...selectedLetters, { char: item.char, originalId: item.id }];
    setSelectedLetters(nextSelected);

    // Check if word completed
    if (nextSelected.length === currentWordObj.word.length) {
      const spelled = nextSelected.map((s) => s.char).join("");
      if (spelled === currentWordObj.word) {
        // Correct!
        sound.playCorrect();
        setIsCorrect(true);
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        sound.playCombo(nextStreak);
        const earned = 100 + nextStreak * 30;
        setScore((s) => s + earned);

        confetti({ particleCount: 80, spread: 60 });
      } else {
        // Wrong
        sound.playWrong();
      }
    }
  };

  const handleRemoveLetter = (index: number) => {
    if (isCorrect) return;
    sound.playClick();
    const removed = selectedLetters[index];
    setSelectedLetters((prev) => prev.filter((_, i) => i !== index));
    setScrambledLetters((prev) =>
      prev.map((l) => (l.id === removed.originalId ? { ...l, used: false } : l))
    );
  };

  const handleResetLetters = () => {
    sound.playClick();
    setSelectedLetters([]);
    setScrambledLetters((prev) => prev.map((l) => ({ ...l, used: false })));
  };

  const handleNextWord = () => {
    sound.playClick();
    if (wordIndex + 1 < WORD_SCRAMBLE_WORDS.length && wordIndex + 1 < 5) {
      setWordIndex((i) => i + 1);
    } else {
      setIsGameOver(true);
      sound.playVictory();
      addStudentXp(Math.max(score, 150));
      confetti({ particleCount: 120, spread: 80 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-berry-300 overflow-hidden flex flex-col">
        {/* Game Top Bar */}
        <div className="bg-gradient-to-r from-berry-600 via-pink-600 to-spark-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-xl">
              🔤
            </div>
            <div>
              <h3 className="font-black font-heading text-lg sm:text-xl tracking-tight leading-tight">
                Word Scramble — Ghép Chữ Kỳ Diệu
              </h3>
              <p className="text-pink-100 text-xs font-bold">
                Từ {wordIndex + 1} / 5 • Môn: {currentWordObj?.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-right">
              <span className="block text-[10px] uppercase font-bold text-pink-200">Điểm</span>
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
            {/* Hint & Speech bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowHint(!showHint);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5 transition"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                {showHint ? "Ẩn Gợi Ý" : "Xem Gợi Ý"}
              </button>

              <button
                onClick={() => sound.speakText(currentWordObj.display)}
                className="p-2 bg-spark-50 hover:bg-spark-100 text-spark-600 rounded-xl transition"
                title="Nghe phát âm từ"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900 animate-fade-in">
                💡 <strong>Gợi ý:</strong> {currentWordObj.hint}
              </div>
            )}

            {/* Selected Letters Answer Slots */}
            <div>
              <span className="block text-center text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                Bấm vào các chữ cái bên dưới để ghép từ hoàn chỉnh:
              </span>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 min-h-[60px] p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                {selectedLetters.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleRemoveLetter(idx)}
                    className={`w-11 h-12 sm:w-13 sm:h-14 rounded-xl font-black text-xl font-heading shadow-md transition flex items-center justify-center ${
                      isCorrect
                        ? "bg-emerald-500 text-white animate-bounce"
                        : "bg-white border-2 border-spark-300 text-spark-800 hover:bg-red-50 hover:border-red-400"
                    }`}
                  >
                    {item.char}
                  </button>
                ))}
                {/* Empty placeholders */}
                {Array.from({ length: Math.max(0, currentWordObj.word.length - selectedLetters.length) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="w-11 h-12 sm:w-13 sm:h-14 rounded-xl border-2 border-dashed border-slate-300 bg-white/50"
                    />
                  )
                )}
              </div>
            </div>

            {/* Scrambled Letters Pool */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-2">
              {scrambledLetters.map((item) => (
                <button
                  key={item.id}
                  disabled={item.used || isCorrect}
                  onClick={() => handlePickLetter(item)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl font-black text-2xl font-heading shadow-md transition transform ${
                    item.used
                      ? "opacity-20 scale-90 bg-slate-200 text-slate-400 cursor-not-allowed"
                      : "bg-white border-2 border-slate-200 hover:border-pink-500 hover:scale-105 active:scale-95 text-slate-800"
                  }`}
                >
                  {item.char}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              {!isCorrect ? (
                <button
                  onClick={handleResetLetters}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition text-sm flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Ghép Lại
                </button>
              ) : (
                <button
                  onClick={handleNextWord}
                  className="flex-1 py-3.5 text-white font-black text-base rounded-2xl btn-game-green shadow-lg flex items-center justify-center gap-2 animate-bounce"
                >
                  Tuyệt Vời! Sang Từ Kế Tiếp <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Summary */
          <div className="p-8 text-center space-y-6 animate-fade-in">
            <div className="inline-block p-4 bg-pink-100 rounded-3xl animate-bounce">
              <span className="text-5xl">🏆</span>
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-800 font-heading">
                Bậc Thầy Ngôn Từ!
              </h2>
              <p className="text-slate-500 font-bold mt-1">
                Em đã giải mã thành công toàn bộ các từ vựng thử thách!
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-pink-50 rounded-2xl border border-pink-200">
                <span className="block text-xs font-bold text-pink-600 uppercase">Điểm Số</span>
                <span className="text-3xl font-black text-pink-950">{score}</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <span className="block text-xs font-bold text-emerald-600 uppercase">XP Nhận Được</span>
                <span className="text-3xl font-black text-emerald-950">+{Math.max(score, 150)} ⚡</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-full py-3.5 text-white font-black rounded-2xl btn-game-pink flex items-center justify-center gap-2 shadow-md"
            >
              <Trophy className="w-5 h-5" /> Về Góc Học Sinh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

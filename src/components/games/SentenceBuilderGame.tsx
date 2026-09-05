"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { SENTENCE_BUILDER_DATA, SentenceBuilderItem } from "@/lib/data";
import { addVocabularyNote } from "@/lib/dataStore";
import {
  RotateCcw,
  ArrowRight,
  Lightbulb,
} from "lucide-react";

interface SentenceBuilderGameProps {
  onClose: () => void;
}

interface TokenState {
  id: string;
  text: string;
}

export default function SentenceBuilderGame({ onClose }: SentenceBuilderGameProps) {
  const { addStudentXp } = useAuth();
  const [items] = useState<SentenceBuilderItem[]>(SENTENCE_BUILDER_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableTokens, setAvailableTokens] = useState<TokenState[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<TokenState[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = items[currentIndex];

  const loadSentence = (item: SentenceBuilderItem) => {
    const tokens: TokenState[] = item.shuffledTokens.map((t, idx) => ({
      id: `${item.id}_token_${idx}_${Math.random().toString(36).substring(2, 5)}`,
      text: t,
    }));
    setAvailableTokens([...tokens].sort(() => Math.random() - 0.5));
    setSelectedTokens([]);
    setShowHint(false);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    if (currentItem) {
      loadSentence(currentItem);
    }
  }, [currentIndex, currentItem]);

  const handleSelectToken = (token: TokenState) => {
    if (isAnswered) return;
    sound.playClick();
    setAvailableTokens((prev) => prev.filter((t) => t.id !== token.id));
    setSelectedTokens((prev) => [...prev, token]);
  };

  const handleDeselectToken = (token: TokenState) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedTokens((prev) => prev.filter((t) => t.id !== token.id));
    setAvailableTokens((prev) => [...prev, token]);
  };

  const handleResetCurrent = () => {
    sound.playClick();
    loadSentence(currentItem);
  };

  const handleCheckSentence = () => {
    if (selectedTokens.length === 0 || isAnswered) return;

    const constructedSentence = selectedTokens.map((t) => t.text).join(" ").trim();
    const normalize = (s: string) => s.replace(/\s+/g, " ").replace(/\s+([.,!?;:])/g, "$1").trim();
    const correct = normalize(constructedSentence) === normalize(currentItem.correctSentence);

    setIsAnswered(true);
    setIsCorrect(correct);

    if (correct) {
      sound.playCorrect();
      setScore((s) => s + 30);
      addStudentXp(30);

      addVocabularyNote({
        id: `vocab_${Date.now()}`,
        word: currentItem.correctSentence,
        category: currentItem.category === "Thành Ngữ" ? "Thành ngữ" : "Từ loại",
        definition: currentItem.hint,
        exampleSentence: currentItem.correctSentence,
        dateLearned: "Hôm nay",
      });
    } else {
      sound.playWrong();
    }
  };

  const handleNextSentence = () => {
    sound.playClick();
    if (currentIndex + 1 < items.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      sound.playVictory();
      addStudentXp(score + 50);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg">
              ✍️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg sm:text-xl tracking-tight">Bắt Chữ Hoàn Câu</h3>
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-xs font-semibold">
                  {currentItem?.category || "Luyện Câu"}
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                Sắp xếp các cụm từ theo đúng trật tự ngữ pháp tiếng Việt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-3 py-1.5 rounded-xl text-center">
              <span className="block text-[10px] uppercase font-semibold text-indigo-200">Điểm</span>
              <span className="text-sm font-bold text-amber-300">+{score} XP</span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-sm transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Area */}
        {isFinished ? (
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-5xl block animate-bounce">🏆</span>
            <h4 className="text-2xl font-bold text-slate-900">Hoàn Thành Thử Thách!</h4>
            <p className="text-sm text-slate-600 max-w-md">
              Em đã xuất sắc ghép đúng các câu văn tiếng Việt và nhận trọn vẹn điểm thưởng.
            </p>
            <div className="px-5 py-2.5 rounded-xl bg-amber-100 text-amber-900 font-bold text-base">
              +{score + 50} XP Đã Nhận!
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setCurrentIndex(0);
                setScore(0);
                setIsFinished(false);
              }}
              className="mt-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
            >
              Luyện Tập Lại Lượt Mới
            </button>
          </div>
        ) : (
          <div className="p-5 sm:p-7 flex-1 overflow-y-auto space-y-6">
            {/* Progress bar */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Câu hỏi {currentIndex + 1} / {items.length}</span>
              <div className="w-36 sm:w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
                />
              </div>
            </div>

          {/* Construction Slot */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Câu văn của em (Bấm từ để ghép vào đây):
              </span>
              {selectedTokens.length > 0 && !isAnswered && (
                <button
                  onClick={handleResetCurrent}
                  className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Xếp lại từ đầu
                </button>
              )}
            </div>

            <div className={`min-h-[110px] p-4 rounded-2xl border-2 transition-all flex flex-wrap items-center gap-2.5 ${
              isAnswered
                ? isCorrect
                  ? "bg-emerald-50/50 border-emerald-300"
                  : "bg-rose-50/50 border-rose-300"
                : selectedTokens.length > 0
                ? "bg-indigo-50/30 border-indigo-200"
                : "bg-slate-50 border-dashed border-slate-200"
            }`}>
              {selectedTokens.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center w-full select-none">
                  Chạm vào các từ ngữ bên dưới để bắt đầu sắp xếp câu hoàn chỉnh...
                </p>
              ) : (
                selectedTokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => handleDeselectToken(token)}
                    disabled={isAnswered}
                    className={`px-3.5 py-2 rounded-xl text-sm font-bold shadow-sm transition transform hover:scale-95 ${
                      isAnswered
                        ? isCorrect
                          ? "bg-emerald-600 text-white"
                          : "bg-rose-600 text-white"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {token.text}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Word Bank Area */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kho từ ngữ có sẵn:
            </span>
            <div className="flex flex-wrap gap-2.5 min-h-[50px] p-3 bg-slate-50 rounded-2xl border border-slate-200">
              {availableTokens.length === 0 ? (
                <span className="text-xs text-slate-400 italic">Đã dùng hết tất cả các cụm từ</span>
              ) : (
                availableTokens.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => handleSelectToken(token)}
                    disabled={isAnswered}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-sm hover:border-indigo-400 hover:text-indigo-600 transition"
                  >
                    {token.text}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Hint Area */}
          <div className="pt-1">
            {!showHint ? (
              <button
                onClick={() => {
                  sound.playClick();
                  setShowHint(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Xem gợi ý ý nghĩa câu
              </button>
            ) : (
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium animate-fade-in flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Gợi ý:</strong> {currentItem.hint}</span>
              </div>
            )}
          </div>

          {/* Result Feedback Banner */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl border animate-fade-in ${
              isCorrect
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}>
              <div className="flex items-start gap-3">
                <span className="text-xl">{isCorrect ? "🎉" : "💡"}</span>
                <div>
                  <h4 className="font-bold text-sm">
                    {isCorrect ? "Chính xác tuyệt đối!" : "Chưa hoàn toàn chính xác"}
                  </h4>
                  <p className="text-xs mt-1">
                    <strong>Câu văn chuẩn:</strong> {currentItem.correctSentence}
                  </p>
                </div>
              </div>
            </div>
          )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Tập trung rèn luyện trật tự câu tiếng Việt
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!isAnswered ? (
              <button
                onClick={handleCheckSentence}
                disabled={selectedTokens.length === 0}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm disabled:opacity-40"
              >
                Kiểm Tra Câu Này
              </button>
            ) : (
              <button
                onClick={handleNextSentence}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm flex items-center justify-center gap-2"
              >
                {currentIndex + 1 < items.length ? "Tiếp Tục Câu Sau" : "Hoàn Thành Thử Thách"}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

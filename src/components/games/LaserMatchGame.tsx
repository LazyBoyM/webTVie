"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { RotateCcw, Clock, Check, Sparkles, Zap } from "lucide-react";

interface LaserMatchGameProps {
  onClose: () => void;
}

interface MatchPair {
  pairId: number;
  leftText: string;
  rightText: string;
  hint?: string;
}

interface MatchTopic {
  id: string;
  title: string;
  subject: string;
  icon: string;
  pairs: MatchPair[];
}

const MATCH_TOPICS: MatchTopic[] = [
  {
    id: "vn-dongnghia",
    title: "Cặp Từ Đồng Nghĩa & Trái Nghĩa",
    subject: "Tiếng Việt Lớp 4 & 5",
    icon: "📖",
    pairs: [
      { pairId: 1, leftText: "Dũng cảm 🦁", rightText: "Can đảm, gan dạ (đồng nghĩa)" },
      { pairId: 2, leftText: "Chăm chỉ 🐝", rightText: "Cần cù, siêng năng (đồng nghĩa)" },
      { pairId: 3, leftText: "Bao la 🌊", rightText: "Mênh mông, bát ngát (đồng nghĩa)" },
      { pairId: 4, leftText: "Giản dị 🌾", rightText: "Mộc mạc, khiêm tốn (đồng nghĩa)" },
      { pairId: 5, leftText: "Lạc quan ☀️", rightText: "Bi quan (trái nghĩa)" },
      { pairId: 6, leftText: "Trung thực 💎", rightText: "Gian dối (trái nghĩa)" },
    ],
  },
  {
    id: "vn-thanhngu",
    title: "Ghép Vế Thành Ngữ - Ca Dao",
    subject: "Văn Học Dân Gian Việt Nam",
    icon: "🇻🇳",
    pairs: [
      { pairId: 1, leftText: "Lá lành đùm... 🌿", rightText: "...lá rách" },
      { pairId: 2, leftText: "Uống nước... 💧", rightText: "...nhớ nguồn" },
      { pairId: 3, leftText: "Có công mài sắt... 🗡️", rightText: "...có ngày nên kim" },
      { pairId: 4, leftText: "Ăn quả nhớ kẻ... 🍎", rightText: "...trồng cây" },
      { pairId: 5, leftText: "Gần mực thì đen... 🕯️", rightText: "...gần đèn thì rạng" },
      { pairId: 6, leftText: "Học đi đôi... 📚", rightText: "...với hành" },
    ],
  },
  {
    id: "vn-hanviet",
    title: "Từ Hán Việt & Nghĩa Thuần Việt",
    subject: "Tiếng Việt Mở Rộng Vốn Từ",
    icon: "📜",
    pairs: [
      { pairId: 1, leftText: "Quốc gia 🏛️", rightText: "Đất nước" },
      { pairId: 2, leftText: "Giang sơn ⛰️", rightText: "Sông núi, non sông" },
      { pairId: 3, leftText: "Phụ mẫu 👨‍👩‍👧", rightText: "Cha mẹ" },
      { pairId: 4, leftText: "Huynh đệ 🤝", rightText: "Anh em" },
      { pairId: 5, leftText: "Đồng bào 🇻🇳", rightText: "Người cùng một bọc (chung tổ quốc)" },
      { pairId: 6, leftText: "Tiên phong 🚀", rightText: "Người đi đầu, dẫn dắt" },
    ],
  },
];

interface CardNode {
  id: string;
  pairId: number;
  text: string;
  side: "left" | "right";
}

export default function LaserMatchGame({ onClose }: LaserMatchGameProps) {
  const { addStudentXp } = useAuth();
  const [selectedTopicId, setSelectedTopicId] = useState<string>("vn-dongnghia");
  const [leftItems, setLeftItems] = useState<CardNode[]>([]);
  const [rightItems, setRightItems] = useState<CardNode[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<CardNode | null>(null);
  const [selectedRight, setSelectedRight] = useState<CardNode | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<number[]>([]);
  const [wrongPair, setWrongPair] = useState<{ leftId: string; rightId: string } | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentTopic = MATCH_TOPICS.find((t) => t.id === selectedTopicId) || MATCH_TOPICS[0];

  const initBoard = useCallback((topicId = selectedTopicId) => {
    const topic = MATCH_TOPICS.find((t) => t.id === topicId) || MATCH_TOPICS[0];

    const leftNodes: CardNode[] = topic.pairs.map((p) => ({
      id: `L-${p.pairId}`,
      pairId: p.pairId,
      text: p.leftText,
      side: "left" as const,
    })).sort(() => 0.5 - Math.random());

    const rightNodes: CardNode[] = topic.pairs.map((p) => ({
      id: `R-${p.pairId}`,
      pairId: p.pairId,
      text: p.rightText,
      side: "right" as const,
    })).sort(() => 0.5 - Math.random());

    setLeftItems(leftNodes);
    setRightItems(rightNodes);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairIds([]);
    setWrongPair(null);
    setSeconds(0);
    setScore(0);
    setCombo(0);
    setIsFinished(false);
  }, [selectedTopicId]);

  useEffect(() => {
    initBoard(selectedTopicId);
  }, [selectedTopicId, initBoard]);

  // Timer
  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

  const handleLeftClick = (node: CardNode) => {
    if (matchedPairIds.includes(node.pairId) || wrongPair) return;
    sound.playClick();
    setSelectedLeft(node);

    // If a right node was already selected, check match
    if (selectedRight) {
      checkMatch(node, selectedRight);
    }
  };

  const handleRightClick = (node: CardNode) => {
    if (matchedPairIds.includes(node.pairId) || wrongPair) return;
    sound.playClick();
    setSelectedRight(node);

    // If a left node was already selected, check match
    if (selectedLeft) {
      checkMatch(selectedLeft, node);
    }
  };

  const checkMatch = (left: CardNode, right: CardNode) => {
    if (left.pairId === right.pairId) {
      // MATCH!
      sound.playCorrect();
      const newMatched = [...matchedPairIds, left.pairId];
      setMatchedPairIds(newMatched);
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      const points = 100 + nextCombo * 30;
      setScore((s) => s + points);

      if (nextCombo > 2) {
        sound.playCombo(nextCombo);
      }

      setSelectedLeft(null);
      setSelectedRight(null);

      // Check win condition
      if (newMatched.length === currentTopic.pairs.length) {
        setTimeout(() => {
          setIsFinished(true);
          sound.playVictory();
          const timeBonus = Math.max(0, 120 - seconds) * 2;
          const finalXp = 200 + timeBonus;
          addStudentXp(finalXp);
          confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
        }, 600);
      }
    } else {
      // WRONG
      sound.playWrong();
      setCombo(0);
      setWrongPair({ leftId: left.id, rightId: right.id });
      setTimeout(() => {
        setWrongPair(null);
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border-4 border-spark-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* TOP BAR */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-spark-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🔗
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-heading">
                  Nối Cột Từ Ngữ Laser
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  Từ Vựng & Thành Ngữ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium">
                {currentTopic.title} • {currentTopic.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold">
              <Clock className="w-4 h-4 text-amber-300" />
              <span className="font-mono text-sm">{formatTime(seconds)}</span>
            </div>
            <div className="bg-white/20 px-3 py-1.5 rounded-xl text-right">
              <span className="text-[10px] uppercase tracking-wider block font-bold text-blue-200">Điểm</span>
              <span className="text-lg font-black text-amber-300">{score}</span>
            </div>
            {combo > 1 && (
              <div className="bg-amber-500/30 border border-amber-400/50 px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-xs font-black text-amber-300">x{combo}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/30 flex items-center justify-center text-white font-bold transition text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* TOPIC SELECTOR TABS */}
        <div className="bg-slate-100 p-2 sm:px-4 flex gap-2 border-b border-slate-200 overflow-x-auto">
          {MATCH_TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sound.playClick();
                setSelectedTopicId(t.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedTopicId === t.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.title}</span>
            </button>
          ))}
        </div>

        {/* MATCHING WORKSPACE */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col justify-between">
          {!isFinished ? (
            <>
              {/* Instructions banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center mb-5">
                <span className="text-xs sm:text-sm font-black text-blue-800 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Chạm chọn 1 ô ở <strong>Cột Trái</strong> rồi chạm tiếp ô tương ứng ở <strong>Cột Phải</strong> để nối tia sáng laser!
                </span>
              </div>

              {/* TWO COLUMNS */}
              <div className="grid grid-cols-2 gap-4 sm:gap-8 my-auto">
                {/* LEFT COLUMN */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 text-center mb-2">
                    Cột A (Câu hỏi / Khái niệm)
                  </h4>
                  {leftItems.map((item) => {
                    const isMatched = matchedPairIds.includes(item.pairId);
                    const isSelected = selectedLeft?.id === item.id;
                    const isWrong = wrongPair?.leftId === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleLeftClick(item)}
                        disabled={isMatched}
                        className={`w-full p-3.5 sm:p-4 rounded-2xl font-black text-sm sm:text-base text-left transition-all duration-200 flex items-center justify-between border-2 shadow-sm ${
                          isMatched
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 opacity-80 cursor-default"
                            : isWrong
                            ? "bg-rose-50 border-rose-500 text-rose-700 animate-shake"
                            : isSelected
                            ? "bg-purple-100 border-purple-500 text-purple-900 shadow-md ring-4 ring-purple-200 scale-102"
                            : "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50"
                        }`}
                      >
                        <span className="font-heading">{item.text}</span>
                        {isMatched && (
                          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                        {isSelected && !isMatched && (
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-ping shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 text-center mb-2">
                    Cột B (Nghĩa / Đáp án tương ứng)
                  </h4>
                  {rightItems.map((item) => {
                    const isMatched = matchedPairIds.includes(item.pairId);
                    const isSelected = selectedRight?.id === item.id;
                    const isWrong = wrongPair?.rightId === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleRightClick(item)}
                        disabled={isMatched}
                        className={`w-full p-3.5 sm:p-4 rounded-2xl font-black text-sm sm:text-base text-left transition-all duration-200 flex items-center justify-between border-2 shadow-sm ${
                          isMatched
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 opacity-80 cursor-default"
                            : isWrong
                            ? "bg-rose-50 border-rose-500 text-rose-700 animate-shake"
                            : isSelected
                            ? "bg-blue-100 border-blue-500 text-blue-900 shadow-md ring-4 ring-blue-200 scale-102"
                            : "bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:bg-blue-50/50"
                        }`}
                      >
                        <span className="font-heading">{item.text}</span>
                        {isMatched && (
                          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                        {isSelected && !isMatched && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Count */}
              <div className="mt-6 text-center text-xs font-extrabold text-slate-500">
                Đã nối thành công: <strong className="text-blue-600 text-sm">{matchedPairIds.length}</strong> / {currentTopic.pairs.length} cặp
              </div>
            </>
          ) : (
            /* FINISHED SCREEN */
            <div className="text-center py-8 px-4 my-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-spark-500 text-white flex items-center justify-center text-5xl mx-auto mb-4 shadow-xl animate-bounce">
                🎉
              </div>
              <h3 className="text-3xl font-black font-heading text-slate-900 mb-2">
                Tuyệt Đỉnh Nối Cột Laser!
              </h3>
              <p className="text-slate-600 font-medium max-w-md mx-auto mb-6">
                Em đã ghép nối thành công toàn bộ kiến thức bài học trong{" "}
                <strong className="text-blue-600">{formatTime(seconds)}</strong>!
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
                <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-2xl">
                  <span className="text-xs text-blue-600 font-bold block">Tổng Điểm</span>
                  <span className="text-2xl font-black text-blue-800">{score}</span>
                </div>
                <div className="bg-amber-50 border-2 border-amber-200 p-3 rounded-2xl">
                  <span className="text-xs text-amber-600 font-bold block">Thưởng XP</span>
                  <span className="text-2xl font-black text-amber-600">+{200 + Math.max(0, 120 - seconds) * 2} XP</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => initBoard()}
                  className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Thử Lại Lần Nữa
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm transition flex items-center gap-2 shadow-lg"
                >
                  Về Trang Chủ 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

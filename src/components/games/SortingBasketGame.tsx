"use client";

import { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/soundEffects";
import { useAuth } from "@/lib/authStore";
import { RotateCcw, CheckCircle2, AlertCircle } from "lucide-react";

interface SortingBasketGameProps {
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  bgGradient: string;
  borderColor: string;
}

interface SortingItem {
  id: number;
  text: string;
  categoryId: string;
  explanation: string;
}

interface Topic {
  id: string;
  title: string;
  subject: string;
  icon: string;
  categories: Category[];
  items: SortingItem[];
}

const TOPICS: Topic[] = [
  {
    id: "vietnamese-grammar",
    title: "Phân Loại Từ Loại Tiếng Việt",
    subject: "Tiếng Việt Lớp 4 & 5",
    icon: "📖",
    categories: [
      {
        id: "danh-tu",
        name: "Danh Từ",
        color: "text-purple-700",
        icon: "🏛️",
        bgGradient: "from-purple-100 to-indigo-100",
        borderColor: "border-purple-300 hover:border-purple-500",
      },
      {
        id: "dong-tu",
        name: "Động Từ",
        color: "text-amber-700",
        icon: "🏃",
        bgGradient: "from-amber-100 to-orange-100",
        borderColor: "border-amber-300 hover:border-amber-500",
      },
      {
        id: "tinh-tu",
        name: "Tính Từ",
        color: "text-emerald-700",
        icon: "✨",
        bgGradient: "from-emerald-100 to-teal-100",
        borderColor: "border-emerald-300 hover:border-emerald-500",
      },
    ],
    items: [
      { id: 1, text: "Ngôi trường", categoryId: "danh-tu", explanation: "'Ngôi trường' là danh từ chỉ sự vật/địa điểm." },
      { id: 2, text: "Chạy nhảy", categoryId: "dong-tu", explanation: "'Chạy nhảy' là động từ chỉ hoạt động của con người/động vật." },
      { id: 3, text: "Thông minh", categoryId: "tinh-tu", explanation: "'Thông minh' là tính từ chỉ đặc điểm trí tuệ." },
      { id: 4, text: "Bút mực", categoryId: "danh-tu", explanation: "'Bút mực' là danh từ chỉ đồ vật học tập." },
      { id: 5, text: "Ca hát", categoryId: "dong-tu", explanation: "'Ca hát' là động từ chỉ hành động phát ra âm điệu." },
      { id: 6, text: "Rực rỡ", categoryId: "tinh-tu", explanation: "'Rực rỡ' là tính từ miêu tả màu sắc, ánh sáng tươi đẹp." },
      { id: 7, text: "Bác sĩ", categoryId: "danh-tu", explanation: "'Bác sĩ' là danh từ chỉ nghề nghiệp/con người." },
      { id: 8, text: "Bơi lội", categoryId: "dong-tu", explanation: "'Bơi lội' là động từ chỉ hoạt động di chuyển dưới nước." },
      { id: 9, text: "Chăm chỉ", categoryId: "tinh-tu", explanation: "'Chăm chỉ' là tính từ chỉ phẩm chất tính cách." },
    ],
  },
  {
    id: "vietnamese-formation",
    title: "Phân Loại Từ Đơn, Từ Ghép & Từ Láy",
    subject: "Tiếng Việt Lớp 4 & 5",
    icon: "🧩",
    categories: [
      {
        id: "tu-don",
        name: "Từ Đơn",
        color: "text-blue-700",
        icon: "🌱",
        bgGradient: "from-blue-100 to-cyan-100",
        borderColor: "border-blue-300 hover:border-blue-500",
      },
      {
        id: "tu-ghep",
        name: "Từ Ghép",
        color: "text-teal-700",
        icon: "🔗",
        bgGradient: "from-teal-100 to-emerald-100",
        borderColor: "border-teal-300 hover:border-teal-500",
      },
      {
        id: "tu-lay",
        name: "Từ Láy",
        color: "text-sky-700",
        icon: "✨",
        bgGradient: "from-sky-100 to-indigo-100",
        borderColor: "border-sky-300 hover:border-sky-500",
      },
    ],
    items: [
      { id: 10, text: "Học", categoryId: "tu-don", explanation: "'Học' chỉ gồm một tiếng có nghĩa (Từ đơn)." },
      { id: 11, text: "Nhà cửa", categoryId: "tu-ghep", explanation: "'Nhà cửa' ghép từ hai tiếng đều có nghĩa bổ sung cho nhau (Từ ghép)." },
      { id: 12, text: "Lung linh", categoryId: "tu-lay", explanation: "'Lung linh' điệp phụ âm đầu 'l' gợi vẻ lấp lánh (Từ láy)." },
      { id: 13, text: "Sách vở", categoryId: "tu-ghep", explanation: "'Sách' và 'vở' đều có nghĩa chỉ đồ dùng học tập (Từ ghép)." },
      { id: 14, text: "Róc rách", categoryId: "tu-lay", explanation: "'Róc rách' là từ láy tượng thanh mô tả tiếng suối chảy (Từ láy)." },
      { id: 15, text: "Bàn ghế", categoryId: "tu-ghep", explanation: "'Bàn' và 'ghế' ghép lại tạo nghĩa tổng hợp (Từ ghép)." },
      { id: 16, text: "Xanh xao", categoryId: "tu-lay", explanation: "'Xanh xao' điệp âm đầu 'x' tả sắc mặt yếu ớt (Từ láy)." },
      { id: 17, text: "Viết", categoryId: "tu-don", explanation: "'Viết' là một tiếng độc lập có nghĩa hành động (Từ đơn)." },
    ],
  },
  {
    id: "vietnamese-figures",
    title: "Nhận Biết So Sánh & Nhân Hóa",
    subject: "Tiếng Việt Luyện Từ & Câu",
    icon: "🎨",
    categories: [
      {
        id: "so-sanh",
        name: "Biện Pháp So Sánh",
        color: "text-indigo-700",
        icon: "⚖️",
        bgGradient: "from-indigo-100 to-blue-100",
        borderColor: "border-indigo-300 hover:border-indigo-500",
      },
      {
        id: "nhan-hoa",
        name: "Biện Pháp Nhân Hóa",
        color: "text-rose-700",
        icon: "🦊",
        bgGradient: "from-rose-100 to-pink-100",
        borderColor: "border-rose-300 hover:border-rose-500",
      },
      {
        id: "cau-thuong",
        name: "Câu Văn Bình Thường",
        color: "text-amber-700",
        icon: "📝",
        bgGradient: "from-amber-100 to-yellow-100",
        borderColor: "border-amber-300 hover:border-amber-500",
      },
    ],
    items: [
      { id: 18, text: "Mặt trời như quả cầu lửa khổng lồ", categoryId: "so-sanh", explanation: "Có từ so sánh 'như' giữa mặt trời và quả cầu lửa." },
      { id: 19, text: "Bác đồng hồ cần mẫn tích tắc báo giờ", categoryId: "nhan-hoa", explanation: "Đồng hồ được gọi bằng 'Bác' và có hành động như người." },
      { id: 20, text: "Buổi chiều trời có nhiều mây xám", categoryId: "cau-thuong", explanation: "Câu văn tường thuật thời tiết bình thường, không dùng biện pháp tu từ." },
      { id: 21, text: "Mắt bé tròn xoe như hai hòn bi ve", categoryId: "so-sanh", explanation: "Có từ 'như' so sánh đôi mắt bé với hòn bi ve." },
      { id: 22, text: "Chị gió thì thầm trò chuyện với cây", categoryId: "nhan-hoa", explanation: "Gió được gọi là 'Chị' và biết 'thì thầm trò chuyện'." },
      { id: 23, text: "Công cha như núi Thái Sơn", categoryId: "so-sanh", explanation: "Câu ca dao so sánh công lao người cha với ngọn núi cao." },
      { id: 24, text: "Em ngồi học bài ở góc bàn", categoryId: "cau-thuong", explanation: "Câu miêu tả hoạt động thực tế hàng ngày." },
    ],
  },
];

export default function SortingBasketGame({ onClose }: SortingBasketGameProps) {
  const { addStudentXp } = useAuth();
  const [selectedTopicId, setSelectedTopicId] = useState<string>("vietnamese-grammar");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<SortingItem[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];

  const resetGame = useCallback((topicId = selectedTopicId) => {
    const topic = TOPICS.find((t) => t.id === topicId) || TOPICS[0];
    const items = [...topic.items].sort(() => 0.5 - Math.random());
    setShuffledItems(items);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setIsFinished(false);
  }, [selectedTopicId]);

  useEffect(() => {
    resetGame(selectedTopicId);
  }, [selectedTopicId, resetGame]);

  const handleSelectBasket = (categoryId: string) => {
    if (feedback || isFinished) return;
    const currentItem = shuffledItems[currentIndex];
    if (!currentItem) return;

    if (currentItem.categoryId === categoryId) {
      // Đúng!
      sound.playCorrect();
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      const points = 100 + (nextStreak > 1 ? nextStreak * 20 : 0);
      setScore((s) => s + points);
      if (nextStreak % 3 === 0) {
        sound.playCombo(nextStreak);
      }
      setFeedback({
        isCorrect: true,
        message: `Chính xác! ${currentItem.explanation}`,
      });
    } else {
      // Sai
      sound.playWrong();
      setStreak(0);
      setFeedback({
        isCorrect: false,
        message: `Chưa đúng rồi! ${currentItem.explanation}`,
      });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex + 1 < shuffledItems.length) {
        setCurrentIndex((i) => i + 1);
      } else {
        // Kết thúc màn chơi
        setIsFinished(true);
        sound.playVictory();
        const earnedXp = Math.max(100, Math.round(score * 0.8));
        addStudentXp(earnedXp);
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    }, 1500);
  };

  const currentItem = shuffledItems[currentIndex];
  const progressPercent = shuffledItems.length > 0 ? ((currentIndex) / shuffledItems.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border-4 border-spark-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* TOP BAR */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🧺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-heading">
                  Kéo Thả Phân Loại Tri Thức
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  Game Ôn Tập Bài Học
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 font-medium">
                {currentTopic.title} • {currentTopic.subject}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 px-3 py-1.5 rounded-xl text-right">
              <span className="text-[10px] uppercase tracking-wider block font-bold text-purple-200">Điểm Số</span>
              <span className="text-lg font-black text-amber-300">{score}</span>
            </div>
            {streak > 1 && (
              <div className="bg-amber-500/30 border border-amber-400/50 px-2.5 py-1.5 rounded-xl flex items-center gap-1">
                <span className="text-sm">🔥</span>
                <span className="text-xs font-black text-amber-300">x{streak}</span>
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
          {TOPICS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sound.playClick();
                setSelectedTopicId(t.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedTopicId === t.id
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.title}</span>
            </button>
          ))}
        </div>

        {/* GAME PLAY AREA */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto flex flex-col justify-between">
          {!isFinished ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs font-black text-slate-500 mb-1">
                  <span>Tiến độ câu: {currentIndex + 1} / {shuffledItems.length}</span>
                  <span>{Math.round(progressPercent)}% Hoàn thành</span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* CARD TO SORT */}
              <div className="my-auto text-center py-6 px-4">
                <div className="inline-block px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-full text-xs font-extrabold mb-3">
                  👉 Chọn chiếc giỏ phù hợp nhất với thẻ dưới đây:
                </div>

                {currentItem && (
                  <div className="max-w-md mx-auto bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-amber-300 rounded-3xl p-6 shadow-xl transform hover:scale-105 transition-all">
                    <span className="text-4xl block mb-2">🏷️</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wide font-heading">
                      &quot;{currentItem.text}&quot;
                    </h3>
                  </div>
                )}

                {/* FEEDBACK BANNER */}
                {feedback && (
                  <div
                    className={`mt-4 p-3 rounded-2xl max-w-lg mx-auto flex items-center gap-2.5 text-sm font-bold shadow-md transition-all animate-bounce ${
                      feedback.isCorrect
                        ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-300"
                        : "bg-rose-100 text-rose-800 border-2 border-rose-300"
                    }`}
                  >
                    {feedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span className="text-left">{feedback.message}</span>
                  </div>
                )}
              </div>

              {/* SORTING BASKETS */}
              <div className="mt-8">
                <p className="text-center text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                  👇 Chạm vào giỏ tương ứng để bỏ vào:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {currentTopic.categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleSelectBasket(cat.id)}
                      disabled={!!feedback}
                      className={`p-4 sm:p-5 rounded-3xl border-2 ${cat.borderColor} bg-gradient-to-b ${cat.bgGradient} shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center text-center transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <span className="text-4xl mb-2">{cat.icon}</span>
                      <h4 className={`text-lg font-black font-heading ${cat.color}`}>
                        {cat.name}
                      </h4>
                      <span className="text-[11px] font-bold text-slate-500 mt-1">
                        Bấm để thả vào giỏ này 📥
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* FINISHED SUMMARY SCREEN */
            <div className="text-center py-8 px-4 my-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-5xl mx-auto mb-4 shadow-xl animate-bounce">
                🏆
              </div>
              <h3 className="text-3xl font-black font-heading text-slate-900 mb-2">
                Hoàn Thành Xuất Sắc!
              </h3>
              <p className="text-slate-600 font-medium max-w-md mx-auto mb-6">
                Em đã phân loại rất chính xác toàn bộ kiến thức của bài học: <br />
                <span className="font-extrabold text-purple-600">{currentTopic.title}</span>
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto mb-6">
                <div className="bg-purple-50 border-2 border-purple-200 p-3 rounded-2xl">
                  <span className="text-xs text-purple-600 font-bold block">Tổng Điểm</span>
                  <span className="text-2xl font-black text-purple-800">{score}</span>
                </div>
                <div className="bg-amber-50 border-2 border-amber-200 p-3 rounded-2xl">
                  <span className="text-xs text-amber-600 font-bold block">Thưởng XP</span>
                  <span className="text-2xl font-black text-amber-600">+{Math.max(100, Math.round(score * 0.8))} XP</span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => resetGame()}
                  className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Chơi Lại Chủ Đề Này
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-sm transition flex items-center gap-2 shadow-lg"
                >
                  Quay Lại Vũ Trụ Game 🚀
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

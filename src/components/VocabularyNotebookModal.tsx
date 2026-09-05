"use client";

import { useState, useEffect } from "react";
import { sound } from "@/lib/soundEffects";
import { getVocabularyNotes } from "@/lib/dataStore";
import { VocabularyItem } from "@/lib/data";
import { Search, Calendar } from "lucide-react";

interface VocabularyNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VocabularyNotebookModal({ isOpen, onClose }: VocabularyNotebookModalProps) {
  const [notes, setNotes] = useState<VocabularyItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (isOpen) {
      setNotes(getVocabularyNotes());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const categories = ["all", "Từ loại", "Chính tả", "Thành ngữ", "Biện pháp tu từ", "Từ đồng nghĩa"];

  const filteredNotes = notes.filter((item) => {
    const matchCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              📖
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl tracking-tight">Sổ Tay Ngôn Từ Của Em</h3>
              <p className="text-xs text-emerald-100">
                Kho tàng từ vựng, thành ngữ & mẹo chính tả đã thu thập được ({notes.length} từ)
              </p>
            </div>
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

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 space-y-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm nhanh từ ngữ, thành ngữ, định nghĩa..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {cat === "all" ? "Tất Cả" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-3">
          {filteredNotes.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="text-3xl block text-slate-300">📚</span>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Chưa tìm thấy từ ngữ nào phù hợp với bộ lọc hiện tại.
              </p>
              <p className="text-xs text-slate-400">
                Hãy tham gia các mini-game để tự động mở khóa thêm nhiều từ ngữ mới nhé!
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-200 hover:shadow-md transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">{note.word}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                      {note.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" /> {note.dateLearned}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>Ý nghĩa:</strong> {note.definition}
                </p>

                <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                  <span className="font-semibold text-emerald-700">Ví dụ câu hay: </span>
                  <span className="italic">&ldquo;{note.exampleSentence}&rdquo;</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Ghi nhớ sâu hơn bằng cách tự đặt câu với các từ trên mỗi ngày</span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition"
          >
            Đóng Sổ Tay
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Book } from "@/lib/types";
import { BookOpen, Star, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface BookCardProps {
  book: Book;
  onUpdate: (book: Book) => void;
  onDelete: (id: string) => void;
}

export default function BookCard({ book, onUpdate, onDelete }: BookCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const progress = book.totalPages > 0 ? Math.round((book.pagesRead / book.totalPages) * 100) : 0;

  const statusLabel = {
    reading: { text: "Reading", bg: "bg-[var(--accent-gold)]/20", color: "text-[var(--accent-gold)]" },
    finished: { text: "Finished", bg: "bg-[var(--accent-green)]/20", color: "text-[var(--accent-green)]" },
    "to-read": { text: "To Read", bg: "bg-[var(--text-muted)]/20", color: "text-[var(--text-muted)]" },
  }[book.status];

  return (
    <div className="group relative">
      <div
        className="relative rounded-lg overflow-hidden transition-all duration-300 hover:translate-y-[-4px] cursor-pointer warm-glow"
        style={{ background: `linear-gradient(145deg, ${book.coverColor}22, ${book.coverColor}08)` }}
        onClick={() => {
          if (book.status === "reading") {
            const newPages = Math.min(book.pagesRead + 20, book.totalPages);
            onUpdate({ ...book, pagesRead: newPages, status: newPages >= book.totalPages ? "finished" : "reading" });
          }
        }}
      >
        {/* Book cover */}
        <div className="relative h-44 flex flex-col justify-between p-4 book-spine"
          style={{ background: `linear-gradient(135deg, ${book.coverColor}, ${book.coverColor}dd)` }}>
          
          {/* Status badge */}
          <div className="flex justify-between items-start">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusLabel.bg} ${statusLabel.color} backdrop-blur-sm`}>
              {statusLabel.text}
            </span>
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black/20"
              >
                <MoreVertical size={14} className="text-white/80" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 z-50 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg shadow-xl py-1 min-w-[140px]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onUpdate({ ...book, status: book.status === "finished" ? "reading" : "finished", pagesRead: book.status === "finished" ? 0 : book.totalPages });
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                  >
                    <Pencil size={13} /> Toggle Status
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete(book.id); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-[var(--bg-card-hover)]"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Title & Author */}
          <div>
            <h3 className="text-white font-bold text-sm leading-tight drop-shadow-lg line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {book.title}
            </h3>
            <p className="text-white/70 text-[11px] mt-1">{book.author}</p>
          </div>
        </div>

        {/* Info section */}
        <div className="p-3 space-y-2">
          {/* Genre */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-full">
              {book.genre}
            </span>
            {book.rating > 0 && (
              <div className="flex items-center gap-0.5">
                {[...Array(book.rating)].map((_, i) => (
                  <Star key={i} size={10} className="fill-[var(--accent-gold)] text-[var(--accent-gold)]" />
                ))}
              </div>
            )}
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                <BookOpen size={10} /> {book.pagesRead}/{book.totalPages} pages
              </span>
              <span className="text-[10px] font-bold text-[var(--accent-gold)]">{progress}%</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full reading-progress transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notes tooltip */}
      {book.notes && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-40 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg px-3 py-2 shadow-xl min-w-[200px] max-w-[250px] mb-2">
            <p className="text-[11px] text-[var(--text-secondary)] italic">&ldquo;{book.notes}&rdquo;</p>
          </div>
        </div>
      )}
    </div>
  );
}

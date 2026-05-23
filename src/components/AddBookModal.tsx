"use client";

import { useState } from "react";
import { X, BookPlus } from "lucide-react";
import { Book, BOOK_GENRES, COVER_COLORS } from "@/lib/types";

interface AddBookModalProps {
  onAdd: (book: Book) => void;
  onClose: () => void;
}

export default function AddBookModal({ onAdd, onClose }: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Fiction");
  const [totalPages, setTotalPages] = useState("");
  const [coverColor, setCoverColor] = useState(COVER_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !totalPages) return;

    const newBook: Book = {
      id: Date.now().toString(),
      title,
      author,
      genre,
      totalPages: parseInt(totalPages),
      pagesRead: 0,
      rating: 0,
      notes: "",
      coverColor,
      dateAdded: new Date().toISOString().split("T")[0],
      status: "to-read",
    };
    onAdd(newBook);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-gold)]/15 flex items-center justify-center">
              <BookPlus size={18} className="text-[var(--accent-gold)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
                Add to Shelf
              </h2>
              <p className="text-xs text-[var(--text-muted)]">Add a new book to your collection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
            <X size={18} className="text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Great Gatsby"
              className="w-full px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-gold)]/50 focus:ring-1 focus:ring-[var(--accent-gold)]/20 transition-all"
              required
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="F. Scott Fitzgerald"
              className="w-full px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-gold)]/50 focus:ring-1 focus:ring-[var(--accent-gold)]/20 transition-all"
              required
            />
          </div>

          {/* Genre & Pages */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-gold)]/50 transition-all"
              >
                {BOOK_GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">Pages</label>
              <input
                type="number"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                placeholder="320"
                min="1"
                className="w-full px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-gold)]/50 transition-all"
                required
              />
            </div>
          </div>

          {/* Cover Color */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">Cover Color</label>
            <div className="flex flex-wrap gap-2">
              {COVER_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCoverColor(color)}
                  className={`w-8 h-8 rounded-lg transition-all ${coverColor === color ? "ring-2 ring-[var(--accent-gold)] ring-offset-2 ring-offset-[var(--bg-secondary)] scale-110" : "hover:scale-105"}`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-amber)] text-[var(--bg-primary)] font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <BookPlus size={16} />
            Add to Bookshelf
          </button>
        </form>
      </div>
    </div>
  );
}

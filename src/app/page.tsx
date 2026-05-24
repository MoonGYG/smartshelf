"use client";

import { useState, useEffect, useMemo } from "react";
import { Book, SAMPLE_BOOKS } from "@/lib/types";
import {
  BookOpen, Plus, Search, LayoutGrid, List, Library,
  Sparkles, BarChart3, Filter
} from "lucide-react";
import BookCard from "@/components/BookCard";
import AddBookModal from "@/components/AddBookModal";
import StatsPanel from "@/components/StatsPanel";
import AIRecommendations from "@/components/AIRecommendations";

const STORAGE_KEY = "smartshelf-books";

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterGenre, setFilterGenre] = useState<string>("all");
  const [showStats, setShowStats] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBooks(JSON.parse(saved));
      } catch {
        setBooks(SAMPLE_BOOKS);
      }
    } else {
      setBooks(SAMPLE_BOOKS);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    }
  }, [books, mounted]);

  const addBook = (book: Book) => {
    setBooks((prev) => [book, ...prev]);
    setShowAddModal(false);
  };

  const updateBook = (updated: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || b.status === filterStatus;
      const matchGenre = filterGenre === "all" || b.genre === filterGenre;
      return matchSearch && matchStatus && matchGenre;
    });
  }, [books, search, filterStatus, filterGenre]);

  const genres = useMemo(() => [...new Set(books.map((b) => b.genre))].sort(), [books]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      {/* Background texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-[var(--border-color)]/50 bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-amber)] flex items-center justify-center shadow-lg">
              <Library size={20} className="text-[var(--bg-primary)]" />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="text-[var(--accent-gold)]">Smart</span>
                <span className="text-[var(--text-primary)]">Shelf</span>
              </h1>
              <p className="text-[10px] text-[var(--text-muted)] tracking-wider uppercase">AI Bookshelf Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] text-xs font-medium border border-[var(--accent-gold)]/20 flex items-center gap-1.5">
              <Sparkles size={12} />
              Powered by MiMo
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books or authors..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent-gold)]/40 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Status */}
            <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg p-0.5">
              {[
                { value: "all", label: "All" },
                { value: "reading", label: "Reading" },
                { value: "finished", label: "Done" },
                { value: "to-read", label: "Queue" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${filterStatus === f.value
                    ? "bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Genre filter */}
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-gold)]/40"
            >
              <option value="all">All Genres</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            {/* Stats toggle */}
            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-2.5 rounded-lg border transition-all ${showStats
                ? "bg-[var(--accent-gold)]/15 border-[var(--accent-gold)]/30 text-[var(--accent-gold)]"
                : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              title="Toggle Stats"
            >
              <BarChart3 size={16} />
            </button>

            {/* Add book */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-amber)] text-[var(--bg-primary)] font-bold text-xs hover:opacity-90 transition-opacity"
            >
              <Plus size={14} />
              Add Book
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-6">
          {/* Bookshelf */}
          <div className="flex-1 min-w-0">
            {/* Shelf count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[var(--text-muted)]">
                <span className="text-[var(--text-primary)] font-bold">{filteredBooks.length}</span> books
                {search && <span> matching &ldquo;{search}&rdquo;</span>}
              </p>
            </div>

            {/* Book Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} onUpdate={updateBook} onDelete={deleteBook} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <BookOpen size={48} className="text-[var(--text-muted)]/30 mb-4" />
                <h3 className="text-lg font-bold text-[var(--text-muted)] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {search ? "No matches found" : "Your shelf is empty"}
                </h3>
                <p className="text-sm text-[var(--text-muted)]/70 mb-4">
                  {search ? "Try a different search term" : "Add your first book to get started"}
                </p>
                {!search && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] text-sm"
                  >
                    <Plus size={14} /> Add a Book
                  </button>
                )}
              </div>
            )}

            {/* Shelf decoration */}
            <div className="mt-8">
              <div className="shelf-wood h-3 rounded-sm" />
              <div className="h-1 bg-[var(--shelf-wood)] rounded-b-sm" style={{ marginLeft: "4px", marginRight: "4px" }} />
            </div>
          </div>

          {/* Sidebar */}
          {showStats && (
            <div className="w-72 flex-shrink-0 space-y-4">
              <StatsPanel books={books} />
              <AIRecommendations books={books} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border-color)]/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">© 2026 SmartShelf — Built by MiMo v2.5 Pro</p>
          <p className="text-xs text-[var(--text-muted)]">v1.0.0</p>
        </div>
      </footer>

      {/* Add Book Modal */}
      {showAddModal && (
        <AddBookModal onAdd={addBook} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

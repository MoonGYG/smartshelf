"use client";

import { useState } from "react";
import { Book } from "@/lib/types";
import { Sparkles, Loader2, ChevronRight, BookOpen } from "lucide-react";

interface AIRecommendationsProps {
  books: Book[];
}

interface Recommendation {
  title: string;
  author: string;
  reason: string;
  genre: string;
}

export default function AIRecommendations({ books }: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const librarySummary = books.map((b) => `"${b.title}" by ${b.author} (${b.genre}, ${b.status})`).join(", ");
      const finishedGenres = books.filter((b) => b.status === "finished").map((b) => b.genre);
      const topGenres = [...new Set(finishedGenres)].slice(0, 3);

      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          library: librarySummary,
          topGenres: topGenres.join(", "),
          totalBooks: books.length,
        }),
      });
      const data = await res.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
        setExpanded(true);
      }
    } catch (err) {
      console.error("Failed to get recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-[var(--accent-gold)]" />
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">AI Picks</span>
        </div>
        <button
          onClick={getRecommendations}
          disabled={loading}
          className="text-[11px] px-3 py-1.5 rounded-lg bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/25 transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          {loading ? "Thinking..." : "Get Recommendations"}
        </button>
      </div>

      {/* Content */}
      {recommendations.length > 0 && expanded && (
        <div className="divide-y divide-[var(--border-color)]">
          {recommendations.map((rec, i) => (
            <div key={i} className="px-4 py-3 hover:bg-[var(--bg-card-hover)] transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-10 rounded flex items-center justify-center flex-shrink-0" style={{ background: `var(--accent-gold)15` }}>
                  <BookOpen size={14} className="text-[var(--accent-gold)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight">{rec.title}</h4>
                  <p className="text-[11px] text-[var(--text-muted)]">{rec.author} · {rec.genre}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 italic">{rec.reason}</p>
                </div>
                <ChevronRight size={14} className="text-[var(--text-muted)] mt-1 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}

      {recommendations.length === 0 && !loading && (
        <div className="px-4 py-6 text-center">
          <Sparkles size={24} className="text-[var(--accent-gold)]/30 mx-auto mb-2" />
          <p className="text-xs text-[var(--text-muted)]">
            Click &ldquo;Get Recommendations&rdquo; for AI-powered book suggestions based on your library
          </p>
        </div>
      )}
    </div>
  );
}

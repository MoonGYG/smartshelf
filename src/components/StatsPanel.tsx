"use client";

import { Book } from "@/lib/types";
import { BookOpen, BookCheck, Clock, Star, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface StatsPanelProps {
  books: Book[];
}

export default function StatsPanel({ books }: StatsPanelProps) {
  const totalBooks = books.length;
  const finished = books.filter((b) => b.status === "finished").length;
  const reading = books.filter((b) => b.status === "reading").length;
  const toRead = books.filter((b) => b.status === "to-read").length;
  const totalPages = books.reduce((sum, b) => sum + b.totalPages, 0);
  const pagesRead = books.reduce((sum, b) => sum + b.pagesRead, 0);
  const avgRating = books.filter((b) => b.rating > 0).reduce((sum, b, _, arr) => sum + b.rating / arr.length, 0);

  // Genre distribution
  const genreCounts: Record<string, number> = {};
  books.forEach((b) => { genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1; });
  const genreData = Object.entries(genreCounts).map(([name, value]) => ({ name, value }));
  const COLORS = ["#d4a550", "#e8a840", "#6b9e5a", "#c47a4a", "#8b3a4a", "#2C3E6B", "#5A3A6B", "#3A6B4A"];

  // Status distribution
  const statusData = [
    { name: "Finished", value: finished, color: "#6b9e5a" },
    { name: "Reading", value: reading, color: "#d4a550" },
    { name: "To Read", value: toRead, color: "#8b7355" },
  ].filter((d) => d.value > 0);

  const stats = [
    { label: "Total Books", value: totalBooks, icon: BookOpen, color: "var(--accent-gold)" },
    { label: "Finished", value: finished, icon: BookCheck, color: "var(--accent-green)" },
    { label: "Currently Reading", value: reading, icon: Clock, color: "var(--accent-amber)" },
    { label: "Avg Rating", value: avgRating.toFixed(1), icon: Star, color: "var(--accent-rust)" },
  ];

  return (
    <div className="space-y-5">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-3.5"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={14} style={{ color: stat.color }} />
              <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</span>
            </div>
            <span className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Pages Progress */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-[var(--accent-gold)]" />
          <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Reading Progress</span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <span className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {pagesRead.toLocaleString()}
          </span>
          <span className="text-xs text-[var(--text-muted)]">of {totalPages.toLocaleString()} pages</span>
        </div>
        <div className="h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full reading-progress transition-all duration-700"
            style={{ width: `${totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0}%` }}
          />
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-2">
          {totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0}% complete across all books
        </p>
      </div>

      {/* Status Pie */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
        <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Collection Status</span>
        <div className="flex items-center gap-4 mt-3">
          <div className="w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={28} outerRadius={48} paddingAngle={4} dataKey="value">
                  {statusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs text-[var(--text-secondary)]">{s.name}</span>
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Genre Bar Chart */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4">
        <span className="text-xs uppercase tracking-wider text-[var(--text-muted)]">Genre Breakdown</span>
        <div className="mt-3 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={genreData} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "var(--text-secondary)" }} width={70} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "var(--text-primary)" }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {genreData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  totalPages: number;
  pagesRead: number;
  rating: number;
  notes: string;
  coverColor: string;
  dateAdded: string;
  status: "reading" | "finished" | "to-read";
}

export const BOOK_GENRES = [
  "Fiction", "Non-Fiction", "Sci-Fi", "Fantasy", "Mystery",
  "Romance", "Thriller", "Biography", "History", "Science",
  "Philosophy", "Self-Help", "Technology", "Poetry", "Horror"
];

export const COVER_COLORS = [
  "#8B4513", "#A0522D", "#6B3FA0", "#2E5A3B", "#8B3A3A",
  "#2C3E6B", "#6B4226", "#3A5A6B", "#5A3A6B", "#6B5A2E",
  "#4A6B3A", "#6B3A5A", "#2E4A6B", "#6B4A2E", "#3A6B4A"
];

export const SAMPLE_BOOKS: Book[] = [
  {
    id: "1",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Sci-Fi",
    totalPages: 688,
    pagesRead: 688,
    rating: 5,
    notes: "Masterpiece of science fiction. The spice must flow.",
    coverColor: "#C47A4A",
    dateAdded: "2025-12-01",
    status: "finished",
  },
  {
    id: "2",
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    genre: "Technology",
    totalPages: 352,
    pagesRead: 210,
    rating: 4,
    notes: "Essential reading for every developer.",
    coverColor: "#2C3E6B",
    dateAdded: "2026-01-15",
    status: "reading",
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    genre: "Fiction",
    totalPages: 328,
    pagesRead: 328,
    rating: 5,
    notes: "Big Brother is watching. More relevant than ever.",
    coverColor: "#8B3A3A",
    dateAdded: "2025-10-20",
    status: "finished",
  },
  {
    id: "4",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "History",
    totalPages: 498,
    pagesRead: 150,
    rating: 4,
    notes: "Fascinating look at human history.",
    coverColor: "#5A3A6B",
    dateAdded: "2026-02-10",
    status: "reading",
  },
  {
    id: "5",
    title: "Neuromancer",
    author: "William Gibson",
    genre: "Sci-Fi",
    totalPages: 271,
    pagesRead: 0,
    rating: 0,
    notes: "",
    coverColor: "#3A6B4A",
    dateAdded: "2026-03-05",
    status: "to-read",
  },
  {
    id: "6",
    title: "The Design of Everyday Things",
    author: "Don Norman",
    genre: "Non-Fiction",
    totalPages: 368,
    pagesRead: 368,
    rating: 5,
    notes: "Changed how I think about design and usability.",
    coverColor: "#6B5A2E",
    dateAdded: "2025-09-12",
    status: "finished",
  },
  {
    id: "7",
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Sci-Fi",
    totalPages: 496,
    pagesRead: 380,
    rating: 5,
    notes: "Rocky is the best character in fiction. Fight me.",
    coverColor: "#2E4A6B",
    dateAdded: "2026-04-01",
    status: "reading",
  },
  {
    id: "8",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    totalPages: 320,
    pagesRead: 320,
    rating: 4,
    notes: "1% better every day. Good framework.",
    coverColor: "#6B4226",
    dateAdded: "2025-11-08",
    status: "finished",
  },
];

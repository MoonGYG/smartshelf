import { NextRequest, NextResponse } from "next/server";

const MIMO_API_URL = "https://opengateway.gitlawb.com/v1/chat/completions";

export async function POST(req: NextRequest) {
  try {
    const { library, topGenres, totalBooks } = await req.json();

    const systemMessage = {
      role: "system",
      content: `You are SmartShelf AI, a literary recommendation engine. You suggest books based on a user's reading history and preferences.

IMPORTANT: Always respond with valid JSON only. No markdown, no explanation.
Format: {"recommendations": [{"title": "...", "author": "...", "reason": "...", "genre": "..."}]}

Rules:
- Suggest 4 books the user hasn't read yet
- Match their preferred genres but suggest variety
- Give specific, compelling reasons based on their library
- Include a mix of classics and modern works
- Be concise but insightful in reasons`,
    };

    const userMessage = {
      role: "user",
      content: `My library (${totalBooks} books): ${library}

My top genres: ${topGenres}

Recommend 4 books I should read next. Respond with JSON only.`,
    };

    const response = await fetch(MIMO_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mimo-v2.5-pro",
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json(parsed);
      }
    } catch {
      // If parsing fails, return a fallback
    }

    // Fallback recommendations
    return NextResponse.json({
      recommendations: [
        { title: "Foundation", author: "Isaac Asimov", reason: "A cornerstone of science fiction that builds grand civilizations.", genre: "Sci-Fi" },
        { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", reason: "Fascinating exploration of how we think and make decisions.", genre: "Non-Fiction" },
        { title: "The Name of the Wind", author: "Patrick Rothfuss", reason: "Beautifully written fantasy with an unforgettable protagonist.", genre: "Fantasy" },
        { title: "Meditations", author: "Marcus Aurelius", reason: "Timeless Stoic wisdom that's as relevant today as 2000 years ago.", genre: "Philosophy" },
      ],
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 });
  }
}

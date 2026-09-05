import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { DEFAULT_VOCABULARY_NOTES } from "@/lib/data";

export const dynamic = "force-dynamic";

interface VocabDbRow {
  id: string;
  word: string;
  category: string;
  definition: string;
  exampleSentence: string;
  dateLearned: string;
}

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(
        "SELECT id, word, category, definition, example_sentence as exampleSentence, date_learned as dateLearned FROM vocabulary_notes ORDER BY created_at DESC"
      )
      .all() as VocabDbRow[];

    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, source: "sqlite", data: rows });
    }
    return NextResponse.json({ success: true, source: "fallback", data: DEFAULT_VOCABULARY_NOTES });
  } catch {
    return NextResponse.json({ success: true, source: "fallback", data: DEFAULT_VOCABULARY_NOTES });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, word, category, definition, exampleSentence, dateLearned } = body;

    if (!word || !definition) {
      return NextResponse.json({ success: false, message: "Thiếu từ ngữ hoặc giải nghĩa" }, { status: 400 });
    }

    const noteId = id || `vocab_${Date.now()}`;
    const db = getDb();
    db.prepare(
      `INSERT OR REPLACE INTO vocabulary_notes (id, word, category, definition, example_sentence, date_learned)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(
      noteId,
      word,
      category || "Từ loại",
      definition,
      exampleSentence || "",
      dateLearned || "Hôm nay"
    );

    return NextResponse.json({
      success: true,
      message: "Đã lưu từ vựng vào SQLite thành công",
      data: { id: noteId, word, category, definition, exampleSentence, dateLearned },
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

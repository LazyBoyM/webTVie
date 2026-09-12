import { NextResponse } from "next/server";
import { DEFAULT_VOCABULARY_NOTES } from "@/lib/data";
import { isTursoConfigured, getTursoClient, ensureTursoTables } from "@/lib/turso";

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
    if (isTursoConfigured()) {
      const turso = getTursoClient()!;
      await ensureTursoTables(turso);
      const result = await turso.execute(
        "SELECT id, word, category, definition, example_sentence as exampleSentence, date_learned as dateLearned FROM vocabulary_notes ORDER BY created_at DESC"
      );
      if (result.rows && result.rows.length > 0) {
        return NextResponse.json({ success: true, source: "turso", data: result.rows as unknown as VocabDbRow[] });
      }
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

    if (!isTursoConfigured()) {
      return NextResponse.json({ success: false, message: "Chưa cấu hình CSDL Turso Cloud" }, { status: 500 });
    }

    const noteId = id || `vocab_${Date.now()}`;
    const turso = getTursoClient()!;
    await ensureTursoTables(turso);

    await turso.execute({
      sql: `INSERT OR REPLACE INTO vocabulary_notes (id, word, category, definition, example_sentence, date_learned)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [
        noteId,
        word,
        category || "Từ loại",
        definition,
        exampleSentence || "",
        dateLearned || "Hôm nay",
      ],
    });

    return NextResponse.json({
      success: true,
      message: "Đã lưu từ vựng vào Turso Cloud thành công",
      data: { id: noteId, word, category, definition, exampleSentence, dateLearned },
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

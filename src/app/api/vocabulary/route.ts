import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { DEFAULT_VOCABULARY_NOTES } from "@/lib/data";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, word, category, definition, example_sentence as exampleSentence, date_learned as dateLearned FROM vocabulary_notes ORDER BY created_at DESC"
    );
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, source: "mysql", data: rows });
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
    const pool = getDbPool();
    await pool.query(
      `INSERT INTO vocabulary_notes (id, word, category, definition, example_sentence, date_learned)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE definition = VALUES(definition), example_sentence = VALUES(example_sentence)`,
      [
        noteId,
        word,
        category || "Từ loại",
        definition,
        exampleSentence || "",
        dateLearned || "Hôm nay",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Đã lưu từ vựng vào MySQL thành công",
      data: { id: noteId, word, category, definition, exampleSentence, dateLearned },
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

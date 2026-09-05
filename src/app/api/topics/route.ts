import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SAMPLE_VIETNAMESE_TOPICS } from "@/lib/data";

export const dynamic = "force-dynamic";

interface TopicDbRow {
  id: string;
  name: string;
  grade: number;
  questionCount: number;
  icon: string;
  description: string;
  is_active: number;
}

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(
        "SELECT id, name, grade, total_questions as questionCount, icon, description, COALESCE(is_active, 0) as is_active FROM topics ORDER BY grade ASC"
      )
      .all() as TopicDbRow[];

    if (rows && rows.length > 0) {
      const parsed = rows.map((r) => ({
        id: r.id,
        name: r.name,
        grade: r.grade,
        questionCount: r.questionCount,
        icon: r.icon || "📖",
        description: r.description || "",
        isActive: Boolean(r.is_active),
        category: "tu-loai",
        categoryName: "Chuyên Đề Tiếng Việt",
      }));
      return NextResponse.json({ success: true, source: "sqlite", data: parsed });
    }
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_VIETNAMESE_TOPICS });
  } catch {
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_VIETNAMESE_TOPICS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, grade, description, icon } = body;
    if (!name) {
      return NextResponse.json({ success: false, message: "Tên đề ôn tập là bắt buộc" }, { status: 400 });
    }

    const id = `topic_${Date.now()}`;
    const db = getDb();
    db.prepare(
      `INSERT INTO topics (id, name, grade, total_questions, icon, description, is_active)
       VALUES (?, ?, ?, 0, ?, ?, 0)`
    ).run(id, name.trim(), grade || 4, icon || "📖", description || `Chuyên đề ôn tập ${name.trim()}`);

    return NextResponse.json({
      success: true,
      message: "Đã thêm đề ôn tập mới vào CSDL SQLite",
      data: {
        id,
        name: name.trim(),
        grade: grade || 4,
        questionCount: 0,
        icon: icon || "📖",
        description: description || `Chuyên đề ôn tập ${name.trim()}`,
        isActive: false,
        category: "tu-loai",
        categoryName: "Chuyên Đề Tiếng Việt",
      },
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { topicId } = body;
    if (!topicId) {
      return NextResponse.json({ success: false, message: "Thiếu topicId" }, { status: 400 });
    }

    const db = getDb();
    // Kích hoạt duy nhất đề được chọn
    db.prepare("UPDATE topics SET is_active = CASE WHEN id = ? THEN 1 ELSE 0 END").run(topicId);

    return NextResponse.json({ success: true, message: "Đã giao đề ôn tập này cho cả lớp thành công!" });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

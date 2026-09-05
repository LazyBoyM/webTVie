import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SAMPLE_STUDENTS } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(
        "SELECT id as studentId, '1234' as pin, name, avatar, 'Lớp 4A' as className, grade, xp, level, streak, '[]' as badges, 0 as completedQuizzes, 100 as accuracy FROM students ORDER BY xp DESC"
      )
      .all();
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, source: "sqlite", data: rows });
    }
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_STUDENTS });
  } catch {
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_STUDENTS });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, xpDelta, gemsDelta, streak } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu student id" }, { status: 400 });
    }

    const db = getDb();
    const update = db.prepare(`
      UPDATE students 
      SET xp = xp + ?, 
          gems = gems + ?, 
          streak = COALESCE(?, streak), 
          level = CAST((xp + ?) / 300 AS INT) + 1,
          last_active = 'Hôm nay'
      WHERE id = ?
    `);
    update.run(xpDelta || 0, gemsDelta || 0, streak ?? null, xpDelta || 0, id);

    return NextResponse.json({ success: true, message: "Đã cập nhật học sinh thành công vào SQLite" });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, grade, avatar } = body;
    if (!name) {
      return NextResponse.json({ success: false, message: "Tên học sinh là bắt buộc" }, { status: 400 });
    }

    const id = `stu_${Date.now()}`;
    const db = getDb();
    db.prepare(
      `INSERT INTO students (id, name, grade, avatar, xp, streak, gems, stars, level, last_active)
       VALUES (?, ?, ?, ?, 0, 1, 100, 10, 1, 'Hôm nay')`
    ).run(id, name, grade || 4, avatar || "🦊");

    return NextResponse.json({
      success: true,
      message: "Đã thêm học sinh mới vào SQLite",
      data: { id, name, grade, avatar, xp: 0, streak: 1, gems: 100, stars: 10, level: 1, lastActive: "Hôm nay" },
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

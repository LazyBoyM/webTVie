import { NextResponse } from "next/server";
import { SAMPLE_STUDENTS } from "@/lib/data";
import { isTursoConfigured, getTursoClient, ensureTursoTables } from "@/lib/turso";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (isTursoConfigured()) {
      const turso = getTursoClient()!;
      await ensureTursoTables(turso);
      const result = await turso.execute(
        "SELECT id as studentId, '1234' as pin, name, avatar, 'Lớp 4A' as className, grade, xp, level, streak, '[]' as badges, 0 as completedQuizzes, 100 as accuracy FROM students ORDER BY xp DESC"
      );
      if (result.rows && result.rows.length > 0) {
        return NextResponse.json({ success: true, source: "turso", data: result.rows });
      }
    }
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_STUDENTS });
  } catch {
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_STUDENTS });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, avatar, grade, xpDelta, gemsDelta, streak } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu student id" }, { status: 400 });
    }

    if (!isTursoConfigured()) {
      return NextResponse.json({ success: false, message: "Chưa cấu hình CSDL Turso Cloud" }, { status: 500 });
    }

    const turso = getTursoClient()!;
    await ensureTursoTables(turso);

    if (name !== undefined || avatar !== undefined || grade !== undefined) {
      await turso.execute({
        sql: "UPDATE students SET name = COALESCE(?, name), avatar = COALESCE(?, avatar), grade = COALESCE(?, grade) WHERE UPPER(id) = UPPER(?)",
        args: [name ?? null, avatar ?? null, grade ?? null, id],
      });
    }

    if (xpDelta !== undefined || gemsDelta !== undefined || streak !== undefined) {
      const numXp = Number(xpDelta) || 0;
      const numGems = Number(gemsDelta) || 0;
      await turso.execute({
        sql: `UPDATE students 
              SET xp = xp + ?, 
                  gems = gems + ?, 
                  streak = COALESCE(?, streak), 
                  level = CAST((xp + ?) / 300 AS INT) + 1,
                  last_active = 'Hôm nay'
              WHERE UPPER(id) = UPPER(?)`,
        args: [numXp, numGems, streak ?? null, numXp, id],
      });
    }

    return NextResponse.json({ success: true, message: "Đã cập nhật học sinh thành công vào Turso Cloud" });
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

    if (!isTursoConfigured()) {
      return NextResponse.json({ success: false, message: "Chưa cấu hình CSDL Turso Cloud" }, { status: 500 });
    }

    const id = `stu_${Date.now()}`;
    const turso = getTursoClient()!;
    await ensureTursoTables(turso);

    await turso.execute({
      sql: `INSERT INTO students (id, name, grade, avatar, xp, streak, gems, stars, level, last_active)
            VALUES (?, ?, ?, ?, 0, 1, 100, 10, 1, 'Hôm nay')`,
      args: [id, name, grade || 4, avatar || "🦊"],
    });

    return NextResponse.json({
      success: true,
      message: "Đã thêm học sinh mới vào Turso Cloud",
      data: { id, name, grade, avatar, xp: 0, streak: 1, gems: 100, stars: 10, level: 1, lastActive: "Hôm nay" },
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu student id" }, { status: 400 });
    }

    if (!isTursoConfigured()) {
      return NextResponse.json({ success: false, message: "Chưa cấu hình CSDL Turso Cloud" }, { status: 500 });
    }

    const turso = getTursoClient()!;
    await ensureTursoTables(turso);
    await turso.execute({
      sql: "DELETE FROM students WHERE id = ?",
      args: [id],
    });

    return NextResponse.json({ success: true, message: "Đã xóa học sinh thành công khỏi Turso Cloud" });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

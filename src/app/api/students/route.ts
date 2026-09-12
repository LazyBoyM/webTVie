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
        "SELECT id as studentId, COALESCE(pin, '1234') as pin, name, avatar, 'Lớp 4A' as className, grade, xp, level, streak, '[]' as badges, 0 as completedQuizzes, 100 as accuracy FROM students ORDER BY xp DESC"
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
    const { id, name, avatar, grade, pin, xpDelta, gemsDelta, streak } = body;
    if (!id) {
      return NextResponse.json({ success: false, message: "Thiếu student id" }, { status: 400 });
    }

    if (!isTursoConfigured()) {
      return NextResponse.json({ success: false, message: "Chưa cấu hình CSDL Turso Cloud" }, { status: 500 });
    }

    const turso = getTursoClient()!;
    await ensureTursoTables(turso);

    if (name !== undefined || avatar !== undefined || grade !== undefined || pin !== undefined) {
      await turso.execute({
        sql: "UPDATE students SET name = COALESCE(?, name), avatar = COALESCE(?, avatar), grade = COALESCE(?, grade), pin = COALESCE(?, pin) WHERE UPPER(id) = UPPER(?)",
        args: [name ?? null, avatar ?? null, grade ?? null, pin ?? null, id],
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
    const { id: customId, name, grade, avatar, pin } = body;
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: "Tên học sinh là bắt buộc" }, { status: 400 });
    }

    if (!isTursoConfigured()) {
      return NextResponse.json({ success: false, message: "Chưa cấu hình CSDL Turso Cloud" }, { status: 500 });
    }

    const turso = getTursoClient()!;
    await ensureTursoTables(turso);

    let finalId = (customId || "").trim().toUpperCase();

    // Nếu không nhập mã, tự động sinh mã dạng HS04, HS05...
    if (!finalId) {
      const existing = await turso.execute("SELECT id FROM students");
      const hsNumbers = existing.rows
        .map((r) => String(r.id || "").toUpperCase())
        .filter((id) => id.startsWith("HS"))
        .map((id) => parseInt(id.replace("HS", ""), 10))
        .filter((n) => !isNaN(n));
      const maxNum = hsNumbers.length > 0 ? Math.max(...hsNumbers) : 3;
      const nextNum = maxNum + 1;
      finalId = `HS${nextNum < 10 ? "0" + nextNum : nextNum}`;
    }

    // Kiểm tra xem mã đã tồn tại chưa
    const checkExist = await turso.execute({
      sql: "SELECT id FROM students WHERE UPPER(id) = UPPER(?)",
      args: [finalId],
    });
    if (checkExist.rows && checkExist.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: `Mã học sinh "${finalId}" đã tồn tại! Vui lòng chọn mã khác.` },
        { status: 400 }
      );
    }

    const cleanPin = (pin || "1234").trim();

    await turso.execute({
      sql: `INSERT INTO students (id, name, pin, grade, avatar, xp, streak, gems, stars, level, last_active)
            VALUES (?, ?, ?, ?, ?, 0, 0, 100, 10, 1, 'Mới tạo')`,
      args: [finalId, name.trim(), cleanPin, grade || 4, avatar || "🦊"],
    });

    const newStudentData = {
      studentId: finalId,
      id: finalId,
      pin: cleanPin,
      name: name.trim(),
      grade: grade || 4,
      avatar: avatar || "🦊",
      className: "Lớp 4A",
      xp: 0,
      streak: 0,
      gems: 100,
      stars: 10,
      level: 1,
      lastActive: "Mới tạo",
    };

    return NextResponse.json({
      success: true,
      message: `Đã thêm học sinh "${name.trim()}" với mã "${finalId}" thành công!`,
      data: newStudentData,
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
      sql: "DELETE FROM students WHERE UPPER(id) = UPPER(?)",
      args: [id.trim()],
    });

    return NextResponse.json({ success: true, message: "Đã xóa học sinh thành công khỏi Turso Cloud" });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

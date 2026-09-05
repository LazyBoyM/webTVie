import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { INITIAL_VIETNAMESE_QUESTIONS } from "@/lib/dataStore";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get("topicId");

    const pool = getDbPool();
    let query = "SELECT id, subject, grade, topic, topic_id as topicId, question, options, correct_index as correctIndex, explanation, difficulty FROM questions";
    const params: string[] = [];

    if (topicId) {
      query += " WHERE topic_id = ?";
      params.push(topicId);
    }
    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    if (rows && rows.length > 0) {
      const parsed = rows.map((r) => ({
        ...r,
        options: typeof r.options === "string" ? JSON.parse(r.options) : r.options,
      }));
      return NextResponse.json({ success: true, source: "mysql", data: parsed });
    }
    return NextResponse.json({ success: true, source: "fallback", data: INITIAL_VIETNAMESE_QUESTIONS });
  } catch {
    return NextResponse.json({ success: true, source: "fallback", data: INITIAL_VIETNAMESE_QUESTIONS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, subject, grade, topic, topicId, question, options, correctIndex, explanation, difficulty } = body;

    if (!question || !options) {
      return NextResponse.json({ success: false, message: "Thiếu nội dung câu hỏi hoặc đáp án" }, { status: 400 });
    }

    const questionId = id || `vn_q_${Date.now()}`;
    const pool = getDbPool();
    await pool.query(
      `INSERT INTO questions (id, subject, grade, topic, topic_id, question, options, correct_index, explanation, difficulty)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        questionId,
        subject || "tieng-viet",
        grade || 4,
        topic || "Chung",
        topicId || "topic_tu_loai",
        question,
        JSON.stringify(options),
        correctIndex ?? 0,
        explanation || "",
        difficulty || "medium",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Đã lưu câu hỏi mới vào CSDL MySQL",
      data: { id: questionId, ...body },
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

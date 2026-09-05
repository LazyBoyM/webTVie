import { NextResponse } from "next/server";
import { getDbPool } from "@/lib/db";
import { SAMPLE_VIETNAMESE_TOPICS } from "@/lib/data";
import { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pool = getDbPool();
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, grade, total_questions as questionCount, icon, description FROM topics ORDER BY grade ASC"
    );
    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, source: "mysql", data: rows });
    }
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_VIETNAMESE_TOPICS });
  } catch {
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_VIETNAMESE_TOPICS });
  }
}

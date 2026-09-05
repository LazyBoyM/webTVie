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
}

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(
        "SELECT id, name, grade, total_questions as questionCount, icon, description FROM topics ORDER BY grade ASC"
      )
      .all() as TopicDbRow[];

    if (rows && rows.length > 0) {
      return NextResponse.json({ success: true, source: "sqlite", data: rows });
    }
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_VIETNAMESE_TOPICS });
  } catch {
    return NextResponse.json({ success: true, source: "fallback", data: SAMPLE_VIETNAMESE_TOPICS });
  }
}

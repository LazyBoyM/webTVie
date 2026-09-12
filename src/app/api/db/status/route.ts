import { NextResponse } from "next/server";
import { testDbConnection } from "@/lib/db";
import { isTursoConfigured, getTursoClient, ensureTursoTables } from "@/lib/turso";

export const dynamic = "force-dynamic";

export async function GET() {
  if (isTursoConfigured()) {
    try {
      const turso = getTursoClient()!;
      await ensureTursoTables(turso);
      const res = await turso.execute("SELECT 1 as connected");
      if (res) {
        return NextResponse.json({
          connected: true,
          message: "Đang kết nối Turso SQLite Cloud (Đám mây đồng bộ 24/7 toàn cầu)",
          databasePath: process.env.TURSO_DATABASE_URL || "Turso Cloud",
          provider: "turso",
        });
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      return NextResponse.json({
        connected: false,
        message: `Lỗi kết nối Turso Cloud: ${error.message}`,
        provider: "turso",
      });
    }
  }

  const status = testDbConnection();
  return NextResponse.json({ ...status, provider: "sqlite" });
}

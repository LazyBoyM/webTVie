import { NextResponse } from "next/server";
import { setupTursoDatabase } from "@/lib/turso";

export const dynamic = "force-dynamic";

export async function POST() {
  const result = await setupTursoDatabase();
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

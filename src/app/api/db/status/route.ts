import { NextResponse } from "next/server";
import { testTursoConnection } from "@/lib/turso";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await testTursoConnection();
  return NextResponse.json(status);
}

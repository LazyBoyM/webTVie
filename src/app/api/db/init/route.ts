import { NextResponse } from "next/server";
import { setupDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  const result = await setupDatabase();
  return NextResponse.json(result, {
    status: result.success ? 200 : 500,
  });
}

import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await sql`SELECT version()`;
    const row = Array.isArray(result) ? (result as Record<string, unknown>[])[0] : null;
    return NextResponse.json({ ok: true, version: row?.version });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

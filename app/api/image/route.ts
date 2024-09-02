import { Google } from "@/module";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(req.nextUrl.searchParams.entries()) as any;
  return NextResponse.json(await Google.photo(query.q));
}

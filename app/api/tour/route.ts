import { ChatGPT } from "@/module";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = await ChatGPT.tour(body.keyword, body.tour);
  return NextResponse.json({ result });
}

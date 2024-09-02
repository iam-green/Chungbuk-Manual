import { PlaceService } from "@/database/service";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const query = Object.fromEntries(
    req.nextUrl.searchParams.entries()
  ) as object;
  const list = await PlaceService.find(query);
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const place = await PlaceService.create(data);
  return NextResponse.json(place);
}

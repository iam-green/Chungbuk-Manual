import { PlaceService } from "@/database/service";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const data = await PlaceService.get(params.name);
  return NextResponse.json(data ? data : { error: "Not found" }, {
    status: data ? 200 : 404,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  const json = await req.json();
  const data = await PlaceService.update(params.name, json);
  return NextResponse.json(data ? data : { error: "Not found" }, {
    status: data ? 200 : 404,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  await PlaceService.delete(params.name);
  return NextResponse.json({ result: "success" }, { status: 200 });
}

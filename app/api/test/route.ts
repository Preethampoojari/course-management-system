import { NextResponse } from "next/server";
export async function POST() {
  return new Response("Test webhook working", { status: 200 });
}

// export async function GET() {
//   return new Response("GET working", { status: 200 });
// }

export async function GET() {
  return NextResponse.json({ message: "API working" });
}

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "Sarah Johnson",
    email: "sarah@example.com",
  });
}
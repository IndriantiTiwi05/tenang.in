import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { success, error } from "@/lib/utils/apiResponse";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(error("Token tidak ditemukan"), { status: 401 });
    }

    // Validasi token
    try {
      verifyToken(token);
    } catch {
      return NextResponse.json(error("Token tidak valid"), { status: 401 });
    }

    // Cek dan Hapus Session
    const session = await prisma.session.findUnique({ where: { token } });
    
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }

    // Response dengan Helper
    const response = NextResponse.json(success(null, "Logout berhasil"));

    // Hapus Cookie
    response.cookies.set("authToken", "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;

  } catch (err) {
    logger.error("LOGOUT ERROR:", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(error("Server error"), { status: 500 });
  }
}
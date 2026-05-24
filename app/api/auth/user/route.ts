import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { success, error } from "@/lib/utils/apiResponse"; // Pastikan import ini ada
import { logger } from "@/lib/logger"; // Gunakan logger

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(error("Token tidak ditemukan"), { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token) as { id: string; email: string };
    } catch {
      return NextResponse.json(error("Token tidak valid"), { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { token },
    });

    if (!session) {
      return NextResponse.json(error("Session tidak ditemukan"), { status: 401 });
    }

    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } });
      return NextResponse.json(error("Session expired"), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nama: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(error("User tidak ditemukan"), { status: 404 });
    }

    return NextResponse.json(success(user, "Berhasil mengambil profile"));

  } catch (err) {
    logger.error("GET PROFILE ERROR:", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(error("Server error"), { status: 500 });
  }
}
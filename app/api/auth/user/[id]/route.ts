import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/utils/apiResponse"; // Konsisten
import { logger } from "@/lib/logger"; // Konsisten

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(error("ID wajib diisi"), { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(error("User tidak ditemukan"), { status: 404 });
    }

    return NextResponse.json(success(user, "User berhasil diambil"));

  } catch (err) {
    logger.error("GET USER ERROR", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(error("Server error"), { status: 500 });
  }
}
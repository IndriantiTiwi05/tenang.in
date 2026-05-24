import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import { getUserFromToken } from "@/lib/auth";
import { success, error } from "@/lib/utils/apiResponse";
import { logger } from "@/lib/logger"; // Tambahkan import ini

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(error("Unauthorized"), { status: 401 });
    }

    // Menggunakan transaksi untuk memastikan keduanya terhapus atau tidak sama sekali
    await prisma.$transaction([
      prisma.prediction.deleteMany({
        where: { userId: user.id },
      }),
      prisma.journalEntry.deleteMany({
        where: { userId: user.id },
      }),
    ]);

    return NextResponse.json(success(null, "Semua history berhasil dihapus"));

  } catch (err) {
    logger.error("DELETE HISTORY ERROR", { 
      error: err instanceof Error ? err.message : String(err) 
    });

    return NextResponse.json(error("Server error"), { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { success, error } from "@/lib/utils/apiResponse";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(error("Unauthorized"), { status: 401 });
    }

    const journals = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      include: { prediction: true },
      orderBy: { createdAt: "asc" },
    });

    const formatted = journals.map((item) => ({
      day: new Date(item.createdAt).toLocaleDateString("id-ID", {
        weekday: "short",
      }),
      value: Math.round((item.prediction?.skorBurnout || 0) * 100),
      risk: item.prediction?.labelRisk || "low",
    }));

    return NextResponse.json(success(formatted, "Data chart berhasil diambil"));

  } catch (err) {
    logger.error("GET CHART ERROR", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(error("Server error"), { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/utils/apiResponse";
import { logger } from "@/lib/logger";
import { registerSchema } from "@/lib/validations/registerSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(error(parsed.error.issues[0]?.message || "Input tidak valid"), { status: 400 });
    }

    const { nama, email, password } = parsed.data;

    // Cek duplikasi email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(error("Email sudah digunakan"), { status: 400 });
    }

    // Hash & Create
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { nama, email, password: hashedPassword },
      select: { id: true, nama: true, email: true, createdAt: true }
    });

    return NextResponse.json(success(user, "Register berhasil"), { status: 201 });

  } catch (err) {
    logger.error("REGISTER ERROR", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(error("Server error"), { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { success, error } from "@/lib/utils/apiResponse"; // Helper
import { logger } from "@/lib/logger"; // Logger
import { rateLimit } from "@/lib/rateLimiter"; // Rate Limiter

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting untuk keamanan
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    if (!rateLimit(ip)) {
      return NextResponse.json(error("Terlalu banyak percobaan login, coba lagi nanti"), { status: 429 });
    }

    const body = await req.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(error("Email dan password wajib diisi"), { status: 400 });
    }

    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json(error("Email atau password salah"), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(error("Email atau password salah"), { status: 401 });
    }

    // 2. Transaksi Session (Opsional tapi lebih aman)
    await prisma.session.deleteMany({ where: { userId: user.id } });
    const token = signToken({ id: user.id, email: user.email });
    
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: { userId: user.id, token, expiresAt },
    });

    // 3. Response dengan Helper
    const response = NextResponse.json(success({
      token,
      user: { id: user.id, nama: user.nama, email: user.email }
    }, "Login berhasil"));

    // Set Cookie
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;

  } catch (err) {
    logger.error("LOGIN ERROR:", { error: err instanceof Error ? err.message : String(err) });
    return NextResponse.json(error("Server error"), { status: 500 });
  }
}
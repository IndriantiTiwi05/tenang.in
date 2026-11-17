
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable belum diatur");
}

export const handler = async (event) => {
    try {
        // Ambil cookie dari request API Gateway
        const headers = event.headers || {};

        const cookieHeader =
            event.cookies?.join("; ") ||
            headers.cookie ||
            headers.Cookie ||
            "";

        const token = cookieHeader
            .split(";")
            .map((item) => item.trim())
            .find((item) => item.startsWith("authToken="))
            ?.substring("authToken=".length);

        if (!token) {
            return response(401, {
                status: "error",
                message: "Unauthorized",
                data: null,
            });
        }

        // Verifikasi JWT
        let decoded;

        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch {
            return response(401, {
                status: "error",
                message: "Invalid token",
                data: null,
            });
        }

        if (!decoded.id) {
            return response(401, {
                status: "error",
                message: "Invalid user token",
                data: null,
            });
        }

        // Periksa session database
        const session = await prisma.session.findUnique({
            where: { token },
        });

        if (!session) {
            return response(401, {
                status: "error",
                message: "Session not found",
                data: null,
            });
        }

        // Periksa masa berlaku session
        if (new Date() > session.expiresAt) {
            await prisma.session.delete({
                where: { id: session.id },
            });

            return response(401, {
                status: "error",
                message: "Session expired",
                data: null,
            });
        }

        // Pastikan token dan session milik user yang sama
        if (session.userId !== decoded.id) {
            return response(401, {
                status: "error",
                message: "Invalid session",
                data: null,
            });
        }

        // Ambil data jurnal dan prediksi
        const journals = await prisma.journalEntry.findMany({
            where: {
                userId: decoded.id,
            },
            include: {
                prediction: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        // Format data grafik
        const formatted = journals.map((item) => ({
            day: new Date(item.createdAt).toLocaleDateString("id-ID", {
                weekday: "short",
            }),
            value: Math.round((item.prediction?.skorBurnout || 0) * 100),
            risk: item.prediction?.labelRisk || "low",
        }));

        //Kirim response
        return response(200, {
            status: "success",
            message: "Data chart berhasil diambil",
            data: formatted,
        });

    } catch (err) {
        console.error("GET CHART ERROR:", err);

        return response(500, {
            status: "error",
            message: "Server error",
            data: null,
        });
    }
};

function response(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    };
}

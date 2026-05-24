import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
import { checkinSchema } from "@/lib/validations/checkinSchema";
import { calculateBurnout, generateInsight,} from "@/lib/services/checkinService";
import { success, error, } from "@/lib/utils/apiResponse"; 
import { logger } from "@/lib/logger";
import { rateLimit } from "@/lib/rateLimiter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user =
      await getUserFromToken(req);

    if (!user) {
      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

  
    const journals =
      await prisma.journalEntry.findMany({
        where: {
          userId: user.id,
        },

        include: {
          prediction: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      success(
        journals,
        "Berhasil ambil semua data"
      )
    );

  } catch (err) {

    logger.error("GET JOURNALS ERROR", {
      error:
        err instanceof Error
          ? err.message
          : String(err),
    });

    return NextResponse.json(
      error("Gagal ambil data"),
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {

    const ip =
      req.headers
        .get("x-forwarded-for")
        ?.split(",")[0]
        ?.trim() || "local";

    if (!rateLimit(ip)) {

      return NextResponse.json(
        error("Too many requests"),
        { status: 429 }
      );
    }

    const user =
      await getUserFromToken(req);

    if (!user) {

      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    let body;

    try {

      body = await req.json();

    } catch {

      return NextResponse.json(
        error("Invalid JSON"),
        { status: 400 }
      );
    }

    const parsed =
      checkinSchema.safeParse(body);

    if (!parsed.success) {

      return NextResponse.json(
        error(
          parsed.error.issues[0]?.message ||
          "Invalid input"
        ),
        { status: 400 }
      );
    }

    const {
      journal: journalText,
      sleep,
      workload,
      mood,
    } = parsed.data;

    const todayStart = new Date();

    todayStart.setHours(
      0,
      0,
      0,
      0
    );

    const todayEnd = new Date();

    todayEnd.setHours(
      23,
      59,
      59,
      999
    );

    const already =
      await prisma.journalEntry.findFirst({
        where: {
          userId: user.id,

          tanggal: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });

    if (already) {

      return NextResponse.json(
        error("Kamu sudah check-in hari ini"),
        { status: 400 }
      );
    }

    // MODEL 1 - EMOTION DETECTION AI  
    const emotionResponse =
      await fetch(
        "https://tenang-in-api-model1-production.up.railway.app/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            text: journalText,
          }),
        }
      );

    if (!emotionResponse.ok) {

      return NextResponse.json(
        error("Emotion AI error"),
        { status: 500 }
      );
    }

    const emotionData =
      await emotionResponse.json();

    const probabilities =
      emotionData.emotion.probabilities;

    const emotionLabel =
      emotionData.emotion.label;

    const confidence =
      emotionData.emotion.confidence;

    const {
      risk,
      score,
    } = calculateBurnout(
      sleep,
      workload,
      mood,
      probabilities.sadness ?? 0
    );

    const insight =
      generateInsight(risk);

    // MODEL 2 - BURNOUT AI
    const burnoutResponse =
      await fetch(
        "https://tenangin-production.up.railway.app/predict",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            text: journalText,

            Jam_Tidur_Semalam:
              sleep,

            Seberapa_Sibuk_Anda_Hari_Ini:
              workload === "very_low"
                ? 1
                : workload === "low"
                ? 2
                : workload === "medium"
                ? 3
                : workload === "high"
                ? 4
                : 5,

            Suasana_Hati_Anda:
              mood === "sad"
                ? 1
                : mood === "bad"
                ? 2
                : mood === "neutral"
                ? 3
                : mood === "good"
                ? 4
                : 5,

            prob_anger:
              probabilities.anger ?? 0,

            prob_fear:
              probabilities.fear ?? 0,

            prob_sadness:
              probabilities.sadness ?? 0,

            prob_joy:
              probabilities.joy ?? 0,

            prob_disgust:
              probabilities.disgust ?? 0,

            prob_trust:
              probabilities.trust ?? 0,

            prob_anticipation:
              probabilities.anticipation ?? 0,
          }),
        }
      );

    if (!burnoutResponse.ok) {

      const burnoutError =
        await burnoutResponse.text();

      logger.error("BURNOUT AI ERROR", {
        error: burnoutError,
      });

      return NextResponse.json(
        error("Burnout AI error"),
        { status: 500 }
      );
    }

    const burnoutText = await burnoutResponse.text();
    let burnoutData;
    try {
      burnoutData = JSON.parse(burnoutText);
    } catch {
      logger.error("AI return non-JSON:", burnoutText);
      return NextResponse.json(error("AI server error"), { status: 502 });
    }

    const result =
      await prisma.$transaction(
        async (tx) => {

          const createdJournal =
            await tx.journalEntry.create({
              data: {
                userId: user.id,

                tanggal: new Date(),

                teksJurnal:
                  journalText,

                jamTidur:
                  sleep,

                bebanKerja:
                  String(workload),

                mood:
                  String(mood),
              },
            });

          const createdPrediction =
            await tx.prediction.create({
              data: {

                userId: user.id,

                journalId:
                  createdJournal.id,

                probAnger:
                  probabilities.anger ?? 0,

                probFear:
                  probabilities.fear ?? 0,

                probSadness:
                  probabilities.sadness ?? 0,

                probJoy:
                  probabilities.joy ?? 0,

                probDisgust:
                  probabilities.disgust ?? 0,

                probTrust:
                  probabilities.trust ?? 0,

                probAnticipation:
                  probabilities.anticipation ?? 0,

                skorBurnout:
                  score / 100,

                labelRisk:
                  risk,
              },
            });

          return {

            journal:
              createdJournal,

            prediction: {

              ...createdPrediction,

              insight,

              emotion:
                emotionLabel,

              confidence,

              burnoutAI:
                burnoutData,
            },
          };
        }
      );


    logger.info("CHECKIN CREATED", {
      userId: user.id,
      ip,
    });

    return NextResponse.json(
      success(
        result,
        "Check-in berhasil"
      ),
      { status: 201 }
    );

  } catch (err) {

    logger.error("CHECKIN ERROR", {
      error:
        err instanceof Error
          ? err.message
          : String(err),
    });

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}
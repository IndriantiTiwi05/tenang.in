import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateBurnout, generateInsight, } from "@/lib/services/checkinService";
import { checkinSchema } from "@/lib/validations/checkinSchema";
import { success, error, } from "@/lib/utils/apiResponse";
import { getUserFromToken } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {

    const { id } =
      await params;

    const user =
      await getUserFromToken(req);

    if (!user) {

      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    const item =
      await prisma.journalEntry.findFirst({
        where: {
          id,
          userId: user.id,
        },

        include: {
          prediction: true,
        },
      });

    if (!item) {

      return NextResponse.json(
        error("Data tidak ditemukan"),
        { status: 404 }
      );
    }

    return NextResponse.json(
      success(
        item,
        "Berhasil ambil detail"
      )
    );

  } catch (err) {

    console.error(
      "GET DETAIL ERROR",
      err
    );

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {

    const { id } =
      await params;


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

    const existing =
      await prisma.journalEntry.findFirst({
        where: {
          id,
          userId: user.id,
        },

        include: {
          prediction: true,
        },
      });

    if (!existing) {

      return NextResponse.json(
        error("Data tidak ditemukan"),
        { status: 404 }
      );
    }

    const emotionResponse =
      await fetch(
        "https://tenang-in-api-model1-production.up.railway.app/predict",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
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

    const burnoutResponse =
      await fetch(
        "https://tenangin-production.up.railway.app/predict",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
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
        async (tx: any) => {

          const updatedJournal =
            await tx.journalEntry.update({
              where: {
                id,
              },

              data: {
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

          let updatedPrediction;

          if (existing.prediction) {

            updatedPrediction =
              await tx.prediction.update({
                where: {
                  journalId: id,
                },

                data: {

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

          } else {

            updatedPrediction =
              await tx.prediction.create({
                data: {

                  userId:
                    user.id,

                  journalId:
                    id,

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
          }

          return {

            journal:
              updatedJournal,

            prediction: {

              ...updatedPrediction,

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

    return NextResponse.json(
      success(
        result,
        "Berhasil update check-in"
      )
    );

  } catch (err) {

    console.error(
      "UPDATE ERROR",
      err
    );

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {

    const { id } =
      await params;

    const user =
      await getUserFromToken(req);

    if (!user) {

      return NextResponse.json(
        error("Unauthorized"),
        { status: 401 }
      );
    }

    const item =
      await prisma.journalEntry.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!item) {

      return NextResponse.json(
        error("Data tidak ditemukan"),
        { status: 404 }
      );
    }

    await prisma.journalEntry.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      success(
        item,
        "Berhasil dihapus"
      )
    );

  } catch (err) {

    console.error(
      "DELETE ERROR",
      err
    );

    return NextResponse.json(
      error("Server error"),
      { status: 500 }
    );
  }
}
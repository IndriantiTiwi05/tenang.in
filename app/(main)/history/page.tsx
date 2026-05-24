"use client";

import Link from "next/link";
import { useEffect, useState, } from "react";
import TrendChart from "@/components/dashboard/TrendChart";

interface CheckinItem {

  id: string;

  jamTidur: number;

  createdAt: string;

  prediction?: {

    skorBurnout: number;

    labelRisk:
      | "low"
      | "medium"
      | "high";
  };
}

export default function HistoryPage() {

  const [data, setData] =
    useState<CheckinItem[]>([]);

  // =========================
  // FETCH HISTORY
  // =========================
  useEffect(() => {

    const fetchHistory =
      async () => {

        try {

          const res =
            await fetch(
              "/api/checkin"
            );

          const result =
            await res.json();

          if (
            !res.ok ||
            !result.data
          ) {
            return;
          }

          setData(
            result.data
          );

        } catch (error) {

          console.error(error);
        }
      };

    fetchHistory();

  }, []);

  // =========================
  // AVERAGE SCORE
  // =========================

  const averageScoreRaw =
    data.length > 0
      ? data.reduce(
          (acc, item) =>
            acc +
            (
              item.prediction
                ?.skorBurnout || 0
            ),
          0
        ) / data.length
      : 0;

  const avgScore =
    (
      averageScoreRaw * 100
    ).toFixed(1);

  // =========================
  // AVERAGE SLEEP
  // =========================

  const avgSleep =
    data.length > 0
      ? (
          data.reduce(
            (acc, item) =>
              acc +
              item.jamTidur,
            0
          ) / data.length
        ).toFixed(1)
      : 0;

  // =========================
  // AGGREGATE RISK
  // =========================

  let overallRisk:
    | "low"
    | "medium"
    | "high" = "low";

  if (
    averageScoreRaw >= 0.7
  ) {

    overallRisk = "high";

  } else if (
    averageScoreRaw >= 0.4
  ) {

    overallRisk = "medium";
  }

  // =========================
  // STREAK
  // =========================

  const streak =
    data.length;

  // =========================
  // COLORS
  // =========================

  const getColor = (
    risk: string
  ) => {

    if (risk === "high") {
      return "bg-red-500";
    }

    if (risk === "medium") {
      return "bg-yellow-500";
    }

    return "bg-green-500";
  };

  return (

    <div className="p-6 space-y-6">

      {/* TITLE */}
      <h1 className="text-2xl font-bold text-white">

        History

      </h1>

      {/* STREAK */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl text-white">

        <h2 className="text-lg font-semibold">

          🔥 {streak} hari berturut-turut!

        </h2>

        <p className="text-sm opacity-80">

          Pertahankan!

        </p>

      </div>

      {/* SUMMARY */}
      <div className="bg-[#1a1a22] p-6 rounded-xl border border-gray-800">

        <h2 className="text-white font-semibold mb-6">

          Ringkasan Mingguan

        </h2>

        {/* SUMMARY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* STATUS */}
          <div>

            <p className="text-sm text-gray-400 mb-2">

              Status Keseluruhan

            </p>

            <span
              className={`px-3 py-1 rounded-full text-white text-sm ${getColor(
                overallRisk
              )}`}
            >
              {overallRisk}
            </span>

          </div>

          {/* SCORE */}
          <div>

            <p className="text-sm text-gray-400 mb-2">

              Skor Rata-rata

            </p>

            <p className="text-white text-2xl font-bold">

              {avgScore}%

            </p>

          </div>

          {/* SLEEP */}
          <div>

            <p className="text-sm text-gray-400 mb-2">

              Tidur Rata-rata

            </p>

            <p className="text-white text-2xl font-bold">

              {avgSleep} jam

            </p>

          </div>

        </div>

        {/* CHART */}
        <TrendChart />

      </div>

      {/* HISTORY LIST */}
      <div className="bg-[#1a1a22] p-6 rounded-xl border border-gray-800">

        <h2 className="text-white font-semibold mb-4">

          Riwayat Check-in

        </h2>

        <div className="space-y-4">

          {data.map((item) => {

            const score =
              Math.round(
                (
                  item.prediction
                    ?.skorBurnout ||
                  0
                ) * 100
              );

            const risk =
              item.prediction
                ?.labelRisk ||
              "low";

            return (

              <Link
                href={`/result/${item.id}`}
                key={item.id}
              >

                <div className="bg-[#0f0f14] p-4 rounded-lg flex items-center justify-between hover:border-purple-500 border border-transparent transition cursor-pointer">

                  {/* LEFT */}
                  <div>

                    <p className="text-white font-medium">

                      {new Date(
                        item.createdAt
                      ).toLocaleDateString(
                        "id-ID",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}

                    </p>

                    <p className="text-gray-400 text-sm">

                      {item.jamTidur} jam tidur

                    </p>

                  </div>

                  {/* PROGRESS */}
                  <div className="flex-1 mx-6">

                    <div className="w-full h-2 bg-gray-700 rounded">

                      <div
                        className={`h-2 rounded ${getColor(
                          risk
                        )}`}
                        style={{
                          width: `${score}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* BADGE */}
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${getColor(
                      risk
                    )}`}
                  >
                    {risk}
                  </span>

                </div>

              </Link>
            );
          })}

        </div>

      </div>

    </div>
  );
}
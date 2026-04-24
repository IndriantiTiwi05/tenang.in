"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("result");

    // 🔥 GUARD WAJIB
    if (!stored || stored === "undefined") {
      console.warn("No valid data in localStorage");
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      setData(parsed);
    } catch (err) {
      console.error("JSON error:", err);
      localStorage.removeItem("result");
    }
  }, []);

  if (!data) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Tidak ada data. Silakan check-in dulu.
      </div>
    );
  }

  const percentage = data.score || 0;

  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  const color =
    data.risk === "high"
      ? "#ef4444"
      : data.risk === "medium"
      ? "#facc15"
      : "#a855f7";

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-[#1a1a22] border border-gray-800 p-6 rounded-3xl">

        <h1 className="text-xl font-bold text-center mb-6 text-purple-400">
          Your Result
        </h1>

        <div className="flex flex-col items-center mb-6">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="#2a2a35"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={`${circumference} ${circumference}`}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              transform={`rotate(-90 ${radius} ${radius})`}
            />
          </svg>

          <div className="-mt-20 text-center">
            <p className="text-sm text-gray-400">Confidence</p>
            <h2 className="text-2xl font-bold">
              {percentage}%
            </h2>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-400">Burnout Risk</p>
          <h2 className="text-xl font-bold capitalize" style={{ color }}>
            {data.risk}
          </h2>
        </div>

        <div className="bg-[#0f0f14] border border-gray-800 p-4 rounded-xl mb-4">
          <p className="font-semibold mb-2">Detail Analysis</p>
          <p className="text-sm text-gray-400">
            Sleep: {data.sleep ?? "-"} jam
          </p>
          <p className="text-sm text-gray-400">
            Workload: {data.workload ?? "-"}
          </p>
        </div>

        <Link
          href="/checkin"
          className="block w-full bg-purple-600 text-center py-3 rounded-xl"
        >
          🔁 Check-in Lagi
        </Link>
      </div>
    </div>
  );
}
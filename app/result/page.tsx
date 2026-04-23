'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('result');
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data)
    return (
      <p className="text-center mt-10 text-gray-400">
        Loading...
      </p>
    );

  const percentage = data.score;
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  const color =
    data.risk === 'high'
      ? '#ef4444'
      : data.risk === 'medium'
      ? '#facc15'
      : '#a855f7';

  return (
    <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center text-white p-4">
      
      <div className="bg-[#1a1a22] border border-gray-800 p-6 rounded-3xl w-full max-w-md">

        <h1 className="text-xl font-bold text-center mb-6 text-purple-400">
          Your Result
        </h1>

        {/* CIRCLE */}
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

        {/* RISK */}
        <div className="text-center mb-4">
          <p className="text-gray-400">Burnout Risk</p>
          <h2 className="text-xl font-bold capitalize" style={{ color }}>
            {data.risk}
          </h2>
        </div>

        {/* DETAIL */}
        <div className="bg-[#0f0f14] border border-gray-800 p-4 rounded-xl mb-4">
          <p className="font-semibold mb-2">Detail Analysis</p>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Sleep: {data.sleep} jam</p>
            <p>Workload: {data.workload}</p>
          </div>
        </div>

        {/* REKOMENDASI */}
        <div className="bg-[#0f0f14] border border-gray-800 p-4 rounded-xl mb-4">
          <p className="font-semibold mb-2">Rekomendasi</p>

          {data.risk === 'high' && (
            <ul className="text-sm space-y-1 text-red-400">
              <li>🔴 Istirahat total minimal 1 hari</li>
              <li>🔴 Kurangi workload drastis</li>
              <li>🔴 Hindari overthinking</li>
            </ul>
          )}

          {data.risk === 'medium' && (
            <ul className="text-sm space-y-1 text-yellow-400">
              <li>🟡 Atur ulang jadwal kerja</li>
              <li>🟡 Tidur minimal 7 jam</li>
              <li>🟡 Ambil break setiap 2–3 jam</li>
            </ul>
          )}

          {data.risk === 'low' && (
            <ul className="text-sm space-y-1 text-purple-400">
              <li>🟢 Pertahankan pola hidup sehat</li>
              <li>🟢 Tetap olahraga ringan</li>
              <li>🟢 Jaga konsistensi tidur</li>
            </ul>
          )}
        </div>

        {/* BUTTON */}
        <Link
          href="/checkin"
          className="block w-full bg-purple-600 text-center py-3 rounded-xl hover:bg-purple-700 transition"
        >
          🔁 Check-in Lagi
        </Link>

      </div>
    </div>
  );
}
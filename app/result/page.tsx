'use client';

import { useEffect, useState } from 'react';

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('result');
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  const percentage = data.score;
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">

        <h1 className="text-xl font-bold text-center mb-6">
          Your Result
        </h1>

        <div className="flex flex-col items-center mb-6">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              stroke="#eee"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="#ef4444"
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
            <p className="text-sm text-gray-500">Confidence</p>
            <h2 className="text-2xl font-bold">
              {percentage}%
            </h2>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-500">Burnout Risk</p>
          <h2
            className={`text-xl font-bold capitalize ${
              data.risk === 'high'
                ? 'text-red-500'
                : data.risk === 'medium'
                ? 'text-yellow-500'
                : 'text-green-500'
            }`}
          >
            {data.risk}
          </h2>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <p className="font-semibold mb-2">Detail Analysis</p>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Sleep: {data.sleep} jam</p>
            <p>Workload: {data.workload}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl mb-4">
            <p className="font-semibold mb-2">Rekomendasi</p>

            {data.risk === 'high' && (
                <ul className="text-sm space-y-1">
                <li>🔴 Istirahat total minimal 1 hari</li>
                <li>🔴 Kurangi workload drastis</li>
                <li>🔴 Hindari overthinking</li>
                </ul>
            )}

            {data.risk === 'medium' && (
                <ul className="text-sm space-y-1">
                <li>🟡 Atur ulang jadwal kerja</li>
                <li>🟡 Tidur minimal 7 jam</li>
                <li>🟡 Ambil break setiap 2–3 jam</li>
                </ul>
            )}

            {data.risk === 'low' && (
                <ul className="text-sm space-y-1">
                <li>🟢 Pertahankan pola hidup sehat</li>
                <li>🟢 Tetap olahraga ringan</li>
                <li>🟢 Jaga konsistensi tidur</li>
                </ul>
            )}
            </div>

        <button
          onClick={() => (window.location.href = '/checkin')}
          className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600"
        >
          Back to Check-in
        </button>
      </div>
    </div>
  );
}
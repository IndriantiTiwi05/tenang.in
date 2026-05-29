"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ResultData = {
  id: string;
  tanggal: string;
  teksJurnal: string;
  jamTidur: number;
  bebanKerja: string;
  mood: string;
  createdAt: string;
  prediction: {
    skorBurnout: number;
    labelRisk: "low" | "medium" | "high";
  };
};

export default function ResultPage() {
  const params = useParams();
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. PINDAHKAN LOGIKA FETCH KE DALAM useEffect
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/checkin/${params.id}`);
        const result = await res.json();
        setData(result.data);
      } catch (error) {
        console.error("FETCH RESULT ERROR", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchDetail();
  }, [params.id]);

  // 2. DEFINISIKAN VARIABEL DI ATAS JSX (AGAR BISA DIAKSES DI DALAM JSX)
  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (!data) return <div className="text-white p-6">Result tidak ditemukan</div>;

  const score = Math.round((data.prediction?.skorBurnout || 0) * 100);
  const risk = data.prediction?.labelRisk || "low";

  const getRiskColor = () => {
    if (risk === "high") return "text-red-500";
    if (risk === "medium") return "text-yellow-400";
    return "text-green-400";
  };

  const getRiskBg = () => {
    if (risk === "high") return "bg-red-500/10 border-red-500/20";
    if (risk === "medium") return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-green-500/10 border-green-500/20";
  };

  const getInsight = () => {
    if (risk === "high") return "Kondisimu cukup berat. Istirahat dan kurangi tekanan kerja.";
    if (risk === "medium") return "Mulai jaga pola tidur dan atur aktivitas harian.";
    return "Kondisimu cukup baik. Pertahankan pola hidup sehat.";
  };

  const getRecommendation = () => {
    if (risk === "high") return ["Tidur minimal 7 jam", "Kurangi beban kerja", "Luangkan waktu istirahat"];
    if (risk === "medium") return ["Atur waktu tidur", "Kurangi overthinking", "Lakukan relaksasi ringan"];
    return ["Pertahankan pola sehat", "Jaga konsistensi tidur", "Lanjutkan check-in harian"];
  };

  // 3. KEMUDIAN RENDER JSX
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Hasil Analisis</h1>

      {/* MAIN CARD */}
      <div className="bg-[#1a1a22] border border-gray-800 rounded-3xl p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className={`inline-flex items-center px-4 py-2 rounded-xl border text-sm font-bold uppercase mb-5 ${getRiskBg()} ${getRiskColor()}`}>
              {risk} risk
            </div>
            <h2 className="text-6xl md:text-7xl font-bold mb-2">{score}%</h2>
            <p className="text-gray-400">Burnout Score</p>
          </div>

          {/* SVG Progress Circle */}
          <div className="relative w-36 h-36 md:w-44 md:h-44">
            <svg className="transform -rotate-90 w-full h-full">
              <circle cx="50%" cy="50%" r="45%" stroke="#2a2a35" strokeWidth="10" fill="none" />
              <circle cx="50%" cy="50%" r="45%" stroke={risk === "high" ? "#ef4444" : risk === "medium" ? "#f59e0b" : "#10b981"} 
                      strokeWidth="10" fill="none" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 - (score / 100) * (2 * Math.PI * 70)}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-bold">{score}%</div>
          </div>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a22] border border-gray-800 p-5 rounded-2xl">
          <p className="text-gray-400 text-sm mb-1">Mood</p>
          <h3 className="text-xl font-bold capitalize">{data.mood}</h3>
        </div>
        <div className="bg-[#1a1a22] border border-gray-800 p-5 rounded-2xl">
          <p className="text-gray-400 text-sm mb-1">Tidur</p>
          <h3 className="text-xl font-bold">{data.jamTidur} jam</h3>
        </div>
        <div className="bg-[#1a1a22] border border-gray-800 p-5 rounded-2xl">
          <p className="text-gray-400 text-sm mb-1">Workload</p>
          <h3 className="text-xl font-bold capitalize">{data.bebanKerja}</h3>
        </div>
      </div>

      {/* Lanjutkan dengan komponen Insight, Recommendation, dan Journal... */}
      <div className="bg-[#1a1a22] border border-gray-800 rounded-2xl p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Penjelasan</h3>
        <p className="text-gray-300 leading-8">{getInsight()}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/dashboard" className="bg-[#2a2a35] hover:bg-[#333] transition p-4 rounded-xl text-center font-semibold">Dashboard</Link>
        <Link href="/history" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition p-4 rounded-xl text-center font-semibold">History</Link>
      </div>
    </div>
  );
}
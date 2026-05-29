"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BurnoutCard from "@/components/dashboard/BurnoutCard";
import StreakCard from "@/components/dashboard/StreakCard";
import InsightCard from "@/components/dashboard/InsightCard";
import TrendChart from "@/components/dashboard/TrendChart";

interface User {
  nama: string;
  email: string;
}

interface Checkin {
  id: string;
  createdAt: string;
  prediction?: {
    skorBurnout: number;
    labelRisk: "low" | "medium" | "high";
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState({
    score: 0,
    risk: "low" as "low" | "medium" | "high",
  });
  const [streak, setStreak] = useState(0);
  const [trendText, setTrendText] = useState("");

  // FETCH USER & CHECKIN (Logika tetap sama)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        const result = await res.json();
        if (!res.ok) { router.push("/login"); return; }
        setUser(result.data);
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchCheckin = async () => {
      try {
        const res = await fetch("/api/checkin");
        const result = await res.json();
        if (!res.ok || !result.data) return;

        const checkins: Checkin[] = result.data;
        if (checkins.length === 0) {
          setLatest({ score: 0, risk: "low" });
          setTrendText("Lanjutkan check-in untuk melihat tren");
          return;
        }

        const sorted = [...checkins].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const scores = sorted.map((item) => item.prediction?.skorBurnout || 0);
        const averageScore = scores.reduce((acc, score) => acc + score, 0) / scores.length;
        const burnoutPercent = Math.round(averageScore * 100);

        let risk: "low" | "medium" | "high" = "low";
        if (averageScore >= 0.7) risk = "high";
        else if (averageScore >= 0.4) risk = "medium";

        setLatest({ score: burnoutPercent, risk });
        setStreak(sorted.length);

        if (sorted.length >= 3) {
          const latest3 = sorted.slice(0, 3);
          const first = Math.round((latest3[2].prediction?.skorBurnout || 0) * 100);
          const lastScore = Math.round((latest3[0].prediction?.skorBurnout || 0) * 100);
          if (lastScore > first) setTrendText("Burnout meningkat dalam 3 hari terakhir");
          else if (lastScore < first) setTrendText("Burnout menurun dalam 3 hari terakhir");
          else setTrendText("Burnout stabil dalam 3 hari terakhir");
        } else {
          setTrendText("Lanjutkan check-in untuk melihat tren");
        }
      } catch (error) { console.error(error); }
    };
    fetchCheckin();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) { console.error(error); }
  };

  return (
    <div className="w-full">
      {/* HEADER - Responsif */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-400 text-sm">Ringkasan kesehatan mentalmu hari ini</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link href="/profile" className="flex-1 md:flex-none flex items-center gap-4 bg-[#1f1f27] px-4 py-2 rounded-2xl border border-gray-800 hover:border-purple-500 transition">
            <div className="text-right flex-1">
              <p className="text-sm font-semibold text-white">{loading ? "Loading..." : user?.nama || "User"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-white shrink-0">
              {user?.nama?.charAt(0) || "U"}
            </div>
          </Link>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm transition">
            Logout
          </button>
        </div>
      </div>

      {/* TOP SECTION - Grid Responsif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <BurnoutCard score={latest.score} risk={latest.risk} trend={trendText} />
        </div>
        <StreakCard streak={streak} />
      </div>

      {/* CHART SECTION - Grid Responsif */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <TrendChart />
        </div>
        <InsightCard />
      </div>

      {/* BUTTON */}
      <Link href="/checkin" className="block text-center bg-gradient-to-r from-purple-600 to-purple-800 p-5 rounded-2xl hover:opacity-90 transition font-bold shadow-lg">
        + Start Daily Check-in
      </Link>
    </div>
  );
}
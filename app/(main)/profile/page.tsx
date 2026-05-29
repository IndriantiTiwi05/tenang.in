"use client";

import { useEffect, useState } from "react";

interface UserData {
  nama: string;
  email: string;
}

interface CheckinData {
  prediction?: {
    skorBurnout: number;
    labelRisk: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [checkins, setCheckins] = useState<CheckinData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch("/api/auth/user");
        const userResult = await userRes.json();
        setUser(userResult.data);

        const checkinRes = await fetch("/api/checkin");
        const checkinResult = await checkinRes.json();
        setCheckins(checkinResult.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const totalCheckin = checkins.length;
  const averageScore = totalCheckin > 0
    ? Math.round(checkins.reduce((acc, item) => acc + (item.prediction?.skorBurnout || 0), 0) / totalCheckin * 100)
    : 0;

  let currentStatus = "Low Risk";
  let statusColor = "text-green-400";
  let statusBg = "bg-green-500/10 border-green-500/20";

  if (averageScore >= 70) {
    currentStatus = "High Risk";
    statusColor = "text-red-400";
    statusBg = "bg-red-500/10 border-red-500/20";
  } else if (averageScore >= 40) {
    currentStatus = "Medium Risk";
    statusColor = "text-yellow-400";
    statusBg = "bg-yellow-500/10 border-yellow-500/20";
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-2">Manage your account information</p>
      </div>

      {/* PROFILE HERO - Responsif */}
      <div className="relative overflow-hidden bg-[#111118] border border-[#232336] rounded-3xl p-6 md:p-8 mb-8">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-72 md:h-72 bg-purple-600/10 blur-3xl rounded-full" />

        <div className="relative flex flex-col items-center text-center md:text-left md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shrink-0">
              {user?.nama?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{user?.nama}</h2>
              <p className="text-gray-400 mt-1 break-all">{user?.email}</p>
              <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border text-sm font-medium ${statusBg} ${statusColor}`}>
                ● {currentStatus}
              </div>
            </div>
          </div>

          <div className="bg-[#181824] border border-[#2a2a3d] rounded-2xl px-6 py-4 w-full md:w-auto md:min-w-[200px]">
            <p className="text-gray-400 text-xs md:text-sm mb-1">Average Burnout</p>
            <h3 className="text-3xl md:text-5xl font-bold text-white">{averageScore}%</h3>
          </div>
        </div>
      </div>

      {/* STATS - Grid Responsif */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: "Total Check-in", value: totalCheckin, color: "text-white" },
          { label: "Burnout Average", value: `${averageScore}%`, color: "text-yellow-400" },
          { label: "Current Status", value: currentStatus, color: statusColor }
        ].map((stat, i) => (
          <div key={i} className="bg-[#111118] border border-[#232336] rounded-2xl p-6 hover:border-purple-500/30 transition">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <h3 className={`text-3xl md:text-5xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
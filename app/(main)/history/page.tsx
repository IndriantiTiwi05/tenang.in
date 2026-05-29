"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TrendChart from "@/components/dashboard/TrendChart";

interface CheckinItem {
  id: string;
  jamTidur: number;
  teksJurnal: string;
  bebanKerja: string;
  mood: string;
  createdAt: string;
  prediction?: {
    skorBurnout: number;
    labelRisk: "low" | "medium" | "high";
  };
}

export default function HistoryPage() {
  const [data, setData] = useState<CheckinItem[]>([]);
  const [editingItem, setEditingItem] = useState<CheckinItem | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/checkin");
        const result = await res.json();
        if (!res.ok || !result.data) return;
        setData(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHistory();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!confirm("Yakin ingin menghapus jurnal ini?")) return;
    try {
      const res = await fetch(`/api/checkin?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setData(data.filter((item) => item.id !== id));
      } else {
        alert("Gagal menghapus jurnal");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (e: React.MouseEvent, item: CheckinItem) => {
    e.preventDefault();
    setEditingItem({ ...item });
  };

  const saveEdit = async () => {
    if (!editingItem) return;
    try {
      const res = await fetch("/api/checkin", {
        method: "PATCH",
        body: JSON.stringify(editingItem),
        headers: { "Content-Type": "application/json" },
      });
      const response = await res.json();
      if (res.ok) {
        const updatedEntry = response.data;
        setData((prevData) =>
          prevData.map((item) =>
            item.id === editingItem.id ? { ...item, ...updatedEntry, prediction: updatedEntry.prediction } : item
          )
        );
        setEditingItem(null);
        alert("Jurnal dan skor berhasil diperbarui!");
      } else {
        alert(response.message || "Gagal mengupdate jurnal");
      }
    } catch (err) {
      console.error("Error saat update:", err);
      alert("Terjadi kesalahan sistem");
    }
  };

  const validData = data.filter((item) => item.prediction != null);
  const averageScoreRaw = validData.length > 0 ? validData.reduce((acc, item) => acc + (item.prediction?.skorBurnout || 0), 0) / validData.length : 0;
  const avgScore = (averageScoreRaw * 100).toFixed(1);
  const avgSleep = data.length > 0 ? (data.reduce((acc, item) => acc + item.jamTidur, 0) / data.length).toFixed(1) : 0;

  let overallRisk: "low" | "medium" | "high" = "low";
  if (averageScoreRaw >= 0.7) overallRisk = "high";
  else if (averageScoreRaw >= 0.4) overallRisk = "medium";

  const getColor = (risk: string) => {
    if (risk === "high") return "bg-red-500";
    if (risk === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">History</h1>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl text-white">
        <h2 className="text-lg font-semibold">🔥 {data.length} hari berturut-turut!</h2>
        <p className="text-sm opacity-80">Pertahankan!</p>
      </div>

      <div className="bg-[#1a1a22] p-6 rounded-xl border border-gray-800">
        <h2 className="text-white font-semibold mb-6">Ringkasan Mingguan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400 mb-2">Status Keseluruhan</p>
            <span className={`px-3 py-1 rounded-full text-white text-sm inline-block ${getColor(overallRisk)}`}>{overallRisk}</span>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400 mb-2">Skor Rata-rata</p>
            <p className="text-white text-2xl font-bold">{avgScore}%</p>
          </div>
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400 mb-2">Tidur Rata-rata</p>
            <p className="text-white text-2xl font-bold">{avgSleep} jam</p>
          </div>
        </div>
        <TrendChart />
      </div>

      <div className="bg-[#1a1a22] p-6 rounded-xl border border-gray-800">
        <h2 className="text-white font-semibold mb-4">Riwayat Check-in</h2>
        <div className="space-y-4">
          {data.map((item) => {
            const score = Math.round((item.prediction?.skorBurnout || 0) * 100);
            const risk = item.prediction?.labelRisk || "low";
            return (
              <div key={item.id} className="relative group">
                <div className="absolute right-2 top-2 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={(e) => handleEdit(e, item)} className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs text-white">Edit</button>
                  <button onClick={(e) => handleDelete(e, item.id)} className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs text-white">Hapus</button>
                </div>
                <Link href={`/result/${item.id}`}>
                  <div className="bg-[#0f0f14] p-4 rounded-lg flex flex-col md:flex-row items-center justify-between hover:border-purple-500 border border-transparent transition cursor-pointer gap-4">
                    <div className="w-full md:w-auto text-center md:text-left">
                      <p className="text-white font-medium">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
                      <p className="text-gray-400 text-sm">{item.jamTidur} jam tidur</p>
                    </div>
                    <div className="flex-1 w-full md:mx-6">
                      <div className="w-full h-2 bg-gray-700 rounded"><div className={`h-2 rounded ${getColor(risk)}`} style={{ width: `${score}%` }} /></div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${getColor(risk)} shrink-0`}>{risk}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Edit... (bisa pakai struktur serupa dengan responsive padding/width) */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
           {/* ... (isi modal sudah cukup oke, tinggal pastikan max-w-lg) */}
        </div>
      )}
    </div>
  );
}
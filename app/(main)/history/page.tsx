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
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<CheckinItem | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/checkin");
        const result = await res.json();
        if (res.ok && result.data) setData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Penting: ini akan mematikan status loading
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
            item.id === editingItem.id 
              ? { ...item, ...updatedEntry, prediction: updatedEntry.prediction } 
              : item
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

  // Filter hanya data yang memiliki prediksi agar perhitungan tidak NaN
  const validData = data.filter((item) => item.prediction != null);

  const averageScoreRaw = validData.length > 0
    ? validData.reduce((acc, item) => acc + (item.prediction?.skorBurnout || 0), 0) / validData.length
    : 0;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400">Sedang menyiapkan riwayat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">History</h1>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl text-white">
        <h2 className="text-lg font-semibold">🔥 {data.length} hari berturut-turut!</h2>
        <p className="text-sm opacity-80">Pertahankan!</p>
      </div>

      <div className="bg-[#1a1a22] p-6 rounded-xl border border-gray-800">
        <h2 className="text-white font-semibold mb-6">Ringkasan Mingguan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-400 mb-2">Status Keseluruhan</p>
            <span className={`px-3 py-1 rounded-full text-white text-sm ${getColor(overallRisk)}`}>{overallRisk}</span>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-2">Skor Rata-rata</p>
            <p className="text-white text-2xl font-bold">{avgScore}%</p>
          </div>
          <div>
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
                  <div className="bg-[#0f0f14] p-4 rounded-lg flex items-center justify-between hover:border-purple-500 border border-transparent transition cursor-pointer">
                    <div>
                      <p className="text-white font-medium">{new Date(item.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
                      <p className="text-gray-400 text-sm">{item.jamTidur} jam tidur</p>
                    </div>
                    <div className="flex-1 mx-6">
                      <div className="w-full h-2 bg-gray-700 rounded"><div className={`h-2 rounded ${getColor(risk)}`} style={{ width: `${score}%` }} /></div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${getColor(risk)}`}>{risk}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a22] p-6 rounded-xl w-full max-w-lg border border-gray-700 space-y-6">
            <h2 className="text-white text-xl font-bold">Edit Jurnal</h2>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Apa yang kamu rasakan hari ini?</label>
              <textarea className="w-full p-3 bg-[#0f0f14] text-white rounded border border-gray-600" rows={3} value={editingItem.teksJurnal || ""} onChange={(e) => setEditingItem({...editingItem, teksJurnal: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">🌙 Durasi tidur ({editingItem.jamTidur} jam)</label>
              <input type="range" min="0" max="12" className="w-full accent-purple-600" value={editingItem.jamTidur || 0} onChange={(e) => setEditingItem({...editingItem, jamTidur: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">⚡ Tingkat Aktivitas</label>
              <div className="grid grid-cols-5 gap-2">
                {["very_low", "low", "medium", "high", "very_high"].map((level) => (
                  <button key={level} onClick={() => setEditingItem({...editingItem, bebanKerja: level})} className={`p-2 rounded text-xs capitalize transition ${editingItem.bebanKerja === level ? "bg-purple-600 text-white" : "bg-[#0f0f14] text-gray-400 hover:bg-gray-800"}`}>
                    {level.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">😊 Mood hari ini</label>
              <div className="grid grid-cols-5 gap-2">
                {["sad", "bad", "neutral", "good", "excellent"].map((m) => (
                  <button key={m} onClick={() => setEditingItem({...editingItem, mood: m})} className={`p-2 rounded text-xs capitalize transition ${editingItem.mood === m ? "bg-purple-600 text-white" : "bg-[#0f0f14] text-gray-400 hover:bg-gray-800"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button onClick={() => setEditingItem(null)} className="flex-1 bg-gray-600 p-2 rounded text-white hover:bg-gray-500">Batal</button>
              <button onClick={saveEdit} className="flex-1 bg-purple-600 p-2 rounded text-white hover:bg-purple-700">Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
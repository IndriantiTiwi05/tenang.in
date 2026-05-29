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
        console.error("Gagal mengambil data:", error);
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
        setData((prev) => prev.filter((item) => item.id !== id));
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
        setData((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, ...response.data } : item))
        );
        setEditingItem(null);
        alert("Berhasil diperbarui!");
      } else {
        alert(response.message || "Gagal mengupdate");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const validData = data.filter((item) => item.prediction != null);
  const avgScore = validData.length > 0
    ? ((validData.reduce((acc, item) => acc + (item.prediction?.skorBurnout || 0), 0) / validData.length) * 100).toFixed(1)
    : "0";
  const avgSleep = data.length > 0 ? (data.reduce((acc, item) => acc + item.jamTidur, 0) / data.length).toFixed(1) : "0";

  const getColor = (risk: string) => {
    if (risk === "high") return "bg-red-500";
    if (risk === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white">History</h1>

      {/* STATS CARD */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-2xl text-white">
        <h2 className="text-lg font-semibold">🔥 {data.length} hari berturut-turut!</h2>
        <p className="text-sm opacity-80">Terus jaga konsistensimu.</p>
      </div>

      <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
        <h2 className="text-white font-semibold mb-6">Ringkasan</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-[#0f0f14] rounded-xl border border-gray-700">
            <p className="text-xs text-gray-400">Skor Rata-rata</p>
            <p className="text-xl font-bold">{avgScore}%</p>
          </div>
          <div className="p-3 bg-[#0f0f14] rounded-xl border border-gray-700">
            <p className="text-xs text-gray-400">Tidur Rata-rata</p>
            <p className="text-xl font-bold">{avgSleep} jam</p>
          </div>
        </div>
        <div className="mt-6">
          <TrendChart />
        </div>
      </div>

      {/* LIST DATA */}
      <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
        <h2 className="text-white font-semibold mb-4">Riwayat</h2>
        <div className="space-y-3">
          {data.map((item) => {
            const score = Math.round((item.prediction?.skorBurnout || 0) * 100);
            const risk = item.prediction?.labelRisk || "low";
            return (
              <div key={item.id} className="relative group p-3 bg-[#0f0f14] rounded-xl border border-gray-700 hover:border-purple-500 transition">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-300 font-medium">{new Date(item.createdAt).toLocaleDateString("id-ID")}</p>
                  <div className="flex gap-2">
                    <button onClick={(e) => handleEdit(e, item)} className="text-[10px] bg-blue-600 px-2 py-1 rounded">Edit</button>
                    <button onClick={(e) => handleDelete(e, item.id)} className="text-[10px] bg-red-600 px-2 py-1 rounded">Hapus</button>
                  </div>
                </div>
                <Link href={`/result/${item.id}`} className="block">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                      <div className={`h-full ${getColor(risk)}`} style={{ width: `${score}%` }} />
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${getColor(risk)}`}>{risk}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL EDIT - Disederhanakan agar tidak rusak di HP */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1a1a22] p-5 rounded-2xl w-full max-w-sm border border-gray-700 space-y-4">
            <h2 className="text-white font-bold">Edit Jurnal</h2>
            <textarea className="w-full p-3 bg-[#0f0f14] text-white rounded-xl border border-gray-600 text-sm" rows={3} value={editingItem.teksJurnal} onChange={(e) => setEditingItem({...editingItem, teksJurnal: e.target.value})} />
            <div className="flex gap-2">
              <button onClick={() => setEditingItem(null)} className="flex-1 py-2 bg-gray-700 rounded-xl">Batal</button>
              <button onClick={saveEdit} className="flex-1 py-2 bg-purple-600 rounded-xl">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
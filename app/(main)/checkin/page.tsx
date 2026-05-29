"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 1. Definisikan Tipe di luar komponen
type Workload = "very_low" | "low" | "medium" | "high" | "very_high";
type Mood = "sad" | "bad" | "neutral" | "good" | "excellent";

export default function CheckinPage() {
  const router = useRouter();
  const [journal, setJournal] = useState("");
  const [sleep, setSleep] = useState(6);
  const [workload, setWorkload] = useState<Workload>("medium");
  const [mood, setMood] = useState<Mood>("neutral");
  const [loading, setLoading] = useState(false);

  // 2. Definisikan array/konstanta di dalam komponen sebelum return
  const moods: { label: Mood; emoji: string }[] = [
    { label: "sad", emoji: "😢" },
    { label: "bad", emoji: "🙁" },
    { label: "neutral", emoji: "😐" },
    { label: "good", emoji: "🙂" },
    { label: "excellent", emoji: "😁" },
  ];

  const workloadLevels: { label: string; value: Workload }[] = [
    { label: "Very Low", value: "very_low" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Very High", value: "very_high" },
  ];

  // 3. Pastikan handleSubmit didefinisikan di atas return
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journal.trim()) {
      alert("Isi jurnal dulu");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journal, sleep, workload, mood }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Gagal check-in");
        return;
      }

      localStorage.setItem("latestPredictionId", data.data.journal.id);
      router.push(`/result/${data.data.journal.id}`);
    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // 4. Baru kemudian return JSX
  return (
    <div className="min-h-screen bg-[#0f0f14] text-white p-4 md:p-8">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Daily Check-in</h1>

        {/* JOURNAL */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="w-full h-32 p-4 rounded-xl bg-[#0f0f14] border border-gray-700 outline-none"
            placeholder="Apa yang kamu rasakan hari ini?"
          />
        </div>

        {/* WORKLOAD */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <p className="mb-4 text-sm text-gray-300">⚡ Tingkat Aktivitas</p>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {workloadLevels.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setWorkload(item.value)}
                className={`py-3 px-2 rounded-xl text-xs md:text-sm transition ${
                  workload === item.value ? "bg-purple-600" : "bg-[#0f0f14] border border-gray-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-2xl font-bold"
        >
          {loading ? "Analyzing..." : "Analyze My Condition"}
        </button>
      </div>
    </div>
  );
}
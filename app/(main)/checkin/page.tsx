"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkin() {
  const [journal, setJournal] = useState("");
  const [sleep, setSleep] = useState(6);
  const [workload, setWorkload] = useState("medium");
  const [mood, setMood] = useState("neutral");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!journal) {
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

      // 🔥 VALIDASI WAJIB
      if (!res.ok || !data || !data.data) {
        console.error("Invalid response:", data);
        alert("Data dari server tidak valid");
        setLoading(false);
        return;
      }

      localStorage.setItem("result", JSON.stringify(data.data));
      router.push("/result");

    } catch (err) {
      console.error(err);
      alert("Server error");
    }

    setLoading(false);
  };

  const moods = [
    { label: "sad", emoji: "😢" },
    { label: "bad", emoji: "🙁" },
    { label: "neutral", emoji: "😐" },
    { label: "good", emoji: "🙂" },
    { label: "excellent", emoji: "😁" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f14] text-white p-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold">Daily Check-in</h1>

        {/* JOURNAL */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <p className="mb-3 text-sm text-gray-300">
            Apa yang kamu rasakan hari ini?
          </p>

          <textarea
            className="w-full p-3 rounded-lg bg-[#0f0f14] border border-gray-700 focus:border-purple-500 outline-none"
            placeholder="Hari ini cukup melelahkan karena..."
            onChange={(e) => setJournal(e.target.value)}
          />
        </div>

        {/* SLEEP */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <p className="mb-3 text-sm text-gray-300">
            🌙 Durasi tidur semalam
          </p>

          <input
            type="range"
            min="0"
            max="12"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
            className="w-full accent-purple-500"
          />

          <p className="text-center mt-2 text-purple-400 font-bold">
            {sleep} jam
          </p>
        </div>

        {/* WORKLOAD */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <p className="mb-3 text-sm text-gray-300">
            ⚡ Tingkat Aktivitas
          </p>

          <div className="flex gap-3">
            {["low", "medium", "high"].map((item) => (
              <button
                key={item}
                onClick={() => setWorkload(item)}
                className={`px-4 py-2 rounded-xl text-sm capitalize transition ${
                  workload === item
                    ? "bg-purple-600 scale-105 shadow-lg"
                    : "bg-[#0f0f14] border border-gray-700 hover:scale-105"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* MOOD */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
          <p className="mb-4 text-sm text-gray-300">
            😊 Mood hari ini
          </p>

          <div className="grid grid-cols-5 gap-4">
            {moods.map((item) => {
              const active = mood === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => setMood(item.label)}
                  className={`
                    flex flex-col items-center justify-center
                    h-24 rounded-xl border transition-all duration-200
                    ${
                      active
                        ? "border-purple-500 bg-purple-500/10 scale-105 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                        : "border-gray-700 hover:scale-105"
                    }
                  `}
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-xs mt-1 capitalize">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-xl hover:opacity-90 transition"
        >
          {loading ? "Analyzing..." : "Analyze My Condition"}
        </button>

      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Workload =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "very_high";

type Mood =
  | "sad"
  | "bad"
  | "neutral"
  | "good"
  | "excellent";

export default function CheckinPage() {

  const router = useRouter();

  // =========================
  // STATE
  // =========================

  const [journal, setJournal] =
    useState("");

  const [sleep, setSleep] =
    useState(6);

  const [workload, setWorkload] =
    useState<Workload>("medium");

  const [mood, setMood] =
    useState<Mood>("neutral");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!journal.trim()) {

      alert("Isi jurnal dulu");

      return;
    }

    setLoading(true);

    try {

      const res =
        await fetch(
          "/api/checkin",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              journal,
              sleep,
              workload,
              mood,
            }),
          }
        );

      const data =
        await res.json();

      console.log(data);

      if (!res.ok) {

        alert(
          data.message ||
          "Gagal check-in"
        );

        return;
      }

      // SAVE LAST RESULT
      localStorage.setItem(
        "latestPredictionId",
        data.data.journal.id
      );

      // REDIRECT
      router.push(
        `/result/${data.data.journal.id}`
      );

    } catch (error) {

      console.error(error);

      alert("Server error");

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // DATA
  // =========================

  const moods: {
    label: Mood;
    emoji: string;
  }[] = [
    {
      label: "sad",
      emoji: "😢",
    },
    {
      label: "bad",
      emoji: "🙁",
    },
    {
      label: "neutral",
      emoji: "😐",
    },
    {
      label: "good",
      emoji: "🙂",
    },
    {
      label: "excellent",
      emoji: "😁",
    },
  ];

  const workloadLevels: {
    label: string;
    value: Workload;
  }[] = [
    {
      label: "Very Low",
      value: "very_low",
    },
    {
      label: "Low",
      value: "low",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "High",
      value: "high",
    },
    {
      label: "Very High",
      value: "very_high",
    },
  ];

  // =========================
  // UI
  // =========================

  return (

    <div className="min-h-screen bg-[#0f0f14] text-white p-6">

      <div className="w-full max-w-4xl mx-auto space-y-6">

        {/* TITLE */}
        <h1 className="text-3xl font-bold">
          Daily Check-in
        </h1>

        {/* JOURNAL */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">

          <p className="mb-3 text-sm text-gray-300">
            Apa yang kamu rasakan hari ini?
          </p>

          <textarea
            value={journal}
            onChange={(e) =>
              setJournal(
                e.target.value
              )
            }
            className="w-full h-40 p-4 rounded-xl bg-[#0f0f14] border border-gray-700 focus:border-purple-500 outline-none resize-none"
            placeholder="Hari ini cukup melelahkan karena..."
          />

        </div>

        {/* SLEEP */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">

          <p className="mb-4 text-sm text-gray-300">
            🌙 Durasi tidur semalam
          </p>

          <input
            type="range"
            min="0"
            max="12"
            value={sleep}
            onChange={(e) =>
              setSleep(
                Number(
                  e.target.value
                )
              )
            }
            className="w-full accent-purple-500"
          />

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0 jam</span>
            <span>12 jam</span>
          </div>

          <p className="text-center mt-4 text-purple-400 text-xl font-bold">
            {sleep} jam
          </p>

        </div>

        {/* WORKLOAD */}
        <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">

          <p className="mb-4 text-sm text-gray-300">
            ⚡ Tingkat Aktivitas
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">

            {workloadLevels.map((item) => (

              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setWorkload(
                    item.value
                  )
                }
                className={`p-4 rounded-xl text-sm transition-all border font-medium ${
                  workload === item.value
                    ? "bg-gradient-to-r from-purple-600 to-fuchsia-500 border-purple-400 text-white scale-105"
                    : "bg-[#0f0f14] border-gray-700 text-gray-300 hover:border-purple-500"
                }`}
              >
                {item.label}
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

              const active =
                mood === item.label;

              return (

                <button
                  key={item.label}
                  type="button"
                  onClick={() =>
                    setMood(
                      item.label
                    )
                  }
                  className={`h-24 rounded-xl border transition ${
                    active
                      ? "border-purple-500 bg-purple-500/10 scale-105"
                      : "border-gray-700 bg-[#0f0f14]"
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {item.emoji}
                  </div>

                  <div className="text-xs capitalize">
                    {item.label}
                  </div>

                </button>
              );
            })}

          </div>

        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-4 rounded-2xl text-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? "Analyzing..."
            : "Analyze My Condition"}
        </button>

      </div>

    </div>
  );
}
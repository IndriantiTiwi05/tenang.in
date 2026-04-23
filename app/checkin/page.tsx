'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Checkin() {
  const [journal, setJournal] = useState('');
  const [sleep, setSleep] = useState(0);
  const [workload, setWorkload] = useState('low');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!journal || sleep <= 0) {
      alert('Isi jurnal dan jam tidur dulu');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journal, sleep, workload }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem('result', JSON.stringify(data.data));
      router.push('/result');
    } catch (err) {
      alert('Server error');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f14] text-white p-4">
      
      <div className="bg-[#1a1a22] border border-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-md">
        
        <h1 className="text-2xl font-bold mb-6 text-center text-purple-400">
          Daily Check-in 🧠
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* JOURNAL */}
          <textarea
            className="w-full p-3 rounded-lg bg-[#0f0f14] border border-gray-700 focus:border-purple-500 outline-none"
            placeholder="Ceritakan harimu hari ini..."
            onChange={(e) => setJournal(e.target.value)}
          />

          {/* SLEEP */}
          <input
            type="number"
            className="w-full p-3 rounded-lg bg-[#0f0f14] border border-gray-700 focus:border-purple-500 outline-none"
            placeholder="Jam tidur (contoh: 6)"
            onChange={(e) => setSleep(Number(e.target.value))}
          />

          {/* WORKLOAD */}
          <div>
            <label className="text-sm text-gray-400">
              Tingkat Kesibukan
            </label>

            <select
              className="w-full p-3 rounded-lg bg-[#0f0f14] border border-gray-700 mt-1 focus:border-purple-500 outline-none"
              onChange={(e) => setWorkload(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 py-3 rounded-xl hover:bg-purple-700 transition disabled:bg-gray-600"
          >
            {loading ? "Analyzing..." : "Analyze My Condition"}
          </button>

        </form>
      </div>
    </div>
  );
}
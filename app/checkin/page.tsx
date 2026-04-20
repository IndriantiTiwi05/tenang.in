'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Checkin() {
  const [journal, setJournal] = useState('');
  const [sleep, setSleep] = useState(0);
  const [workload, setWorkload] = useState('low');

  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ journal, sleep, workload }),
    });

    const data = await res.json();

    localStorage.setItem('result', JSON.stringify(data.data));

    // redirect ke result page
    router.push('/result');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Daily Check-in 🧠
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-2 border rounded-lg"
            placeholder="Tulis jurnal kamu..."
            onChange={(e) => setJournal(e.target.value)}
          />

          <input
            type="number"
            className="w-full p-2 border rounded-lg"
            placeholder="Jam tidur"
            onChange={(e) => setSleep(Number(e.target.value))}
          />

          <div>
            <label className="text-sm text-gray-600">
              Tingkat Kesibukan (Workload)
            </label>

            <select
              className="w-full p-2 border rounded-lg mt-1"
              onChange={(e) => setWorkload(e.target.value)}
            >
              <option value="low">Low (Santai / ringan)</option>
              <option value="medium">Medium (Lumayan sibuk)</option>
              <option value="high">High (Sibuk banget)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Analyze My Condition
          </button>
        </form>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          ℹ️ Hasil burnout akan dihitung berdasarkan tidur, jurnal, dan tingkat kesibukan.
        </div>
      </div>
    </div>
  );
}
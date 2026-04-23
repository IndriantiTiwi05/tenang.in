import Link from "next/link";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen bg-[#0f0f14] text-white">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#18181f] p-6 border-r border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400 mb-10">
          tenang.in
        </h1>

        <nav className="space-y-4 text-gray-400">
          <p className="text-purple-400 font-semibold">Dashboard</p>
          <p className="hover:text-purple-400 cursor-pointer">Check-in</p>
          <p className="hover:text-purple-400 cursor-pointer">History</p>
        </nav>
      </aside>

      {/* MAIN */}
      <section className="flex-1 p-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Halo, Tiwi 👋</h2>
          <div className="bg-[#1f1f27] px-4 py-2 rounded-xl text-sm border border-gray-800">
            Hari ini
          </div>
        </div>

        {/* STATUS CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
            <p className="text-gray-400">Mood Terakhir</p>
            <h3 className="text-2xl font-bold mt-2">😊 Baik</h3>
          </div>

          <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
            <p className="text-gray-400">Risiko Burnout</p>
            <h3 className="text-2xl font-bold mt-2 text-purple-400">
              LOW
            </h3>
          </div>

          <div className="bg-[#1a1a22] p-5 rounded-2xl border border-gray-800">
            <p className="text-gray-400">Streak</p>
            <h3 className="text-2xl font-bold mt-2">5 hari 🔥</h3>
          </div>
        </div>

        {/* QUICK ACTION */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          
          {/* ✅ FIX DI SINI */}
          <Link
            href="/checkin"
            className="bg-purple-600 p-6 rounded-2xl hover:bg-purple-700 transition text-center block"
          >
            ➕ Check-in Hari Ini
          </Link>

          <button className="bg-[#1a1a22] p-6 rounded-2xl border border-gray-800 hover:border-purple-500 transition">
            📖 Tulis Jurnal
          </button>
        </div>

        {/* AI INSIGHT */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 rounded-2xl mb-8">
          <h3 className="font-semibold mb-2">Insight AI</h3>
          <p className="text-sm opacity-90">
            Kamu terlihat cukup stabil minggu ini. Pertahankan kebiasaan baikmu 👍
          </p>
        </div>

        {/* HISTORY */}
        <div className="bg-[#1a1a22] p-6 rounded-2xl border border-gray-800">
          <h3 className="font-semibold mb-4">Riwayat Terakhir</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>✔ Check-in berhasil</li>
            <li>✔ Mood diperbarui</li>
            <li>✔ Jurnal ditambahkan</li>
          </ul>
        </div>

      </section>
    </main>
  );
}
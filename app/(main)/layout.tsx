import Link from "next/link";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen bg-[#0f0f14] text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#18181f] p-6 border-r border-gray-800">
        <h1 className="text-2xl font-bold text-purple-400 mb-10">
          tenang.in
        </h1>

        <nav className="space-y-4 text-gray-400">
          <Link href="/" className="block hover:text-purple-400">
            Dashboard
          </Link>

          <Link href="/checkin" className="block hover:text-purple-400">
            Check-in
          </Link>

          <Link href="/result" className="block hover:text-purple-400">
            Result
          </Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 p-8">
        {children}
      </section>

    </main>
  );
}
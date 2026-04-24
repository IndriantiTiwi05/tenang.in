export default function StreakCard() {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col justify-center">
      
      <div className="flex items-start gap-3">
        <div className="text-3xl">🔥</div>

        <div>
          <div className="text-2xl font-bold mb-1">
            5 days streak
          </div>

          <div className="text-indigo-200 text-sm">
            Terus jaga konsistensimu!
          </div>
        </div>
      </div>

    </div>
  );
}
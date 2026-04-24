interface BurnoutCardProps {
  score: number;
  risk: "low" | "medium" | "high";
}

export default function BurnoutCard({ score, risk }: BurnoutCardProps) {
  const getRiskColor = () => {
    switch (risk) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  const getRiskBg = () => {
    switch (risk) {
      case "high":
        return "bg-red-500/10";
      case "medium":
        return "bg-yellow-500/10";
      case "low":
        return "bg-green-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  const getProgressColor = () => {
    switch (risk) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#1a1a22] p-6 rounded-2xl border border-gray-800 flex justify-between items-center">
      {/* BURNOUT INFO YANG KANAN */}
      <div>
        <p className="text-gray-400 text-sm mb-2">Burnout Status Today</p>

        <div
          className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold mb-3 ${getRiskBg()} ${getRiskColor()}`}
        >
          ● {risk.toUpperCase()} RISK
        </div>

        <p className="text-white/90 text-sm mb-2">
        Current Burnout Level
        </p>

        <h2 className="text-4xl font-bold mb-2">{score}%</h2>

        <p className="text-white/70 text-sm">
        Kondisi menurun 3 hari terakhir
        </p>
      </div>

      {/* RIGHT (CIRCLE) */}
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="#2a2a35"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke={getProgressColor()}
            strokeWidth="10"
            fill="none"
            strokeDasharray={2 * Math.PI * 56}
            strokeDashoffset={
              2 * Math.PI * 56 - (score / 100) * (2 * Math.PI * 56)
            }
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{score}%</span>
        </div>
      </div>
    </div>
  );
}

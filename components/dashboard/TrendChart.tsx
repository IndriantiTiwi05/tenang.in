import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function TrendChart() {
  const data = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 52 },
    { day: "Wed", value: 60 },
    { day: "Thu", value: 68 },
    { day: "Fri", value: 75 },
    { day: "Sat", value: 78 },
    { day: "Sun", value: 82 },
  ];

  return (
    <div className="bg-[#1a1a22] p-6 rounded-2xl border border-gray-800">
      <h3 className="text-white font-semibold mb-4">7-Day Trend</h3>

      {/* FIX HEIGHT */}
      <div className="w-full h-[260px] min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>

            {/* GRID (biar rapi kayak figma) */}
            <CartesianGrid stroke="#2a2a35" strokeDasharray="3 3" />

            {/* X AXIS */}
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
            />

            {/* Y AXIS */}
            <YAxis
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
            />

            {/* TOOLTIP */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f1f27",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              labelStyle={{ color: "#9ca3af" }}
              cursor={{ stroke: "#444", strokeWidth: 1 }}
            />

            {/* LINE */}
            <Line
              type="linear"
              dataKey="value"
              stroke="#a855f7"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#a855f7",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 6,
                fill: "#a855f7",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
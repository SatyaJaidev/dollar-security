"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function VisitorStatsWidget() {
  const [count, setCount] = useState<number | null>(null);
  const [data, setData] = useState<{ date: string; visitors: number }[]>([]);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const res = await axios.get("http://18.188.242.116:5000/api/analytics/visitors");
        setCount(res.data.visitorCount);

        // ✨ Simulated trend for now
        const trendData = Array.from({ length: 7 }, (_, i) => ({
          date: `Day ${i + 1}`,
          visitors: Math.floor(Math.random() * 50) + 10, // replace with real data when ready
        }));

        setData(trendData);
      } catch (err) {
        console.error("Error fetching visitor data:", err);
      }
    };

    fetchVisitorData();
  }, []);

  return (
    <div className="bg-[#A3A375] rounded-2xl p-3 lg:p-6 border border-white/20 text-white w-full hover:opacity-90 transition-all duration-300">
      <div className="text-sm lg:text-lg font-bold mb-2 text-white">VISITORS (Last 7 days)</div>
      <div className="text-2xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">{count !== null ? count : "..."}</div>

      {/* Sparkline Graph */}
      <div className="h-24 lg:h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                color: 'black'
              }}
            />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="#FFFFFF"
              strokeWidth={3}
              dot={{ fill: '#FFFFFF', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#FFFFFF' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

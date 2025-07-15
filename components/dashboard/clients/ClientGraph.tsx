"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

interface QuotationQuery {
  _id?: string;
  createdAt: string;
  status: string;
}

interface Props {
  clients: any[]; // Keeping this prop for backward compatibility
}

export const ClientGraph = ({ clients }: Props) => {
  const [queries, setQueries] = useState<QuotationQuery[]>([]);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/quotation-queries");
        setQueries(res.data);
      } catch (err) {
        console.error("Failed to fetch quotation queries:", err);
      }
    };
    fetchQueries();
  }, []);

  // Group by createdAt date (YYYY-MM-DD) for both total and cleared queries
  const dailyCounts = queries.reduce<Record<string, { total: number; cleared: number }>>((acc, query) => {
    try {
      if (!query.createdAt) return acc;
      const date = new Date(query.createdAt).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { total: 0, cleared: 0 };
      }
      acc[date].total += 1;
      if (query.status === "Cleared") {
        acc[date].cleared += 1;
      }
    } catch (err) {
      console.warn("⛔ Invalid date skipped:", query.createdAt);
    }
    return acc;
  }, {});

  const data = Object.entries(dailyCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ 
      date, 
      total: counts.total,
      cleared: counts.cleared 
    }));

  return (
    <div className="w-full min-w-full bg-[#FEB852] rounded-2xl p-3 border border-white/20">
      <h2 className="text-lg font-bold mb-2 text-black">QUOTATION QUERIES</h2>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E85E30" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#E85E30" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorCleared" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E85E30" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#E85E30" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.3)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(0, 0, 0, 0.8)"
            tick={{ fill: 'rgba(0, 0, 0, 0.8)', fontSize: 14, fontWeight: 'bold' }}
          />
          <YAxis 
            stroke="rgba(0, 0, 0, 0.8)"
            tick={{ fill: 'rgba(0, 0, 0, 0.8)', fontSize: 14, fontWeight: 'bold' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              color: '#000',
              backdropFilter: 'blur(10px)',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            name="Total Queries"
            stroke="#E85E30"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorTotal)"
            dot={{ fill: '#E85E30', stroke: '#E85E30', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#E85E30', strokeWidth: 2, fill: '#E85E30' }}
          />
          <Area
            type="monotone"
            dataKey="cleared"
            name="Cleared Queries"
            stroke="#E85E30"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorCleared)"
            dot={{ fill: '#E85E30', stroke: '#E85E30', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#E85E30', strokeWidth: 2, fill: '#E85E30' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

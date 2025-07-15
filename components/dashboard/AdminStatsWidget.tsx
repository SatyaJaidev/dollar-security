import React from "react";

interface AdminStatsWidgetProps {
  clientCount: number;
  guardCount: number;
}

export default function AdminStatsWidget({ clientCount, guardCount }: AdminStatsWidgetProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md text-white p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 text-white">Total Counts</h2>
      <div className="flex justify-between">
        <div className="text-center">
          <p className="text-sm text-white/70 mb-2">Clients</p>
          <p className="text-4xl font-bold text-[#00DCAA]">{clientCount}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-white/70 mb-2">Guards</p>
          <p className="text-4xl font-bold text-[#00DCAA]">{guardCount}</p>
        </div>
      </div>
    </div>
  );
}

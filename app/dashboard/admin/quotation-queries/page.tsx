"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "@/lib/config";

import { QuotationTable } from "../../../../components/quotation/QuotationTable";
import { ClearedQueriesTable } from "../../../../components/quotation/ClearedQueriesTable";

export default function QuotationQueriesPage() {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(getApiUrl("/quotation-queries"));
        const pending = res.data.filter((q: any) => q.status === "Pending");
        setPendingCount(pending.length);
      } catch (err) {
        console.error("Failed to fetch quotation count", err);
      }
    };
    fetchCount();
  }, []);

  return (
    <div className="h-full flex flex-col pt-1 pb-6 px-3 lg:px-6 overflow-hidden">
      <div className="mb-2">
        <h1 className="text-2xl lg:text-6xl font-bold text-white ml-2 lg:ml-0">QUOTATION</h1>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 lg:space-y-6">
        <QuotationTable />
        <ClearedQueriesTable />
      </div>
    </div>
  );
}

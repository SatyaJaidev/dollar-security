"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { FaChevronDown } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getApiUrl } from "@/lib/config";

interface QuotationQuery {
  _id: string;
  name: string;
  email: string;
  phone: string;
  pincode: string;
  company: string;
  serviceType: string;
  jobTitle: string;
  message: string;
  status: "Pending" | "Cleared";
  createdAt: string;
}

export const QuotationTable = () => {
  const [queries, setQueries] = useState<QuotationQuery[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const itemsPerPage = 2;

  useEffect(() => {
    axios.get(getApiUrl("/quotation-queries"))
      .then((res) => setQueries(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [queries]);

  const markCleared = async (id: string) => {
    await axios.put(getApiUrl(`/quotation-queries/${id}`), { status: "Cleared" })
    setQueries((prev) => prev.map(q => q._id === id ? { ...q, status: "Cleared" } : q));
  };

  const pendingQueries = queries.filter(q => q.status === "Pending");
  const totalPages = Math.ceil(pendingQueries.length / itemsPerPage);
  const paginatedQueries = pendingQueries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-3 lg:p-6 h-[350px] flex flex-col mb-4 lg:mb-8">
      <h2 className="text-lg lg:text-2xl font-bold mb-4 lg:mb-6 text-[#A3A375]">QUOTATION QUERIES (PENDING)</h2>
      
      {/* Mobile/Tablet Horizontal Scroll Container */}
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="min-w-[700px]"> {/* Minimum width for table content */}
          {/* Fixed Header */}
          <div className="grid grid-cols-[40px_40px_1fr_1.5fr_1fr_1fr_0.8fr] gap-2 px-3 lg:px-4 py-2 lg:py-3 bg-[#A3A375] rounded-2xl text-white font-bold text-xs lg:text-sm uppercase mb-2 lg:mb-4">
            <div></div>
            <div>#</div>
            <div>Name</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Date</div>
            <div>Actions</div>
          </div>

          {/* Scrollable Table Body */}
          <div className="flex-1 overflow-y-auto space-y-2 h-[250px] pb-4">
            {paginatedQueries.map((query, index) => {
              const isOpen = openRow === query._id;

              return (
                <React.Fragment key={query._id}>
                  <div
                    className={`grid grid-cols-[40px_40px_1fr_1.5fr_1fr_1fr_0.8fr] gap-2 items-center bg-white rounded-2xl px-3 lg:px-4 py-2 cursor-pointer transition-all duration-300 text-black font-bold text-sm lg:text-lg border-2 ${
                      isOpen 
                        ? 'shadow-2xl border-[#E85E30]' 
                        : 'hover:shadow-xl border-black hover:-translate-y-1'
                    }`}
                    onClick={() => setOpenRow(isOpen ? null : query._id)}
                  >
                    <div className="flex items-center justify-center">
                      <span className={`inline-block transition-transform duration-300 text-[#A3A375] ${isOpen ? 'rotate-180' : ''}`}>
                        <FaChevronDown size={12} className="lg:w-4 lg:h-4" />
                      </span>
                    </div>
                    <div className="font-bold text-sm lg:text-lg">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                    <div className="truncate min-w-0 font-bold text-sm lg:text-lg">{query.name}</div>
                    <div className="truncate min-w-0 text-black/80 font-bold text-sm lg:text-lg">{query.email}</div>
                    <div className="truncate min-w-0 text-black/80 font-bold text-sm lg:text-lg">{query.phone}</div>
                    <div className="truncate min-w-0 text-black/80 font-bold text-sm lg:text-lg">{new Date(query.createdAt).toLocaleDateString()}</div>
                    <div>
                      <button
                        onClick={(e) => { e.stopPropagation(); markCleared(query._id); }}
                        className="bg-green-500 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-semibold hover:bg-green-600 transition-colors duration-200"
                      >
                        Mark Cleared
                      </button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="bg-white rounded-2xl shadow-inner px-3 lg:px-6 py-4 lg:py-6 mt-2 mb-4 ml-2 lg:ml-4 mr-2 lg:mr-4 text-black font-bold border-2 border-[#E85E30]">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-3 lg:mb-4">
                          <span className="text-base lg:text-lg">📋</span>
                          <h3 className="font-semibold text-base lg:text-lg">Query Details</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 mb-3 lg:mb-4">
                          <div className="text-sm lg:text-base"><b>Company:</b> {query.company}</div>
                          <div className="text-sm lg:text-base"><b>Service Type:</b> {query.serviceType}</div>
                          <div className="text-sm lg:text-base"><b>Job Title:</b> {query.jobTitle}</div>
                          <div className="text-sm lg:text-base"><b>Pincode:</b> {query.pincode}</div>
                          <div className="text-sm lg:text-base"><b>Email:</b> {query.email}</div>
                          <div className="text-sm lg:text-base"><b>Phone:</b> {query.phone}</div>
                        </div>
                        <div className="mt-3 lg:mt-4">
                          <b className="text-sm lg:text-base">Message:</b>
                          <div className="bg-gray-100 p-3 rounded-lg border mt-2 text-black/80 text-sm lg:text-base">
                            {query.message}
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-4">
                          <b className="text-sm lg:text-base">Created At:</b> <span className="text-black/80 text-sm lg:text-base">{new Date(query.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Pagination */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-4">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-2 lg:px-3 py-1 lg:py-2 bg-[#A3A375] text-white rounded-lg disabled:opacity-50 disabled:bg-[#A3A375] flex items-center justify-center hover:bg-[#8C8A5F] transition-colors duration-200"
        >
          <FiChevronLeft size={16} className="lg:w-5 lg:h-5" />
        </button>
        <div className="text-xs lg:text-sm text-[#A3A375] font-bold bg-white px-2 lg:px-3 py-1 lg:py-2 rounded-lg border border-[#A3A375]">
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-2 lg:px-3 py-1 lg:py-2 bg-[#A3A375] text-white rounded-lg disabled:opacity-50 disabled:bg-[#A3A375] flex items-center justify-center hover:bg-[#8C8A5F] transition-colors duration-200"
        >
          <FiChevronRight size={16} className="lg:w-5 lg:h-5" />
        </button>
      </div>

      {pendingQueries.length === 0 && (
        <div className="text-center text-gray-500 mt-4 font-medium text-sm lg:text-base">No pending queries found.</div>
      )}
    </div>
  );
};

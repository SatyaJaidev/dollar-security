'use client';

import React, { useState, useMemo, useEffect } from "react";
import { Client } from "@/types/client";
import { FaChevronDown, FaTrash } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface Props {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

const calculateProgress = (startDate: string, endDate: string): { percent: number; color: string } => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();

  if (!startDate || !endDate || isNaN(start) || isNaN(end) || start >= end) {
    return { percent: 0, color: "bg-gray-400" };
  }

  const total = end - start;
  const elapsed = now - start;
  const percent = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));

  let barColor = "bg-red-500";
  if (percent === 100) barColor = "bg-green-500";
  else if (percent >= 70) barColor = "bg-orange-400";
  else if (percent >= 31) barColor = "bg-yellow-400";

  return { percent, color: barColor };
};

export const ClientTable = ({ clients, onEdit, onDelete }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; clientId: string; clientName: string }>({
    show: false,
    clientId: '',
    clientName: ''
  });

  // Reset to page 1 whenever the clients prop changes
  useEffect(() => {
    setCurrentPage(1);
  }, [clients]);

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const paginatedClients = clients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleDeleteClick = (clientId: string, clientName: string) => {
    setDeleteConfirm({
      show: true,
      clientId,
      clientName
    });
  };

  const handleConfirmDelete = () => {
    onDelete(deleteConfirm.clientId);
    setDeleteConfirm({ show: false, clientId: '', clientName: '' });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ show: false, clientId: '', clientName: '' });
  };

  return (
    <div className="bg-white rounded-3xl p-2 lg:p-3 pb-0 shadow-2xl border border-gray-200 w-full min-w-full flex flex-col" style={{ height: '400px' }}>
      {/* Mobile/Tablet Horizontal Scroll Container */}
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="min-w-[800px]"> {/* Minimum width for table content */}
          {/* Table Header - Fixed */}
          <div className="grid grid-cols-[40px_40px_1fr_1.5fr_1fr_1.5fr_1.5fr_0.8fr] gap-2 px-3 py-1 bg-[#A3A375] rounded-2xl border border-gray-200 mb-1">
            <div></div>
            <div className="font-bold text-white uppercase text-xs py-1">#</div>
            <div className="font-bold text-white uppercase text-xs py-1">Name</div>
            <div className="font-bold text-white uppercase text-xs py-1">Email</div>
            <div className="font-bold text-white uppercase text-xs py-1">Joined On</div>
            <div className="font-bold text-white uppercase text-xs py-1">Assigned Guards</div>
            <div className="font-bold text-white uppercase text-xs py-1">Progress</div>
            <div className="font-bold text-white uppercase text-xs py-1">Actions</div>
          </div>

          {/* Table Body - Scrollable */}
          <div className="overflow-y-auto" style={{ height: '300px' }}>
            <div className="space-y-1">
              {paginatedClients.map((client, index) => {
                const hasEndDate = client.startDate && client.endDate;
                const { percent, color } = hasEndDate
                  ? calculateProgress(client.startDate!, client.endDate!)
                  : { percent: 0, color: "bg-gray-300" };

                const isOpen = openRow === client._id;

                return (
                  <React.Fragment key={client._id}>
                    <div
                      className={`grid grid-cols-[40px_40px_1fr_1.5fr_1fr_1.5fr_1.5fr_0.8fr] gap-2 items-center bg-white rounded-2xl px-3 py-2 cursor-pointer transition-all duration-300 text-black font-bold text-sm lg:text-lg border-2 ${
                        isOpen 
                          ? 'shadow-2xl border-[#E85E30]' 
                          : 'hover:shadow-xl border-black hover:-translate-y-1'
                      }`}
                      onClick={() => setOpenRow(isOpen ? null : client._id)}
                    >
                      <div className="flex items-center justify-center">
                        <span className={`inline-block transition-transform duration-300 text-[#A3A375] ${isOpen ? 'rotate-180' : ''}`}>
                          <FaChevronDown size={12} />
                        </span>
                      </div>
                      <div className="font-bold text-sm lg:text-lg">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                      <div className="truncate min-w-0 font-bold text-sm lg:text-lg">{client.name}</div>
                      <div className="truncate min-w-0 text-black/90 font-bold text-sm lg:text-lg">{client.email}</div>
                      <div className="truncate min-w-0 text-black/90 font-bold text-sm lg:text-lg">
                        {client.joinedDate && !isNaN(new Date(client.joinedDate).getTime()) ? 
                          new Date(client.joinedDate).toLocaleDateString() : 
                          'Date not set'
                        }
                      </div>
                      <div className="truncate min-w-0 flex gap-1">
                        {client.assignedGuards && client.assignedGuards.length > 0 ? (
                          <>
                            <span className="bg-gray-100 text-black font-bold px-1 lg:px-2 py-1 text-xs lg:text-base rounded-full border border-gray-300">
                              {client.assignedGuards[0]?.name || "Unnamed"}
                            </span>
                            {client.assignedGuards.length > 1 && (
                              <span className="bg-gray-200 text-black font-bold px-1 lg:px-2 py-1 text-xs lg:text-base rounded-full border border-gray-400">
                                +{client.assignedGuards.length - 1}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-500 text-xs lg:text-base italic font-bold">No guards</span>
                        )}
                      </div>
                      <div className="w-[60px] lg:w-[80px]">
                        {hasEndDate ? (
                          <div className="relative w-full h-2 lg:h-3 bg-gray-200 rounded-full border border-gray-300">
                            <div
                              className="h-2 lg:h-3 rounded-full transition-all flex items-center justify-end pr-1 bg-gradient-to-r from-[#E85E30] to-[#E85E30]"
                              style={{ width: `${percent}%` }}
                            >
                              {percent > 20 && (
                                <span className="font-bold text-white text-xs">{percent}%</span>
                              )}
                            </div>
                            {percent <= 20 && (
                              <span className="absolute right-1 top-1/2 -translate-y-1/2 font-bold text-black text-xs">{percent}%</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-500 font-bold text-xs lg:text-sm">not valid</span>
                        )}
                      </div>
                      <div>
                        <button
                          onClick={e => { e.stopPropagation(); handleDeleteClick(client._id, client.name); }}
                          className="text-[#A3A375] hover:text-[#8B8A5F] text-sm lg:text-lg p-1 lg:p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    {/* Expanded Row Details */}
                    {isOpen && (
                      <div className="bg-white rounded-2xl shadow-inner px-3 lg:px-6 py-4 lg:py-6 mt-2 ml-2 lg:ml-4 mr-2 lg:mr-4 text-black font-bold border-2 border-[#E85E30]">
                        
                        {/* Client Information Box */}
                        <div className="bg-yellow-50 rounded-xl border-2 border-[#FEB852] p-4 lg:p-6 mb-4">
                          <div className="mb-4 font-bold text-lg lg:text-2xl text-[#E85E30]">Client Details</div>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
                            <div>
                              <span className="font-bold text-black/90 text-sm lg:text-xl">Status:</span> 
                              <span className={`ml-2 text-xs lg:text-base px-2 lg:px-3 py-1 rounded-full font-medium ${
                                client.status === "Active"
                                  ? "bg-green-100 text-green-800 border border-green-300"
                                  : client.status === "Standby"
                                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                  : "bg-red-100 text-red-800 border border-red-300"
                              }`}>
                                {client.status}
                              </span>
                            </div>
                            <div><span className="font-bold text-black/90 text-sm lg:text-xl">Guard Type:</span> <span className="text-black font-bold text-sm lg:text-xl">{client.guardType}</span></div>
                            <div><span className="font-bold text-black/90 text-sm lg:text-xl">Number of Guards:</span> <span className="text-black font-bold text-sm lg:text-xl">{client.numberOfGuards}</span></div>
                            <div><span className="font-bold text-black/90 text-sm lg:text-xl">Email:</span> <span className="text-black font-bold text-sm lg:text-xl">{client.email}</span></div>
                            <div className="lg:col-span-2">
                              <span className="font-bold text-black/90 text-sm lg:text-xl">Joined On:</span> 
                              <span className="text-black font-bold text-sm lg:text-xl ml-2">
                                {client.joinedDate && !isNaN(new Date(client.joinedDate).getTime()) ? 
                                  new Date(client.joinedDate).toLocaleDateString() : 
                                  'Date not set'
                                }
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Assigned Guards Box */}
                        <div className="rounded-xl border-2 border-[#A3A375] p-4 lg:p-6 mb-4" style={{ backgroundColor: '#E8E8D8' }}>
                          <div className="mb-3 font-bold text-lg lg:text-xl text-[#A3A375]">Assigned Guards</div>
                          {client.assignedGuards && client.assignedGuards.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {client.assignedGuards.map((guard: any, idx: number) =>
                                guard ? (
                                  <span
                                    key={guard._id || `${client._id}-guard-${idx}`}
                                    className="bg-white text-black font-bold px-3 lg:px-4 py-2 text-sm lg:text-base rounded-xl border-2 border-[#A3A375] shadow-sm"
                                  >
                                    {guard.name || "Unnamed"}
                                  </span>
                                ) : null
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm lg:text-base italic font-bold">No guards assigned</span>
                          )}
                        </div>

                        {/* Edit Button */}
                        <div className="flex justify-center lg:justify-start">
                          <button
                            onClick={e => { e.stopPropagation(); onEdit(client); }}
                            className="bg-black hover:bg-gray-800 text-white px-4 lg:px-6 py-3 rounded-xl font-bold text-sm lg:text-base transition-all duration-200 shadow-lg hover:shadow-xl"
                          >
                            Edit Client
                          </button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Pagination at Bottom */}
      <div className="flex-shrink-0 -mb-8">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-2 lg:px-3 py-1 bg-[#A3A375] border border-[#A3A375] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#8B8A5F] transition-all duration-200"
          >
            <FiChevronLeft size={14} />
          </button>
          <div className="text-xs text-white font-medium bg-[#A3A375] px-2 lg:px-3 py-1 rounded-xl border border-[#A3A375]">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-2 lg:px-3 py-1 bg-[#A3A375] border border-[#A3A375] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#8B8A5F] transition-all duration-200"
          >
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Confirm Delete</h3>
            <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">
              Are you sure you want to delete client <span className="font-semibold text-[#FEB852]">"{deleteConfirm.clientName}"</span>? 
              This action cannot be undone.
            </p>
            <div className="flex flex-col lg:flex-row justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 lg:px-6 py-2 lg:py-3 text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 border border-gray-300 transition-all duration-200 text-sm lg:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 lg:px-6 py-2 lg:py-3 text-white bg-red-500 rounded-xl hover:bg-red-600 border border-red-500 transition-all duration-200 text-sm lg:text-base"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
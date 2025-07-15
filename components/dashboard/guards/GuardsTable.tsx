'use client';

import { useEffect, useState } from "react";
import { Guard } from "../../../app/dashboard/admin/guards/page";
import React from "react";
import { FaChevronDown, FaTrash } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiEdit2, FiX } from 'react-icons/fi';
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import AddGuardForm from "./AddGuardForm"; // Adjust path if needed

// ✅ API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";


interface ClientAssignment {
  clientName: string;
  residentName?: string;
  totalHours: number;
  schedule: string[];
}

export default function GuardsTable({ guards }: { guards: Guard[] }) {
  const [clientAssignments, setClientAssignments] = useState<Record<string, ClientAssignment[]>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [editModeGuardId, setEditModeGuardId] = useState<string | null>(null);
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});
  const [clientsCurrentPage, setClientsCurrentPage] = useState<Record<string, number>>({});
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState<Record<string, number>>({});
  const itemsPerPage = 5;
  const accordionItemsPerPage = 3; // Items per page for accordion sections
  const [emailMap, setEmailMap] = useState<Record<string, string>>({});
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    isOpen: boolean;
    guardId: string;
    guardName: string;
  }>({
    isOpen: false,
    guardId: "",
    guardName: ""
  });
  
  // ✅ Track which guards have been viewed (accordion opened)
  const [viewedGuards, setViewedGuards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchClientData = async () => {
      const res = await fetch(`${API_BASE_URL}/clients`);
      const clients = await res.json();

      const assignments: Record<string, ClientAssignment[]> = {};
      clients.forEach((client: any) => {
        client.assignedGuards?.forEach((g: any) => {
          if (!assignments[g.guardId]) assignments[g.guardId] = [];

          const totalHours = g.schedule?.reduce((sum: number, s: any) => {
            const startH = parseInt(s.startHour) % 12 + (s.startPeriod === "PM" ? 12 : 0);
            const endH = parseInt(s.endHour) % 12 + (s.endPeriod === "PM" ? 12 : 0);
            const startM = parseInt(s.startMinute);
            const endM = parseInt(s.endMinute);
            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;
            let duration = endTotal - startTotal;
            if (duration < 0) duration += 1440;
            if (duration === 0) duration = 1440;
            return sum + duration / 60;
          }, 0);

          assignments[g.guardId].push({
            clientName: client.name,
            residentName: g.residentName,
            totalHours: Math.round(totalHours * 10) / 10,
            schedule: g.schedule.map((s: any, i: number) =>
              `Day ${i + 1}: ${s.date} (${s.startHour}:${s.startMinute} ${s.startPeriod} – ${s.endHour}:${s.endMinute} ${s.endPeriod})`
            ),
          });
        });
      });

      setClientAssignments(assignments);
    };

    fetchClientData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [guards]);

  const totalPages = Math.ceil(guards.length / itemsPerPage);
  const paginatedGuards = guards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleEmailChange = (guardId: string, clientName: string, value: string) => {
    setEmailMap((prev) => ({
      ...prev,
      [`${guardId}_${clientName}`]: value,
    }));
  };

  const handleSendEmail = async (guardId: string, assignment: ClientAssignment) => {
    const email = emailMap[`${guardId}_${assignment.clientName}`];
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/guards/share-full-assignment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guardId,
        email,
        clientName: assignment.clientName,
        totalHours: assignment.totalHours,
        schedule: assignment.schedule,
      }),
    });

    if (res.ok) {
      toast.success("Assignment shared with client");
    } else {
      toast.error("Failed to send");
    }
  };

  const handleSendGuardDetailsToClient = async (
    guardId: string,
    email: string,
    assignment: ClientAssignment
  ) => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
  
    try {
      const res = await fetch(`${API_BASE_URL}/guards/share-full-assignment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: assignment.clientName,
          email,
          guards: [
            {
              guardId,
              totalHours: assignment.totalHours,
              schedule: assignment.schedule,
            }
          ]
        }),
      });
  
      if (res.ok) {
        toast.success("Guard documents & assignment sent");
      } else {
        toast.error("Failed to send email");
      }
    } catch (error) {
      toast.error("An error occurred while sending email");
    }
  };
  
  
  const handleOtherDocUpload = async (guardId: string, file: File | undefined) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_BASE_URL}/guards/upload-other/${guardId}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      toast.success("Other document uploaded!");
      window.location.reload();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload document");
    }
  };

  const handleDeleteGuard = async (guardId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/guards/${guardId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete guard");
      }

      // Refresh the page to update the guards list
      window.location.reload();
    } catch (error) {
      console.error("Error deleting guard:", error);
      alert("Failed to delete guard. Please try again.");
    }
  };

  const confirmDelete = (guardId: string, guardName: string) => {
    setDeleteConfirmDialog({
      isOpen: true,
      guardId,
      guardName
    });
  };

  const cancelDelete = () => {
    setDeleteConfirmDialog({
      isOpen: false,
      guardId: "",
      guardName: ""
    });
  };

  const proceedWithDelete = () => {
    handleDeleteGuard(deleteConfirmDialog.guardId);
    cancelDelete();
  };

  return (
    <>
      {/* Edit Modal */}
      {editModeGuardId && selectedGuard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-800">Edit Guard</h3>
              <button
                onClick={() => {
                  setEditModeGuardId(null);
                  setSelectedGuard(null);
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FiX size={24} className="text-gray-500" />
              </button>
            </div>
            <AddGuardForm
              guardToEdit={selectedGuard}
              onCancel={() => {
                setEditModeGuardId(null);
                setSelectedGuard(null);
              }}
              onSaveSuccess={() => {
                setEditModeGuardId(null);
                setSelectedGuard(null);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}

    <div className="bg-white rounded-3xl p-2 lg:p-3 pb-0 shadow-2xl border border-gray-200 w-full min-w-full flex flex-col" style={{ height: '500px' }}>
      {/* Mobile/Tablet Horizontal Scroll Container */}
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="min-w-[800px]"> {/* Minimum width for table content */}
          {/* Table Header - Fixed */}
          <div className="grid grid-cols-[40px_1fr_1.5fr_1fr_1fr_1.5fr_0.8fr] gap-2 px-3 py-1 bg-[#A3A375] rounded-2xl border border-gray-200 mb-1">
            <div></div>
            <div className="font-bold text-white uppercase text-xs py-1">Name</div>
            <div className="font-bold text-white uppercase text-xs py-1">Email</div>
            <div className="font-bold text-white uppercase text-xs py-1">Phone</div>
            <div className="font-bold text-white uppercase text-xs py-1">Status</div>
            <div className="font-bold text-white uppercase text-xs py-1">Client Assignments</div>
            <div className="font-bold text-white uppercase text-xs py-1">Actions</div>
          </div>

          {/* Table Body - Scrollable */}
          <div className="overflow-y-auto" style={{ height: '400px' }}>
            <div className="space-y-1">
              {paginatedGuards.map((guard, index) => {
                const isOpen = openRow === guard._id;
                const assignments = clientAssignments[guard._id!] || [];

                return (
                  <React.Fragment key={guard._id}>
                    <div
                      className={`grid grid-cols-[40px_1fr_1.5fr_1fr_1fr_1.5fr_0.8fr] gap-2 items-center bg-white rounded-2xl px-3 lg:px-4 py-2 lg:py-4 cursor-pointer transition-all duration-300 text-black font-bold text-sm lg:text-lg border-2 ${
                        isOpen 
                          ? 'shadow-2xl border-[#E85E30]' 
                          : 'hover:shadow-xl border-black hover:-translate-y-1'
                      }`}
                      onClick={() => {
                        const guardId = guard._id!;
                        // ✅ Don't mark as viewed here - only when Reviews tab is clicked
                        setOpenRow(isOpen ? null : guardId);
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <span className={`inline-block transition-transform duration-300 text-[#A3A375] ${isOpen ? 'rotate-180' : ''}`}>
                          <FaChevronDown size={12} />
                        </span>
                      </div>
                      <div className="truncate min-w-0 font-bold text-sm lg:text-lg flex items-center gap-2">
                        <span>{guard.name}</span>
                        {/* ✅ Show notification dot for guards with unread reviews that haven't been viewed */}
                        {(guard.unreadReviewsCount || 0) > 0 && !viewedGuards.has(guard._id!) && (
                          <div className="relative">
                            <div className="w-4 h-4 bg-[#E85E30] rounded-full animate-pulse shadow-lg"></div>
                            <div className="absolute top-0 left-0 w-4 h-4 bg-[#E85E30] rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>
                      <div className="truncate min-w-0 text-black/80 font-bold text-sm lg:text-lg">{guard.email}</div>
                      <div className="truncate min-w-0 text-black/80 font-bold text-sm lg:text-lg">{guard.phone}</div>
                      <div>
                        <span className={`text-xs px-1 lg:px-2 py-1 rounded-full font-bold ${
                          guard.status === "Active"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : guard.status === "Standby"
                            ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                        }`}>
                          {guard.status}
                        </span>
                      </div>
                      <div className="truncate min-w-0">
                        {assignments.length > 0 ? (
                          <span className="bg-gray-100 text-black font-bold px-1 lg:px-2 py-1 text-xs lg:text-base rounded-full border border-gray-300">
                            {assignments.length} client{assignments.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs lg:text-base italic font-bold">No assignments</span>
                        )}
                      </div>
                      <div>
                        <button
                          onClick={e => { 
                            e.stopPropagation(); 
                            confirmDelete(guard._id!, guard.name);
                          }}
                          className="text-[#A3A375] hover:text-[#8B8A5F] text-sm lg:text-lg p-1 lg:p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditModeGuardId(guard._id!);
                            setSelectedGuard(guard);
                          }}
                          className="text-[#FEB852] ml-1 lg:ml-2 text-sm lg:text-lg p-1"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="bg-white rounded-2xl shadow-inner px-3 lg:px-6 py-4 lg:py-6 mt-2 ml-2 lg:ml-4 mr-2 lg:mr-4 text-black font-bold border-2 border-[#E85E30]">
                        {/* Navigation Tabs */}
                        <div className="flex justify-center mb-4 lg:mb-6">
                          <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1 flex overflow-x-auto">
                            {[
                              { id: 'details', label: 'Guard', icon: '👤' },
                              { id: 'clients', label: 'Clients', icon: '👥' },
                              { id: 'reviews', label: 'Reviews', icon: '⭐' },
                              { id: 'documents', label: 'Documents', icon: '📄' }
                            ].map((tab) => {
                              const currentTab = activeTab[guard._id!] || 'details';
                              const isActive = currentTab === tab.id;
                              return (
                                <button
                                  key={tab.id}
                                  onClick={() => {
                                    setActiveTab(prev => ({ ...prev, [guard._id!]: tab.id }));
                                    // ✅ Mark guard as viewed when Reviews tab is clicked
                                    if (tab.id === 'reviews') {
                                      setViewedGuards(prev => new Set([...prev, guard._id!]));
                                    }
                                  }}
                                  className={`px-2 lg:px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all duration-200 flex items-center gap-1 lg:gap-2 whitespace-nowrap ${
                                    isActive
                                      ? 'bg-[#FEB852] text-black shadow-md'
                                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                  }`}
                                >
                                  <span>{tab.icon}</span>
                                  <span>{tab.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Guard Details Section */}
                        {(activeTab[guard._id!] || 'details') === 'details' && (
                          <div className="space-y-3 lg:space-y-4">
                            <div className="flex items-center gap-2 mb-3 lg:mb-4">
                              <span className="text-base lg:text-lg">👤</span>
                              <h3 className="font-semibold text-base lg:text-lg">Guard Details</h3>
                            </div>
                            
                            <div className="mb-3 lg:mb-4">
                              <b className="text-sm lg:text-base">Average Rating:</b>{" "}
                              {guard.averageRating ? (
                                <div className="flex items-center gap-1 ml-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={16}
                                      className={`lg:w-5 lg:h-5 transition-colors ${
                                        star <= Math.round(guard.averageRating || 0)
                                          ? "fill-[#FEB852] text-[#FEB852]"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-1 text-xs lg:text-sm text-black font-medium">({guard.averageRating.toFixed(1)})</span>
                                </div>
                              ) : (
                                <span className="ml-2 text-gray-500 italic text-xs lg:text-sm">No reviews yet</span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
                              <div className="text-sm lg:text-base"><b>Type:</b> {guard.type}</div>
                              <div className="text-sm lg:text-base"><b>Status:</b>
                                <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                  guard.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : guard.status === "Standby"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {guard.status}
                                </span>
                              </div>
                              <div className="text-sm lg:text-base"><b>Email:</b> {guard.email}</div>
                              <div className="text-sm lg:text-base"><b>Phone:</b> {guard.phone}</div>
                              <div className="text-sm lg:text-base"><b>Availability:</b> 
                                {guard.dayType ? (
                                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                    guard.dayType === "weekday"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-purple-100 text-purple-700"
                                  }`}>
                                    {guard.dayType === "weekday" ? "Weekday" : "Weekend"}
                                  </span>
                                ) : (
                                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                                    Not Set
                                  </span>
                                )}
                              </div>
                              <div className="text-sm lg:text-base"><b>Shift:</b> 
                                {guard.shift ? (
                                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                                    guard.shift === "day"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}>
                                    {guard.shift === "day" ? "Day Shift" : "Night Shift"}
                                  </span>
                                ) : (
                                  <span className="ml-2 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                                    Not Set
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Client Assignments Section */}
                        {activeTab[guard._id!] === 'clients' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">👥</span>
                                <h3 className="font-semibold text-lg">Client Assignments</h3>
                                {assignments.length > 0 && (
                                  <span className="bg-[#FEB852] text-black text-xs px-2 py-1 rounded-full font-medium">
                                    {assignments.length} total
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {assignments.length > 0 ? (
                              <>
                                <div className="space-y-3">
                                  {(() => {
                                    const currentClientPage = clientsCurrentPage[guard._id!] || 1;
                                    const startIndex = (currentClientPage - 1) * accordionItemsPerPage;
                                    const endIndex = startIndex + accordionItemsPerPage;
                                    const paginatedAssignments = assignments.slice(startIndex, endIndex);
                                    
                                    return paginatedAssignments.map((assignment, idx) => (
                                      <div key={startIndex + idx} className="bg-white p-4 rounded-lg border shadow-sm">
                                        <p><strong>Client:</strong> {assignment.clientName}</p>
                                        {assignment.residentName && (
                                          <p><strong>Resident:</strong> {assignment.residentName}</p>
                                        )}
                                        <p><strong>Total Hours:</strong> {assignment.totalHours} hrs</p>
                                        <div className="mt-2">
                                          <strong>Schedule:</strong>
                                          <ul className="list-disc list-inside mt-1 text-sm">
                                            {assignment.schedule.map((s, i) => <li key={i}>{s}</li>)}
                                          </ul>
                                        </div>

                                        {/* Email Share Section */}
                                        <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                          <input
                                            type="email"
                                            placeholder="Enter client email"
                                            value={emailMap[`${guard._id}_${assignment.clientName}`] || ""}
                                            onChange={(e) =>
                                              handleEmailChange(guard._id!, assignment.clientName, e.target.value)
                                            }
                                            className="border px-3 py-1 rounded w-full sm:w-auto"
                                          />
                                          <button
                                            onClick={() => handleSendEmail(guard._id!, assignment)}
                                            className="bg-[#FEB852] text-black px-4 py-1 rounded hover:bg-[#FEB852]/90 font-medium"
                                          >
                                            Share
                                          </button>
                                          <button
                                            onClick={() =>
                                              handleSendGuardDetailsToClient(
                                                guard._id!,
                                                emailMap[`${guard._id}_${assignment.clientName}`],
                                                assignment
                                              )
                                            }
                                            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 font-medium"
                                          >
                                            Share Assignment + Guard Docs
                                          </button>
                                        </div>
                                      </div>
                                    ));
                                  })()}
                                </div>
                                
                                {/* Clients Pagination */}
                                {assignments.length > accordionItemsPerPage && (
                                  <div className="flex items-center justify-center gap-2 mt-4">
                                    <button
                                      onClick={() => {
                                        const currentClientPage = clientsCurrentPage[guard._id!] || 1;
                                        setClientsCurrentPage(prev => ({
                                          ...prev,
                                          [guard._id!]: Math.max(currentClientPage - 1, 1)
                                        }));
                                      }}
                                      disabled={(clientsCurrentPage[guard._id!] || 1) === 1}
                                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center"
                                    >
                                      <FiChevronLeft size={16} />
                                    </button>
                                    
                                    <div className="text-sm text-gray-600 px-3">
                                      {clientsCurrentPage[guard._id!] || 1} / {Math.ceil(assignments.length / accordionItemsPerPage)}
                                    </div>
                                    
                                    <button
                                      onClick={() => {
                                        const currentClientPage = clientsCurrentPage[guard._id!] || 1;
                                        const maxPages = Math.ceil(assignments.length / accordionItemsPerPage);
                                        setClientsCurrentPage(prev => ({
                                          ...prev,
                                          [guard._id!]: Math.min(currentClientPage + 1, maxPages)
                                        }));
                                      }}
                                      disabled={(clientsCurrentPage[guard._id!] || 1) >= Math.ceil(assignments.length / accordionItemsPerPage)}
                                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center"
                                    >
                                      <FiChevronRight size={16} />
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <span className="text-2xl block mb-2">📝</span>
                                <p className="text-sm italic">No client assignments</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Reviews Section */}
                        {activeTab[guard._id!] === 'reviews' && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">⭐</span>
                                <h3 className="font-semibold text-lg">Reviews</h3>
                                {guard.reviews && guard.reviews.length > 0 && (
                                  <span className="bg-[#FEB852] text-black text-xs px-2 py-1 rounded-full font-medium">
                                    {guard.reviews.length} total
                                  </span>
                                )}
                              </div>
                            </div>

                            {guard.reviews && guard.reviews.length > 0 && (
                              <div className="flex justify-end mb-3">
                                <button
                                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                  onClick={async () => {
                                    const confirmed = confirm("Are you sure you want to delete all reviews for this guard?");
                                    if (!confirmed) return;

                                                                          const res = await fetch(`${API_BASE_URL}/guards/clear-reviews/${guard._id}`, {
                                      method: "DELETE",
                                    });

                                    if (res.ok) {
                                      toast.success("Reviews cleared");
                                      window.location.reload(); // Optionally: re-fetch data instead of reload
                                    } else {
                                      toast.error("Failed to clear reviews");
                                    }
                                  }}
                                >
                                  Clear All Reviews
                                </button>
                              </div>
                            )}

                            
                            {guard.reviews && guard.reviews.length > 0 ? (
                              <>
                                <div className="space-y-3">
                                  {(() => {
                                    const currentReviewPage = reviewsCurrentPage[guard._id!] || 1;
                                    const startIndex = (currentReviewPage - 1) * accordionItemsPerPage;
                                    const endIndex = startIndex + accordionItemsPerPage;
                                    const paginatedReviews = (guard.reviews || []).slice(startIndex, endIndex);
                                    
                                    return paginatedReviews.map((review, i) => (
                                      <div key={startIndex + i} className="bg-white border p-4 rounded-lg shadow-sm">
                                        <p><strong>Customer:</strong> {review.customerName}</p>
                                        <p><strong>Reviewer:</strong> {review.reviewerName}</p>
                                        <p><strong>Site:</strong> {review.site}</p>
                                        <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                          <strong>Rating:</strong>
                                          <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <Star
                                                key={star}
                                                size={16}
                                                className={`transition-colors ${
                                                  star <= review.rating
                                                    ? "fill-[#FEB852] text-[#FEB852]"
                                                    : "text-gray-300"
                                                }`}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                        <p className="mt-2"><strong>Message:</strong> {review.message}</p>
                                      </div>
                                    ));
                                  })()}
                                </div>
                                
                                {/* Reviews Pagination */}
                                {(guard.reviews || []).length > accordionItemsPerPage && (
                                  <div className="flex items-center justify-center gap-2 mt-4">
                                    <button
                                      onClick={() => {
                                        const currentReviewPage = reviewsCurrentPage[guard._id!] || 1;
                                        setReviewsCurrentPage(prev => ({
                                          ...prev,
                                          [guard._id!]: Math.max(currentReviewPage - 1, 1)
                                        }));
                                      }}
                                      disabled={(reviewsCurrentPage[guard._id!] || 1) === 1}
                                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center"
                                    >
                                      <FiChevronLeft size={16} />
                                    </button>
                                    
                                    <div className="text-sm text-gray-600 px-3">
                                      {reviewsCurrentPage[guard._id!] || 1} / {Math.ceil((guard.reviews || []).length / accordionItemsPerPage)}
                                    </div>
                                    
                                    <button
                                      onClick={() => {
                                        const currentReviewPage = reviewsCurrentPage[guard._id!] || 1;
                                        const maxPages = Math.ceil((guard.reviews || []).length / accordionItemsPerPage);
                                        setReviewsCurrentPage(prev => ({
                                          ...prev,
                                          [guard._id!]: Math.min(currentReviewPage + 1, maxPages)
                                        }));
                                      }}
                                      disabled={(reviewsCurrentPage[guard._id!] || 1) >= Math.ceil((guard.reviews || []).length / accordionItemsPerPage)}
                                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center justify-center"
                                    >
                                      <FiChevronRight size={16} />
                                    </button>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <span className="text-2xl block mb-2">📝</span>
                                <p className="text-sm italic">No reviews yet</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Documents Section */}
                        {activeTab[guard._id!] === 'documents' && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-lg">📄</span>
                              <h3 className="font-semibold text-lg">Documents</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="bg-white p-4 rounded-lg border shadow-sm">
                                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                  <span>🎓</span>
                                  Certificates
                                </h4>
                                {guard.documents && guard.documents.certificates && guard.documents.certificates.length > 0 ? (
                                  <ul className="space-y-2">
                                    {guard.documents.certificates.map((doc, idx) => (
                                      <li key={idx} className="flex items-center gap-2">
                                        <span className="text-xs">📜</span>
                                        <a href={doc.url} target="_blank" className="text-blue-600 underline text-sm hover:text-blue-800">
                                          {doc.originalName}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs italic text-gray-400">None uploaded</p>
                                )}
                              </div>

                              <div className="bg-white p-4 rounded-lg border shadow-sm">
                                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                  <span>💉</span>
                                  Vaccinations
                                </h4>
                                {guard.documents && guard.documents.vaccinations && guard.documents.vaccinations.length > 0 ? (
                                  <ul className="space-y-2">
                                    {guard.documents.vaccinations.map((doc, idx) => (
                                      <li key={idx} className="flex items-center gap-2">
                                        <span className="text-xs">🏥</span>
                                        <a href={doc.url} target="_blank" className="text-blue-600 underline text-sm hover:text-blue-800">
                                          {doc.originalName}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs italic text-gray-400">None uploaded</p>
                                )}
                              </div>

                              <div className="bg-white p-4 rounded-lg border shadow-sm md:col-span-2">
                                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                                  <span>📎</span>
                                  Other Documents
                                </h4>
                                {guard.otherDocuments && guard.otherDocuments.length > 0 ? (
                                  <ul className="space-y-2 mb-4">
                                    {guard.otherDocuments.map((doc, idx) => (
                                      <li key={idx} className="flex items-center gap-2">
                                        <span className="text-xs">📄</span>
                                        <a
                                          href={doc.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 underline text-sm hover:text-blue-800"
                                        >
                                          {doc.name}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs italic text-gray-400 mb-4">None uploaded</p>
                                )}

                                <div className="border-t pt-4">
                                  <label className="block text-sm font-medium mb-2">Upload New Document:</label>
                                  <input
                                    type="file"
                                    onChange={(e) => handleOtherDocUpload(guard._id!, e.target.files?.[0])}
                                    className="text-sm w-full border border-gray-300 rounded px-3 py-2"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
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
        <div className="flex items-center justify-center gap-2 lg:gap-3">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-2 lg:px-3 py-1 bg-[#A3A375] border border-[#A3A375] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#8B8A5F] transition-all duration-200"
          >
            <FiChevronLeft size={16} />
          </button>
          <div className="text-xs lg:text-sm text-white font-medium bg-[#A3A375] px-2 lg:px-3 py-1 rounded-xl border border-[#A3A375]">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-2 lg:px-3 py-1 bg-[#A3A375] border border-[#A3A375] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-[#8B8A5F] transition-all duration-200"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>

      {guards.length === 0 && (
        <div className="text-center text-gray-500 mt-4 text-sm lg:text-base">No guards found.</div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <h3 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">Confirm Delete</h3>
            <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">
              Are you sure you want to delete guard <span className="font-semibold text-[#FEB852]">"{deleteConfirmDialog.guardName}"</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 lg:gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base text-gray-700 bg-gray-200 rounded-xl hover:bg-gray-300 border border-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={proceedWithDelete}
                className="px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base text-white bg-red-500 rounded-xl hover:bg-red-600 border border-red-500 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};




"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/dashboard/Sidebar";
import VisitorStatsWidget from "@/components/dashboard/VisitorStatsWidget";
import AdminStatsWidget from "@/components/dashboard/AdminStatsWidget";
import RecentClients from "../../../components/dashboard/clients/RecentClients";
import SmartAdminAssistant from "@/components/dashboard/SmartAdminAssistant";
import { Client } from "@/types/client";
import { Toaster } from "react-hot-toast";
import { FiSearch, FiFilter, FiChevronDown, FiArrowUp, FiArrowDown, FiX, FiPlus, FiMenu } from 'react-icons/fi';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [quotationCount, setQuotationCount] = useState(0);
  const [guardNotificationCount, setGuardNotificationCount] = useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [guardCount, setGuardCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getPageHeading = () => {
    if (pathname.includes('/clients')) return 'CLIENT';
    if (pathname.includes('/guards')) return 'GUARD';
    if (pathname.includes('/quotation-queries')) return 'QUOTATION';
    return '';
  };

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/quotation-queries`);
        const pending = res.data.filter((q: any) => q.status === "Pending");
        setQuotationCount(pending.length);
      } catch (err) {
        console.error("Failed to fetch quotation count:", err);
      }
    };

    const fetchGuardNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/guards/unread-reviews-count`);
        setGuardNotificationCount(res.data.unreadCount);
      } catch (err) {
        console.error("Failed to fetch guard notification count:", err);
      }
    };

    const fetchClients = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/clients`);
        setClients(res.data);
        setClientCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      }
    };

    const fetchGuards = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/guards`);
        setGuardCount(res.data.length);
      } catch (err) {
        console.error("Failed to fetch guards:", err);
      }
    };

    fetchCount();
    fetchGuardNotifications();
    fetchClients();
    fetchGuards();
  }, []);

  // Clear guard notifications when visiting guards page
  useEffect(() => {
    const markGuardReviewsAsRead = async () => {
      if (pathname.includes('/guards') && guardNotificationCount > 0) {
        try {
          // Add proper headers and configuration for the PUT request
          const response = await axios.put(
            `${API_BASE_URL}/guards/mark-reviews-read`,
            {}, // Empty body
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 5000, // 5 second timeout
            }
          );
          
          if (response.status === 200) {
            setGuardNotificationCount(0);
            console.log("✅ Guard reviews marked as read successfully");
          }
        } catch (err) {
          console.error("❌ Failed to mark guard reviews as read:", err);
          
          // More detailed error logging
          if (err.response) {
            console.error("Response status:", err.response.status);
            console.error("Response data:", err.response.data);
          } else if (err.request) {
            console.error("Request made but no response received:", err.request);
          } else {
            console.error("Error setting up request:", err.message);
          }
          
          // Don't update the notification count if the request fails
          // The user will still see the notification and can try again
        }
      }
    };

    markGuardReviewsAsRead();
  }, [pathname, guardNotificationCount]);

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-screen bg-black relative">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        
        {/* Mobile Header with Hamburger Menu */}
        <div className="flex items-center justify-between p-4 bg-black border-b border-gray-700 flex-shrink-0">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
          >
            <FiMenu className="text-white" size={20} />
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Mobile Sidebar */}
        <div className={`
          ${isSidebarOpen ? 'fixed left-0 top-0 h-full w-80 z-50 transform translate-x-0' : 'hidden'} 
          flex-col gap-2 bg-black p-2 overflow-y-auto
        `}>
          {/* Mobile Close Button */}
          <div className="flex justify-end p-4">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <FiX className="text-white" size={20} />
            </button>
          </div>

          {/* Mobile Sidebar Content */}
          <div className="flex flex-col gap-2">
            <Sidebar quotationCount={quotationCount} guardNotificationCount={guardNotificationCount} />
            <div className="bg-black rounded-3xl p-3 shadow-2xl backdrop-blur-sm border border-white">
              <RecentClients clients={clients} />
            </div>
          </div>

          {/* Mobile Stats Widgets */}
          <div className="flex flex-col gap-2">
            <VisitorStatsWidget />
            
            <div className="flex flex-col gap-2">
              {/* Mobile Count Cards - Stack vertically */}
              <div className="flex flex-col gap-2">
                {/* Clients Count Card */}
                <div className="bg-transparent rounded-3xl p-3 shadow-2xl border-2 border-[#FEB852] h-24">
                  <div className="h-full flex flex-col justify-center items-center transition-all duration-300">
                    <h2 className="text-xs font-bold mb-1 text-white">CLIENTS</h2>
                    <div className="text-3xl font-bold text-white">{clientCount}</div>
                  </div>
                </div>
                
                {/* Guards Count Card */}
                <div className="bg-transparent rounded-3xl p-3 shadow-2xl border-2 border-[#FEB852] h-24">
                  <div className="h-full flex flex-col justify-center items-center transition-all duration-300">
                    <h2 className="text-xs font-bold mb-1 text-white">GUARDS</h2>
                    <div className="text-3xl font-bold text-white">{guardCount}</div>
                  </div>
                </div>
              </div>
              
              {/* Smart Admin Assistant */}
              <SmartAdminAssistant />
            </div>
          </div>
        </div>

        {/* Mobile Main Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 w-full overflow-y-auto">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Desktop Layout - Original Layout Restored */}
      <div className="hidden lg:flex h-screen bg-black px-2 py-8">
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <div className="flex gap-4">
          {/* Left Sidebar Section - Original Layout */}
          <div className="flex flex-col gap-4">
            <Sidebar quotationCount={quotationCount} guardNotificationCount={guardNotificationCount} />
            <div className="bg-black rounded-3xl p-4 shadow-2xl backdrop-blur-sm border border-white">
              <RecentClients clients={clients} />
            </div>
          </div>

          {/* Stats Widgets Section - Original Layout */}
          <div className="flex flex-col gap-4">
            <VisitorStatsWidget />
            
            <div className="flex flex-col gap-4">
              {/* Client and Guard Count Cards - Original Side by Side */}
              <div className="flex gap-4">
                {/* Clients Count Card - Original Square */}
                <div className="bg-transparent rounded-3xl p-3 shadow-2xl border-2 border-[#FEB852] w-32 h-32">
                  <div className="h-full flex flex-col justify-center items-center transition-all duration-300">
                    <h2 className="text-sm font-bold mb-1 text-white">CLIENTS</h2>
                    <div className="text-5xl font-bold text-white">{clientCount}</div>
                  </div>
                </div>
                
                {/* Guards Count Card - Original Square */}
                <div className="bg-transparent rounded-3xl p-3 shadow-2xl border-2 border-[#FEB852] w-32 h-32">
                  <div className="h-full flex flex-col justify-center items-center transition-all duration-300">
                    <h2 className="text-sm font-bold mb-1 text-white">GUARDS</h2>
                    <div className="text-5xl font-bold text-white">{guardCount}</div>
                  </div>
                </div>
              </div>
              
              {/* Smart Admin Assistant - Original */}
              <SmartAdminAssistant />
            </div>
          </div>
        </div>

        {/* Main Content Area - Original */}
        <main className="flex-1 ml-2 h-screen overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 w-full overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Client } from "@/types/client";
import { AddClientModal } from "@/components/dashboard/clients/AddClientModal";
import { ClientTable } from "@/components/dashboard/clients/ClientTable";
import { ClientGraph } from "@/components/dashboard/clients/ClientGraph";
import { FiSearch, FiFilter, FiChevronDown, FiArrowUp, FiArrowDown, FiX, FiPlus } from 'react-icons/fi';
import { getApiUrl } from "@/lib/config";
import { Suspense } from 'react';
import { getClients } from '@/lib/api';



export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('all');
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch all clients
  const fetchClients = async () => {
    try {
      const res = await axios.get(getApiUrl("/clients"));
      setClients(res.data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (!showFilters) return;
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  // ✅ Add or update client, then refetch fresh list
  const handleAddClient = async (client: Client) => {
    try {
      if (clientToEdit) {
        await await axios.put(getApiUrl(`/clients/${clientToEdit._id}`), client);
      } else {
        await await axios.post(getApiUrl("/clients"), client);
      }

      await fetchClients(); // 🔁 Get updated list after mutation
      setClientToEdit(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to save client:", err);
    }
  };

  const handleEdit = (client: Client) => {
    setClientToEdit(client);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(getApiUrl(`/clients/${id}`));
      fetchClients(); // Refresh after deletion
    } catch (err) {
      console.error("Failed to delete client:", err);
    }
  };

  const filteredClients = (() => {
    const lowerTerm = searchTerm.toLowerCase();
    const searchFiltered = clients.filter(client => {
      const getField = (field: keyof Client) => (client as any)[field]?.toString().toLowerCase() || '';
      if (searchField === 'all') {
        return (
          getField('name').includes(lowerTerm) ||
          getField('email').includes(lowerTerm) ||
          getField('status').includes(lowerTerm) ||
          getField('guardType').includes(lowerTerm) ||
          getField('joinedDate').includes(lowerTerm)
        );
      } else {
        return getField(searchField).includes(lowerTerm);
      }
    });
    const sorted = [...searchFiltered].sort((a, b) => {
      if (sortKey === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortKey === 'numberOfGuards') {
        return sortOrder === 'asc'
          ? a.numberOfGuards - b.numberOfGuards
          : b.numberOfGuards - a.numberOfGuards;
      }
      return 0;
    });
    return sorted;
  })();

  return (
    <div className="h-full flex flex-col overflow-hidden px-3 lg:px-6">
      <div className="flex-1 flex flex-col gap-3 lg:gap-5 max-w-[3600px] mx-auto w-full">
        {/* Client Heading */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl lg:text-6xl font-bold text-white ml-2 lg:ml-8">CLIENT DASHBOARD</h1>
        </div>
        
        {/* Client Graph */}
        <div className="flex-shrink-0">
          <ClientGraph clients={clients} />
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3 flex-shrink-0">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 w-full lg:max-w-2xl" ref={filterRef}>
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg w-full lg:w-[300px] border border-white">
              <FiSearch className="absolute left-4 text-white/70" size={18} />
              <input
                type="text"
                placeholder={`Search by ${searchField === 'all' ? 'any field' : searchField}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-12 lg:pr-2 py-1 w-full bg-transparent outline-none text-white placeholder-white/60 rounded-full text-sm lg:text-base"
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden absolute right-4 rounded-full border-2 border-[#FEB852] p-1 bg-transparent transition-all duration-500 ease-in-out flex items-center justify-center hover:bg-[#FEB852]/20"
                aria-label="Toggle filters"
              >
                <FiFilter className="text-[#FEB852]" size={16} />
              </button>
              {!showFilters && (
                <button
                  type="button"
                  onClick={() => setShowFilters(true)}
                  className="hidden lg:block rounded-full border-2 border-[#FEB852] p-2 bg-transparent transition-all duration-500 ease-in-out flex items-center justify-center hover:bg-[#FEB852]/20"
                  aria-label="Show filters"
                >
                  <FiFilter className="text-[#FEB852]" size={18} />
                </button>
              )}
            </div>
            
            <div
              className={`flex flex-col lg:flex-row lg:items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg transition-all duration-500 ease-in-out border border-white ${
                showFilters ? 'opacity-100 translate-y-0 lg:translate-x-0 max-h-96 lg:max-w-2xl lg:ml-2' : 'opacity-0 -translate-y-4 lg:-translate-x-8 max-h-0 lg:max-w-0 overflow-hidden'
              }`}
              style={{ 
                minWidth: showFilters ? 320 : 0,
                width: showFilters ? '100%' : 0
              }}
            >
              <div className="relative bg-transparent">
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FEB852] pointer-events-none" size={16} />
                <select
                  value={searchField}
                  onChange={e => setSearchField(e.target.value)}
                  className="p-2 pl-8 pr-8 border border-white rounded-xl text-white appearance-none bg-white/10 backdrop-blur-md w-full lg:min-w-[120px] text-sm lg:text-base"
                >
                  <option value="all" className="bg-gray-800">All Fields</option>
                  <option value="name" className="bg-gray-800">Name</option>
                  <option value="email" className="bg-gray-800">Email</option>
                  <option value="status" className="bg-gray-800">Status</option>
                  <option value="guardType" className="bg-gray-800">Guard Type</option>
                  <option value="joinedDate" className="bg-gray-800">Joined On</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={16} />
              </div>
              
              <div className="relative bg-transparent">
                {sortOrder === 'asc' ? (
                  <FiArrowUp className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FEB852] pointer-events-none" size={16} />
                ) : (
                  <FiArrowDown className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FEB852] pointer-events-none" size={16} />
                )}
                <select
                  value={sortOrder}
                  onChange={e => setSortOrder(e.target.value)}
                  className="p-2 pl-8 pr-8 border border-white rounded-xl text-white appearance-none bg-white/10 backdrop-blur-md w-full lg:min-w-[100px] text-sm lg:text-base"
                >
                  <option value="asc" className="bg-gray-800">Asc</option>
                  <option value="desc" className="bg-gray-800">Desc</option>
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white pointer-events-none" size={16} />
              </div>
              
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="lg:ml-2 rounded-full border border-white bg-white/10 backdrop-blur-md transition-transform duration-300 flex items-center justify-center hover:bg-white/20 self-center lg:self-auto w-6 h-6"
                aria-label="Close filters"
              >
                <FiX className="text-white" size={16} />
              </button>
            </div>
          </div>
          
          <button
            onClick={() => {
              setClientToEdit(null);
              setModalOpen(true);
            }}
            className="bg-black text-white px-4 lg:px-6 py-2 lg:py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 font-medium border-2 border-[#FEB852] hover:bg-gray-900 w-full lg:w-auto"
          >
            <FiPlus className="text-[#FEB852] text-lg lg:text-xl font-bold" />
            <span className="text-sm lg:text-base">Add New Client</span>
          </button>
        </div>
        
        {/* Client Table */}
        <div className="flex-1 min-h-0">
          <ClientTable 
            clients={filteredClients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setClientToEdit(null);
        }}
        onAddClient={handleAddClient}
        clientToEdit={clientToEdit}
      />
    </div>
  );
}

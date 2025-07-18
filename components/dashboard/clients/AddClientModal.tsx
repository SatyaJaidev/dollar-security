"use client";

import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { Guard } from "../../../app/dashboard/admin/guards/page";
import { FiX } from 'react-icons/fi';
import { getApiUrl } from "@/lib/config";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: Client) => void;
  clientToEdit?: Client | null;
}

interface GuardSchedule {
  date: string;
  startHour: string;
  startMinute: string;
  startPeriod: string;
  endHour: string;
  endMinute: string;
  endPeriod: string;
}

interface AssignedGuard {
  guardId: string;
  name: string;
  residentName?: string;
  days: number;
  schedule: GuardSchedule[];
}

const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const minutes = ["00", "15", "30", "45"];
const periods = ["AM", "PM"];

export const AddClientModal = ({ isOpen, onClose, onAddClient, clientToEdit }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [guardType, setGuardType] = useState("");
  const [numberOfGuards, setNumberOfGuards] = useState(1);
  const [availableGuards, setAvailableGuards] = useState<Guard[]>([]);
  const [assignedGuards, setAssignedGuards] = useState<AssignedGuard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    const fetchGuards = async () => {
      const res = await fetch(getApiUrl("/guards"));
      const data = await res.json();
      setAvailableGuards(data);
    };
    fetchGuards();
  }, []);

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name || "");
      setEmail(clientToEdit.email || "");
      setJoinedDate(clientToEdit.joinedDate || "");
      setGuardType(clientToEdit.guardType || "");
      setNumberOfGuards(clientToEdit.numberOfGuards || 1);
      setStartDate(clientToEdit.startDate || "");
      setEndDate(clientToEdit.endDate || "");
      setAssignedGuards(clientToEdit.assignedGuards?.map(guard => ({
        guardId: guard.guardId || guard._id || '',
        name: guard.name,
        residentName: (guard as any).residentName || '',
        days: guard.days || 1,
        schedule: guard.schedule || [{ date: '', startHour: '07', startMinute: '00', startPeriod: 'PM', endHour: '07', endMinute: '00', endPeriod: 'AM' }]
      })) || []);
    } else {
      setName("");
      setEmail("");
      setJoinedDate("");
      setGuardType("");
      setNumberOfGuards(1);
      setStartDate("");
      setEndDate("");
      setAssignedGuards([]);
    }
  }, [clientToEdit, isOpen]);

  const handleAddGuard = (guard: Guard) => {
    if (assignedGuards.find(g => g.guardId === guard._id)) return;
    if (assignedGuards.length >= numberOfGuards) {
      alert(`You can only select ${numberOfGuards} guard(s). Please increase the number of guards or remove a guard first.`);
      return;
    }
    setAssignedGuards(prev => [...prev, {
      guardId: guard._id!,
      name: guard.name,
      days: 1,
      schedule: [{ date: '', startHour: '07', startMinute: '00', startPeriod: 'PM', endHour: '07', endMinute: '00', endPeriod: 'AM' }]
    }]);
    setSearchTerm("");
  };

  const updateSchedule = (guardId: string, index: number, field: keyof GuardSchedule, value: string) => {
    setAssignedGuards(prev => prev.map(g =>
      g.guardId === guardId ? {
        ...g,
        schedule: g.schedule.map((s, i) => i === index ? { ...s, [field]: value } : s)
      } : g
    ));
  };

  const updateDays = (guardId: string, days: number) => {
    setAssignedGuards(prev => prev.map(g =>
      g.guardId === guardId ? {
        ...g,
        days,
        schedule: Array.from({ length: days }, (_, i) => g.schedule[i] || {
          date: '', startHour: '07', startMinute: '00', startPeriod: 'PM', endHour: '07', endMinute: '00', endPeriod: 'AM'
        })
      } : g
    ));
  };

  const removeGuard = (guardId: string) => {
    setAssignedGuards(prev => prev.filter(g => g.guardId !== guardId));
  };

  const calculateHours = (s: GuardSchedule) => {
    const startH = parseInt(s.startHour) % 12 + (s.startPeriod === "PM" ? 12 : 0);
    const endH = parseInt(s.endHour) % 12 + (s.endPeriod === "PM" ? 12 : 0);
    const startM = parseInt(s.startMinute);
    const endM = parseInt(s.endMinute);
    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    let duration = endTotal - startTotal;
    if (duration < 0) duration += 1440;
    if (duration === 0) duration = 1440; // 24-hour case (same start and end time)
    return Math.round((duration / 60) * 10) / 10;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newClient: Partial<Client> = {
      name,
      email,
      joinedDate,
      guardType,
      numberOfGuards,
      assignedGuards,
      progress: clientToEdit?.progress ?? 0,
      startDate,
      endDate,
    };

    if (clientToEdit?._id) newClient._id = clientToEdit._id;

    onAddClient(newClient as Client);

    setName("");
    setEmail("");
    setJoinedDate("");
    setGuardType("");
    setNumberOfGuards(1);
    setAssignedGuards([]);
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setShowSummary(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-[#FEB852]"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black mb-4">
            {clientToEdit ? "Edit Client" : "Add New Client"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-black hover:text-gray-700 text-2xl font-bold"
            aria-label="Close modal"
          >
            <FiX />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="border-2 border-[#FEB852] bg-white text-black p-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" 
              placeholder="Client Name" 
            />
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="border-2 border-[#FEB852] bg-white text-black p-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" 
              placeholder="Email" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-black mb-1">Joined Date</label>
              <input 
                type="date" 
                value={joinedDate} 
                onChange={(e) => setJoinedDate(e.target.value)} 
                className="border-2 border-[#FEB852] bg-white text-black p-3 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" 
                required 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-black mb-1">Guard Type</label>
              <select 
                value={guardType} 
                onChange={(e) => setGuardType(e.target.value)} 
                className="border-2 border-[#FEB852] bg-white text-black p-3 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] h-[42px] min-h-[42px]" 
                required
              >
                <option value="" className="bg-white">Select Guard Type</option>
                <option value="Residential" className="bg-white">Residential</option>
                <option value="Home Care" className="bg-white">Home Care</option>
                <option value="Corporate Events" className="bg-white">Corporate Events</option>
                <option value="Construction site" className="bg-white">Construction site</option>
                <option value="Commercial and retail" className="bg-white">Commercial and retail</option>
                <option value="Hospitality and Hostel" className="bg-white">Hospitality and Hostel</option>
                <option value="Logistics and Warehouse" className="bg-white">Logistics and Warehouse</option>
                <option value="Healthcare" className="bg-white">Healthcare</option>
                <option value="Specialized Security" className="bg-white">Specialized Security</option>
                <option value="Event Security" className="bg-white">Event Security</option>
                <option value="Other" className="bg-white">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-black mb-1">Number of Guards</label>
              <input 
                type="number" 
                value={numberOfGuards} 
                onChange={(e) => setNumberOfGuards(Number(e.target.value))} 
                min={1} 
                className="border-2 border-[#FEB852] bg-white text-black p-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" 
                required 
                placeholder="Number of Guards" 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-black mb-1">Start Date</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="border-2 border-[#FEB852] bg-white text-black p-3 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" 
                required 
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-black mb-1">End Date (Optional)</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="border-2 border-[#FEB852] bg-white text-black p-3 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" 
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm text-black">Search Guards</label>
              <span className="text-sm text-[#FEB852] font-medium">
                {assignedGuards.length} of {numberOfGuards} selected
              </span>
            </div>
            <input 
              type="text" 
              placeholder="Search Guard by Name" 
              className="border-2 border-[#FEB852] bg-white text-black p-3 rounded-xl placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
            {searchTerm && (
              <div className="flex flex-wrap gap-2 mt-2">
                {availableGuards.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase())).map(guard => (
                  <button 
                    key={guard._id} 
                    type="button" 
                    className={`px-3 py-2 rounded-xl transition-colors duration-200 font-medium ${
                      assignedGuards.find(g => g.guardId === guard._id) 
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed" 
                        : assignedGuards.length >= numberOfGuards
                        ? "bg-red-500/20 text-red-300 cursor-not-allowed"
                        : "bg-[#FEB852] text-black hover:bg-[#FEB852]/80"
                    }`}
                    onClick={() => handleAddGuard(guard)}
                    disabled={assignedGuards.find(g => g.guardId === guard._id) ? true : assignedGuards.length >= numberOfGuards}
                  >
                    {guard.name} {assignedGuards.find(g => g.guardId === guard._id) && "✓"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {assignedGuards.map(guard => (
            <div key={guard.guardId} className="border-2 border-[#FEB852] p-4 rounded-xl bg-gray-50 text-black">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-[#FEB852]">{guard.name}</h4>
                <button
                  type="button"
                  onClick={() => removeGuard(guard.guardId)}
                  className="text-red-600 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-500/20"
                  aria-label="Remove guard"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Resident Name"
                  value={guard.residentName || ""}
                  onChange={(e) =>
                    setAssignedGuards(prev =>
                      prev.map(g => g.guardId === guard.guardId
                        ? { ...g, residentName: e.target.value }
                        : g
                      )
                    )
                  }
                  className="w-full border-2 border-[#FEB852] bg-white text-black p-2 rounded-xl placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]"
                />
                <input 
                  type="number" 
                  min={1} 
                  max={10} 
                  value={guard.days} 
                  onChange={(e) => updateDays(guard.guardId, Number(e.target.value))} 
                  className="w-full border-2 border-[#FEB852] bg-white text-black p-2 rounded-xl placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" 
                  placeholder="Number of days" 
                />
                {guard.schedule.map((s, i) => (
                  <div key={i} className="border border-gray-300 p-3 bg-gray-100 rounded-xl">
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="block text-sm text-black mb-1">Date:</label>
                        <input 
                          type="date" 
                          value={s.date} 
                          onChange={(e) => updateSchedule(guard.guardId, i, 'date', e.target.value)} 
                          className="w-full border-2 border-[#FEB852] bg-white text-black p-2 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-black mb-1 block">Start Time</label>
                          <div className="flex gap-1">
                            <select 
                              value={s.startHour} 
                              onChange={(e) => updateSchedule(guard.guardId, i, 'startHour', e.target.value)} 
                              className="border-2 border-[#FEB852] bg-white text-black p-2 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] flex-1"
                            >
                              {hours.map(h => <option key={h} value={h} className="bg-white">{h}</option>)}
                            </select>
                            <select 
                              value={s.startMinute} 
                              onChange={(e) => updateSchedule(guard.guardId, i, 'startMinute', e.target.value)} 
                              className="border-2 border-[#FEB852] bg-white text-black p-2 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] flex-1"
                            >
                              {minutes.map(m => <option key={m} value={m} className="bg-white">{m}</option>)}
                            </select>
                            <select 
                              value={s.startPeriod} 
                              onChange={(e) => updateSchedule(guard.guardId, i, 'startPeriod', e.target.value)} 
                              className="border-2 border-[#FEB852] bg-white text-black p-2 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] flex-1"
                            >
                              {periods.map(p => <option key={p} value={p} className="bg-white">{p}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-black mb-1 block">End Time</label>
                          <div className="flex gap-1">
                            <select 
                              value={s.endHour} 
                              onChange={(e) => updateSchedule(guard.guardId, i, 'endHour', e.target.value)} 
                              className="border-2 border-[#FEB852] bg-white text-black p-2 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] flex-1"
                            >
                              {hours.map(h => <option key={h} value={h} className="bg-white">{h}</option>)}
                            </select>
                            <select 
                              value={s.endMinute} 
                              onChange={(e) => updateSchedule(guard.guardId, i, 'endMinute', e.target.value)} 
                              className="border-2 border-[#FEB852] bg-white text-black p-2 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] flex-1"
                            >
                              {minutes.map(m => <option key={m} value={m} className="bg-white">{m}</option>)}
                            </select>
                            <select 
                              value={s.endPeriod} 
                              onChange={(e) => updateSchedule(guard.guardId, i, 'endPeriod', e.target.value)} 
                              className="border-2 border-[#FEB852] bg-white text-black p-2 rounded-xl focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] flex-1"
                            >
                              {periods.map(p => <option key={p} value={p} className="bg-white">{p}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {assignedGuards.length > 0 && (
            <button 
              type="button" 
              onClick={() => setShowSummary(!showSummary)} 
              className="bg-[#FEB852] text-black px-6 py-3 rounded-xl hover:bg-[#FEB852]/80 transition-colors duration-200 font-medium"
            >
              {showSummary ? "Hide Summary" : "Show Summary"}
            </button>
          )}

          {showSummary && (
            <div className="border-2 border-[#FEB852] bg-gray-50 text-black p-4 rounded-xl space-y-3">
              <h3 className="font-bold text-[#FEB852]">Assignment Summary</h3>
              {assignedGuards.map(g => (
                <div key={g.guardId} className="border-b border-gray-300 pb-2 last:border-b-0">
                  <h4 className="font-semibold text-[#FEB852]">{g.name}</h4>
                  {g.schedule.map((s, i) => (
                    <p key={i} className="text-sm text-gray-700">
                      Day {i + 1}: {s.date} — {s.startHour}:{s.startMinute} {s.startPeriod} to {s.endHour}:{s.endMinute} {s.endPeriod} ({calculateHours(s)} hrs)
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-[#FEB852] text-black px-6 py-3 rounded-xl hover:bg-[#FEB852]/80 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            >
              <span className="text-black text-lg font-bold">
                {clientToEdit ? "✎" : "+"}
              </span>
              <span>{clientToEdit ? "Update Client" : "Add Client"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

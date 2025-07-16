"use client";

import { useState } from "react";
import { Guard } from "../../../app/dashboard/admin/guards/page";
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from "react";



export default function AddGuardForm({
  onGuardAdded,
  guardToEdit,
  onCancel,
  onSaveSuccess,
}: {
  onGuardAdded?: () => void;
  guardToEdit?: Guard;
  onCancel?: () => void;
  onSaveSuccess?: () => void;
}) {
  const [form, setForm] = useState<Partial<Guard>>({
    name: "",
    email: "",
    phone: "",
    city: "",
    payPerHour: 0,
    dateJoined: "",
    certifications: false,
    licenseEndDate: "",
    dayType: "weekday",
    shift: "day",
  });

  const [documents, setDocuments] = useState<{
    certificates: { _id: string; originalName: string; url: string; uploadedAt: string }[];
    vaccinations: { _id: string; originalName: string; url: string; uploadedAt: string }[];
  }>({ certificates: [], vaccinations: [] });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (guardToEdit) {
      setForm({
        name: guardToEdit.name,
        email: guardToEdit.email,
        phone: guardToEdit.phone,
        city: guardToEdit.city,
        payPerHour: guardToEdit.payPerHour,
        dateJoined: guardToEdit.dateJoined?.split("T")[0],
        certifications: guardToEdit.certifications,
        licenseEndDate: guardToEdit.licenseEndDate?.split("T")[0],
        dayType: guardToEdit.dayType,
        shift: guardToEdit.shift,
      });
  
      setDocuments(guardToEdit.documents || { certificates: [], vaccinations: [] });
    }
  }, [guardToEdit]);
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "number"
        ? Number(value)
        : type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value;
    setForm({ ...form, [name]: newValue });
  };

  const handleUpload = async (
    files: FileList | null,
    type: "certificates" | "vaccinations"
  ) => {
    if (!files) return;
    setIsUploading(true);
    const uploaded: { _id: string; originalName: string; url: string; uploadedAt: string }[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("document", file);

      try {
        const res = await fetch("http://18.188.242.116:5000/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploaded.push({
          _id: uuidv4(),
          originalName: file.name,
          url: data.fileUrl,
          uploadedAt: Date(),
        } as { _id: string; originalName: string; url: string; uploadedAt: string });
      } catch (err) {
        console.error("Upload failed:", err);
      }
    }

    setDocuments((prev) => {
      const updated = {
        ...prev,
        [type]: [...prev[type], ...uploaded],
      };
      console.log("✅ Updated documents state:", updated);
      return updated;
    });

    console.log("Updated documents after upload:", documents);
    setIsUploading(false);
  };

  /*
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isUploading) {
      alert("Please wait for files to finish uploading.");
      return;
    }
  
    const payload = {
      ...form,
      documents,
    };
    console.log("Submitting payload:", payload); // TEMP LOG
  
    const res = await fetch("http://18.188.242.116:5000/api/guards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  
    if (res.ok) {
      setForm({
        name: "",
        email: "",
        phone: "",
        city: "",
        payPerHour: 0,
        dateJoined: "",
        certifications: false,
        licenseEndDate: "",
        dayType: "weekday",
        shift: "day",
      });
      setDocuments({ certificates: [], vaccinations: [] });
      onGuardAdded();
      // window.location.reload();
    }
  };
  */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (isUploading) {
      alert("Please wait for files to finish uploading.");
      return;
    }
  
    const payload = {
      ...form,
      documents,
    };
  
    const url = guardToEdit
      ? `http://18.188.242.116:5000/api/guards/${guardToEdit._id}`
      : "http://18.188.242.116:5000/api/guards";
  
    const method = guardToEdit ? "PUT" : "POST";
  
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        if (guardToEdit) {
          onSaveSuccess && onSaveSuccess(); // For edit mode
        } else {
          onGuardAdded && onGuardAdded(); // For add mode
        }
  
        setForm({
          name: "",
          email: "",
          phone: "",
          city: "",
          payPerHour: 0,
          dateJoined: "",
          certifications: false,
          licenseEndDate: "",
          dayType: "weekday",
          shift: "day",
        });
  
        setDocuments({ certificates: [], vaccinations: [] });
      } else {
        console.error("Failed to save guard:", await res.text());
      }
    } catch (err) {
      console.error("Error submitting guard form:", err);
    }
  };
  

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white border-2 border-[#FEB852] p-6 rounded-xl shadow-lg max-w-3xl"
    >
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="name" value={form.name || ""} onChange={handleChange} placeholder="Full Name" className="border-2 border-[#FEB852] bg-white text-black p-2 rounded placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" required />
        <input type="email" name="email" value={form.email || ""} onChange={handleChange} placeholder="Email" className="border-2 border-[#FEB852] bg-white text-black p-2 rounded placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" required />
        <input type="text" name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Phone" className="border-2 border-[#FEB852] bg-white text-black p-2 rounded placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" required />
        <input type="text" name="city" value={form.city || ""} onChange={handleChange} placeholder="City" className="border-2 border-[#FEB852] bg-white text-black p-2 rounded placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" required />
        <div className="flex flex-col">
          <label htmlFor="payPerHour" className="text-sm text-black mb-1">Pay/hr</label>
          <input id="payPerHour" type="number" name="payPerHour" value={form.payPerHour?.toString() || ""} onChange={handleChange} placeholder="Pay per hour" className="border-2 border-[#FEB852] bg-white text-black p-2 rounded placeholder-gray-500 focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="dateJoined" className="text-sm text-black mb-1">Date Joined</label>
          <input id="dateJoined" type="date" name="dateJoined" value={form.dateJoined || ""} onChange={handleChange} className="border-2 border-[#FEB852] bg-white text-black p-2 rounded focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="certifications" className="text-sm text-black mb-1">Certifications</label>
          <select id="certifications" name="certifications" value={String(form.certifications)} onChange={(e) => setForm({ ...form, certifications: e.target.value === "true" })} className="border-2 border-[#FEB852] bg-white text-black p-2 rounded focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] h-[42px] min-h-[42px]" required>
            <option value="false">No Certifications</option>
            <option value="true">Has Certifications</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="licenseEndDate" className="text-sm text-black mb-1">License End Date</label>
          <input id="licenseEndDate" type="date" name="licenseEndDate" value={form.licenseEndDate || ""} onChange={handleChange} className="border-2 border-[#FEB852] bg-white text-black p-2 rounded focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852]" required />
        </div>
        <div className="flex flex-col">
          <label htmlFor="dayType" className="text-sm text-black mb-1">Availability</label>
          <select id="dayType" name="dayType" value={form.dayType || "weekday"} onChange={handleChange} className="border-2 border-[#FEB852] bg-white text-black p-2 rounded focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] h-[42px] min-h-[42px]" required>
            <option value="weekday">Weekday</option>
            <option value="weekend">Weekend</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="shift" className="text-sm text-black mb-1">Shift</label>
          <select id="shift" name="shift" value={form.shift || "day"} onChange={handleChange} className="border-2 border-[#FEB852] bg-white text-black p-2 rounded focus:outline-none focus:border-[#FEB852] focus:ring-1 focus:ring-[#FEB852] h-[42px] min-h-[42px]" required>
            <option value="day">Day Shift</option>
            <option value="night">Night Shift</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm text-black mb-1">Upload Certificates</label>
          <input type="file" multiple accept=".pdf,.jpg,.png" onChange={(e) => handleUpload(e.target.files, "certificates")} className="text-black" />
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-black mb-1">Upload Vaccination Docs</label>
          <input type="file" multiple accept=".pdf,.jpg,.png" onChange={(e) => handleUpload(e.target.files, "vaccinations")} className="text-black" />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="flex-1 bg-[#FEB852] text-black px-6 py-3 rounded-xl hover:bg-[#FEB852]/80 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
        >
          {isUploading ? "Uploading..." : (
            <>
              <span className="text-[#FEB852] text-lg font-bold">
                {guardToEdit ? "✎" : "+"}
              </span>
              <span>{guardToEdit ? "Update Guard" : "Add Guard"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}






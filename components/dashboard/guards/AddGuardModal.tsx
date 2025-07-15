"use client";

import { Guard } from "../../../app/dashboard/admin/guards/page";
import AddGuardForm from "./AddGuardForm";
import { FiX } from 'react-icons/fi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGuardAdded: () => void;
  guardToEdit?: Guard | null;
}

export const AddGuardModal = ({ isOpen, onClose, onGuardAdded, guardToEdit }: Props) => {
  const handleGuardAdded = () => {
    onGuardAdded();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleSaveSuccess = () => {
    onGuardAdded();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-[#FEB852]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">
            {guardToEdit ? "Edit Guard" : "Add New Guard"}
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>
        
        <AddGuardForm
          onGuardAdded={handleGuardAdded}
          guardToEdit={guardToEdit}
          onCancel={handleCancel}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>
    </div>
  );
}; 
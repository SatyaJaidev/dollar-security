"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


interface DecodedToken {
  role: "client" | "vendor" | "admin";
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.token) {
      const decoded: DecodedToken = jwtDecode(user.token);
      if (decoded.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, router]);

  return (
    <ProtectedRoute>
      <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-3xl p-4 lg:p-8 shadow-2xl backdrop-blur-sm border border-white/10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-8 border border-white/20 text-center">
          <div className="text-4xl lg:text-6xl mb-3 lg:mb-4">🛡️</div>
          <h1 className="text-xl lg:text-3xl font-bold text-white mb-3 lg:mb-4">Welcome to the Admin Dashboard</h1>
          <p className="text-white/80 text-sm lg:text-lg">Manage your security operations from this central hub</p>
          <div className="mt-4 lg:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
            <div className="bg-white/10 rounded-xl p-3 lg:p-4 border border-white/20">
              <div className="text-xl lg:text-2xl mb-2">👥</div>
              <div className="text-white font-medium text-sm lg:text-base">Manage Clients</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 lg:p-4 border border-white/20">
              <div className="text-xl lg:text-2xl mb-2">🛡️</div>
              <div className="text-white font-medium text-sm lg:text-base">Oversee Guards</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 lg:p-4 border border-white/20">
              <div className="text-xl lg:text-2xl mb-2">📊</div>
              <div className="text-white font-medium text-sm lg:text-base">View Analytics</div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

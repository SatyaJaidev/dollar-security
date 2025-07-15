"use client";

import { ChatQueriesTable } from "@/components/chatbot/ChatQueriesTable";
import AdminChat from "../../../../components/chatbot/AdminChat"; // ✅ import here
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface DecodedToken {
  role: "client" | "vendor" | "admin";
}

export default function ChatbotQueriesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || typeof user.token !== "string") return;

    try {
      const decoded: DecodedToken = jwtDecode(user.token);
      if (decoded.role !== "admin") {
        router.push("/");
      }
    } catch (err) {
      console.error("JWT decode failed:", err);
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return <div className="p-6 text-center">🔐 Loading admin access...</div>;
  }

  return (
    <ProtectedRoute>
      <div className="text-xl font-semibold mb-4">📨 Chatbot Queries</div>
      <ChatQueriesTable />

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">🧠 Live Admin Chat</h3>
        <AdminChat /> {/* 👈 Add this */}
      </div>
    </ProtectedRoute>
  );
}

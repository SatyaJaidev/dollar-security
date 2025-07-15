"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function AdminChat() {
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [reply, setReply] = useState("");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        console.log("🟢 Admin socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.warn("🔌 Admin socket disconnected:", reason);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("❌ Admin socket connect error:", err.message);
      });
    }

    const socket = socketRef.current;

    console.log("📡 [ADMIN] Setting up adminReceive listener...");
    socket?.on("adminReceive", (data) => {
      console.log("📥 [ADMIN] received message from user:", data);
      setMessages((prev) => [...prev, { sender: "user", message: data.message }]);
    });

    return () => {
      console.log("🔁 [ADMIN] Cleaning up listener");
      socket?.off("adminReceive");
    };
  }, []);

  const sendReply = () => {
    if (!reply.trim()) return;

    const adminMsg = { sender: "admin", message: reply };
    setMessages((prev) => [...prev, adminMsg]);

    if (socketRef.current?.connected) {
      console.log("📤 [ADMIN] Emitting reply:", adminMsg);
      socketRef.current.emit("adminReply", adminMsg);
    } else {
      console.warn("❌ [ADMIN] Socket not connected yet");
    }

    setReply("");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">🛠️ Admin Chat</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-4 bg-gray-100 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 text-sm ${msg.sender === "admin" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-1 rounded ${msg.sender === "admin" ? "bg-blue-300" : "bg-yellow-200"}`}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type a reply..."
          className="flex-grow px-3 py-2 border rounded-l"
        />
        <button
          onClick={sendReply}
          className="bg-green-500 text-white px-4 rounded-r hover:bg-green-600"
        >
          Reply
        </button>
      </div>
    </div>
  );
}

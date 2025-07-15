"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [input, setInput] = useState("");
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
        console.log("🟢 User socket connected:", socketRef.current?.id);
      });

      socketRef.current.on("disconnect", (reason) => {
        console.warn("🔌 User socket disconnected:", reason);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("❌ User socket connect error:", err.message);
      });
    }

    const socket = socketRef.current;

    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat/messages");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("❌ Failed to fetch messages:", err);
      }
    };

    fetchMessages();

    console.log("📡 [USER] Setting up userReceive listener...");
    socket?.on("userReceive", (data) => {
      console.log("📥 [USER] received message from admin:", data);
      setMessages((prev) => [...prev, { sender: "admin", message: data.message }]);
    });

    return () => {
      console.log("🔁 [USER] Cleaning up listener");
      socket?.off("userReceive");
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { sender: "user", message: input };
    setMessages((prev) => [...prev, newMsg]);

    if (socketRef.current?.connected) {
      console.log("📤 [USER] Emitting message:", newMsg);
      socketRef.current.emit("userMessage", newMsg);
      socketRef.current.emit("refreshAdminTable"); // ✅ broadcast to admin
    } else {
      console.warn("❌ [USER] Socket not connected yet");
    }

    try {
      await fetch("http://localhost:5000/api/chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
    } catch (err) {
      console.error("❌ Failed to send message:", err);
    }

    setInput("");
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">💬 Chatbot</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-4 bg-gray-100 rounded">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 text-sm ${msg.sender === "user" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-1 rounded ${msg.sender === "user" ? "bg-blue-200" : "bg-green-200"}`}>
              {msg.message}
            </span>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow px-3 py-2 border rounded-l"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}

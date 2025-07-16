"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  _id: string;
  sender: string;
  message: string;
  timestamp: string;
  responded: boolean;
}

export const ChatQueriesTable = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState<{ [key: string]: string }>({});
  const socketRef = useRef<Socket | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("http://18.188.242.116:5000/api/chat/messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!socketRef.current) {
      socketRef.current = io("http://18.188.242.116:5000", {
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("🟢 Admin table socket connected:", socket.id);
    });

    socket.on("refreshAdminTable", () => {
      console.log("♻️ Refreshing table from socket event");
      fetchMessages();
    });

    return () => {
      socket.off("refreshAdminTable");
    };
  }, []);

  const handleReply = async (id: string) => {
    if (!reply[id]) return;

    try {
      await fetch("http://18.188.242.116:5000/api/chat/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ replyToId: id, message: reply[id] }),
      });

      setReply(prev => ({ ...prev, [id]: "" }));
      setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, responded: true } : msg));
    } catch (err) {
      console.error("Failed to send reply:", err);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow mt-6">
      <h3 className="text-lg font-bold mb-3">📨 Chatbot Queries</h3>

      {messages.filter(msg => msg.sender === "user").map(msg => (
        <div key={msg._id} className="mb-4 p-2 border rounded">
          <p><strong>User:</strong> {msg.message}</p>
          <p className="text-sm text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>

          {!msg.responded && (
            <>
              <textarea
                className="w-full mt-2 border p-1 rounded"
                placeholder="Type your reply..."
                value={reply[msg._id] || ""}
                onChange={(e) => setReply(prev => ({ ...prev, [msg._id]: e.target.value }))}
              />
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
                onClick={() => handleReply(msg._id)}
              >
                Send Reply
              </button>
            </>
          )}

          {msg.responded && (
            <p className="text-green-600 mt-2">✅ Replied</p>
          )}
        </div>
      ))}
    </div>
  );
};

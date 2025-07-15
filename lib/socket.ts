// lib/socket.ts
import { io, Socket } from "socket.io-client";

const URL = "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to Socket.IO server:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("🔌 Disconnected from Socket.IO:", reason);
    });
  }

  return socket;
};

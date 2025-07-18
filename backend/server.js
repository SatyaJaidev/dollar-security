
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const analyticsRoutes = require("./routes/analyticsRoutes");
const guardController = require("./controllers/guardController");
const { initAnalytics } = require("./config/analytics");
initAnalytics();

// Route Imports
const clientRoutes = require("./routes/clientRoutes");
const guardRoutes = require("./routes/guards");
const quotationQueries = require("./routes/quotationQueries");
const chatRoutes = require("./routes/chatRoutes");
const uploadRoutes = require('./routes/upload');

dotenv.config();
const app = express();

// Middleware
app.use(cors({origin: "http://localhost:3000"}));
app.use(express.json());

// Connect to MongoDB
connectDB();



// Routes
console.log("✅ Mounting /api/clients");
app.use("/api/clients", clientRoutes);
console.log("✅ Mounting /api/guards");
app.use("/api/guards", guardRoutes);
console.log("✅ Mounting /api/quotation-queries");
app.use("/api/quotation-queries", quotationQueries);
console.log("✅ Mounting /api/chat");
app.use("/api/chat", chatRoutes);
console.log("✅ Mounting /api/analytics");
app.use("/api/analytics", analyticsRoutes);
console.log("✅ Mounting /api/upload");
app.use('/api', uploadRoutes);

app.use("*", (req, res) => {
  console.log("❌ Route not found:", req.originalUrl);
  res.status(404).json({ error: "Route not found" });
});


// Server + Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("userMessage", (data) => {
    console.log("📨 User message:", data);
    io.emit("adminReceive", data); // Send to all admins
  });

  socket.on("adminReply", (data) => {
    console.log("📤 Admin reply:", data);
    io.emit("userReceive", data); // Send to user
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0',() => {
  console.log(`🚀 Server running on 0.0.0.0 ${PORT}`);
});


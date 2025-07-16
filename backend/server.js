/*
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clientRoutes'); // ✅ add this

dotenv.config(); 
const app = express();

connectDB(); 

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Register the client routes
app.use('/api/clients', clientRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
*/

/*
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const clientRoutes = require("./routes/clientRoutes");
const guardRoutes = require("./routes/guards"); // ✅ NEW LINE
const quotationQueries = require("./routes/quotationQueries"); // ✅ THIS LINE


dotenv.config();
const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/guards", guardRoutes); // ✅ NEW LINE
app.use("/api/quotation-queries", quotationQueries);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
*/


/*
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Route Imports
const clientRoutes = require("./routes/clientRoutes");
const guardRoutes = require("./routes/guards");
const quotationQueries = require("./routes/quotationQueries");
const chatRoutes = require("./routes/chatRoutes"); // ✅ NEW - Chatbot Route

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/clients", clientRoutes);
app.use("/api/guards", guardRoutes);
app.use("/api/quotation-queries", quotationQueries);
app.use("/api/chat", chatRoutes); // ✅ NEW - Chatbot Queries

// Start Server
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ A user connected:", socket.id);

  socket.on("userMessage", (data) => {
    io.emit("adminReceive", data); // Admin listens for this
  });

  socket.on("adminReply", (data) => {
    io.emit("userReceive", data); // User listens for this
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running with Socket.IO on port ${PORT}`);
});

module.exports = { io };
*/



const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const analyticsRoutes = require("./routes/analyticsRoutes");
const guardController = require("./controllers/guardController");

// Route Imports
const clientRoutes = require("./routes/clientRoutes");
const guardRoutes = require("./routes/guards");
const quotationQueries = require("./routes/quotationQueries");
const chatRoutes = require("./routes/chatRoutes");
const uploadRoutes = require('./routes/upload');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();



// Routes
app.use("/api/clients", clientRoutes);
app.use("/api/guards", guardRoutes);
app.use("/api/quotation-queries", quotationQueries);
app.use("/api/chat", chatRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use('/api', uploadRoutes);

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


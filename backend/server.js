require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Server } = require("socket.io");

const userRoutes = require("./routes/userRoutes");
const printRoutes = require("./routes/printRoutes");
const socketService = require("./services/socketService");
const cronService = require("./services/cronService");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);

// ROOT ROUTE
app.get("/", (req, res) => {
  res.send("QueueLessPrint API running 🚀");
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://queue-less-print-plwk.vercel.app"
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// ✅ Initialize socket service
socketService.initializeSocket(io);

// ✅ Expose io instance to controllers
app.set("io", io);

// ✅ Enhanced Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  // Optional: Join a room for broadcast filtering
  socket.on("user:join", (data) => {
    const userId = data.userId;
    socket.join(`user:${userId}`);
    console.log(`User ${userId} joined socket room`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// ✅ Helper function to get IO instance (for socket service)
app.getIO = function() {
  return io;
};

app.use("/api/users", userRoutes);
app.use("/api/print", printRoutes);

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/queuelessprint";

const createAdmin = async () => {
  try {
    const adminEmail = "admin@print.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });
      console.log("Admin account created");
    } else {
      console.log("Admin already exists");
    }

    // Create demo student account
    const studentEmail = "student@print.com";
    const existingStudent = await User.findOne({ email: studentEmail });

    if (!existingStudent) {
      const hashedPassword = await bcrypt.hash("student123", 10);
      await User.create({
        name: "Student User",
        email: studentEmail,
        password: hashedPassword,
        role: "student"
      });
      console.log("Demo student account created");
    }
  } catch (error) {
    console.error("Error creating demo accounts:", error);
  }
};

mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    createAdmin();
    
    // ✅ Initialize cron jobs after database connection
    cronService.initializeCrons();
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));


const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  cronService.stopAllCrons();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  cronService.stopAllCrons();
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
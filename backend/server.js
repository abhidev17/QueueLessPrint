require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { Server } = require("socket.io");
app.get("/", (req, res) => {
  res.send("QueueLessPrint Backend Running 🚀");
});
const userRoutes = require("./routes/userRoutes");
const printRoutes = require("./routes/printRoutes");
const User = require("./models/User");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST", "PUT"]
  }
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json());

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

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    createAdmin();
  })
  .catch(err => console.log("MongoDB connection error:", err));


const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const userRoutes = require("./routes/userRoutes");
const printRoutes = require("./routes/printRoutes");
const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/print", printRoutes);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/queuelessprint";
const PORT = process.env.PORT || 5000;

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
  .catch(err => console.error("MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
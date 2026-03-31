const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const socketService = require("../services/socketService");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Force student role if not admin@gmail.com, and prevent creating other admins
    let userRole = "student";
    if (email === "admin@gmail.com") {
      userRole = "admin";
    } else if (role === "admin") {
      return res.status(403).json({ message: "Admin role cannot be assigned" });
    } else if (role && ["student", "staff"].includes(role)) {
      userRole = role;
    }
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Registration successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`Login attempt failed: User not found for email ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log(`Login attempt failed: Invalid password for email ${email}`);
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    console.log(`User ${email} logged in successfully`);

    res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Protect superadmin
    if (user.email === "admin@gmail.com" || user.role === "superadmin") {
      return res.status(403).json({ message: "Cannot delete super admin account" });
    }

    // Prevent deleting yourself
    if (req.user.userId === id) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    // ✅ Delete user (this triggers mongoose pre-hook cascade delete for jobs)
    console.log(`🔥 Deleting user: ${id} (${user.email})`);
    await User.findByIdAndDelete(id);
    console.log(`✅ User deleted successfully. Pre-hook cascade delete triggered for related jobs.`);

    res.json({ message: "User deleted successfully", user });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update user role (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Protect superadmin
    if (user.email === "admin@gmail.com" || user.role === "superadmin") {
      return res.status(403).json({ message: "Cannot modify super admin account" });
    }

    // Only allow student or staff roles (no admin assignments)
    if (!role || !["student", "staff"].includes(role)) {
      return res.status(403).json({ message: "Only student or staff roles allowed" });
    }

    // Prevent changing your own role
    if (req.user.userId === id) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    res.json({ message: "User role updated successfully", user: updated });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: error.message });
  }
};
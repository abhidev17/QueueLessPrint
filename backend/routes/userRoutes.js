const express = require("express");
const router = express.Router();

const { loginUser, registerUser, getAllUsers, deleteUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");

router.post("/login", loginUser);
router.post("/register", registerUser);

// Admin routes
router.get("/", authMiddleware, isAdmin, getAllUsers);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
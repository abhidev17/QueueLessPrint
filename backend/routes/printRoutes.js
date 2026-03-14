const express = require("express");
const router = express.Router();

const { createPrintJob, getAllPrintJobs, updatePrintStatus, getSlots, getUserPrintJobs } =
require("../controllers/printController");

const upload = require("../config/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", authMiddleware, upload.single("document"), createPrintJob);

router.get("/all", authMiddleware, getAllPrintJobs);

router.get("/user-jobs", authMiddleware, getUserPrintJobs);

router.put("/status/:id", authMiddleware, updatePrintStatus);

router.get("/slots", getSlots);

module.exports = router;
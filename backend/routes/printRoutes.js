const express = require("express");
const router = express.Router();

const { createPrintJob, getAllPrintJobs, updatePrintStatus, getSlots, getUserPrintJobs, deletePrintJob } =
require("../controllers/printController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin, isStaff } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");

router.post("/create", authMiddleware, upload.single("document"), createPrintJob);

// Staff can view all jobs, admin can manage them
router.get("/all", authMiddleware, isStaff, getAllPrintJobs);

router.get("/user-jobs", authMiddleware, getUserPrintJobs);

// Staff can update job status
router.put("/:id", authMiddleware, isStaff, updatePrintStatus);
router.put("/status/:id", authMiddleware, isStaff, updatePrintStatus);

router.delete("/:id", authMiddleware, isAdmin, deletePrintJob);

router.get("/slots", getSlots);

module.exports = router;
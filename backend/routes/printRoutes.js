const express = require("express");
const router = express.Router();

const { createPrintJob, getAllPrintJobs, updatePrintStatus, getSlots, getUserPrintJobs, deletePrintJob } =
require("../controllers/printController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/authMiddleware");
const upload = require("../config/multerConfig");

router.post("/create", authMiddleware, upload.single("document"), createPrintJob);

router.get("/all", authMiddleware, isAdmin, getAllPrintJobs);

router.get("/user-jobs", authMiddleware, getUserPrintJobs);

router.put("/status/:id", authMiddleware, updatePrintStatus);

router.delete("/:id", authMiddleware, isAdmin, deletePrintJob);

router.get("/slots", getSlots);

module.exports = router;
const PrintJob = require("../models/PrintJob");
const socketService = require("../services/socketService");

exports.createPrintJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const { copies, pageSize, color, printDate, slotTime, priority } = req.body;
    const userId = req.user?.userId; // Get from authenticated user

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (!copies || !pageSize || !printDate || !slotTime) {
      return res.status(400).json({ error: "Missing required fields: copies, pageSize, printDate, slotTime" });
    }

    // Check slot availability
    const slotCount = await PrintJob.countDocuments({
      slotTime: slotTime,
      printDate: printDate,
      status: { $ne: "Completed" }
    });

    if (slotCount >= 3) {
      return res.status(400).json({ error: "Slot is full" });
    }

    const fileName = req.file.filename;

    const job = new PrintJob({
      userId,
      fileName,
      copies: parseInt(copies),
      pageSize,
      color: color === 'true' || color === true,
      printDate,
      slotTime,
      priority: priority && ["low", "normal", "high"].includes(priority) ? priority : "normal"
    });

    await job.save();

    // ✅ Emit real-time event using socket service
    socketService.emitJobCreated(job);

    res.json({
      message: "Print job created successfully",
      job
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPrintJobs = async (req, res) => {
  try {
    const jobs = await PrintJob.find().populate("userId").sort({ 
      // Sort by priority first (high -> normal -> low), then by creation date
      priority: 1,  // low (1) < normal (2) < high (3) - need to reverse in code
      createdAt: -1 
    });
    
    // Manually sort by priority with custom order (high > normal > low)
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    const sortedJobs = jobs.sort((a, b) => {
      const priorityDiff = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    res.json(sortedJobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserPrintJobs = async (req, res) => {
  try {
    const userId = req.user.userId;
    const jobs = await PrintJob.find({ userId }).populate("userId").sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.updatePrintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const job = await PrintJob.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("userId");

    if (!job) {
      return res.status(404).json({ message: "Print job not found" });
    }

    // ✅ Emit job update using socket service
    socketService.emitJobUpdated(job);
    
    // Emit completion notification to the user when job is completed
    const io = socketService.getIO();
    if (io && status === "completed" && job.userId) {
      io.emit("jobCompleted", {
        userId: job.userId._id,
        userName: job.userId.name,
        fileName: job.fileName,
        message: `Your print job "${job.fileName}" is ready for pickup!`
      });
    }

    res.json({
      message: "Status updated successfully",
      job
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSlots = async (req, res) => {
  try {
    const { printDate } = req.query;

    if (!printDate) {
      return res.status(400).json({ error: "printDate query parameter is required" });
    }

    const slots = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];
    const result = [];

    for (let slot of slots) {
      const count = await PrintJob.countDocuments({
        slotTime: slot,
        printDate: printDate,
        status: { $ne: "Completed" }
      });

      result.push({
        slot,
        available: Math.max(0, 3 - count),
        total: 3,
        booked: count
      });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a print job (admin only)
exports.deletePrintJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Print job ID is required" });
    }

    const job = await PrintJob.findByIdAndDelete(id);

    if (!job) {
      return res.status(404).json({ message: "Print job not found" });
    }

    // ✅ Emit job deleted event using socket service
    socketService.emitJobDeleted(id);

    res.json({ message: "Print job deleted successfully", job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
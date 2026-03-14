const PrintJob = require("../models/PrintJob");

exports.createPrintJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const { copies, pageSize, color, printDate, slotTime } = req.body;
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
      slotTime
    });

    await job.save();

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
    const jobs = await PrintJob.find().populate("userId").sort({ createdAt: -1 });
    res.json(jobs);
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
const PrintJob = require("../models/PrintJob");
exports.getAllPrintJobs = async (req, res) => {
  try {

    const jobs = await PrintJob.find()
      .populate("userId", "name email")
      .sort({ printDate: 1, slotTime: 1 });

    res.json(jobs);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPrintJob = async (req, res) => {
  try {

    const { userId, copies, pageSize, color, printDate, slotTime } = req.body;

    const MAX_SLOT = 3;

    const existingJobs = await PrintJob.countDocuments({
      printDate,
      slotTime
    });

    if (existingJobs >= MAX_SLOT) {
      return res.status(400).json({
        message: "Slot is full. Please choose another time."
      });
    }

    const newJob = new PrintJob({
      userId,
      fileName: req.file.filename,
      copies,
      pageSize,
      color,
      printDate,
      slotTime
    });

    await newJob.save();

    res.json({
      message: "Print job created successfully",
      job: newJob
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getSlotAvailability = async (req, res) => {
  try {

    const MAX_SLOT = 3;

    const { printDate } = req.query;

    const slots = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"];

    const result = [];

    for (let slot of slots) {

      const booked = await PrintJob.countDocuments({
        printDate,
        slotTime: slot
      });

      result.push({
        slot,
        available: MAX_SLOT - booked
      });

    }

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updatePrintStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const job = await PrintJob.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        message: "Print job not found"
      });
    }

    res.json({
      message: "Status updated successfully",
      job
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
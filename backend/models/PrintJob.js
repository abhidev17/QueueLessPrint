const mongoose = require("mongoose");

const printJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  fileName: String,
  copies: Number,
  pageSize: String,
  color: Boolean,
  printDate: String,
  slotTime: String,
  status: {
    type: String,
    enum: ["pending", "printing", "completed"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("PrintJob", printJobSchema);
// services/socketService.js
// 🚀 Socket.IO event emission service - keeps socket logic centralized

let io = null;

const initializeSocket = (ioInstance) => {
  io = ioInstance;
};

const getIO = () => io;

// ✅ Emit job_created event
const emitJobCreated = (job) => {
  if (!io) return;
  
  io.emit("job_created", {
    _id: job._id,
    userId: job.userId,
    fileName: job.fileName,
    copies: job.copies,
    pageSize: job.pageSize,
    color: job.color,
    status: job.status,
    priority: job.priority,
    printDate: job.printDate,
    slotTime: job.slotTime,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  });
  
  console.log("📡 Emitted: job_created", job._id);
};

// ✅ Emit job_updated event
const emitJobUpdated = (job) => {
  if (!io) return;
  
  io.emit("job_updated", {
    _id: job._id,
    userId: job.userId,
    fileName: job.fileName,
    status: job.status,
    priority: job.priority,
    printDate: job.printDate,
    slotTime: job.slotTime,
    copies: job.copies,
    pageSize: job.pageSize,
    color: job.color,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt
  });
  
  console.log("📡 Emitted: job_updated", job._id);
};

// ✅ Emit job_deleted event
const emitJobDeleted = (jobId) => {
  if (!io) return;
  
  io.emit("job_deleted", { jobId });
  
  console.log("📡 Emitted: job_deleted", jobId);
};

// ✅ Emit jobs_bulk_deleted (when user deleted, multiple jobs removed)
const emitJobsBulkDeleted = (jobIds) => {
  if (!io) return;
  
  io.emit("jobs_bulk_deleted", { jobIds });
  
  console.log("📡 Emitted: jobs_bulk_deleted, count:", jobIds.length);
};

module.exports = {
  initializeSocket,
  getIO,
  emitJobCreated,
  emitJobUpdated,
  emitJobDeleted,
  emitJobsBulkDeleted
};

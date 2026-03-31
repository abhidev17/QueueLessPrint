// services/cronService.js
// 🔄 Cron jobs for automatic cleanup and scheduled tasks

const cron = require("node-cron");
const PrintJob = require("../models/PrintJob");
const socketService = require("./socketService");

let cronJobs = [];

// ✅ Initialize cron jobs
const initializeCrons = () => {
  // Delete completed/failed jobs after 24 hours
  startAutoDeleteOldJobs();
  
  console.log("✅ All cron jobs initialized");
};

// ✅ Auto-delete completed/failed jobs after 24 hours
const startAutoDeleteOldJobs = () => {
  // Runs every hour
  const job = cron.schedule("0 * * * *", async () => {
    try {
      console.log("🔄 Running cron: Auto-delete old jobs...");
      
      // Calculate timestamp for 24 hours ago
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      // Find jobs to delete
      const jobsToDelete = await PrintJob.find({
        status: { $in: ["completed", "failed"] },
        updatedAt: { $lt: oneDayAgo }
      });
      
      if (jobsToDelete.length > 0) {
        const deletedJobIds = jobsToDelete.map(job => job._id);
        
        // Delete from database
        await PrintJob.deleteMany({
          status: { $in: ["completed", "failed"] },
          updatedAt: { $lt: oneDayAgo }
        });
        
        // Emit events to remove from all connected clients
        socketService.emitJobsBulkDeleted(deletedJobIds);
        
        console.log(`✅ Auto-deleted ${jobsToDelete.length} old jobs`);
      } else {
        console.log("ℹ No old jobs to delete");
      }
    } catch (error) {
      console.error("❌ Cron job error:", error);
    }
  });
  
  cronJobs.push(job);
};

// ✅ Stop all cron jobs (cleanup on server shutdown)
const stopAllCrons = () => {
  cronJobs.forEach(job => {
    if (job) {
      job.stop();
      job.destroy();
    }
  });
  
  cronJobs = [];
  console.log("✅ All cron jobs stopped");
};

module.exports = {
  initializeCrons,
  stopAllCrons,
  startAutoDeleteOldJobs
};

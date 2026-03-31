const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["superadmin", "admin", "staff", "student"],
        default: "student"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// ✅ CASCADING DELETE MIDDLEWARE
// When a user is deleted via findByIdAndDelete(), this pre-hook:
// 1. Finds all jobs for that user
// 2. Deletes all those jobs from database
// 3. Emits Socket.IO events to update all connected clients in real-time
// 4. Prevents "Unknown" users from appearing on staff dashboard
// This ensures referential integrity: No orphaned jobs in database
UserSchema.pre("findByIdAndDelete", async function(next) {
    try {
        const PrintJob = mongoose.model("PrintJob");
        const socketService = require("../services/socketService");
        
        const userId = this.getQuery()._id;
        
        // 🔍 Find all print jobs associated with this user
        const deletedJobs = await PrintJob.find({ userId });
        const deletedJobIds = deletedJobs.map(job => job._id);
        
        // 🗑️ Delete all jobs from database
        await PrintJob.deleteMany({ userId });
        
        // 📡 Emit bulk delete events for all deleted jobs (real-time UI update)
        if (deletedJobIds.length > 0) {
            socketService.emitJobsBulkDeleted(deletedJobIds);
            console.log(`✅ Cascaded delete: Deleted ${deletedJobIds.length} jobs for user ${userId}`);
        }
    } catch (error) {
        console.error("❌ Error in cascading delete:", error);
        // Don't stop the deletion process if socket emission fails
    }
    
    next();
});

module.exports = mongoose.model("User", UserSchema);
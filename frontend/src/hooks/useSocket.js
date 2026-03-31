import { useEffect } from "react";
import socket from "../socket";

/**
 * Custom hook for Socket.IO event listeners
 * Handles real-time job updates from backend
 * 
 * Events:
 * - job_created: New job submitted
 * - job_updated: Job status changed
 * - job_deleted: Single job deleted
 * - jobs_bulk_deleted: Multiple jobs deleted (cascade/cron cleanup)
 */

export const useSocket = (onJobCreated, onJobUpdated, onJobDeleted, onJobsBulkDeleted) => {
  useEffect(() => {
    if (!socket || !socket.on) return;

    // Register event listeners
    if (onJobCreated) socket.on("job_created", onJobCreated);
    if (onJobUpdated) socket.on("job_updated", onJobUpdated);
    if (onJobDeleted) socket.on("job_deleted", onJobDeleted);
    if (onJobsBulkDeleted) socket.on("jobs_bulk_deleted", onJobsBulkDeleted);

    // Cleanup on unmount
    return () => {
      if (onJobCreated) socket.off("job_created", onJobCreated);
      if (onJobUpdated) socket.off("job_updated", onJobUpdated);
      if (onJobDeleted) socket.off("job_deleted", onJobDeleted);
      if (onJobsBulkDeleted) socket.off("jobs_bulk_deleted", onJobsBulkDeleted);
    };
  }, [onJobCreated, onJobUpdated, onJobDeleted, onJobsBulkDeleted]);
};

export default useSocket;

import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Create socket with error handling
let socket = null;
let connectionAttempt = 0;
const MAX_ATTEMPTS = 3;

try {
  socket = io(API_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: MAX_ATTEMPTS,
    withCredentials: false,
    forceNew: false
  });

  // Error handling
  socket.on("connect_error", (error) => {
    console.warn("Socket connection error:", error.message);
    console.log("Socket will retry. Dashboard features may be limited.");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error) => {
    console.warn("Socket error:", error);
  });
} catch (err) {
  console.warn("Socket initialization error:", err.message);
  console.log("Creating mock socket to prevent app crash");

  // Create mock socket if connection fails
  socket = {
    on: () => {},
    off: () => {},
    emit: () => {},
    disconnect: () => {},
    connected: false
  };
}

export default socket;

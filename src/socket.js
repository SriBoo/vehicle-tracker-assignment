// src/socket.js
import { io } from "socket.io-client";

// connect to your backend (adjust if running on a different host/port)
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log(" Connected to backend via Socket.IO:", socket.id);
});

socket.on("disconnect", () => {
  console.log(" Disconnected from backend");
});

export default socket;

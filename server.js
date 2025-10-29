// server.js
// Node + Express + Socket.IO (ESM)
// Put this at project root (same level as package.json)

import express from "express";
import http from "http";
import { Server as IOServer } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: "*", // allow any origin (for dev). Lock down in production.
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;
const HISTORY_LIMIT = 30;

const state = {
  currentPositions: {
    car: [17.3850, 78.4867],
    truck: [17.4200, 78.4800],
    bus: [17.3700, 78.4800],
  },
  history: {
    car: [],
    truck: [],
    bus: [],
  },
};

function randomOffset() {
  // tune amplitude
  return (Math.random() - 0.5) * 0.005;
}

function tickVehiclesAndEmit() {
  const nowISO = new Date().toISOString();
  Object.keys(state.currentPositions).forEach((k) => {
    const p = state.currentPositions[k];
    p[0] = parseFloat((p[0] + randomOffset()).toFixed(6));
    p[1] = parseFloat((p[1] + randomOffset()).toFixed(6));

    const entry = {
      time: nowISO,
      coords: [p[0], p[1]],
      speed: Math.floor(Math.random() * (90 - 30 + 1)) + 30,
    };

    state.history[k].push(entry);
    if (state.history[k].length > HISTORY_LIMIT) state.history[k].shift();
  });

  // Emit to all connected clients
  const payloadVehicles = {
    timestamp: new Date().toLocaleString(),
    data: state.currentPositions,
  };
  const payloadHistory = {
    timestamp: new Date().toLocaleString(),
    history: state.history,
  };

  io.emit("vehicles", payloadVehicles);
  io.emit("history", payloadHistory);
}

// start ticking
const TICK_MS = 2500; // frequency of updates
setInterval(tickVehiclesAndEmit, TICK_MS);

// initial ticks so frontend sees some history immediately
for (let i = 0; i < 4; i++) tickVehiclesAndEmit();

// HTTP endpoints for backward compatibility / debugging
app.get("/api/vehicles", (req, res) => {
  res.json({ timestamp: new Date().toLocaleString(), data: state.currentPositions });
});

app.get("/api/history", (req, res) => {
  res.json({ timestamp: new Date().toLocaleString(), history: state.history });
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // send current state right away
  socket.emit("vehicles", { timestamp: new Date().toLocaleString(), data: state.currentPositions });
  socket.emit("history", { timestamp: new Date().toLocaleString(), history: state.history });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(` Socket.IO server running on http://localhost:${PORT}`);
});

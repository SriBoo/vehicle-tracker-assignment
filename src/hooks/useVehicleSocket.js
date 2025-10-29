// src/hooks/useVehicleSocket.js
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // backend URL

export default function useVehicleSocket() {
  const [vehicleData, setVehicleData] = useState({
    latitude: 17.3850,
    longitude: 78.4867,
    speed: 0,
    timestamp: "",
  });

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("vehicles", (payload) => {
      // Just take "car" data from backend
      const carCoords = payload.data.car;
      setVehicleData({
        latitude: carCoords[0],
        longitude: carCoords[1],
        speed: Math.floor(Math.random() * 50) + 30, // simulated speed for UI
        timestamp: payload.timestamp,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return vehicleData;
}

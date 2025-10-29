// src/components/SocketTest.js
import React, { useEffect } from "react";
import socket from "../socket";

const SocketTest = () => {
  useEffect(() => {
    socket.on("vehicles", (data) => {
      console.log("🚗 Live vehicle update:", data);
    });

    socket.on("history", (data) => {
      console.log("📜 History data:", data);
    });

    return () => {
      socket.off("vehicles");
      socket.off("history");
    };
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Socket.IO Connection Test</h2>
      <p>Open your browser console to see live data updates every few seconds.</p>
    </div>
  );
};

export default SocketTest;

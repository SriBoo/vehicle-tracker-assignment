import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { io } from "socket.io-client";

const SpeedChart = () => {
  const [speedData, setSpeedData] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000", { transports: ["websocket"] });

    socket.on("history", (payload) => {
      if (!payload?.history) return;
      const { history } = payload;

      const maxPoints = 10; // last 10 data points only
      const car = history.car.slice(-maxPoints);
      const truck = history.truck.slice(-maxPoints);
      const bus = history.bus.slice(-maxPoints);

      const newData = car.map((_, i) => ({
        time: new Date(car[i]?.time).toLocaleTimeString("en-IN", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        car: car[i]?.speed || 0,
        truck: truck[i]?.speed || 0,
        bus: bus[i]?.speed || 0,
      }));

      setSpeedData(newData);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md mt-6 w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        🚦 Vehicle Speed Trend (Last 10 Points)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={speedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis unit=" km/h" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="car"
            stroke="#FF0000"
            activeDot={{ r: 8 }}
            name="Car"
          />
          <Line
            type="monotone"
            dataKey="truck"
            stroke="#008000"
            name="Truck"
          />
          <Line
            type="monotone"
            dataKey="bus"
            stroke="#0000FF"
            name="Bus"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpeedChart;

import React from "react";

const VehicleInsights = ({ historyData }) => {
  if (!historyData) return null;

  const vehicles = ["car", "truck", "bus"];

  const calculateStats = (vehicle) => {
    const data = historyData[vehicle] || [];
    if (data.length === 0) return { avg: 0, min: 0, max: 0, totalDistance: 0 };

    const speeds = data.map((d) => d.speed);
    const avg = (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(1);
    const min = Math.min(...speeds).toFixed(1);
    const max = Math.max(...speeds).toFixed(1);

    // Approximate total distance (speed in km/h, assuming 1 sec interval)
    const totalDistance = (speeds.reduce((a, b) => a + b / 3600, 0)).toFixed(2);

    return { avg, min, max, totalDistance };
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 mt-4">
      <h2 className="text-lg font-semibold mb-3 text-center">📊 Vehicle Insights Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {vehicles.map((v) => {
          const { avg, min, max, totalDistance } = calculateStats(v);
          return (
            <div key={v} className="border rounded-xl p-3 hover:shadow-md transition-all">
              <h3 className="text-blue-600 font-semibold uppercase">{v}</h3>
              <p>Avg Speed: <span className="font-medium">{avg} km/h</span></p>
              <p>Min Speed: <span className="font-medium">{min} km/h</span></p>
              <p>Max Speed: <span className="font-medium">{max} km/h</span></p>
              <p>Total Distance: <span className="font-medium">{totalDistance} km</span></p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VehicleInsights;

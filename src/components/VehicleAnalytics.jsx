import React, { useMemo } from "react";

const VehicleAnalytics = ({ history }) => {
  const analytics = useMemo(() => {
    const data = {};
    Object.keys(history).forEach((key) => {
      const entries = history[key];
      if (!entries.length) return;

      const avgSpeed =
        entries.reduce((sum, e) => sum + (e.speed || 0), 0) / entries.length;
      const totalDist = entries.reduce((dist, e, i, arr) => {
        if (i === 0) return dist;
        const [lat1, lon1] = arr[i - 1].coords;
        const [lat2, lon2] = e.coords;
        const R = 6371; // Earth radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return dist + R * c;
      }, 0);

      data[key] = {
        avgSpeed: avgSpeed.toFixed(1),
        distance: totalDist.toFixed(2),
        lastUpdate: entries.at(-1)?.time,
      };
    });
    return data;
  }, [history]);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Analytics</h2>
      {Object.keys(analytics).map((key) => (
        <div key={key} className="border-b pb-2 mb-2">
          <div className="font-semibold capitalize text-blue-600">{key}</div>
          <p className="text-sm">
            <strong>Avg Speed:</strong> {analytics[key].avgSpeed} km/h <br />
            <strong>Distance:</strong> {analytics[key].distance} km <br />
            <strong>Last Update:</strong>{" "}
            {new Date(analytics[key].lastUpdate).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default VehicleAnalytics;

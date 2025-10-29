import React, { useEffect, useState, useMemo } from "react";
import {
MapContainer,
TileLayer,
Marker,
Polyline,
Popup,
useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { io } from "socket.io-client";

/* --- Custom Icons --- */
const carIcon = new L.Icon({
iconUrl: "[https://cdn-icons-png.flaticon.com/512/743/743922.png](https://cdn-icons-png.flaticon.com/512/743/743922.png)",
iconSize: [36, 36],
iconAnchor: [18, 36],
});

const truckIcon = new L.Icon({
iconUrl: "[https://cdn-icons-png.flaticon.com/512/1995/1995503.png](https://cdn-icons-png.flaticon.com/512/1995/1995503.png)",
iconSize: [40, 40],
iconAnchor: [20, 40],
});

const busIcon = new L.Icon({
iconUrl: "[https://cdn-icons-png.flaticon.com/512/61/61168.png](https://cdn-icons-png.flaticon.com/512/61/61168.png)",
iconSize: [36, 36],
iconAnchor: [18, 36],
});

const icons = { car: carIcon, truck: truckIcon, bus: busIcon };

/* --- Smooth Movement Hook --- */
const useAnimatedVehicle = (vehicles, delay = 2500) => {
const [animated, setAnimated] = useState(vehicles);

useEffect(() => {
const interval = setInterval(() => {
setAnimated((prev) => {
const updated = {};
Object.keys(vehicles).forEach((k) => {
const [lat, lng] = vehicles[k];
const [prevLat, prevLng] = prev[k] || vehicles[k];
const smoothLat = prevLat + (lat - prevLat) * 0.3;
const smoothLng = prevLng + (lng - prevLng) * 0.3;
updated[k] = [smoothLat, smoothLng];
});
return updated;
});
}, delay / 5);
return () => clearInterval(interval);
}, [vehicles, delay]);

return animated;
};

/* --- Map Auto-Fit --- */
const AutoFitMap = ({ vehicles }) => {
const map = useMap();

useEffect(() => {
const coords = Object.values(vehicles);
if (coords.length > 0) {
const bounds = L.latLngBounds(coords);
map.fitBounds(bounds, { padding: [40, 40] });
}
}, [vehicles, map]);

return null;
};

/* --- Main Component --- */
const MultiVehicleMap = () => {
const [vehicles, setVehicles] = useState({});
const [history, setHistory] = useState({ car: [], truck: [], bus: [] });
const [lastUpdate, setLastUpdate] = useState(null);
const [showTrails, setShowTrails] = useState(true);

/* --- Socket Connection --- */
useEffect(() => {
const socket = io("[http://localhost:5000](http://localhost:5000)", { transports: ["websocket"] });

socket.on("vehicles", (payload) => {
  setVehicles(payload.data || {});
  setLastUpdate(payload.timestamp);
});

socket.on("history", (payload) => {
  setHistory(payload.history || {});
});

return () => socket.disconnect();


}, []);

/* --- Animated Marker Movement --- */
const smoothVehicles = useAnimatedVehicle(vehicles, 2500);

/* --- Center Calculation --- */
const coordsList = Object.values(vehicles);
const center = coordsList.length
? coordsList
.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0])
.map((v) => v / coordsList.length)
: [17.385, 78.4867];

/* --- Analytics Calculation --- */
const analytics = useMemo(() => {
const result = {};
Object.keys(history).forEach((key) => {
const entries = history[key];
if (!entries.length) return;


  const avgSpeed =
    entries.reduce((sum, e) => sum + (e.speed || 0), 0) / entries.length;

  const totalDist = entries.reduce((dist, e, i, arr) => {
    if (i === 0) return dist;
    const [lat1, lon1] = arr[i - 1].coords;
    const [lat2, lon2] = e.coords;
    const R = 6371;
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

  result[key] = {
    avgSpeed: avgSpeed.toFixed(1),
    distance: totalDist.toFixed(2),
    lastUpdate: entries.at(-1)?.time,
  };
});
return result;


}, [history]);

return ( <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6"> <h1 className="text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
Multi-Vehicle Live Tracker 🚗🚛🚌 </h1>


  <div className="flex flex-col md:flex-row gap-6">
    {/* --- Map Section --- */}
    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-300">
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
        <div className="text-sm text-gray-700">
          Last Update: <strong>{lastUpdate || "—"}</strong>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Show Trails</label>
          <input
            type="checkbox"
            checked={showTrails}
            onChange={(e) => setShowTrails(e.target.checked)}
          />
        </div>
      </div>

      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        style={{ height: "500px", width: "700px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        <AutoFitMap vehicles={vehicles} />

        {/* --- Trails --- */}
        {showTrails &&
          Object.keys(history).map((key) => {
            const pts = history[key]?.map((p) => p.coords);
            if (!pts?.length) return null;
            const color =
              key === "car" ? "red" : key === "truck" ? "green" : "blue";
            return (
              <Polyline
                key={`trail-${key}`}
                positions={pts}
                color={color}
                weight={4}
                opacity={0.8}
              />
            );
          })}

        {/* --- Vehicle Markers --- */}
        {Object.keys(smoothVehicles).map((key) => {
          const pos = smoothVehicles[key];
          if (!pos) return null;
          return (
            <Marker key={key} position={pos} icon={icons[key]}>
              <Popup>
                <div style={{ minWidth: 140 }}>
                  <strong>{key.toUpperCase()}</strong>
                  <div>Lat: {pos[0].toFixed(6)}</div>
                  <div>Lng: {pos[1].toFixed(6)}</div>
                  <div>Trail pts: {(history[key] || []).length}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>

    {/* --- Info + Analytics --- */}
    <div className="flex flex-col gap-6">
      {/* Vehicle Status */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Vehicle Status
        </h2>
        {Object.keys(vehicles).map((key) => (
          <div key={key} className="border-b pb-2 mb-2">
            <div className="font-semibold capitalize text-blue-600">
              {key}
            </div>
            <p className="text-sm">
              <strong>Lat:</strong> {vehicles[key][0].toFixed(6)} <br />
              <strong>Lng:</strong> {vehicles[key][1].toFixed(6)} <br />
              <strong>Trail:</strong> {(history[key] || []).length} pts
            </p>
          </div>
        ))}
      </div>

      {/* Analytics */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Analytics
        </h2>
        {Object.keys(analytics).map((key) => (
          <div key={key} className="border-b pb-2 mb-2">
            <div className="font-semibold capitalize text-blue-600">
              {key}
            </div>
            <p className="text-sm">
              <strong>Avg Speed:</strong> {analytics[key].avgSpeed} km/h
              <br />
              <strong>Distance:</strong> {analytics[key].distance} km
              <br />
              <strong>Last Update:</strong>{" "}
              {new Date(analytics[key].lastUpdate).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>


);
};

export default MultiVehicleMap;

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { io } from "socket.io-client";
import SpeedChart from "./components/SpeedChart";
import VehicleInsights from "./components/VehicleInsights";

/* ----------------------------- Custom Icons ----------------------------- */
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1995/1995503.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61168.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const icons = { car: carIcon, truck: truckIcon, bus: busIcon };

/* ----------------------------- Auto Center ----------------------------- */
function AutoCenter({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, map.getZoom(), { animate: true });
  }, [position, map]);
  return null;
}

/* ----------------------------- Main App ----------------------------- */
export default function App() {
  const [vehicles, setVehicles] = useState({});
  const [history, setHistory] = useState({ car: [], truck: [], bus: [] });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showTrails, setShowTrails] = useState(true);

  /* ----------------------------- Socket.io Setup ----------------------------- */
  useEffect(() => {
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => console.log(" Connected:", socket.id));
    socket.on("vehicles", (payload) => {
      if (payload?.data) {
        setVehicles(payload.data);
        setLastUpdate(payload.timestamp);
      }
    });

    socket.on("history", (payload) => {
      if (payload?.history) {
        setHistory(payload.history);
      }
    });

    socket.on("disconnect", () => console.log("⚠️ Disconnected"));
    return () => socket.disconnect();
  }, []);

  /* ----------------------------- Map Center Calculation ----------------------------- */
  const coordsList = Object.values(vehicles);
  const center =
    coordsList.length > 0
      ? coordsList
          .reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0])
          .map((v) => v / coordsList.length)
      : [17.385, 78.4867]; // Default → Hyderabad

  /* ----------------------------- UI Layout ----------------------------- */
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-3xl font-bold text-blue-700">
          Vehicle Tracker Dashboard 🚗 (Real-time)
        </h1>
        <p className="text-sm text-gray-500">
          Last Updated: {lastUpdate || "—"}
        </p>
      </header>

      {/* ----------------------------- Map Section ----------------------------- */}
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <strong>Real-time Map</strong>
          <div className="flex items-center gap-2 text-sm">
            <label>Show Trails</label>
            <input
              type="checkbox"
              checked={showTrails}
              onChange={(e) => setShowTrails(e.target.checked)}
            />
          </div>
        </div>

        <div
          className="rounded-2xl overflow-hidden border border-gray-200"
          style={{ height: 540 }}
        >
          <MapContainer center={center} zoom={12} style={{ height: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap contributors'
            />
            <AutoCenter position={center} />

            {/* Trails */}
            {showTrails &&
              Object.keys(history).map((key) => {
                const pts = history[key]?.map((p) => p.coords) || [];
                if (!pts.length) return null;
                const color =
                  key === "car" ? "red" : key === "truck" ? "green" : "blue";
                return (
                  <Polyline
                    key={`trail-${key}`}
                    positions={pts}
                    color={color}
                    weight={4}
                    opacity={0.85}
                  />
                );
              })}

            {/* Markers */}
            {Object.keys(vehicles).map((key) => {
              const pos = vehicles[key];
              if (!pos) return null;
              return (
                <Marker key={key} position={pos} icon={icons[key]}>
                  <Popup>
                    <div style={{ minWidth: 140 }}>
                      <strong>{key.toUpperCase()}</strong>
                      <div>Lat: {pos[0].toFixed(6)}</div>
                      <div>Lng: {pos[1].toFixed(6)}</div>
                      <div>
                        Trail Points: {(history[key] || []).length}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* ----------------------------- Info Panels ----------------------------- */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Live Vehicle Status */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h2 className="font-semibold text-lg">Live Vehicle Status</h2>
          <div className="space-y-3 mt-3">
            {Object.keys(vehicles).length === 0 && (
              <p className="text-sm text-gray-500">No vehicle data yet</p>
            )}
            {Object.keys(vehicles).map((key) => (
              <div key={key} className="border-b pb-2">
                <div className="font-medium text-blue-700">
                  {key.toUpperCase()}
                </div>
                <div className="text-sm">
                  Coordinate: {vehicles[key][0].toFixed(6)},{" "}
                  {vehicles[key][1].toFixed(6)}
                </div>
                <div className="text-sm">
                  Trail Points: {(history[key] || []).length}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History Snapshot */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <h2 className="font-semibold text-lg">Vehicle History Snapshot</h2>
          <div className="text-sm text-gray-600 mt-2 space-y-2">
            {Object.keys(history).map((key) => (
              <div key={key} className="border-b pb-2">
                <div className="font-medium capitalize">{key}</div>
                <div className="text-xs">
                  Points: {history[key]?.length || 0}
                </div>
                {history[key]?.length > 0 && (
                  <div className="text-xs">
                    Last: {history[key][history[key].length - 1].coords.join(
                      ", "
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <VehicleInsights historyData={history} />
      </div>

      {/* Speed Chart */}
      <div className="w-full max-w-6xl mt-6">
        <SpeedChart historyData={history} />
      </div>
    </div>
  );
}

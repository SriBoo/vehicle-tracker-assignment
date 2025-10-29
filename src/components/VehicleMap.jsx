import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useVehicleSocket from "../hooks/useVehicleSocket"; //  live data hook

const VehicleMap = () => {
  const { latitude, longitude, speed, timestamp } = useVehicleSocket();
  const position = [latitude, longitude];

  const vehicleIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
    iconSize: [45, 45],
    iconAnchor: [22, 45],
    popupAnchor: [0, -45],
  });

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-4 flex items-center gap-2">
        Vehicle Tracker Dashboard <span>🚗</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-300">
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "500px", width: "700px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={vehicleIcon}>
              <Popup>
                <div>
                  <strong>Vehicle Location</strong>
                  <br />
                  Speed: {speed} km/h
                  <br />
                  Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 w-80">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Vehicle Status
          </h2>
          <p>
            <strong>Coordinate:</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
          <p>
            <strong>Speed:</strong> {speed} km/h
          </p>
          <p>
            <strong>Timestamp:</strong> {timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleMap;

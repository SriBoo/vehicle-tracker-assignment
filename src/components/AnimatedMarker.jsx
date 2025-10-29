// src/components/AnimatedMarker.jsx
import React, { useEffect, useRef } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

export default function AnimatedMarker({ position, icon, duration = 1500 }) {
  const markerRef = useRef(null);
  const rafRef = useRef(null);
  const map = useMap();

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || !position) return;
    const startLatLng = marker.getLatLng ? marker.getLatLng() : null;
    const endLatLng = L.latLng(position[0], position[1]);

    if (!startLatLng || (startLatLng.lat === 0 && startLatLng.lng === 0)) {
      marker.setLatLng(endLatLng);
      return;
    }

    if (startLatLng.equals(endLatLng)) return;

    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const lat = startLatLng.lat + (endLatLng.lat - startLatLng.lat) * t;
      const lng = startLatLng.lng + (endLatLng.lng - startLatLng.lng) * t;
      marker.setLatLng([lat, lng]);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        marker.setLatLng(endLatLng);
      }
    };

    rafRef.current = requestAnimationFrame(animate);


    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [position, duration, map]);

  return <Marker ref={markerRef} position={position} icon={icon} />;
}

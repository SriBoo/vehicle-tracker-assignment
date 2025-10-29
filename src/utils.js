// src/utils.js
export function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateSpeedKmH(prevPoint, currPoint) {
  if (!prevPoint || !currPoint) return 0;
  const distanceKm = haversineKm(prevPoint.lat, prevPoint.lng, currPoint.lat, currPoint.lng);
  const t1 = new Date(prevPoint.timestamp).getTime();
  const t2 = new Date(currPoint.timestamp).getTime();
  const hours = (t2 - t1) / (1000 * 60 * 60);
  if (hours <= 0) return 0;
  return distanceKm / hours;
}

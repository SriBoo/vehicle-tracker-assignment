const VehicleInfo = ({ data }) => {
  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-full md:w-1/3">
      <h2 className="text-2xl font-semibold mb-3 text-gray-700">Vehicle Status</h2>
      <p><span className="font-semibold">Coordinate:</span> {data.lat}, {data.lng}</p>
      <p><span className="font-semibold">Speed:</span> {data.speed} km/h</p>
      <p><span className="font-semibold">Timestamp:</span> {data.timestamp}</p>
    </div>
  );
};

export default VehicleInfo;

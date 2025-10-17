import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Search } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FlyToDistrict({ coords }) {
  const map = useMap();
  if (coords) {
    map.flyTo(coords, 13, { duration: 1.5 });
  }
  return null;
}

const BangladeshMap = ({ serviceCenter }) => {
  const [searchText, setSearchText] = useState("");
  const [activeCoords, setActiveCoords] = useState(null);
  const [activeDistrict, setActiveDistrict] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    const district = serviceCenter.find((d) =>
      d.district.toLowerCase().includes(searchText.toLowerCase())
    );

    if (district) {
      setActiveCoords([district.latitude, district.longitude]);
      setActiveDistrict(district.district);
    } else {
      alert(" No matching district found!");
    }
  };

  const bangladeshPosition = [23.685, 90.3563];

  return (
    <div className="p-4 md:p-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex justify-center">
        <div className="w-full max-w-xl mb-8">
          <div className="flex items-center bg-slate-100 rounded-full shadow-md overflow-hidden border border-gray-200">
            {/* Search Icon */}
            <span className="pl-4 text-gray-500">
              <Search size={20} />
            </span>

            {/* Input */}
            <input
              type="text"
              placeholder="Search district..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-grow bg-transparent outline-none px-3 py-3 text-gray-700 placeholder-gray-400"
            />

            {/* Button */}
            <button
              type="submit"
              className="bg-[#FA2A3B] hover:bg-[#E02032] text-white font-semibold px-7 py-3 rounded-full transition"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Map Section */}
      <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <MapContainer
          center={bangladeshPosition}
          zoom={7}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fly to searched district */}
          <FlyToDistrict coords={activeCoords} />

          {/* Markers for all service centers */}
          {serviceCenter.map((center, idx) => (
            <Marker key={idx} position={[center.latitude, center.longitude]}>
              <Popup autoOpen={center.district === activeDistrict}>
                <strong className="text-[#FA2A3B] text-base">
                  📍 {center.district}
                </strong>
                <br />
                <span className="text-gray-600 text-sm">
                  {center.covered_area.join(", ")}
                </span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default BangladeshMap;

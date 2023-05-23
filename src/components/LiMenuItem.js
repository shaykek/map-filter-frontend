import { useEffect, useState, useContext } from "react";
import { SelectedLocationContext } from "@/store/location-context";
import { useGlobalData } from "@/store/global-context";

const LiMenuItem = ({ marker, onClick, id, selectedMarker }) => {
  const { primaryColor } = useGlobalData();
  const [distance, setDistance] = useState();
  const { selectedLocation } = useContext(SelectedLocationContext);

  useEffect(() => {
    if (selectedLocation) {
      const origin = {
        lat: marker.branchDetails.address.latitude,
        lng: marker.branchDetails.address.longitude,
      };

      const destination = {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };

      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        origin,
        destination
      );

      const distanceInKm = distance / 1000; // Convert distance to kilometers
      setDistance(distanceInKm.toFixed(1));
    }
  }, [selectedLocation]);

  return (
    <li
      className={`group cursor-pointer px-2  py-4 flex flex-col items-start border-b border-black-50 transition-all ${
        selectedMarker && selectedMarker.title === marker.title
          ? "bg-slate-300"
          : ""
      }`}
      onClick={onClick}
    >
      <h2 className=" font-bold mb-2 flex" style={{ color: primaryColor }}>
        <span
          className="w-6 h-6 border border-solid flex items-center justify-center rounded-full mr-2"
          style={{ borderColor: primaryColor }}
        >
          {id + 1}
        </span>
        <span className="group-hover:underline">{marker.title}</span>
      </h2>
      <div className="w-full flex justify-between items-center">
        {selectedLocation && (
          <span className=" text-xs font-semibold text-slate-500">
            {distance}km
          </span>
        )}

        <span className="ml-auto text-xs p-2 px-2 font-semibold border border-solid border-black-50">
          {marker.branchCats.edges.map((cat) => cat.node.name)}
        </span>
      </div>
    </li>
  );
};

export default LiMenuItem;

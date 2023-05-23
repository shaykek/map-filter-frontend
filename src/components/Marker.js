import { MarkerF } from "@react-google-maps/api";

const Marker = ({ marker, index, onMarkerClick }) => {
  return (
    <MarkerF
      onClick={() => onMarkerClick(marker)}
      label={index}
      position={{
        lat: marker.branchDetails.address.latitude,
        lng: marker.branchDetails.address.longitude,
      }}
    />
  );
};

export default Marker;

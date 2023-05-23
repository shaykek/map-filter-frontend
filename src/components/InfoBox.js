import { InfoWindowF } from "@react-google-maps/api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import parse from "html-react-parser";

import "swiper/css";
import "swiper/css/navigation";

const InfoBox = ({ marker, setSelectedMarker }) => {
  const gallery = marker.branchDetails.gallery;

  const closeInfoWindow = (e) => {
    const targetElement = e.currentTarget
      .closest(".gm-style-iw.gm-style-iw-c")
      .querySelector("button.gm-ui-hover-effect");

    if (targetElement) {
      targetElement.click();
    }
  };
  return (
    <InfoWindowF
      onCloseClick={() => {
        setSelectedMarker();
      }}
      position={{
        lat: marker.branchDetails.address.latitude,
        lng: marker.branchDetails.address.longitude,
      }}
    >
      <div className="min-w-[300px] font-mont p-4 md:min-w-[200px] md:p-0">
        {gallery && gallery[0] && (
          <Swiper
            navigation={true}
            modules={[Navigation]}
            className="mySwiper h-[250px] w-full md:h-[100px]"
          >
            {gallery.map((img) => (
              <SwiperSlide key={img.id}>
                <img
                  src={img.mediaItemUrl}
                  alt={img.altText}
                  className="w-full object-cover h-full"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <span className="w-full flex justify-between  mt-2 mb-1 md:flex-col md:items-start">
          <h2 className="font-bold text-2xl md:text-lg">{marker.title}</h2>

          <span className="ml-auto text-xs p-2 px-2 font-semibold border border-solid border-black-50 h-[30px] md:ml-0 md:w-auto md:mt-2">
            {marker.branchCats.edges.map((cat) => cat.node.name)}
          </span>
        </span>
        <div className="text-md font-semibold text-slate-500 mb-4">
          {marker.branchDetails.address.streetAddress}
        </div>
        {marker.branchDetails.phone && (
          <div className="mb-2 text-xs">
            Phone: {marker.branchDetails.phone}
          </div>
        )}

        {marker.branchDetails.openingHours && (
          <div className="mb-2 text-xs">
            Opening Hours:
            <div className="pl-4">
              {parse(marker.branchDetails.openingHours, "text/html")}
            </div>
          </div>
        )}
        <span className="w-full flex justify-end mb-4">
          <button
            type="button"
            onClick={closeInfoWindow}
            className="font-semibold px-4 border border-solid border-black/50 inline-flex items-center justify-center h-[40px] mt-4 hover:bg-black hover:text-white"
          >
            Close
          </button>
        </span>
      </div>
    </InfoWindowF>
  );
};

export default InfoBox;

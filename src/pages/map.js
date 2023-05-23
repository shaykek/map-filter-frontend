import { client } from "../api/apollo";
import { gql } from "@apollo/client";
import { SelectedLocationContext } from "@/store/location-context";

import { useEffect, useState, useContext, lazy, Suspense } from "react";

import Layout from "@/components/Layout";
import { MarkerF } from "@react-google-maps/api";

const LazySidebar = lazy(() => import("@/components/Sidebar"));
const LazyMapWrapper = lazy(() => import("@/components/MapWrapper"));
const Marker = lazy(() => import("@/components/Marker"));
const LazyInfoBox = lazy(() => import("@/components/InfoBox"));

const MapPage = ({ page }) => {
  const { seo } = page;
  const { selectedLocation } = useContext(SelectedLocationContext);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState([]);

  const [mapCenter, setMapCenter] = useState({
    lat: selectedLocation ? selectedLocation.lat : 32.0880503,
    lng: selectedLocation ? selectedLocation.lng : 34.7148448,
  });

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter({
        lat: selectedLocation ? selectedLocation.lat : 0,
        lng: selectedLocation ? selectedLocation.lng : 0,
      });
    }
  }, [selectedLocation]);

  useEffect(() => {
    // Event listener to close the selected marker when the Escape key is pressed
    const listener = (e) => {
      if (e.key === "Escape") {
        setSelectedMarker(null);
      }
    };

    window.addEventListener("keydown", listener);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <Layout seo={seo}>
      <div className="md:flex-col-reverse md:justify-end flex items-stretch overflow-hidden min-h-screen h-full">
        <Suspense fallback={<div>Loading Sidebar...</div>}>
          <LazySidebar
            branches={filteredMarkers}
            onItemClick={handleMarkerClick}
            selectedMarker={selectedMarker}
          />
        </Suspense>
        <div className="bg-white w-[80%] md:w-full md:h-[300px] xl:w-[65%]">
          <Suspense fallback={<div>Loading MapWrapper...</div>}>
            <LazyMapWrapper
              mapCenter={mapCenter}
              selectedMarker={selectedMarker}
              selectedLocation={selectedLocation}
              setFilteredMarkers={setFilteredMarkers}
              branches={filteredMarkers}
            >
              {filteredMarkers.map((m, key) => (
                <Suspense fallback={<div>Loading Marker...</div>} key={key}>
                  <Marker
                    marker={m}
                    index={(key + 1).toString()}
                    onMarkerClick={handleMarkerClick}
                  />
                </Suspense>
              ))}

              {selectedLocation && (
                <Suspense fallback={<div>Loading MarkerF...</div>}>
                  <MarkerF
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 7,
                    }}
                    position={{
                      lat: selectedLocation.lat,
                      lng: selectedLocation.lng,
                    }}
                  />
                </Suspense>
              )}

              {selectedMarker && (
                <Suspense fallback={<div>Loading InfoBox...</div>}>
                  <LazyInfoBox
                    marker={selectedMarker}
                    setSelectedMarker={() => setSelectedMarker(null)}
                  />
                </Suspense>
              )}
            </LazyMapWrapper>
          </Suspense>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;

export async function getStaticProps() {
  const GET_PAGE = gql`
    query {
      pageBy(uri: "/map") {
        seo {
          fullHead
          title
        }
      }
    }
  `;
  const response = await client.query({
    query: GET_PAGE,
  });

  const page = response?.data?.pageBy;

  return {
    props: {
      page,
    },
  };
}

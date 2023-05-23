import { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";

import { useGlobalData } from "@/store/global-context";
import { GoogleMap } from "@react-google-maps/api";
import Loader from "./Loader";

const YOUR_MUTATION_QUERY = gql`
  mutation ExampleMutation($input: ExampleMutationInput!) {
    exampleMutation(input: $input) {
      exampleOutput
    }
  }
`;

const MAP_OPTIONS = {
  draggable: true,
  scrollwheel: true,
  zoomControl: true,
  disableDoubleClickZoom: false,
};

const MapWrapper = ({
  children,
  selectedMarker,
  mapCenter,
  selectedLocation,
  branches,
  setFilteredMarkers,
}) => {
  const [yourMutation, { loading, error, data }] =
    useMutation(YOUR_MUTATION_QUERY);

  const [mapBounds, setMapBounds] = useState(null);
  const [mapOptions, setMapOptions] = useState(MAP_OPTIONS);
  const { zoomLevel } = useGlobalData();

  // Function to handle the map bounds change
  const handleFilterPosts = async () => {
    // Check if mapBounds is available
    if (!mapBounds) {
      return;
    }
    try {
      // Execute the mutation with the map bounds as input
      const response = await yourMutation({
        variables: {
          input: {
            exampleInput: JSON.stringify(mapBounds.getBounds()),
          },
        },
      });
      // Extract the exampleOutput data from the mutation response
      const data = response.data.exampleMutation.exampleOutput;

      // Set the filtered markers based on the parsed exampleOutput data
      setFilteredMarkers(JSON.parse(data));
    } catch (error) {
      // Handle any errors that occur during the mutation
      console.log("error", error);
    }
  };

  useEffect(() => {
    let options;
    if (!selectedMarker) {
      options = {
        draggable: true,
        scrollwheel: true,
        zoomControl: true,
        disableDoubleClickZoom: false,
      };
    } else {
      options = {
        draggable: false,
        scrollwheel: false,
        zoomControl: false,
        disableDoubleClickZoom: true,
      };
    }

    setMapOptions((prevOptions) => ({
      ...prevOptions,
      options,
    }));
  }, [selectedMarker]);

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      zoom={selectedLocation ? zoomLevel : 3}
      center={mapCenter}
      onIdle={handleFilterPosts}
      onLoad={(map) => setMapBounds(map)}
      options={mapOptions}
    >
      {loading && (
        <span className=" absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white/50">
          <Loader />
        </span>
      )}
      {children}
    </GoogleMap>
  );
};

export default MapWrapper;

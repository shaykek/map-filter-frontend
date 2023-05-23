import { useState, useContext, useEffect } from "react";
import { SelectedLocationContext } from "@/store/location-context";
import { Combobox } from "@headlessui/react";
import SearchIcon from "./icons/SearchIcon";
import { useGlobalData } from "@/store/global-context";
import { useRouter } from "next/router";

const Autocomplete = () => {
  const { primaryColor } = useGlobalData();
  const router = useRouter();
  const { updateSelectedLocation } = useContext(SelectedLocationContext);
  const [searchText, setSearchText] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [prediction, setPrediction] = useState(null);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);

    if (event.target.value) {
      fetchPredictions(event.target.value);
    } else {
      setPrediction(null);
      setPredictions([]);
    }
  };

  const handlePredictionClick = async (prediction) => {
    setSearchText(prediction.description);

    setPredictions([]);

    try {
      const geocoder = new window.google.maps.Geocoder();
      const { place_id } = prediction;
      const response = await geocodePlaceId(geocoder, place_id);
      const { lat, lng } = getLatLongFromResponse(response);
      setPrediction({
        title: prediction.description,
        lat: lat,
        lng: lng,
      });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const fetchPredictions = (input) => {
    const service = new window.google.maps.places.AutocompleteService();
    const request = {
      input: input,
    };

    service.getPlacePredictions(request, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPredictions(predictions);
      }
    });
  };

  const geocodePlaceId = (geocoder, placeId) => {
    return new Promise((resolve, reject) => {
      geocoder.geocode({ placeId: placeId }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          resolve(results[0]);
        } else {
          reject(status);
        }
      });
    });
  };

  const getLatLongFromResponse = (response) => {
    const { lat, lng } = response.geometry.location;
    return { lat: lat(), lng: lng() };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (prediction) {
      router.push({
        pathname: "/map",
        query: {
          lat: prediction.lat,
          lng: prediction.lng,
          title: prediction.title,
        },
      });
    }
  };

  useEffect(() => {
    if (router.query.lng) {
      updateSelectedLocation({
        lat: +router.query.lat,
        lng: +router.query.lng,
        title: router.query.title,
      });

      setSearchText(router.query.title);
    }
  }, [router.query]);

  return (
    <form onSubmit={handleSubmit}>
      <Combobox value={searchText} onChange={(value) => setSearchText(value)}>
        <div className="relative">
          <button
            disabled={!prediction && true}
            style={{ backgroundColor: primaryColor }}
            type="submit"
            className="absolute stroke-white right-0 top-[50%] -translate-y-[50%] w-8 flex justify-center items-center h-full border-l border-indigo-600 bg-primaryColor hover:stroke-white rounded-r-md disabled:opacity-30 disabled:pointer-events-none "
          >
            <SearchIcon className="w-[14px]" />
          </button>
          <Combobox.Input
            className="w-full p-2 rounded-md border  pr-10"
            style={{ borderColor: primaryColor }}
            placeholder="Search"
            onChange={handleInputChange}
            autoComplete="off"
          />
          <Combobox.Options
            onKeyUp={(e) => console.log(e)}
            className="absolute z-30 mt-1 max-h-60 w-full text-left overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {predictions.map((prediction) => (
              <Combobox.Option
                key={prediction.place_id}
                value={prediction.description}
                className={({ active }) =>
                  `py-2 px-4 cursor-default select-none ${
                    active ? "bg-indigo-600 text-white" : ""
                  }`
                }
                onClick={() => handlePredictionClick(prediction)}
              >
                {prediction.description}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </form>
  );
};

export default Autocomplete;

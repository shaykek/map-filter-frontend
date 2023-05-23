import { createContext, useState } from "react";

// Create the context
const SelectedLocationContext = createContext({
  selectedLocation: null,
  updateSelectedLocation: () => {},
});

// Create the context provider component
const SelectedLocationProvider = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const updateSelectedLocation = (location) => {
    setSelectedLocation(location);
  };

  return (
    <SelectedLocationContext.Provider
      value={{
        selectedLocation,
        updateSelectedLocation,
      }}
    >
      {children}
    </SelectedLocationContext.Provider>
  );
};

export { SelectedLocationContext, SelectedLocationProvider };

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Loader from "@/components/Loader";

const GET_GLOBAL_DATA_QUERY = gql`
  query generalSettings {
    themeGeneralSettings {
      themeOptions {
        language
        primaryColor
        textColor
        zoomLevel
        closedPopup {
          content
          fieldGroupName
          title
        }
        fromHour
        toHour
        enableClosingHours
      }
    }
  }
`;

// Create the context
const GlobalDataContext = createContext({});

// provider component to wrap our app
export function GlobalDataProvider({ children }) {
  const [globalData, setGlobalData] = useState({});

  const { loading, error, data } = useQuery(GET_GLOBAL_DATA_QUERY);

  useEffect(() => {
    if (!loading && !error && data) {
      setGlobalData(data?.themeGeneralSettings?.themeOptions || {});
    }
  }, [loading, error, data]);

  if (loading) {
    // Handle loading state
    return (
      <div className=" w-full h-[100svh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    // Handle error state
    return <div>Error: {error.message}</div>;
  }

  // Make the global data accessible to components
  return (
    <GlobalDataContext.Provider value={globalData}>
      {children}
    </GlobalDataContext.Provider>
  );
}

// Custom hook to access the global data
export function useGlobalData() {
  return useContext(GlobalDataContext);
}

// Create: ./src/context/LocationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if location is already stored in sessionStorage
    const storedLocation = sessionStorage.getItem("userLocation");

    if (storedLocation) {
      setLocation(JSON.parse(storedLocation));
      setLoading(false);
      return;
    }

    // Request location from browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          // Optionally get address using reverse geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
            );
            const data = await response.json();

            const locationData = {
              ...coords,
              city:
                data.address?.city ||
                data.address?.town ||
                data.address?.village,
              state: data.address?.state,
              country: data.address?.country,
              countryCode: data.address?.country_code,
              fullAddress: data.display_name,
              timestamp: new Date().toISOString(),
            };

            setLocation(locationData);
            sessionStorage.setItem(
              "userLocation",
              JSON.stringify(locationData)
            );
          } catch (error) {
            console.error("Error getting address:", error);
            // Store coordinates even if reverse geocoding fails
            const locationData = {
              ...coords,
              timestamp: new Date().toISOString(),
            };
            setLocation(locationData);
            sessionStorage.setItem(
              "userLocation",
              JSON.stringify(locationData)
            );
          }

          setLoading(false);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocationError(error.message);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser");
      setLoading(false);
    }
  }, []);

  const refreshLocation = () => {
    setLoading(true);
    sessionStorage.removeItem("userLocation");
    window.location.reload();
  };

  const clearLocation = () => {
    setLocation(null);
    sessionStorage.removeItem("userLocation");
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        locationError,
        loading,
        refreshLocation,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

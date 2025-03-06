import React, { useEffect, useRef, useMemo } from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";

const libraries = ["places", "marker"]; // Ensure "marker" library is loaded

const DirectionsMap = ({ trips }) => {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const defaultCenter = { lat: 5.6037, lng: -0.1870, };

  // ✅ Get the first trip's position as the center
 
  const center = useMemo(() => {
    if (trips?.length > 0) {
      const firstTrip = trips[0];
      return { lat: parseFloat(firstTrip.t_end_lat), lng: parseFloat(firstTrip.t_end_long) };
    }
    return defaultCenter;
  },
   // eslint-disable-next-line
  [] );

  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: false,
      clickableIcons: false,
    }),
    []
  );

  const containerStyle = {
    width: "100%",
    height: "500px",
  };

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google || !window.google.maps || !window.google.maps.marker) return;
 
    const map = mapRef.current.state.map;
    if (!map) return;

    // Clear previous markers
    if (mapRef.current.markers) {
      mapRef.current.markers.forEach((marker) => (marker.map = null));
    }
    mapRef.current.markers = [];

    trips.forEach((trip) => {
      // Ensure lat and lng are numbers
      const lat = parseFloat(trip.t_end_lat);
      const lng = parseFloat(trip.t_end_long);
      console.log(lat, lng)
      if (isNaN(lat) || isNaN(lng)) {
        console.warn("Invalid lat/lng for trip:",lat , lng);
        return; // Skip invalid locations
      }
      const position = new window.google.maps.LatLng(lat, lng);

      const pin = new window.google.maps.marker.PinElement ({
        scale: 1.5,
        background: "#FBBC04",
    });

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        position:position,
        map,
        title: 'heree',
        content: pin.element,
        gmpClickable: true,

        zIndex: trip.id || 1,
      });

      mapRef.current.markers.push(marker);
    });
  }, [isLoaded, trips]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={7}
      options={options}  // Pass options with mapId here
      onLoad={(map) => (mapRef.current = { state: { map } })}
    />
  );
};

export default DirectionsMap;

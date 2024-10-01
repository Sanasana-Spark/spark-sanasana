import React from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
// import markicon from "../../assets/gasFiller.png";

const DirectionsMap = ({ trips }) => {

  // Load Google Maps JS API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Replace with your API Key
    libraries: ["places"]
  });
  const google = window.google;

  const customIcon = {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", // This is a simplified map marker SVG path
    fillColor: '#FBBC04', // Background color
    fillOpacity: 1,
    strokeColor: '#000', // Border color
    strokeWeight: 2,
    scale: 2, // Adjust size as needed
    // anchor: new window.google.maps.Point(12, 24), // Adjust the position of the icon relative to the location
  };

  // Map container styles
  const containerStyle = {
    width: '100%',
    height: '500px',
  };
  const center = {
    lat: -1.2331500000000002,
    lng: 36.77929,
  };

  

   if (!isLoaded) return <div>Loading...</div>;
   console.log(trips)

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
    >

      {trips.map((trip) => (
        <Marker
          key={trip.id}  // Key prop directly on Marker
          position={{ lat: parseFloat(trip.t_start_lat), lng: parseFloat(trip.t_start_long) }}
          icon={customIcon}
          label={{
            text: trip.t_type, // Glyph color customization
            color: "#000", // Glyph color
            fontWeight: "bold",
            fontSize: "12px",
          }}
        />
      ))}



    </GoogleMap>
  );
};

export default DirectionsMap;

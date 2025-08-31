import React, { useState, useEffect, useMemo } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer, Marker, Polyline
} from "@react-google-maps/api";
import { useAuthContext } from '../onboarding/authProvider';
const libraries = ["places", "marker"];

const DirectionsMap = ({ origin, destination, center, tripid }) => {
  const baseURL = process.env.REACT_APP_BASE_URL
  const { user_id, org_id } = useAuthContext();
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverLocations, setDriverLocations] = useState([]);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Map container styles
  const containerStyle = {
    width: '100%',
    height: '500px',
  };


  // Calculate and display the route
  const calculateRoute = () => {
    if (origin && destination) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING, // Can also be WALKING, BICYCLING, etc.
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  console.log(directionsResponse)

  // Run when component loads or when origin/destination changes
  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  },
  // eslint-disable-next-line
   [isLoaded, origin, destination]);


  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: false,
      clickableIcons: false,
    }),
    []
  );

  useEffect(() => {
      if (org_id && user_id) {
      fetch(`${baseURL}/trips/location/${org_id}/${user_id}/${tripid}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setDriverLocations(data.trip_locations);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
  }},[baseURL,org_id, user_id, tripid] );

  const driverPath = driverLocations.map(loc => ({
    lat: loc.or_latitude,
    lng: loc.or_longitude,
  }));



  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      options={options}
    >
      {directionsResponse && !loading && (
        <DirectionsRenderer directions={directionsResponse} />
      )}

      {!loading && driverPath.map((pos, index) => (
        <Marker
          key={index}
          position={pos}
          label={(index + 1).toString()} // numbers markers in order
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE, // circular marker
            scale: 8, // size of marker
            fillColor: "yellow",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "black",
          }}
          
        />
      ))}

      {driverPath.length > 1 && (
        <Polyline
          path={driverPath}
          options={{
            strokeColor: "yellow", // yellow line for driver path
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />
      )}


    </GoogleMap>
  );
};

export default DirectionsMap;

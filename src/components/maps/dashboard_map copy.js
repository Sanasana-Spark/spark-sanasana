import React, { useMemo } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";

const libraries = ["places"];
const DirectionsMap = ({trips, center }) => {
  console.log(trips);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Map container styles
  const containerStyle = {
    width: '100%',
    height: '500px',
  };
  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: false,
      clickableIcons: false,
    }),
    []
  );

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      options={options}
    >

      {trips?.map((trip) => (
  <Marker key={trip.id} position={{ lat: trip.t_end_lat, lng: trip.t_end_lng }} />
))}

    </GoogleMap>
  );
};

export default DirectionsMap;

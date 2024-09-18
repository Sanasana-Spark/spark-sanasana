import React, {  useMemo, useCallback, useRef } from "react";
import { useLoadScript, GoogleMap, Marker, Polyline } from "@react-google-maps/api";

const mapContainerStyle = {
  height: "400px",
  width: "100%",
};
// const center = { lat: 0.00075, lng: 36.0098 };

const PropCard = ({ origin, destination, key, center }) => {
    console.log("origin", origin, "destination", destination)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });
  const google = window.google;



  const mapRef = useRef();
  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  if (!isLoaded) return <div>Loading...</div>;




        return (

            
                <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                options={options}
                onLoad={onLoad}
              >
                <Marker
                  position={center}
                  key={key}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    fillColor: 'red',
                    fillOpacity: 1,
                    strokeColor: 'red',
                    strokeWeight: 1,
                    scale: 10,
                  }}
                   />
{origin && destination && (
          <Polyline
            path={[origin, destination]}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2
            }}
          />
        )}

  
              </GoogleMap>

     



        );
    

};

export default PropCard;

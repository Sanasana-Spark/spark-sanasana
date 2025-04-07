import React, { useEffect, useRef, useMemo, useState } from "react";
import { useJsApiLoader, GoogleMap , DirectionsRenderer, Marker, InfoWindow} from "@react-google-maps/api";

const libraries = ["places", "marker"]; // Ensure "marker" library is loaded

const DirectionsMap = ({ trips }) => {
  const [directionsResponses, setDirectionsResponses] = useState([]);
  const [markers, setMarkers] = useState([]); // Store labels for start & end points
  const [selectedMarker, setSelectedMarker] = useState(null); // Track clicked marker
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const defaultCenter = { lat: 5.6037, lng: -0.1870, };

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
    setDirectionsResponses([]);
    setMarkers([]);

    trips.forEach((trip) => {
      const origin = { lat: parseFloat(trip.t_start_lat), lng: parseFloat(trip.t_start_long) };
      const destination = { lat: parseFloat(trip.t_end_lat), lng: parseFloat(trip.t_end_long) };

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
              setDirectionsResponses((prev) => [...prev, result]); // Store multiple routes

            // Add custom markers for start & end points
            setMarkers((prev) => [
              ...prev,
              { position: origin, trip, title: `Start: ${trip.a_license_plate}`, type: "start" },
              { position: destination, trip, title: `End: ${trip.a_license_plate}`, type: "end" },
            ]);

            } else {
              console.error(`error fetching directions ${result}`);
            }
          }
        );
      }

      
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
    >


      {directionsResponses.map((directionsResponses, index) => (
        <DirectionsRenderer key={index} directions={directionsResponses} options={{ suppressMarkers: true }} />
      ))}

     {/* Render custom start & end markers */}
     {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          label={{
            text: marker.title,
            fontSize: "12px",
            fontWeight: "bold",
          }}
          icon={{
            url: marker.type === "start" ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(40, 40), // Adjust size
          }}
          onClick={() => setSelectedMarker(marker)} // Open InfoWindow on click

        />
      ))}


      {/* Show InfoWindow when a marker is clicked */}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div style={{ fontSize: "14px", padding: "5px" }}>
            <h3>{selectedMarker.trip.a_license_plate}</h3>
            <p><strong>Desc:</strong> {selectedMarker.trip.t_type}</p>
            <p><strong>Driver:</strong> {selectedMarker.trip.o_name}</p>
            <p><strong>Status:</strong> {selectedMarker.trip.t_status}</p>
          </div>
        </InfoWindow>
      )}

      </GoogleMap>
  );
};

export default DirectionsMap;

import React, { useState, useEffect, useMemo } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer, 
  Marker, 
  Polyline
} from "@react-google-maps/api";
import { useAuthContext } from '../onboarding/authProvider';

const libraries = ["places", "marker"];

const DirectionsMap = ({ origin, destination, center, tripid, stops = [] }) => {
  const baseURL = process.env.REACT_APP_BASE_URL;
  const { apiFetch } = useAuthContext();
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [driverLocations, setDriverLocations] = useState([]);
  const [routeMarkers, setRouteMarkers] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Map container styles
  const containerStyle = {
    width: '100%',
    height: '500px',
  };

  // Helper function to get marker icon based on type
  const getMarkerIcon = (type) => {
    switch (type) {
      case "start":
        return {
          url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        };
      case "stop":
        return {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(35, 35),
        };
      case "end":
        return {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          scaledSize: new window.google.maps.Size(40, 40),
        };
      default:
        return {
          url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
          scaledSize: new window.google.maps.Size(35, 35),
        };
    }
  };

  // Calculate and display the route with stops
  const calculateRoute = () => {
    if (origin && destination) {
      // Prepare waypoints from stops
      const waypoints = stops
        .filter(stop => stop.s_place_query) // Only include stops with valid location data
        .map(stop => ({
          location: stop.s_place_query,
          stopover: true
        }));

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints,
          optimizeWaypoints: false, // Set to true if you want Google to optimize the order
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
            updateRouteMarkers(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  };

  // Update route markers based on the directions result
  const updateRouteMarkers = (directionsResult) => {
    const markers = [];
    const route = directionsResult.routes[0];

    // Add start marker
    const startLocation = route.legs[0].start_location;
    markers.push({
      position: { lat: startLocation.lat(), lng: startLocation.lng() },
      type: "start",
      title: "Start Location",
      label: "S",
    });

    // Add stop markers (intermediate waypoints)
    route.legs.forEach((leg, index) => {
      if (index < route.legs.length - 1) { // Don't add marker for final destination
        const endLocation = leg.end_location;
        markers.push({
          position: { lat: endLocation.lat(), lng: endLocation.lng() },
          type: "stop",
          title: `Stop ${index + 1}`,
          label: `${index + 1}`,
        });
      }
    });

    // Add end marker
    const lastLeg = route.legs[route.legs.length - 1];
    const endLocation = lastLeg.end_location;
    markers.push({
      position: { lat: endLocation.lat(), lng: endLocation.lng() },
      type: "end",
      title: "End Location",
      label: "E",
    });

    setRouteMarkers(markers);
  };

  console.log(directionsResponse);

  // Run when component loads or when origin/destination/stops changes
  useEffect(() => {
    if (isLoaded) {
      calculateRoute();
    }
  },
  // eslint-disable-next-line
   [isLoaded, origin, destination, stops]);

  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: false,
      clickableIcons: false,
    }),
    []
  );

  // Fetch driver locations
  useEffect(() => {
    apiFetch(`${baseURL}/trips/location/${tripid}`, { method: 'GET' })
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
  }, [baseURL, apiFetch, tripid]);

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
        <DirectionsRenderer 
          directions={directionsResponse}
          options={{
            suppressMarkers: true, // We'll show custom markers
            polylineOptions: {
              strokeColor: "#2196f3",
              strokeWeight: 4,
              strokeOpacity: 0.8,
            },
          }}
        />
      )}

      {/* Custom route markers (start, stops, end) */}
      {routeMarkers.map((marker, index) => (
        <Marker
          key={`route-${index}`}
          position={marker.position}
          icon={getMarkerIcon(marker.type)}
          title={marker.title}
          label={{
            text: marker.label,
            fontSize: "12px",
            fontWeight: "bold",
            color: "white",
          }}
        />
      ))}

      {/* Driver location markers */}
      {!loading && driverPath.map((pos, index) => (
        <Marker
          key={`driver-${index}`}
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

      {/* Driver path polyline */}
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
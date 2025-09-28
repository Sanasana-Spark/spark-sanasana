import React, { useEffect, useRef, useMemo, useState } from "react";
import { useJsApiLoader, GoogleMap, DirectionsRenderer, Marker, InfoWindow } from "@react-google-maps/api";

const libraries = ["places", "marker"];

const DirectionsMap = ({ trips }) => {
  console.log("Trips data in DirectionsMap:", trips);
  const [directionsResponses, setDirectionsResponses] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [tripsWithStops, setTripsWithStops] = useState([]);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const defaultCenter = { lat: 5.6037, lng: -0.1870 };

  const center = useMemo(() => {
    if (trips?.length > 0) {
      const firstTrip = trips[0];
      return { 
        lat: parseFloat(firstTrip.t_start_lat), 
        lng: parseFloat(firstTrip.t_start_long) 
      };
    }
    return defaultCenter;
  }, [trips]);

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

  // Fetch stops data for each trip
  useEffect(() => {
    const fetchStopsForTrips = async () => {
      if (!trips || trips.length === 0) return;

      const baseURL = process.env.REACT_APP_BASE_URL;
      const tripsWithStopsData = await Promise.all(
        trips.map(async (trip) => {
          try {
            // You'll need to implement an endpoint to get stops by trip_id
            // For now, assuming stops are included in trip data or need to be fetched
            const response = await fetch(`${baseURL}/trips/stops/${trip.id}/`, {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`, // Adjust based on your auth
                "Content-Type": "application/json",
              },
            });
            
            if (response.ok) {
              const stops = await response.json();
              return { ...trip, stops };
            } else {
              return { ...trip, stops: [] };
            }
          } catch (error) {
            console.error(`Error fetching stops for trip ${trip.id}:`, error);
            return { ...trip, stops: [] };
          }
        })
      );

      setTripsWithStops(tripsWithStopsData);
    };

    fetchStopsForTrips();
  }, [trips]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google || !window.google.maps || !tripsWithStops.length) return;

    const map = mapRef.current.state.map;
    if (!map) return;

    // Clear previous data
    if (mapRef.current.markers) {
      mapRef.current.markers.forEach((marker) => (marker.map = null));
    }
    mapRef.current.markers = [];
    setDirectionsResponses([]);
    setMarkers([]);

    tripsWithStops.forEach((trip, tripIndex) => {
      const origin = { 
        lat: parseFloat(trip.t_start_lat), 
        lng: parseFloat(trip.t_start_long) 
      };
      const destination = { 
        lat: parseFloat(trip.t_end_lat), 
        lng: parseFloat(trip.t_end_long) 
      };

      // Create waypoints from stops
      const waypoints = trip.stops ? trip.stops.map(stop => ({
        location: { lat: parseFloat(stop.s_lat), lng: parseFloat(stop.s_long) },
        stopover: true
      })) : [];

      if (origin && destination) {
        const directionsService = new window.google.maps.DirectionsService();
        
        const routeRequest = {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        // Add waypoints if they exist
        if (waypoints.length > 0) {
          routeRequest.waypoints = waypoints;
          routeRequest.optimizeWaypoints = true;
        }

        directionsService.route(routeRequest, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponses((prev) => [...prev, {
              ...result,
              tripIndex,
              polylineOptions: {
                strokeColor: getRouteColor(tripIndex),
                strokeWeight: 4,
                strokeOpacity: 0.8
              }
            }]);

            // Add markers for start point
            setMarkers((prev) => [
              ...prev,
              {
                position: origin,
                trip,
                title: `Start: ${trip.a_license_plate}`,
                type: "start",
                tripIndex
              }
            ]);

            // Add markers for stops
            if (trip.stops) {
              trip.stops.forEach((stop, stopIndex) => {
                setMarkers((prev) => [
                  ...prev,
                  {
                    position: { lat: parseFloat(stop.s_lat), lng: parseFloat(stop.s_long) },
                    trip,
                    stop,
                    title: `Stop ${stopIndex + 1}: ${trip.a_license_plate}`,
                    type: "stop",
                    tripIndex,
                    stopIndex
                  }
                ]);
              });
            }

            // Add marker for destination
            setMarkers((prev) => [
              ...prev,
              {
                position: destination,
                trip,
                title: `End: ${trip.a_license_plate}`,
                type: "end",
                tripIndex
              }
            ]);

          } else {
            console.error(`Error fetching directions for trip ${trip.id}:`, result);
          }
        });
      }
    });
  }, [isLoaded, tripsWithStops]);

  // Helper function to get different colors for different routes
  const getRouteColor = (tripIndex) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
    return colors[tripIndex % colors.length];
  };

  // Helper function to get marker icon based on type
  const getMarkerIcon = (type, tripIndex) => {
    const color = getRouteColor(tripIndex);
    
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

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={7}
      options={options}
      onLoad={(map) => (mapRef.current = { state: { map } })}
    >
      {/* Render directions with different colors */}
      {directionsResponses.map((response, index) => (
        <DirectionsRenderer
          key={index}
          directions={response}
          options={{
            suppressMarkers: true,
            polylineOptions: response.polylineOptions
          }}
        />
      ))}

      {/* Render custom markers for start, stops, and end points */}
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          label={{
            text: marker.title.split(':')[0], // Show just "Start", "Stop 1", "End", etc.
            fontSize: "10px",
            fontWeight: "bold",
            color: "white"
          }}
          icon={getMarkerIcon(marker.type, marker.tripIndex)}
          onClick={() => setSelectedMarker(marker)}
        />
      ))}

      {/* InfoWindow for selected marker */}
      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div style={{ fontSize: "14px", padding: "5px", minWidth: "200px" }}>
            <h3>{selectedMarker.trip.a_license_plate}</h3>
            <p><strong>Type:</strong> {selectedMarker.type.charAt(0).toUpperCase() + selectedMarker.type.slice(1)}</p>
            <p><strong>Trip:</strong> {selectedMarker.trip.t_type}</p>
            <p><strong>Driver:</strong> {selectedMarker.trip.o_name}</p>
            <p><strong>Status:</strong> {selectedMarker.trip.t_status}</p>
            
            {selectedMarker.type === "start" && (
              <p><strong>Origin:</strong> {selectedMarker.trip.t_origin_place_query}</p>
            )}
            
            {selectedMarker.type === "stop" && selectedMarker.stop && (
              <>
                <p><strong>Stop Location:</strong> {selectedMarker.stop.s_place_query}</p>
                {selectedMarker.stop.s_client_id && (
                  <p><strong>Client:</strong> {selectedMarker.stop.s_client_id}</p>
                )}
              </>
            )}
            
            {selectedMarker.type === "end" && (
              <p><strong>Destination:</strong> {selectedMarker.trip.t_destination_place_query}</p>
            )}
            
            {selectedMarker.trip.t_distance && (
              <p><strong>Total Distance:</strong> {selectedMarker.trip.t_distance} km</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default DirectionsMap;
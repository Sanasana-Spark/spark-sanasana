import React, { useEffect, useRef, useMemo, useState } from "react";
import { useJsApiLoader, GoogleMap, DirectionsRenderer, OverlayView } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const libraries = ["places", "marker"];

const DirectionsMap = ({ trips }) => {
  const navigate = useNavigate();
  const [directionsResponses, setDirectionsResponses] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // Center coordinate logic falling back to a default viewport location frame
  const center = useMemo(() => {
    if (trips?.length > 0) {
      const firstTrip = trips[0];
      return { 
        lat: parseFloat(firstTrip.t_start_lat), 
        lng: parseFloat(firstTrip.t_start_long) 
      };
    }
    return { lat: -1.2921, lng: 36.8219 }; // Default centered fallback anchor coordinates
  }, [trips]);

  const options = useMemo(
    () => ({
      mapId: "9ebfa89edaafd2e",
      disableDefaultUI: true, // Hides native UI buttons to maintain the minimalist dashboard layout style
      clickableIcons: false,
    }),
    []
  );

  const containerStyle = {
    width: "100%",
    height: "100%", // Inherits structural height rules natively from the canvas parent viewport wrapper
    position: "relative"
  };

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google || !window.google.maps || !trips?.length) return;

    // Generates a sleek, readable route color matrix matching your system style metrics
    const getRouteColor = (tripIndex) => {
      const hue = (tripIndex * (360 / trips.length)) % 360;
      return `hsl(${hue}, 65%, 45%)`;
    };

    const map = mapRef.current;
    if (!map) return;

    setDirectionsResponses([]);
    setMarkers([]);

    trips.forEach((trip, tripIndex) => {
      const origin = { 
        lat: parseFloat(trip.t_start_lat), 
        lng: parseFloat(trip.t_start_long) 
      };
      const destination = { 
        lat: parseFloat(trip.t_end_lat), 
        lng: parseFloat(trip.t_end_long) 
      };

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

        if (waypoints.length > 0) {
          routeRequest.waypoints = waypoints;
          routeRequest.optimizeWaypoints = true;
        }

        directionsService.route(routeRequest, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponses((prev) => [...prev, {
              ...result,
              polylineOptions: {
                strokeColor: getRouteColor(tripIndex),
                strokeWeight: 5,
                strokeOpacity: 0.85,
                strokeLinecap: "round"
              }
            }]);

            // Map custom properties to pins to match your structural layout
            setMarkers((prev) => [
              ...prev,
              {
                position: origin,
                trip,
                icon: "🏁",
                type: "start",
                label: "Origin"
              }
            ]);

            if (trip.stops) {
              trip.stops.forEach((stop) => {
                setMarkers((prev) => [
                  ...prev,
                  {
                    position: { lat: parseFloat(stop.s_lat), lng: parseFloat(stop.s_long) },
                    trip,
                    icon: "🛑",
                    type: "stop",
                    label: stop.s_place_query || "Stopover"
                  }
                ]);
              });
            }

            setMarkers((prev) => [
              ...prev,
              {
                position: destination,
                trip,
                icon: trip.t_type === "delivery" ? "🚐" : "🌿", // Custom runtime strings derived from telemetry metrics
                type: "end",
                label: "Destination"
              }
            ]);
          }
        });
      }
    });
  }, [isLoaded, trips]);

  if (!isLoaded) return <div className="map-loading-placeholder">Loading Real-Time Grid...</div>;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* ── DESIGN BACKGROUND OVERLAY LAYERS ── */}
      <div className="map-grid-overlay" style={{ pointerEvents: 'none', zIndex: 1 }} />

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
        options={options}
        onLoad={(map) => { mapRef.current = map; }}
      >
        {/* Real-time Dynamic Path Infrastructure Polylines */}
        {directionsResponses.map((response, index) => (
          <DirectionsRenderer
            key={index}
            directions={response}
            options={{
              suppressMarkers: true, // Suppresses standard Google pins so we can inject your custom look
              polylineOptions: response.polylineOptions
            }}
          />
        ))}

        {/* ── OVERLAY PIN RENDER ENGINE ── */}
        {markers.map((marker, i) => (
          <OverlayView
            key={i}
            position={marker.position}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            {/* Custom DOM Component matching your exact layout styles */}
            <div 
              className={`vehicle-pin ${marker.type}`}
              style={{ transform: 'translate(-50%, -100%)', cursor: 'pointer' }} 
              onClick={() => {
                setSelectedMarker(marker);
                navigate('/assets');
              }}
            >
              <div className="pin-body">
                <div className="pin-inner">{marker.icon}</div>
              </div>
              <div className="pin-tail" />
              
              {/* Optional Inline Floating Hover Tooltip Elements */}
              <div className="pin-floating-label" style={{
                position: 'absolute',
                top: '-24px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'var(--brand-ink, #1b4332)',
                color: '#fff',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
              }}>
                {marker.trip.a_license_plate}
              </div>
            </div>
          </OverlayView>
        ))}
      </GoogleMap>

      {/* ── SYSTEM DATA MODAL COMPONENT (Replaces the basic InfoWindow framework) ── */}
      {selectedMarker && (
        <div className="map-context-card" style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          zIndex: 10,
          width: '260px',
          border: '1px solid var(--brand-border, #e0e0e0)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>{selectedMarker.trip.a_license_plate}</h3>
            <button 
              onClick={() => setSelectedMarker(null)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', color: '#999' }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: '12px', color: '#555', lineHeight: '1.6' }}>
            <div><strong>Operator:</strong> {selectedMarker.trip.o_name}</div>
            <div><strong>Status:</strong> <span className={`badge-${selectedMarker.trip.t_status === 'Active' ? 'green' : 'amber'}`}>{selectedMarker.trip.t_status}</span></div>
            <div><strong>Task Classification:</strong> {selectedMarker.trip.t_type}</div>
            {selectedMarker.trip.t_distance && <div><strong>Route Range:</strong> {selectedMarker.trip.t_distance} km</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectionsMap;
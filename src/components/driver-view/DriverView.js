import React, { useState, useEffect, useRef } from 'react';
import './DriverView.css';
import profileImage from '../assets/profileImage.png';
import truckImage from '../assets/truckImage.png';
import logoImage from '../assets/logo.png';
import odometerImage from '../assets/odometer.png';
import spinningWheel from '../assets/spinningWheel.png';
import gasFillerImage from '../assets/gasFiller.png';
import successTickImage from '../assets/successTick.png';
import Trip from './Trip';
import EndTrip from './EndTrip';
import { useAuthContext } from "../../components/onboarding/authProvider"; // Adjust path as needed

const loadScript = (url, callback) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  script.async = true;
  script.onload = callback;
  document.head.appendChild(script);
};

const DriverView = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showStartTripButton, setShowStartTripButton] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [tripEnded, setTripEnded] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverEmail, setDriverEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [distanceRemaining, setDistanceRemaining] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  // Extracting user details from auth context
  const { userId, org_id, userEmail } = useAuthContext(); // Ensure this hook works correctly

  useEffect(() => {
    const fetchDriverData = async (email) => {
      setLoading(true);
      try {
        const baseURL = 'process.env.REACT_APP_BASE_URL'; // Replace with your actual base URL
        const apiUrl = `${baseURL}/trips?userEmail=${email}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data) {
          setDriverName(data.name);
          setDriverEmail(data.email);
          setTripDetails(data.trip); // Assuming `data.trip` contains the trip details
        } else {
          console.error('Driver not found');
        }
      } catch (error) {
        console.error('Error fetching driver data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchDriverData(userEmail);
    } else {
      console.error('User email is not available');
    }
  }, [userEmail]);

  useEffect(() => {
    const initMap = () => {
      if (window.google && mapRef.current) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 10,
        });
        setMap(mapInstance);

        if (tripDetails) {
          const { startLat, startLng, endLat, endLng } = tripDetails;

          // Create markers for start and end locations
          new window.google.maps.Marker({
            position: { lat: startLat, lng: startLng },
            map: mapInstance,
            title: 'Start Location',
          });

          new window.google.maps.Marker({
            position: { lat: endLat, lng: endLng },
            map: mapInstance,
            title: 'End Location',
          });

          // Calculate the distance remaining
          if (driverLocation) {
            const tripEnd = new window.google.maps.LatLng(endLat, endLng);
            const driverPosition = new window.google.maps.LatLng(driverLocation.lat, driverLocation.lng);
            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(driverPosition, tripEnd);
            setDistanceRemaining(distance / 1000); // Convert meters to kilometers
          }
        }
      }
    };

    if (!window.google) {
      loadScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyACIsovAIGLyWjhP-KZAK7wz-smt0NPTCY&libraries=geometry`, initMap);
    } else {
      initMap();
    }
  }, [tripDetails, driverLocation]);

  useEffect(() => {
    const getDriverLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDriverLocation({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error('Error getting driver location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getDriverLocation();
  }, []);

  const handleRequestFuel = () => {
    setShowModal(true);
  };

  const handleOpenCamera = async () => {
    setShowModal(false);
    setShowCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Error accessing camera. Please ensure you have allowed camera access.');
    }
  };

  const handleTakePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageData); // Store the captured image

      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      setShowCamera(false);
      setShowProcessingModal(true);

      setTimeout(() => {
        setShowProcessingModal(false);
        setShowResultModal(true);
      }, 5000);
    }
  };

  const handleProceed = async () => {
    const baseURL = 'https://your-api-url.com'; // Replace with your actual base URL

    // Construct the payload with specific naming
    const payload = {
      f_created_by: userId,
      f_organization_id: org_id,
      f_operator_id: tripDetails?.t_operator_id,
      f_asset_id: tripDetails?.t_asset_id,
      f_trip_id: tripDetails?.t_trip_id,
      f_odometer_image: capturedImage,
    };

    try {
      const response = await fetch(`${baseURL}/fuel/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowResultModal(false);
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          setShowSuccessMessage(true);
          setShowStartTripButton(true);
        }, 3000);
      } else {
        console.error('Error posting fuel request:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting fuel request:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTripEnd = () => {
    setTripEnded(true);
  };

  return (
    <div className="driver-view">
      <header className="header">
        <img src={logoImage} alt="Sana Sana" className="logo" />
        <div className="driver-info">
          <div className="driver-details">
            {loading ? (
              <p>Loading driver details...</p> // Loading indicator
            ) : (
              <>
                <img src={profileImage} alt={driverName} className="profile-pic" />
                <h3>{driverName}</h3>
                <p>{driverEmail}</p>
              </>
            )}
          </div>
        </div>
      </header>
      <div ref={mapRef} className="google-map"></div>
      <div className="delivery-info">
        <img src={truckImage} alt="Sand delivery" className="delivery-pic" />
        <div className="delivery-details">
          <h4>Sand delivery</h4>
          <p>East Legon</p>
          <p>12:00 am - 10:00 pm</p>
          <div className="delivery-meta">
            <span className="rating">3.9</span>
            <span className="distance">
              {distanceRemaining !== null ? `Distance Remaining: ${distanceRemaining.toFixed(2)} km` : 'Calculating...'}
            </span>
          </div>
        </div>
      </div>
      {showStartTripButton ? (
        <Trip tripDistance={tripDetails?.distance || 5} onTripEnd={handleTripEnd} />
      ) : (
        <button className="request-fuel" onClick={handleRequestFuel}>
          Request fuel
        </button>
      )}
      {tripEnded && <EndTrip />} {/* Render EndTrip component if trip has ended */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <img src={odometerImage} alt="Odometer" className="odometer-img" />
            <h2>Upload Picture of the Odometer</h2>
            <p>To determine the amount of fuel needed for the trip, upload a picture of the odometer.</p>
            <button className="blue-button" onClick={handleOpenCamera}>
              Open Camera
            </button>
            <button className="white-button" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {showCamera && (
        <div className="modal">
          <div className="modal-content">
            <video ref={videoRef} className="video-feed"></video>
            <div>
              <button className="blue-button" onClick={handleTakePicture}>
                Take Picture
              </button>
            </div>
          </div>
        </div>
      )}
      {showProcessingModal && (
        <div className="modal">
          <div className="modal-content processing-modal">
            <img src={spinningWheel} alt="Processing" className="processing-img" />
            <h3>Analyzing data...</h3>
          </div>
        </div>
      )}
      {showResultModal && (
        <div className="modal">
          <div className="modal-content result-modal">
            <img src={gasFillerImage} alt="Gas filler" className="gas-filler-img" />
            <h2>$100</h2>
            <p>According to the trip duration, this is the amount of fuel needed to complete your journey.</p>
            <div>
              <button className="blue-button big-button" onClick={handleProceed}>
                Proceed
              </button>
              <button className="white-button big-button" onClick={() => setShowResultModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="modal">
          <div className="modal-content success-modal">
            <img src={successTickImage} alt="Success" className="success-tick-img" />
            <h3>Refuel request successful</h3>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <div className="success-popup">
          <p>Refuel request successful!</p>
        </div>
      )}
    </div>
  );
};

export default DriverView;

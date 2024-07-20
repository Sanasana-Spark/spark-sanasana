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
  const [showStartTripButton, setShowStartTripButton] = useState(false);
  const [showStartTripMessage, setShowStartTripMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [tripEnded, setTripEnded] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mapRef = useRef(null);
  const [tripDistance, setTripDistance] = useState(5); // Updated to default to 5 km

  useEffect(() => {
    const initMap = () => {
      if (window.google && mapRef.current) {
        new window.google.maps.Map(mapRef.current, {
          center: { lat: 37.7749, lng: -122.4194 },
          zoom: 10,
        });
      }
    };

    if (!window.google) {
      loadScript(`https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`, initMap);
    } else {
      initMap();
    }
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

  const handleProceed = () => {
    setShowResultModal(false);
    setShowSuccessModal(true);

    setTimeout(() => {
      setShowSuccessModal(false);
      setShowSuccessMessage(true);
      setShowStartTripButton(true);
    }, 3000);
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
            <img src={profileImage} alt="Nana Kwame" className="profile-pic" />
            <h3>Nana Kwame</h3>
            <p>Madina</p>
          </div>
          <div className="contact-info">
            <p>Benz Aligon</p>
            <p>BE 75324</p>
            <p>Construction Material</p>
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
            <span className="distance">100 Km</span>
          </div>
        </div>
      </div>
      {showStartTripButton ? (
        <Trip tripDistance={tripDistance} onTripEnd={handleTripEnd} />
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
          <div className="modal-content result-modal">
            <img src={successTickImage} alt="Success tick" className="gas-filler-img" />
            <h2>Your request has been successfully submitted</h2>
            <div>
              <button className="blue-button big-button" onClick={() => setShowSuccessModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessMessage && (
        <div className="success-message-popup">
          <p>Your request has been successfully submitted</p>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

export default DriverView;

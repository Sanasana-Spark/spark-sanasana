import React, { useState, useEffect } from 'react';
import Map from "../../components/maps/singleTripMap"
import { Button } from '@mui/material';




const DriverHome = () => {
  const center = { lat:5.66667, lng: 0.0000 }
  const baseURL = process.env.REACT_APP_BASE_URL
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    const apiUrl = `${baseURL}/trips`;
    // to be corrected to dynamic
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTrips(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL]); // Empty dependency array ensures this effect runs only once when the component mounts
  console.log(trips)
  if (loading) return <div>Loading...</div>;


  return (
    <>
    <Map
    startpoint = {center}
    endpoint = {center}
     key = {1}
    />

<Button>
  Request fuel 
</Button>
    </>
   
  )
}

export default DriverHome
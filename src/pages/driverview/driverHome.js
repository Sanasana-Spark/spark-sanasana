import React, { useState, useEffect } from "react";
import Map from "../../components/maps/singleTripMap";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddFuelRequest from "../../components/driver-view/addFuelRequest";

import { useAuthContext } from "../../components/onboarding/authProvider";

const DriverHome = () => {
  const center = { lat: 5.66667, lng: 0.0 };
  const baseURL = process.env.REACT_APP_BASE_URL;

  const { userId, org_id } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [trips, setTrips] = useState([]);
  console.log(trips);
  const [inProgressTrip, setInProgressTrip] = useState(null);
  const [inProgressTripId, setInProgressTripId] = useState(null);

  useEffect(() => {
    const apiUrl = `${baseURL}/trips`;

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

        // Find the first trip with status "In-progress"
        const inProgressTrip = data.find(
          (trip) => trip.t_status === "In-progress"
        );
        if (inProgressTrip) {
          setInProgressTrip(inProgressTrip);
          setInProgressTripId(inProgressTrip.id);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL]);

  // const center = { lat:inProgressTrip.t_start_lat , lng: inProgressTrip.t_start_long };

  const handleSubmit = (capturedImage) => {
    capturedImage.preventDefault();

    if (inProgressTripId) {
      const payload = {
        // Your payload data
        f_created_by: userId,
        f_organization_id: org_id,
        f_operator_id: inProgressTrip.t_operator_id,
        f_asset_id: inProgressTrip.t_asset_id,
        f_trip_id: inProgressTripId,
        f_odometer_image: capturedImage,
      };

      fetch(`${baseURL}/fuel/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
        });
    } else {
      console.error("No in-progress trip found.");
    }
  };
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleStartTrip = () => {
    navigate("/newtrips");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Map startpoint={center} endpoint={center} key={1} />

      {inProgressTrip ? (
        <Box>
          <AddFuelRequest
            open={open}
            onSubmit={handleSubmit}
            onCancel={handleClose}
          />

          <Button onClick={handleOpen}>Request Fuel</Button>
        </Box>
      ) : (
        <Button onClick={handleStartTrip}>Start Trip</Button>
      )}
    </>
  );
};

export default DriverHome;

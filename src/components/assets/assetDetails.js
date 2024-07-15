/* eslint-disable react/prop-types */
import { React, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Loader from '../loader'

const PropCard = ({ selectedProperty }) => {
  const baseURL = process.env.REACT_APP_BASE_URL;

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const apiUrl = `${baseURL}/units`;
    // to be corrected to dynamic
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setUnits(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [baseURL]); // Empty dependency array ensures this effect runs only once when the component mounts

  const propertyUnits = units.filter(
    (unit) => unit["u_p_id"] === selectedProperty
  );

  console.log(selectedProperty);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Unitcode</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Start-date</TableCell>
            <TableCell>End-date</TableCell>
            <TableCell>Tenant </TableCell>
            <TableCell>Tenant Mobile</TableCell>
            <TableCell>Lease No </TableCell>
          </TableRow>
        </TableHead>
        {!loading && (
          <>
            <TableBody>
              {propertyUnits.map((unit) => (
                <TableRow key={unit.u_id}>
                  <TableCell>{unit.u_name}</TableCell>
                  <TableCell>{unit.u_description}</TableCell>
                  <TableCell>{unit.u_type}</TableCell>
                  <TableCell>{unit.u_status}</TableCell>
                  <TableCell>{unit.l_start_date}</TableCell>
                  <TableCell>{unit.l_end_date}</TableCell>
                  <TableCell>{unit.l_lessee_name}</TableCell>
                  <TableCell>{unit.l_code}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
        
        { loading && ( <Loader/>
        )}
      </Table>
    </TableContainer>
  );
};

export default PropCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HistoryIcon from '@mui/icons-material/History';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TripOriginIcon from '@mui/icons-material/TripOrigin';

const BottomBar = () => {
  const [value, setValue] = React.useState(1); // Set the initial value to the index of /drive
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate('/history');
        break;
      case 1:
        navigate('/drive');
        break;
      case 2:
        navigate('/newtrips');
        break;
      default:
        break;
    }
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      style={{ width: '100%', position: 'fixed', bottom: 0 }}
    >
      <BottomNavigationAction label="History" icon={<HistoryIcon />} />
      <BottomNavigationAction label="Drive" icon={<DirectionsCarIcon />} />
      <BottomNavigationAction label="New Trips" icon={<TripOriginIcon />} />
    </BottomNavigation>
  );
};

export default BottomBar;

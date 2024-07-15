// components/ProtectedRoute.js
import React from 'react';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        {navigate('/signin')}
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;

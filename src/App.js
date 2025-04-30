import React from 'react';

import {SignIn , SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/onboarding/authProvider';
import ProtectedRoute from './components/onboarding/protectedRoute';
import Layout from "./components/layout/layout";
import DashboardPage from './pages/dashboard'
import Assets from './pages/assets'
import Operators from './pages/operators'
import Clients from './pages/clients'
import Fuel from './pages/fuel'
import Trips from './pages/trips'
import Maintenance from './pages/maintenance'
import Reports from './pages/reports'
import Settings from './pages/settings'
import Helpcenter from './pages/helpcenter'
import Logout from './pages/logout'

import './App.css';
 


const App = () => {
  
  return (
    <Router>
      <div className="App">
      <AuthProvider>
        <Routes>

        <Route path="/signin" element={ <SignIn />  } /> 
        <Route path="*" element={<Navigate to="/signin" />} />
       


        <Route path="/login" element={<SignedOut> <SignInButton /></SignedOut>}  />
       

       <Route path="/" element={<ProtectedRoute> <Layout> <DashboardPage /> </Layout> </ProtectedRoute>} />
      <Route path="/assets" element={<SignedIn>  <Layout>  <Assets/> </Layout> </SignedIn> } />  
      <Route path="/operators" element={<SignedIn>  <Layout> <Operators/> </Layout> </SignedIn> } /> 
      <Route path="/clients" element={<SignedIn>  <Layout> <Clients/> </Layout> </SignedIn> } />
      <Route path="/fuel" element={<SignedIn>  <Layout> <Fuel/> </Layout> </SignedIn> } />      
      <Route path="/trips" element={<SignedIn>  <Layout> <Trips/> </Layout> </SignedIn> } />         
      <Route path="/maintenance" element={<SignedIn> <Layout> <Maintenance/> </Layout> </SignedIn>   } />
      <Route path="/reports" element={<SignedIn> <Layout> <Reports/> </Layout> </SignedIn>   } />
      <Route path="/settings" element={<SignedIn> <Layout> <Settings/> </Layout> </SignedIn>   } />
      <Route path="/helpcenter" element={<SignedIn> <Layout> <Helpcenter/> </Layout> </SignedIn>   } />

      <Route path="/logout" element={<SignedIn> <Layout> <Logout/> </Layout>  </SignedIn>  } />

        </Routes>
        </AuthProvider>
      </div>
    </Router>
   
  );
}

export default App;

import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from "./components/layout/layout";
import DashboardPage from './pages/dashboard'
import Assets from './pages/assets'
import Maintenance from './pages/maintenance'
import Reports from './pages/reports'
import Settings from './pages/settings'
import Helpcenter from './pages/helpcenter'
import Logout from './pages/logout'


import SignIn from './components/onboarding/signIn/SignIn';
import Step1 from './components/onboarding/signUp/Step1';
import Step2 from './components/onboarding/signUp/Step2';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>

        <Route path="" element={<SignedIn><UserButton /></SignedIn>}  />
        <Route path="" element={<SignedOut> <SignInButton /></SignedOut>}  />

        <Route path="/" element={<SignedOut>    <Step1 /> </SignedOut>} /> 
        <Route path="/step" element={ <SignedOut> <Step2 /> </SignedOut>} /> 
        <Route path="/signin" element={<SignedOut> <SignIn /> </SignedOut> } /> 


       <Route path="/dashboard" element={<SignedOut> <Layout> <DashboardPage /> </Layout> </SignedOut>} />
      <Route path="/assets" element={<SignedOut>  <Layout> <Assets/> </Layout> </SignedOut> } />     
      <Route path="/maintenance" element={<SignedOut> <Layout> <Maintenance/> </Layout> </SignedOut>   } />
      <Route path="/reports" element={<SignedOut> <Layout> <Reports/> </Layout> </SignedOut>   } />
      <Route path="/settings" element={<SignedOut> <Layout> <Settings/> </Layout> </SignedOut>   } />
      <Route path="/helpcenter" element={<SignedOut> <Layout> <Helpcenter/> </Layout> </SignedOut>   } />
      <Route path="/logout" element={<SignedIn> <Layout> <Logout/> </Layout>  </SignedIn>  } />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

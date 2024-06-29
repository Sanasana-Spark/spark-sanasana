import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/onboarding/signIn/SignIn';
import Step1 from './components/onboarding/signUp/Step1';
import Step2 from './components/onboarding/signUp/Step2';
import Dashboard from './components/dashboardMain/DashboardMain';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/step1" element={<Step1 />} />
          <Route path="/step2" element={<Step2 />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<SignIn />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

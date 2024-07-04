import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import {FaGoogle} from 'react-icons/fa'

const SignIn = () => {
  const navigate = useNavigate();

  const handleContinue = (e) => {
    e.preventDefault();
    // Here you can add any authentication logic if needed
    navigate('/dashboard');
  };

  return (
    <div className="signInContainer">
      <div className="leftPanel">
        <div className="iconContainer">
          <FaGoogle />
          {/* <img src="https://path-to-your-icon.com/icon.png" alt="Icon" className="icon" /> */}
          <h2>Sign in or create an account</h2>
        </div>
      </div>
      <div className="rightPanel">
        <div className="formContainer">
          <h2>Sign In</h2>
          <p>New user? <a href="/create-account" className="createAccountLink">Create an account</a></p>
          <form onSubmit={handleContinue}>
            <div className="formGroup">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Ami Hayford" 
                required 
              />
            </div>
            <button type="submit" className="continueButton">Continue</button>
          </form>
          <div className="orSeparator">Or</div>
          <button className="googleButton">
            <FaGoogle />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;


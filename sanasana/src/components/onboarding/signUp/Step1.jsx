import React from 'react';
import './Step1.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const CreateAccount = () => {
  return (
    <div className="createAccountContainer">
      <div className="leftPanel">
        <div className="iconContainer">
          <img src="https://path-to-your-icon.com/icon.png" alt="Icon" className="icon" />
          <h2>Sign in or create an account</h2>
        </div>
      </div>
      <div className="rightPanel">
        <div className="formContainer">
          <h2>Step 1 of 2</h2>
          <h3>Create an account</h3>
          <button className="googleButton">
            <FontAwesomeIcon icon={faGoogle} className="googleIcon" />
            Continue with Google
          </button>
          <div className="orSeparator">Or</div>
          <h4>Sign up with email</h4>
          <p>Already have an account? <a href="/sign-in" className="signInLink">Sign In</a></p>
          <form>
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
            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder="Password" 
                required 
              />
            </div>
            <button type="submit" className="nextButton">Next</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccount;

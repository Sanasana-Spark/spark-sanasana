import React from 'react';
import './CreateAccountForm.css';

const CreateAccountForm = () => {
  return (
    <div className="createAccountContainer">
      <div className="leftPanel">
        <div className="iconContainer">
          <img src="/path/to/your/assets/icon.png" alt="Icon" className="icon" />
          <h2>Sign in or create an account</h2>
        </div>
      </div>
      <div className="rightPanel">
        <div className="formContainer">
          <h2>Welcome to Sana Sana</h2>
          <p>Please take a moment to complete your account</p>
          <form>
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Ami Hayford" 
                  required 
                />
              </div>
              <div className="formGroup">
                <label htmlFor="companyName">Company Name</label>
                <input 
                  type="text" 
                  id="companyName" 
                  name="companyName" 
                  placeholder="Ami Construction Ltd" 
                  required 
                />
              </div>
            </div>
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="country">Country</label>
                <input 
                  type="text" 
                  id="country" 
                  name="country" 
                  placeholder="amicomstruction@gmail.com" 
                  required 
                />
              </div>
              <div className="formGroup">
                <label htmlFor="industry">Industry</label>
                <select id="industry" name="industry" required>
                  <option value="construction">Construction</option>
            
                </select>
              </div>
            </div>
            <div className="formRow">
              <div className="formGroup">
                <label htmlFor="role">Role</label>
                <select id="role" name="role" required>
                  <option value="operations-manager">Operations Manager</option>
                  
                </select>
              </div>
              <div className="formGroup">
                <label htmlFor="roleDuplicate">Role</label>
                <select id="roleDuplicate" name="roleDuplicate" required>
                  <option value="operations-manager">Operations Manager</option>
                  
                </select>
              </div>
            </div>
            <p className="infoText">
              Sana Sana may keep me informed with personalized emails about products and services. See our 
              <a href="/privacy-policy" className="privacyLink">Privacy Policy</a> for more details or to opt-out at any time.
            </p>
            <div className="formGroup">
              <input type="checkbox" id="contactMe" name="contactMe" />
              <label htmlFor="contactMe">Please contact me via email</label>
            </div>
            <p className="termsText">
              By clicking Create account, I agree that I have read and accepted the 
              <a href="/terms-of-use" className="termsLink">Terms of Use</a> and 
              <a href="/privacy-policy" className="privacyLink">Privacy Policy</a>.
            </p>
            <button type="submit" className="createAccountButton">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateAccountForm;

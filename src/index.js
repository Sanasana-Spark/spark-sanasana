import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { ClerkProvider } from '@clerk/clerk-react'


const PUBLISHABLE_KEY1 = process.env.REACT_APP_VITE_CLERK_PUBLISHABLE_KEY;
const PUBLISHABLE_KEY = 'pk_test_cHJvYmFibGUtYnVsbGRvZy00OC5jbGVyay5hY2NvdW50cy5kZXYk'
console.log(process.env);
console.log('key' ,PUBLISHABLE_KEY1)

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

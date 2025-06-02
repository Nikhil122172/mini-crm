// Login.jsx
import React from 'react';
import './Login.css'; // Adjust path if needed

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome to Xeno CRM</h2>
        <p className="login-subtitle">Login with your Google account</p>
        <a href="http://localhost:5000/auth/google" className="google-btn">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google Logo"
            className="google-logo"
          />
          Sign in with Google
        </a>
      </div>
    </div>
  );
}

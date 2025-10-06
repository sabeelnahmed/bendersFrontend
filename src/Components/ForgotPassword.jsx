import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../Context';
import './ForgotPassword.css';

// Asset imports
const videoSignup = "/assets/signupvideo.mp4";
const imgRectangle1538 = "/assets/ba2ac793b77e14c38ef549e7bfdbfb23b6c271ae.svg";
const imgEllipse3 = "/assets/52224bd8f23dade59bab86c939f7bc45d13e8901.svg";
const codebendersLogo = "/assets/codebenders-logo.png";

function ForgotPasswordForm({ className }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await apiClient.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });

      // Success - show message
      setSuccess(true);
      setEmail('');
      
    } catch (err) {
      // Handle error
      const errorMessage = err.response?.data?.detail || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      console.error('Forgot password error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`login-signup-container ${className}`}>
      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header-section">
          <p className="main-heading">
            Reset Your Password
          </p>
          <p className="sub-heading">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Form Section */}
        <div className="form-section">
          {/* Success Message */}
          {success && (
            <div className="success-message">
              Password reset email sent! Please check your inbox.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!success && (
            <>
              {/* Email Input */}
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  className="signup-input"
                  placeholder="Email address*"
                  disabled={loading}
                />
                <div className="input-border">
                  <img alt="" src={imgRectangle1538} />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                className="login-btn" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </>
          )}

          {/* Back to Login Link */}
          <p className="signup-link">
            <Link to="/login" className="bold">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  return (
    <div className="signup-page">
      {/* Logo Section */}
      <div className="logo-section-top">
        <img src={codebendersLogo} alt="Codebenders Logo" className="logo-image" />
        <div className="logo-text">
          <span className="logo-text-span">Codebenders</span>
        </div>
      </div>

      {/* Background Ellipse */}
      <div className="background-ellipse">
        <img alt="" src={imgEllipse3} />
      </div>

      {/* Forgot Password Form */}
      <ForgotPasswordForm className="login-form-wrapper" />

      {/* Futuristic Background Video */}
      <div className="futuristic-bg">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="background-video"
        >
          <source src={videoSignup} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}


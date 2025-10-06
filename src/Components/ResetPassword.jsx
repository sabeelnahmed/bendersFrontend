import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../Context';
import './ResetPassword.css';

// Asset imports
const videoSignup = "/assets/signupvideo.mp4";
const imgRectangle1539 = "/assets/cd20d7fa8fc004a417b93518ca868a0e7407fc97.svg";
const imgVector12 = "/assets/bb3b2a28d87c62143b4c3ae92c65170ac1d89810.svg";
const imgEllipse3 = "/assets/52224bd8f23dade59bab86c939f7bc45d13e8901.svg";
const codebendersLogo = "/assets/codebenders-logo.png";

function ResetPasswordForm({ className }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Get token from URL query parameters
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiClient.post(API_ENDPOINTS.RESET_PASSWORD, {
        token: token,
        password: formData.password,
      });

      // Success
      alert('Password reset successful! Please log in with your new password.');
      navigate('/login');
      
    } catch (err) {
      // Handle error
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        
        if (detail === 'RESET_PASSWORD_BAD_TOKEN') {
          errorMessage = 'Invalid or expired reset token. Please request a new password reset.';
        } else if (typeof detail === 'object' && detail.code === 'RESET_PASSWORD_INVALID_PASSWORD') {
          errorMessage = detail.reason || 'Password validation failed.';
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }
      
      setError(errorMessage);
      console.error('Reset password error:', err);
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
            Create New Password
          </p>
          <p className="sub-heading">Enter your new password below</p>
        </div>

        {/* Form Section */}
        <div className="form-section">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Password Input */}
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="signup-input"
              placeholder="New Password*"
              disabled={loading || !token}
            />
            <div className="input-border">
              <img alt="" src={imgRectangle1539} />
            </div>
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              disabled={loading || !token}
            >
              <img alt="Toggle password visibility" src={imgVector12} />
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="signup-input"
              placeholder="Confirm New Password*"
              disabled={loading || !token}
            />
            <div className="input-border">
              <img alt="" src={imgRectangle1539} />
            </div>
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle"
              disabled={loading || !token}
            >
              <img alt="Toggle password visibility" src={imgVector12} />
            </button>
          </div>

          {/* Submit Button */}
          <button 
            className="login-btn" 
            onClick={handleSubmit}
            disabled={loading || !token}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>

          {/* Back to Login Link */}
          <p className="signup-link">
            <Link to="/login" className="bold">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
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

      {/* Reset Password Form */}
      <ResetPasswordForm className="login-form-wrapper" />

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


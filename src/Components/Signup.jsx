import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../Context';
import './Signup.css';

// Asset imports
const videoSignup = "/assets/signupvideo.mp4";
const imgVector = "/assets/6072142ccf7454e91e3e75c70d5fc4f4c5fde6ac.svg";
const imgRectangle1538 = "/assets/ba2ac793b77e14c38ef549e7bfdbfb23b6c271ae.svg";
const imgRectangle1539 = "/assets/cd20d7fa8fc004a417b93518ca868a0e7407fc97.svg";
const imgVector12 = "/assets/bb3b2a28d87c62143b4c3ae92c65170ac1d89810.svg";
const imgEllipse3 = "/assets/52224bd8f23dade59bab86c939f7bc45d13e8901.svg";
const codebendersLogo = "/assets/codebenders-logo.png";

function Microsoft({ className }) {
  return (
    <div className={className}>
      <div className="microsoft-grid">
        <div className="microsoft-yellow"></div>
        <div className="microsoft-blue"></div>
        <div className="microsoft-green"></div>
        <div className="microsoft-red"></div>
      </div>
    </div>
  );
}

function SocialIcons({ className, platform = "Google" }) {
  if (platform === "Google") {
    return (
      <div className={className}>
        <img alt="Google" src={imgVector} />
      </div>
    );
  }
  return null;
}

function SignupForm({ className }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
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

    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post(API_ENDPOINTS.REGISTER, {
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        // Optional: you can add username if needed
        // username: formData.email.split('@')[0],
      });

      // Handle successful signup (201 response with UserRead object)
      console.log('Signup successful:', response.data);
      
      // Store user data
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      // Show success message
      alert('Account created successfully! Please log in.');
      
      // Navigate to login page
      navigate('/login');
      
    } catch (err) {
      // Handle error
      let errorMessage = 'Signup failed. Please try again.';
      
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        
        // Handle different error types
        if (detail === 'REGISTER_USER_ALREADY_EXISTS') {
          errorMessage = 'A user with this email already exists.';
        } else if (typeof detail === 'object' && detail.code === 'REGISTER_INVALID_PASSWORD') {
          errorMessage = detail.reason || 'Password validation failed.';
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }
      
      setError(errorMessage);
      console.error('Signup error:', err);
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
            Join Codebenders Today
          </p>
          <p className="sub-heading">Create your account to get started</p>
        </div>

        {/* Form Section */}
        <div className="form-section">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div className="input-wrapper">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="signup-input"
              placeholder="Full Name*"
              disabled={loading}
            />
            <div className="input-border">
              <img alt="" src={imgRectangle1538} />
            </div>
          </div>

          {/* Email Input */}
          <div className="input-wrapper">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="signup-input"
              placeholder="Email address*"
              disabled={loading}
            />
            <div className="input-border">
              <img alt="" src={imgRectangle1538} />
            </div>
          </div>

          {/* Password Input */}
          <div className="input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="signup-input"
              placeholder="Password*"
              disabled={loading}
            />
            <div className="input-border">
              <img alt="" src={imgRectangle1539} />
            </div>
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              disabled={loading}
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
              placeholder="Confirm Password*"
              disabled={loading}
            />
            <div className="input-border">
              <img alt="" src={imgRectangle1539} />
            </div>
            <button 
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="password-toggle"
              disabled={loading}
            >
              <img alt="Toggle password visibility" src={imgVector12} />
            </button>
          </div>

          {/* Signup Button */}
          <button 
            className="login-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {/* Login Link */}
          <p className="signup-link">
            Already have an account? <Link to="/login" className="bold">Log in</Link>
          </p>
        </div>

        {/* Divider */}
        <div className="divider-section">
          <div className="divider-line left"></div>
          <span className="divider-text">OR</span>
          <div className="divider-line right"></div>
        </div>

        {/* Social Login Section */}
        <div className="social-section">
          <div className="social-icons-row">
            <button className="social-btn" title="Continue with Google">
              <SocialIcons platform="Google" className="social-icon-wrapper" />
            </button>

            <button className="social-btn" title="Continue with Microsoft">
              <Microsoft className="microsoft-icon-wrapper" />
            </button>
          </div>

          <p className="terms-text">
            By continuing, you agree with our <span className="bold underline">Terms of Service</span> and <span className="bold underline">Privacy Policy.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Signup() {
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

      {/* Signup Form */}
      <SignupForm className="login-form-wrapper" />

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


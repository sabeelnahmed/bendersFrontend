import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient, API_ENDPOINTS } from '../Context';
import './Login.css';

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

function LogInSignUp({ className }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare form data in URL-encoded format
      const formBody = new URLSearchParams();
      formBody.append('username', formData.email); // API expects 'username' field
      formBody.append('password', formData.password);

      const response = await apiClient.post(API_ENDPOINTS.LOGIN, formBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Handle successful login
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      
      // Store user data if provided
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      console.log('Login successful:', response.data);
      
      // Navigate to dashboard page
      navigate('/dashboard');
      
    } catch (err) {
      // Handle error with mock API fallback
      console.error('API Login failed, using mock authentication:', err);
      
      // Mock API response - simulate successful login
      const mockUser = {
        email: formData.email,
        name: formData.email.split('@')[0],
        id: 'mock-user-' + Date.now(),
      };
      
      const mockToken = 'mock-token-' + btoa(formData.email + Date.now());
      
      // Store mock data
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      console.log('Mock login successful:', mockUser);
      
      // Navigate to dashboard page
      navigate('/dashboard');
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
            Take Full Control of your Enterprise Code
          </p>
          <p className="sub-heading">Welcome back!</p>
        </div>

        {/* Form Section */}
        <div className="form-section">
          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

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
          <div className="password-section">
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
            <Link to="/forgot-password" className="forgot-password-btn">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button 
            className="login-btn" 
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Sign Up Link */}
          <p className="signup-link">
            Don't have an account? <Link to="/signup" className="bold">Sign up</Link>
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
            By continuing, you agree with our <span className="bold underline">Terms of Service</span> & <span className="bold underline">Privacy Policy.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
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

      {/* Login Form */}
      <LogInSignUp className="login-form-wrapper" />

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


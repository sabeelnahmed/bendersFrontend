import React, { useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS } from '../Context';

// Main ThirdPartyKey component - Apple minimalist design
export default function ThirdPartyKey({ onNavigateNext }) {
  const [apiKeyRequirements, setApiKeyRequirements] = useState([]);
  const [apiKeys, setApiKeys] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    console.log('🔍 ThirdPartyKey - Loading API key requirements...');
    
    // Get API key requirements from localStorage
    const storedRequirements = localStorage.getItem('apiKeyRequirements');
    console.log('📦 Raw localStorage data:', storedRequirements);
    
    if (storedRequirements) {
      try {
        const parsed = JSON.parse(storedRequirements);
        console.log('✅ Parsed requirements:', parsed);
        console.log('📊 Number of providers:', parsed ? parsed.length : 0);
        
        setApiKeyRequirements(parsed);
        
        // Initialize empty API keys object
        const initialKeys = {};
        parsed.forEach(req => {
          req.keys_required.forEach(key => {
            initialKeys[key.field] = '';
          });
        });
        setApiKeys(initialKeys);
        console.log('✅ Initialized API keys structure');
      } catch (error) {
        console.error('❌ Error parsing requirements:', error);
      }
    } else {
      console.warn('⚠️ No API key requirements found in localStorage');
    }
    
    setLoading(false);
  }, []);

  const handleKeyChange = (field, value) => {
    setApiKeys(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    // Validate all required keys are filled
    const emptyKeys = Object.entries(apiKeys).filter(([_, value]) => !value.trim());
    
    if (emptyKeys.length > 0) {
      alert('Please fill in all API keys to continue');
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log('📤 Submitting API keys...');
      console.log('🔑 API keys:', apiKeys);
      
      // Get user_id and project_id from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

      // TODO: Send API keys to backend
      // This endpoint doesn't exist yet in mock_backend.py
      // For now, we'll just store in localStorage and navigate
      
      localStorage.setItem('thirdPartyApiKeys', JSON.stringify(apiKeys));
      console.log('💾 API keys stored in localStorage');
      
      // Small delay to ensure localStorage is written
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to next step on success
      if (onNavigateNext) {
        console.log('🚀 Navigating to next step...');
        onNavigateNext();
      } else {
        console.warn('⚠️ onNavigateNext callback not provided');
      }
    } catch (err) {
      console.error('Error submitting API keys:', err);
      alert(err.message || 'Failed to save API keys');
    } finally {
      // Always reset the submitting state
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.contentWrapper}>
              <main style={styles.mainSection}>
                <div style={styles.loadingContainer}>
                  <div style={styles.loadingSpinner}></div>
                  <p style={styles.loadingText}>Loading API key requirements...</p>
                </div>
              </main>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!apiKeyRequirements || apiKeyRequirements.length === 0) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.contentWrapper}>
              <main style={styles.mainSection}>
                <div style={styles.emptyState}>
                  <p style={styles.emptyStateText}>No API keys required</p>
                </div>
              </main>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Flatten all keys into a single array for minimalist card layout
  const allKeys = [];
  apiKeyRequirements.forEach(requirement => {
    requirement.keys_required.forEach(keyInfo => {
      allKeys.push({
        ...keyInfo,
        provider: requirement.provider,
        category: requirement.category
      });
    });
  });

  // Calculate how many keys are filled
  const filledKeys = Object.values(apiKeys).filter(val => val.trim()).length;
  const totalKeys = allKeys.length;

  return (
    <>
      <style>{styles.cssStyles}</style>
      <div style={styles.appContainer}>
        <div style={styles.mainContentContainer}>
          <div style={styles.contentWrapper}>
            <main style={styles.mainSection}>
              {/* Header Section */}
              <div style={styles.headerSection}>
                <h1 style={styles.pageTitle}>Configure API Keys</h1>
                <p style={styles.pageSubtitle}>
                  Enter credentials for your selected providers
                </p>
              </div>

              {/* API Keys Grid - Minimalist Card Layout */}
              <div style={styles.keysGrid}>
                {allKeys.map((keyInfo, index) => {
                  const isFilled = apiKeys[keyInfo.field] && apiKeys[keyInfo.field].trim();
                  const isFocused = focusedField === keyInfo.field;
                  
                  return (
                    <KeyCard
                      key={index}
                      keyInfo={keyInfo}
                      value={apiKeys[keyInfo.field] || ''}
                      onChange={(value) => handleKeyChange(keyInfo.field, value)}
                      onFocus={() => setFocusedField(keyInfo.field)}
                      onBlur={() => setFocusedField(null)}
                      isFilled={isFilled}
                      isFocused={isFocused}
                    />
                  );
                })}
              </div>

              {/* Action Footer */}
              <div style={styles.actionFooter}>
                <div style={styles.selectionInfo}>
                  <span style={styles.selectionCount}>
                    {filledKeys} of {totalKeys} configured
                  </span>
                </div>
                <button
                  className="key-continue-button"
                  style={{
                    ...styles.continueButton,
                    ...(filledKeys !== totalKeys || isSubmitting ? styles.continueButtonDisabled : {})
                  }}
                  onClick={handleSubmit}
                  disabled={filledKeys !== totalKeys || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="key-spinner" style={{...styles.spinner, marginBottom: 0, width: '18px', height: '18px', borderWidth: '2px'}}></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRightIcon />
                    </>
                  )}
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

// Key Card Component - Minimalist & Clean
const KeyCard = ({ keyInfo, value, onChange, onFocus, onBlur, isFilled, isFocused }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div
      className="key-card"
      style={{
        ...styles.keyCard,
        ...(isFocused ? styles.keyCardFocused : {}),
        ...(isFilled ? styles.keyCardFilled : {})
      }}
    >
      {/* Filled Indicator */}
      <div style={{
        ...styles.filledIndicator,
        ...(isFilled ? styles.filledIndicatorActive : {})
      }}>
        {isFilled && <CheckIcon />}
      </div>

      {/* Provider Name - Subtle */}
      <div style={styles.providerLabel}>{keyInfo.provider}</div>

      {/* Key Name - Main Focus */}
      <h3 style={styles.keyName}>{keyInfo.name}</h3>

      {/* Description - Subtle */}
      <p style={styles.keyDescription}>{keyInfo.description}</p>

      {/* Input Field - Clean & Spacious */}
      <div style={styles.inputWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          style={{
            ...styles.keyInput,
            ...(isFocused ? styles.keyInputFocused : {})
          }}
          placeholder="••••••••••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <button
          style={styles.toggleButton}
          onClick={() => setShowPassword(!showPassword)}
          type="button"
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

// Check Icon
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Eye Icon
const EyeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

// Eye Off Icon
const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

// Arrow Right Icon
const ArrowRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

// Styles object - Apple minimalist design
const styles = {
  cssStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .key-card {
      animation: fadeIn 0.5s ease-out backwards;
    }

    .key-continue-button:hover {
      opacity: 0.9;
    }

    .key-continue-button:active {
      opacity: 0.8;
    }
  `,

  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    color: '#ffffff',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  mainContentContainer: {
    width: '100%',
    minHeight: '100vh',
    padding: '48px 24px',
  },

  contentWrapper: {
    maxWidth: '1100px',
    margin: '0 auto',
  },

  mainSection: {
    animation: 'fadeIn 0.6s ease-out',
  },

  headerSection: {
    marginBottom: '40px',
    textAlign: 'center',
  },

  pageTitle: {
    fontSize: '32px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },

  pageSubtitle: {
    fontSize: '15px',
    fontWeight: '400',
    color: '#666666',
    maxWidth: '500px',
    margin: '0 auto',
    lineHeight: '1.5',
  },

  keysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
    marginBottom: '48px',
  },

  keyCard: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    padding: '20px',
    transition: 'all 0.2s ease',
    cursor: 'default',
  },

  keyCardFocused: {
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
  },

  keyCardFilled: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },

  filledIndicator: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1.5px solid rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },

  filledIndicatorActive: {
    background: '#ffffff',
    border: '1.5px solid #ffffff',
  },

  providerLabel: {
    fontSize: '11px',
    fontWeight: '500',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },

  keyName: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '6px',
    letterSpacing: '-0.01em',
  },

  keyDescription: {
    fontSize: '13px',
    color: '#888888',
    lineHeight: '1.4',
    marginBottom: '16px',
  },

  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  keyInput: {
    width: '100%',
    padding: '12px 40px 12px 12px',
    fontSize: '14px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    color: '#ffffff',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: "'SF Mono', 'Monaco', 'Courier New', monospace",
    letterSpacing: '0.01em',
  },

  keyInputFocused: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  },

  toggleButton: {
    position: 'absolute',
    right: '8px',
    background: 'none',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    outline: 'none',
  },

  actionFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px 0 0 0',
  },

  selectionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  selectionCount: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#888888',
  },

  continueButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 32px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    background: '#D16021',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },

  continueButtonDisabled: {
    opacity: '0.4',
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },

  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '24px',
  },

  loadingSpinner: {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(209, 96, 33, 0.2)',
    borderTop: '4px solid #D16021',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  loadingText: {
    fontSize: '16px',
    color: '#999999',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },

  emptyStateText: {
    fontSize: '18px',
    color: '#999999',
  },
};


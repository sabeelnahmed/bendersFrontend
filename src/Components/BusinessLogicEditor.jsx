import React, { useState } from 'react';

export default function BusinessLogicEditor() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAccessClick = () => {
    setShowPasswordModal(true);
    setPassword('');
    setShowError(false);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'Alpha@12345678') {
      setIsAuthenticated(true);
      setShowPasswordModal(false);
      setShowError(false);
    } else {
      setShowError(true);
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setShowError(false);
  };

  if (isAuthenticated) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.contentWrapper}>
              <h1 style={styles.pageTitle}>Business Logic Editor</h1>
              <p style={styles.pageDescription}>
                This section will contain the business logic editor.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles.cssStyles}</style>
      <div style={styles.appContainer}>
        <div style={styles.mainContentContainer}>
          <div style={styles.contentWrapper}>
            {/* Lock Icon */}
            <div style={styles.lockIconContainer}>
              <LockIcon />
            </div>

            {/* Restricted Access Message */}
            <h1 style={styles.restrictedTitle}>Restricted Access</h1>
            <p style={styles.restrictedDescription}>
              Sorry, you do not have permission to access this feature.
            </p>
            <p style={styles.restrictedSubtext}>
              This section is reserved for authorized administrators only.
            </p>

            {/* Access Button */}
            <button 
              className="access-admin-button" 
              style={styles.accessButton}
              onClick={handleAccessClick}
            >
              Access as Admin
            </button>
          </div>
        </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div style={styles.modalOverlay} onClick={handleCloseModal}>
            <div 
              className="password-modal" 
              style={styles.modalContent} 
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Administrator Access</h2>
                <button 
                  style={styles.modalCloseButton} 
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} style={styles.modalBody}>
                {showError && (
                  <div className="error-banner" style={styles.errorBanner}>
                    <span style={styles.errorIcon}>⚠️</span>
                    <span>Password denied. Access not granted.</span>
                  </div>
                )}

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Administrator Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter administrator password"
                    style={styles.passwordInput}
                    autoFocus
                  />
                </div>

                <div style={styles.modalFooter}>
                  <button 
                    type="button" 
                    style={styles.cancelButton}
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-button"
                    style={styles.submitButton}
                    disabled={!password}
                  >
                    Authenticate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Lock Icon Component
const LockIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="16" r="1.5" fill="currentColor"/>
  </svg>
);

// Styles object - Premium Minimalist Design
const styles = {
  cssStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
    
    body {
      margin: 0;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Refined animations */
    @keyframes restrictedFadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes lockIconFloat {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-24px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes errorShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-8px); }
      75% { transform: translateX(8px); }
    }

    /* Button hover effects */
    .access-admin-button:hover {
      background: linear-gradient(135deg, #e87332 0%, #f28a4a 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(208, 93, 29, 0.45);
    }

    .access-admin-button:active {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(208, 93, 29, 0.4);
    }

    .submit-button:hover {
      background: linear-gradient(135deg, #e87332 0%, #f28a4a 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(208, 93, 29, 0.45);
    }

    .submit-button:active {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(208, 93, 29, 0.4);
    }

    .submit-button:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: 0 4px 16px rgba(208, 93, 29, 0.35) !important;
    }

    .password-modal {
      animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .error-banner {
      animation: errorShake 0.4s ease-out;
    }
  `,

  appContainer: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  mainContentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflowY: 'auto',
    backgroundColor: '#101010',
    padding: '40px 32px',
    minHeight: '100vh',
  },

  contentWrapper: {
    width: '100%',
    maxWidth: '560px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    animation: 'restrictedFadeIn 0.8s ease-out',
  },

  // Lock Icon
  lockIconContainer: {
    width: '120px',
    height: '120px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '0.5px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px',
    color: 'rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
    animation: 'lockIconFloat 3s ease-in-out infinite',
  },

  // Typography
  restrictedTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '500',
    fontSize: '42px',
    color: '#ffffff',
    margin: '0 0 16px 0',
    letterSpacing: '-1.2px',
    lineHeight: '1.1',
  },

  restrictedDescription: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '400',
    fontSize: '18px',
    color: 'rgba(255, 255, 255, 0.65)',
    margin: '0 0 8px 0',
    letterSpacing: '-0.2px',
    lineHeight: '1.6',
  },

  restrictedSubtext: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '400',
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.45)',
    margin: '0 0 48px 0',
    letterSpacing: '-0.1px',
    lineHeight: '1.5',
  },

  // Access Button - Premium Orange
  accessButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 36px',
    background: 'linear-gradient(135deg, #d05d1d 0%, #e87332 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '15px',
    fontWeight: '600',
    letterSpacing: '-0.2px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(208, 93, 29, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
  },

  // Page title (authenticated state)
  pageTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '450',
    fontSize: '36px',
    color: '#ffffff',
    margin: '0 0 16px 0',
    letterSpacing: '-0.8px',
    lineHeight: '1.15',
  },

  pageDescription: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '400',
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.65)',
    margin: 0,
    letterSpacing: '-0.2px',
    lineHeight: '1.6',
  },

  // Modal Overlay
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },

  // Modal Content
  modalContent: {
    position: 'relative',
    width: '92%',
    maxWidth: '440px',
    background: 'rgba(28, 28, 28, 0.95)',
    backdropFilter: 'blur(60px) saturate(160%)',
    WebkitBackdropFilter: 'blur(60px) saturate(160%)',
    border: '0.5px solid rgba(255, 255, 255, 0.14)',
    borderRadius: '20px',
    boxShadow: '0 32px 64px rgba(0, 0, 0, 0.56), 0 0 0 0.5px rgba(255, 255, 255, 0.08) inset',
    overflow: 'hidden',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '28px 32px 20px',
    borderBottom: '0.5px solid rgba(255, 255, 255, 0.1)',
  },

  modalTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.5px',
  },

  modalCloseButton: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '0.5px solid rgba(255, 255, 255, 0.1)',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    fontSize: '24px',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    lineHeight: '1',
    padding: 0,
  },

  modalBody: {
    padding: '28px 32px 32px',
  },

  // Error Banner
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    background: 'rgba(220, 38, 38, 0.12)',
    border: '0.5px solid rgba(220, 38, 38, 0.3)',
    borderRadius: '10px',
    color: 'rgba(252, 165, 165, 0.95)',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '24px',
    letterSpacing: '-0.1px',
    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)',
  },

  errorIcon: {
    fontSize: '18px',
    lineHeight: '1',
  },

  // Form Elements
  formGroup: {
    marginBottom: '28px',
  },

  formLabel: {
    display: 'block',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '600',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '10px',
    letterSpacing: '-0.1px',
  },

  passwordInput: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '0.5px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '10px',
    outline: 'none',
    color: '#ffffff',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '14px',
    fontWeight: '400',
    letterSpacing: '-0.1px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxSizing: 'border-box',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
  },

  // Modal Footer
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '28px',
  },

  cancelButton: {
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '0.5px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.95)',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '-0.2px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  submitButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #d05d1d 0%, #e87332 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '14px',
    fontWeight: '600',
    letterSpacing: '-0.2px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(208, 93, 29, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
  },
};


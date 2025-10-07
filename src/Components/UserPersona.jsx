import React, { useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS } from '../Context.jsx';

// Main Persona component with Apple-inspired premium design
export default function UserPersona({ onNavigateNext }) {
  const [personas, setPersonas] = useState([]);
  const [selectedPersonas, setSelectedPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        // Get user_id and project_id from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

        // Make GET request with user_id and project_id as query params
        const response = await apiClient.get(API_ENDPOINTS.GET_USER_PERSONAS, {
          params: {
            user_id: user.id || null,
            project_id: project.id || null,
          },
        });

        // Check if response has personas
        if (response.data && response.data.success) {
          if (response.data.personas && response.data.personas.length > 0) {
            setPersonas(response.data.personas);
            setIsEmpty(false);
          } else {
            // Empty response - no personas found
            setIsEmpty(true);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user personas:', err);
        setError(err.response?.data?.detail || err.message || 'Failed to fetch user personas');
        setLoading(false);
      }
    };

    fetchPersonas();
  }, []);

  const handlePersonaSelect = (personaId) => {
    setSelectedPersonas(prev => {
      const isSelected = prev.includes(personaId);
      
      if (isSelected) {
        // Deselect persona
        setShowLimitWarning(false);
        return prev.filter(id => id !== personaId);
      } else {
        // Check if trying to select more than 2
        if (prev.length >= 2) {
          setShowLimitWarning(true);
          // Auto-hide warning after 4 seconds
          setTimeout(() => setShowLimitWarning(false), 4000);
          return prev;
        }
        setShowLimitWarning(false);
        return [...prev, personaId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedPersonas.length === 0) {
      alert('Please select at least one persona to continue');
      return;
    }

    try {
      setIsUploading(true);
      
      // Get user_id and project_id from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

      // Get the full persona objects for the selected persona IDs
      const selectedPersonaObjects = personas.filter(persona => 
        selectedPersonas.includes(persona.id)
      );

      // Send selected personas to backend
      const response = await apiClient.post(API_ENDPOINTS.UPLOAD_USER_PERSONAS, {
        selected_personas: selectedPersonaObjects,
        user_id: user.id || null,
        project_id: project.id || null,
      });

      console.log('Selected personas uploaded successfully:', response.data);
      
      // Navigate to Business Logic Editor on success
      if (onNavigateNext) {
        onNavigateNext();
      }
    } catch (err) {
      console.error('Error uploading personas:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to save selected personas');
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.loadingContainer}>
              <div className="persona-spinner" style={styles.spinner}></div>
              <p style={styles.loadingText}>Analyzing PRD and identifying user personas...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.errorContainer}>
              <div style={styles.errorIcon}>⚠️</div>
              <h2 style={styles.errorTitle}>Error Loading User Personas</h2>
              <p style={styles.errorText}>{error}</p>
              <button
                className="persona-retry-button"
                style={styles.retryButton}
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Empty state - no personas found
  if (isEmpty) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.emptyContainer}>
              <div style={styles.emptyIcon}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 style={styles.emptyTitle}>No User Personas Found</h2>
              <p style={styles.emptyText}>
                Upload your requirements and start the process to generate user personas for your project.
              </p>
              <p style={styles.emptyHint}>
                Navigate to the PRD section to upload your project requirements document.
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
            <main style={styles.mainSection}>
              {/* Header Section */}
              <div style={styles.headerSection}>
                <h1 style={styles.pageTitle}>Select User Personas</h1>
                <p style={styles.pageSubtitle}>
                  We've identified {personas.length} user personas from your PRD. Select the personas for which you want the application to be built.
                </p>
              </div>

              {/* Limit Warning */}
              {showLimitWarning && (
                <div className="persona-warning" style={styles.warningBanner}>
                  <div style={styles.warningIcon}>⚠️</div>
                  <div style={styles.warningContent}>
                    <strong style={styles.warningTitle}>Demo Version Limit</strong>
                    <p style={styles.warningText}>Our demo version supports up to 2 personas. Please deselect a persona before selecting another.</p>
                  </div>
                </div>
              )}

              {/* Personas Grid */}
              <div style={styles.personasGrid}>
                {personas.map((persona, index) => {
                  const isSelected = selectedPersonas.includes(persona.id);
                  return (
                    <PersonaCard
                      key={persona.id}
                      persona={persona}
                      isSelected={isSelected}
                      onSelect={handlePersonaSelect}
                      index={index}
                    />
                  );
                })}
              </div>

              {/* Action Footer */}
              <div style={styles.actionFooter}>
                <div style={styles.selectionInfo}>
                  <span style={styles.selectionCount}>
                    {selectedPersonas.length} of {Math.min(personas.length, 2)} selected
                  </span>
                  {selectedPersonas.length > 0 && (
                    <span style={styles.selectionHint}>
                      (Demo version allows up to 2 personas)
                    </span>
                  )}
                </div>
                <button
                  className="persona-continue-button"
                  style={{
                    ...styles.continueButton,
                    ...(selectedPersonas.length === 0 || isUploading ? styles.continueButtonDisabled : {})
                  }}
                  onClick={handleContinue}
                  disabled={selectedPersonas.length === 0 || isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="persona-spinner" style={{...styles.spinner, marginBottom: 0, width: '18px', height: '18px', borderWidth: '2px'}}></div>
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

// Persona Card Component - Minimal & Premium
const PersonaCard = ({ persona, isSelected, onSelect }) => {
  return (
    <div
      className="persona-card"
      style={{
        ...styles.personaCard,
        ...(isSelected ? styles.personaCardSelected : {})
      }}
      onClick={() => onSelect(persona.id)}
    >
      {/* Selection Indicator - Top Right */}
      <div style={{
        ...styles.selectionIndicator,
        ...(isSelected ? styles.selectionIndicatorSelected : {})
      }}>
        {isSelected && <CheckIcon />}
      </div>

      {/* Persona Icon - Large & Centered */}
      <div style={styles.personaIconLarge}>
        <UserIcon />
      </div>

      {/* Persona Name */}
      <h3 style={styles.personaName}>{persona.name}</h3>

      {/* Brief Tagline - One Line Only */}
      <p style={styles.personaTagline}>
        {persona.description.split('.')[0]}.
      </p>

      {/* Select Overlay */}
      {isSelected && (
        <div className="persona-selected-overlay" style={styles.selectedOverlay} />
      )}
    </div>
  );
};

// SVG Icons
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Styles object
const styles = {
  cssStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
    
    body {
      margin: 0;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Animations */
    @keyframes personaFadeIn {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes personaCardAppear {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes personaSpin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes personaWarningSlide {
      from {
        opacity: 0;
        transform: translateY(-12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Card Hover Effects */
    .persona-card {
      animation: personaCardAppear 0.5s ease-out backwards;
    }

    .persona-card:nth-child(1) { animation-delay: 0.05s; }
    .persona-card:nth-child(2) { animation-delay: 0.1s; }
    .persona-card:nth-child(3) { animation-delay: 0.15s; }
    .persona-card:nth-child(4) { animation-delay: 0.2s; }

    .persona-card:hover {
      transform: translateY(-6px);
      border-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2), 0 0 0 0.5px rgba(255, 255, 255, 0.06) inset;
    }

    .persona-card:active {
      transform: translateY(-4px);
    }

    /* Continue Button Hover */
    .persona-continue-button:hover {
      background: linear-gradient(135deg, #e87332 0%, #f28a4a 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(208, 93, 29, 0.5);
    }

    .persona-continue-button:active {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(208, 93, 29, 0.4);
    }

    .persona-continue-button:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Warning Animation */
    .persona-warning {
      animation: personaWarningSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Selected Overlay - Subtle */
    .persona-selected-overlay {
      animation: personaFadeOverlay 0.25s ease-out;
    }

    @keyframes personaFadeOverlay {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* Spinner Animation */
    .persona-spinner {
      animation: personaSpin 0.8s linear infinite;
    }

    /* Retry Button Hover */
    .persona-retry-button:hover {
      background: linear-gradient(135deg, #e87332 0%, #f28a4a 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(208, 93, 29, 0.5);
    }

    .persona-retry-button:active {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(208, 93, 29, 0.4);
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
    justifyContent: 'flex-start',
    overflowY: 'auto',
    backgroundColor: '#101010',
    padding: '40px 32px',
    minHeight: '100vh',
  },

  contentWrapper: {
    width: '100%',
    maxWidth: '1200px',
    animation: 'personaFadeIn 0.8s ease-out',
  },

  mainSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },

  // Header Section
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '8px',
  },

  pageTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '450',
    fontSize: '36px',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.4px',
    lineHeight: '1.15',
  },

  pageSubtitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '400',
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.65)',
    margin: 0,
    letterSpacing: '-0.2px',
    lineHeight: '1.6',
    maxWidth: '800px',
  },

  // Warning Banner
  warningBanner: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '18px 24px',
    background: 'rgba(232, 115, 50, 0.08)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '0.5px solid rgba(232, 115, 50, 0.25)',
    borderRadius: '14px',
    boxShadow: '0 4px 16px rgba(232, 115, 50, 0.12)',
  },

  warningIcon: {
    fontSize: '24px',
    lineHeight: '1',
    flexShrink: 0,
  },

  warningContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  warningTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: '-0.2px',
  },

  warningText: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '13px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.75)',
    margin: 0,
    letterSpacing: '-0.1px',
    lineHeight: '1.5',
  },

  // Personas Grid - Premium Layout
  personasGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '24px',
    marginBottom: '16px',
  },

  // Persona Card - Refined & Boutique
  personaCard: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(40px) saturate(180%)',
    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
    border: '0.5px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '18px',
    padding: '32px 28px',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '16px',
    minHeight: '230px',
    boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(255, 255, 255, 0.03) inset',
    overflow: 'hidden',
  },

  personaCardSelected: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '2px solid #e87332',
    boxShadow: '0 0 0 0.5px rgba(255, 255, 255, 0.03) inset',
  },

  selectedOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'transparent',
    pointerEvents: 'none',
    zIndex: 0,
  },

  // Selection Indicator
  selectionIndicator: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 2,
  },

  selectionIndicatorSelected: {
    background: '#e87332',
    border: 'none',
    boxShadow: 'none',
    color: '#ffffff',
  },

  // Centered Icon - Refined Size
  personaIconLarge: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '0.5px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'rgba(232, 115, 50, 0.7)',
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  personaName: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.3px',
    lineHeight: '1.2',
    position: 'relative',
    zIndex: 1,
  },

  // Brief Tagline - Minimal
  personaTagline: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '13px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    letterSpacing: '-0.1px',
    lineHeight: '1.5',
    position: 'relative',
    zIndex: 1,
    maxWidth: '90%',
  },

  // Action Footer
  actionFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    marginTop: '16px',
    borderTop: '0.5px solid rgba(255, 255, 255, 0.08)',
  },

  selectionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  selectionCount: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '16px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: '-0.2px',
  },

  selectionHint: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '12px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: '-0.1px',
  },

  continueButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 36px',
    background: 'linear-gradient(135deg, #d05d1d 0%, #e87332 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '15px',
    fontWeight: '600',
    letterSpacing: '-0.3px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(208, 93, 29, 0.4)',
  },

  continueButtonDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },

  // Loading State
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 20px',
  },

  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(255, 255, 255, 0.08)',
    borderTopColor: '#e87332',
    borderRadius: '50%',
    marginBottom: '28px',
  },

  loadingText: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '15px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: '-0.2px',
    textAlign: 'center',
    margin: 0,
  },

  // Error State
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },

  errorIcon: {
    fontSize: '64px',
    marginBottom: '24px',
  },

  errorTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '28px',
    fontWeight: '600',
    color: '#ffffff',
    margin: '0 0 16px 0',
    letterSpacing: '-0.4px',
  },

  errorText: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '16px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.65)',
    margin: '0 0 32px 0',
    maxWidth: '500px',
    lineHeight: '1.6',
  },

  retryButton: {
    display: 'flex',
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
    letterSpacing: '-0.3px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(208, 93, 29, 0.4)',
  },

  // Empty State
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
  },

  emptyIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '0.5px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(232, 115, 50, 0.6)',
    marginBottom: '32px',
  },

  emptyTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '28px',
    fontWeight: '600',
    color: '#ffffff',
    margin: '0 0 16px 0',
    letterSpacing: '-0.4px',
  },

  emptyText: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '16px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.65)',
    margin: '0 0 12px 0',
    maxWidth: '500px',
    lineHeight: '1.6',
  },

  emptyHint: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '14px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    maxWidth: '450px',
    lineHeight: '1.5',
  },
};

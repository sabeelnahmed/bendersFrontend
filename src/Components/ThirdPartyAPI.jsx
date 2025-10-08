import React, { useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS } from '../Context';

// Main ThirdPartyAPI component matching UserPersona design
export default function ThirdPartyAPI({ onNavigateNext }) {
  const [apis, setApis] = useState([]);
  const [selectedApis, setSelectedApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchApis = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.GET_THIRD_PARTY);
        
        // Check if response has APIs
        if (response.data && response.data.apis && response.data.apis.length > 0) {
          // Add unique IDs to each API
          const apisWithIds = response.data.apis.map((api, index) => ({
            ...api,
            id: `api-${index}-${api.category}`
          }));
          setApis(apisWithIds);
          setIsEmpty(false);
        } else {
          // Empty response - no APIs needed
          setIsEmpty(true);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching third-party APIs:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch third-party API data');
        setLoading(false);
      }
    };

    fetchApis();
  }, []);

  const handleApiSelect = (apiId) => {
    setSelectedApis(prev => {
      const isSelected = prev.includes(apiId);
      
      if (isSelected) {
        // Deselect API
        return prev.filter(id => id !== apiId);
      } else {
        // Select API
        return [...prev, apiId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedApis.length === 0) {
      alert('Please select at least one third-party API to continue');
      return;
    }

    try {
      setIsUploading(true);
      
      // Get user_id and project_id from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

      // Get the full API objects for the selected API IDs
      const selectedApiObjects = apis.filter(api => 
        selectedApis.includes(api.id)
      );

      // Send selected APIs to backend
      const response = await apiClient.post(API_ENDPOINTS.UPLOAD_THIRD_PARTY, {
        selected_apis: selectedApiObjects,
        user_id: user.id || null,
        project_id: project.id || null,
      });

      console.log('✅ Selected third-party APIs uploaded successfully');
      console.log('📦 Full response:', response.data);
      
      // Store provider recommendations in localStorage for next page
      // The recommendations are in response.data.data.apis_saved (each has providers array)
      // OR in response.data.data.provider_recommendations
      let recommendations = null;
      
      if (response.data && response.data.data) {
        // Check for provider_recommendations first
        if (response.data.data.provider_recommendations) {
          recommendations = response.data.data.provider_recommendations;
          console.log('📋 Found provider_recommendations field');
        } 
        // Fallback to apis_saved (which has providers embedded)
        else if (response.data.data.apis_saved && Array.isArray(response.data.data.apis_saved)) {
          recommendations = response.data.data.apis_saved.map(api => ({
            api_category: api.name,
            category: api.category,
            description: api.description,
            providers: api.providers || []
          }));
          console.log('📋 Transformed from apis_saved field');
        }
      }
      
      if (recommendations && recommendations.length > 0) {
        console.log('📋 Provider recommendations to store:', recommendations);
        localStorage.setItem('providerRecommendations', JSON.stringify(recommendations));
        console.log('💾 Provider recommendations stored in localStorage');
        
        // Verify storage
        const stored = localStorage.getItem('providerRecommendations');
        console.log('✓ Verified stored data:', stored ? JSON.parse(stored) : 'NOT FOUND');
      } else {
        console.error('❌ No provider recommendations in response!');
        console.log('Response data:', response.data.data);
      }
      
      // Small delay to ensure localStorage is written
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to next step on success
      if (onNavigateNext) {
        console.log('🚀 Navigating to next step...');
        onNavigateNext(response.data);
      } else {
        console.warn('⚠️ onNavigateNext callback not provided');
      }
    } catch (err) {
      console.error('Error uploading third-party APIs:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to save selected APIs');
    } finally {
      // Always reset the uploading state
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
              <div className="api-spinner" style={styles.spinner}></div>
              <p style={styles.loadingText}>Analyzing PRD for third-party API requirements...</p>
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
              <h2 style={styles.errorTitle}>Error Loading Third-Party APIs</h2>
              <p style={styles.errorText}>{error}</p>
              <button
                className="api-retry-button"
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

  // Empty state - no APIs needed
  if (isEmpty) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.emptyContainer}>
              <div style={styles.emptyIcon}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={styles.emptyTitle}>No Third-Party APIs Needed</h2>
              <p style={styles.emptyText}>
                Based on the PRD analysis, your project doesn't require any external third-party API integrations.
              </p>
              <p style={styles.emptyHint}>
                You can proceed to the next step in your project setup.
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
                <h1 style={styles.pageTitle}>Select Third-Party APIs</h1>
                <p style={styles.pageSubtitle}>
                  We've identified {apis.length} third-party API integration{apis.length !== 1 ? 's' : ''} from your PRD. Select the APIs you want to integrate into your application.
                </p>
              </div>

              {/* APIs Grid */}
              <div style={styles.apisGrid}>
                {apis.map((api, index) => {
                  const isSelected = selectedApis.includes(api.id);
                  return (
                    <ApiCard
                      key={api.id}
                      api={api}
                      isSelected={isSelected}
                      onSelect={handleApiSelect}
                      index={index}
                    />
                  );
                })}
              </div>

              {/* Action Footer */}
              <div style={styles.actionFooter}>
                <div style={styles.selectionInfo}>
                  <span style={styles.selectionCount}>
                    {selectedApis.length} of {apis.length} selected
                  </span>
                  {selectedApis.length > 0 && (
                    <span style={styles.selectionHint}>
                      Selected APIs will be integrated into your project
                    </span>
                  )}
                </div>
                <button
                  className="api-continue-button"
                  style={{
                    ...styles.continueButton,
                    ...(selectedApis.length === 0 || isUploading ? styles.continueButtonDisabled : {})
                  }}
                  onClick={handleContinue}
                  disabled={selectedApis.length === 0 || isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="api-spinner" style={{...styles.spinner, marginBottom: 0, width: '18px', height: '18px', borderWidth: '2px'}}></div>
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

// API Card Component - Apple minimalist design
const ApiCard = ({ api, isSelected, onSelect }) => {
  return (
    <div
      className="api-card"
      style={{
        ...styles.apiCard,
        ...(isSelected ? styles.apiCardSelected : {})
      }}
      onClick={() => onSelect(api.id)}
    >
      {/* Selection Indicator - Minimal */}
      <div style={{
        ...styles.selectionIndicator,
        ...(isSelected ? styles.selectionIndicatorSelected : {})
      }}>
        {isSelected && <CheckIcon />}
      </div>

      {/* API Name - Prominent */}
      <h3 style={styles.apiName}>{api.name || 'Unnamed API'}</h3>

      {/* Description - Single line */}
      <p style={styles.apiDescription}>
        {api.description}
      </p>
    </div>
  );
};

// SVG Icons
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Styles object matching UserPersona
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
    @keyframes apiFadeIn {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes apiCardAppear {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes apiSpin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Card Hover Effects */
    .api-card {
      animation: apiCardAppear 0.5s ease-out backwards;
    }

    .api-card:nth-child(1) { animation-delay: 0.05s; }
    .api-card:nth-child(2) { animation-delay: 0.1s; }
    .api-card:nth-child(3) { animation-delay: 0.15s; }
    .api-card:nth-child(4) { animation-delay: 0.2s; }
    .api-card:nth-child(5) { animation-delay: 0.25s; }
    .api-card:nth-child(6) { animation-delay: 0.3s; }
    .api-card:nth-child(7) { animation-delay: 0.35s; }

    .api-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .api-card:active {
      transform: translateY(-1px);
    }

    /* Continue Button Hover */
    .api-continue-button:hover {
      background: linear-gradient(135deg, #e87332 0%, #f28a4a 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(208, 93, 29, 0.5);
    }

    .api-continue-button:active {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(208, 93, 29, 0.4);
    }

    .api-continue-button:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      transform: none !important;
    }

    /* Selected Overlay */
    .api-selected-overlay {
      animation: apiFadeOverlay 0.25s ease-out;
    }

    @keyframes apiFadeOverlay {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* Spinner Animation */
    .api-spinner {
      animation: apiSpin 0.8s linear infinite;
    }

    /* Retry Button Hover */
    .api-retry-button:hover {
      background: linear-gradient(135deg, #e87332 0%, #f28a4a 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(208, 93, 29, 0.5);
    }

    .api-retry-button:active {
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
    padding: '48px 40px',
    minHeight: '100vh',
  },

  contentWrapper: {
    width: '100%',
    maxWidth: '1200px',
    animation: 'apiFadeIn 0.8s ease-out',
  },

  mainSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '40px',
  },

  // Header Section - More breathing space
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  },

  pageTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '500',
    fontSize: '32px',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.5px',
    lineHeight: '1.2',
  },

  pageSubtitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '400',
    fontSize: '15px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    letterSpacing: '-0.2px',
    lineHeight: '1.6',
    maxWidth: '700px',
  },

  // APIs Grid - More breathing space
  apisGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },

  // API Card - Minimal Apple design
  apiCard: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.01)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '0.5px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    padding: '20px 18px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minHeight: '110px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },

  apiCardSelected: {
    background: 'rgba(232, 115, 50, 0.02)',
    border: '1px solid rgba(232, 115, 50, 0.4)',
    boxShadow: '0 0 0 1px rgba(232, 115, 50, 0.1)',
  },

  selectedOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'transparent',
    pointerEvents: 'none',
    zIndex: 0,
  },

  // Selection Indicator - Minimal
  selectionIndicator: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '1.5px solid rgba(255, 255, 255, 0.15)',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.25s ease',
    zIndex: 2,
  },

  selectionIndicatorSelected: {
    background: '#e87332',
    border: 'none',
    color: '#ffffff',
  },

  apiName: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '15px',
    fontWeight: '500',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.2px',
    lineHeight: '1.4',
    position: 'relative',
    zIndex: 1,
  },

  apiDescription: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '12px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    letterSpacing: '-0.1px',
    lineHeight: '1.5',
    position: 'relative',
    zIndex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },

  // Action Footer - Clean and minimal
  actionFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '24px',
    marginTop: '8px',
    borderTop: '0.5px solid rgba(255, 255, 255, 0.05)',
  },

  selectionInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },

  selectionCount: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: '-0.2px',
  },

  selectionHint: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '11px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: '-0.1px',
  },

  continueButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 28px',
    background: 'linear-gradient(135deg, #d05d1d 0%, #e87332 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#ffffff',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '-0.2px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    boxShadow: '0 2px 8px rgba(208, 93, 29, 0.3)',
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

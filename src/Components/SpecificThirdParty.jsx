import React, { useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS } from '../Context';

// Main SpecificThirdParty component - Apple minimalist design
export default function SpecificThirdParty({ onNavigateNext }) {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedProviders, setSelectedProviders] = useState({});
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console.log('🔍 SpecificThirdParty - Loading provider recommendations...');
    
    // Get provider recommendations from localStorage
    const storedRecommendations = localStorage.getItem('providerRecommendations');
    console.log('📦 Raw localStorage data:', storedRecommendations);
    
    if (storedRecommendations) {
      try {
        const parsed = JSON.parse(storedRecommendations);
        console.log('✅ Parsed recommendations:', parsed);
        console.log('📊 Number of recommendations:', parsed ? parsed.length : 0);
        
        setRecommendations(parsed);
        
        // Initialize selected providers (select first provider by default for each category)
        const initialSelection = {};
        parsed.forEach(rec => {
          if (rec.providers && rec.providers.length > 0) {
            initialSelection[rec.category] = rec.providers[0].name;
            console.log(`✓ Auto-selected ${rec.providers[0].name} for ${rec.category}`);
          }
        });
        setSelectedProviders(initialSelection);
        console.log('✅ Initial selection:', initialSelection);
      } catch (error) {
        console.error('❌ Error parsing recommendations:', error);
      }
    } else {
      console.warn('⚠️ No provider recommendations found in localStorage');
    }
    
    setLoading(false);
  }, []);

  const handleProviderSelect = (category, providerName) => {
    setSelectedProviders(prev => ({
      ...prev,
      [category]: providerName
    }));
  };

  const handleContinue = async () => {
    if (Object.keys(selectedProviders).length === 0) {
      alert('Please select at least one provider to continue');
      return;
    }

    try {
      setIsUploading(true);
      
      console.log('📤 Uploading selected providers...');
      console.log('📋 Selected providers:', selectedProviders);
      
      // Get user_id and project_id from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

      // Send selected providers to backend
      const response = await apiClient.post(API_ENDPOINTS.UPLOAD_THIRD_PARTY_PROVIDERS, {
        selected_providers: selectedProviders,
        user_id: user.id || null,
        project_id: project.id || null,
      });

      console.log('✅ Selected providers uploaded successfully');
      console.log('📦 Full response:', response.data);
      
      // Store API key requirements in localStorage for next page
      if (response.data && response.data.data && response.data.data.api_key_requirements) {
        const apiKeyRequirements = response.data.data.api_key_requirements;
        console.log('🔑 API key requirements to store:', apiKeyRequirements);
        localStorage.setItem('apiKeyRequirements', JSON.stringify(apiKeyRequirements));
        console.log('💾 API key requirements stored in localStorage');
        
        // Verify storage
        const stored = localStorage.getItem('apiKeyRequirements');
        console.log('✓ Verified stored data:', stored ? JSON.parse(stored) : 'NOT FOUND');
      } else {
        console.error('❌ No API key requirements in response!');
        console.log('Response structure:', {
          hasData: !!response.data,
          hasDataData: !!(response.data && response.data.data),
          hasApiKeyRequirements: !!(response.data && response.data.data && response.data.data.api_key_requirements)
        });
      }
      
      // Small delay to ensure localStorage is written
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to next step on success
      if (onNavigateNext) {
        console.log('🚀 Navigating to ThirdPartyKey page...');
        onNavigateNext(response.data);
      } else {
        console.warn('⚠️ onNavigateNext callback not provided');
      }
    } catch (err) {
      console.error('Error uploading providers:', err);
      alert(err.response?.data?.detail || err.message || 'Failed to save selected providers');
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
              <div className="provider-spinner" style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading provider recommendations...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (recommendations.length === 0) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.emptyContainer}>
              <h2 style={styles.emptyTitle}>No Recommendations Available</h2>
              <p style={styles.emptyText}>
                Please go back and select third-party APIs first.
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
                <h1 style={styles.pageTitle}>Select Providers</h1>
                <p style={styles.pageSubtitle}>
                  Choose your preferred provider for each third-party service. You've selected {recommendations.length} API{recommendations.length !== 1 ? 's' : ''}.
                </p>
              </div>

              {/* Provider Sections */}
              <div style={styles.sectionsContainer}>
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="provider-section" style={styles.section}>
                    {/* Section Header */}
                    <div style={styles.sectionHeader}>
                      <h2 style={styles.sectionTitle}>{recommendation.api_category}</h2>
                      <p style={styles.sectionDescription}>{recommendation.description}</p>
                    </div>

                    {/* Provider Grid */}
                    <div style={styles.providerGrid}>
                      {recommendation.providers.map((provider, pIndex) => {
                        const isSelected = selectedProviders[recommendation.category] === provider.name;
                        return (
                          <ProviderCard
                            key={pIndex}
                            provider={provider}
                            isSelected={isSelected}
                            onSelect={() => handleProviderSelect(recommendation.category, provider.name)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Footer */}
              <div style={styles.actionFooter}>
                <div style={styles.selectionInfo}>
                  <span style={styles.selectionCount}>
                    {Object.keys(selectedProviders).length} provider{Object.keys(selectedProviders).length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <button
                  className="provider-continue-button"
                  style={styles.continueButton}
                  onClick={handleContinue}
                  disabled={isUploading}
                >
                  <span>{isUploading ? 'Saving...' : 'Continue'}</span>
                  {!isUploading && <ArrowRightIcon />}
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

// Provider Card Component - Minimal Apple design
const ProviderCard = ({ provider, isSelected, onSelect }) => {
  return (
    <div
      className="provider-card"
      style={{
        ...styles.providerCard,
        ...(isSelected ? styles.providerCardSelected : {})
      }}
      onClick={onSelect}
    >
      {/* Selection Indicator */}
      <div style={{
        ...styles.selectionIndicator,
        ...(isSelected ? styles.selectionIndicatorSelected : {})
      }}>
        {isSelected && <CheckIcon />}
      </div>

      {/* Popularity Badge */}
      {provider.popularity && (
        <div style={styles.popularityBadge}>
          {provider.popularity}
        </div>
      )}

      {/* Provider Name */}
      <h3 style={styles.providerName}>{provider.name}</h3>

      {/* Description */}
      <p style={styles.providerDescription}>{provider.description}</p>

      {/* Pricing */}
      {provider.pricing && (
        <p style={styles.providerPricing}>{provider.pricing}</p>
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

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L7 13L15 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Styles object - Apple minimalist design
const styles = {
  cssStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
    
    body {
      margin: 0;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @keyframes providerFadeIn {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes providerCardAppear {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes providerSpin {
      to {
        transform: rotate(360deg);
      }
    }

    .provider-section {
      animation: providerFadeIn 0.5s ease-out backwards;
    }

    .provider-section:nth-child(1) { animation-delay: 0.1s; }
    .provider-section:nth-child(2) { animation-delay: 0.2s; }
    .provider-section:nth-child(3) { animation-delay: 0.3s; }

    .provider-card {
      animation: providerCardAppear 0.4s ease-out backwards;
    }

    .provider-card:nth-child(1) { animation-delay: 0.05s; }
    .provider-card:nth-child(2) { animation-delay: 0.1s; }
    .provider-card:nth-child(3) { animation-delay: 0.15s; }
    .provider-card:nth-child(4) { animation-delay: 0.2s; }

    .provider-card:hover {
      transform: translateY(-2px);
      border-color: rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .provider-continue-button:hover {
      background: linear-gradient(135deg, #e87332 0%, #f28a4a 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(208, 93, 29, 0.5);
    }

    .provider-spinner {
      animation: providerSpin 0.8s linear infinite;
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
    animation: 'providerFadeIn 0.8s ease-out',
  },

  mainSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },

  // Header Section
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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

  // Sections Container
  sectionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },

  // Section
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  sectionTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '20px',
    fontWeight: '500',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.3px',
  },

  sectionDescription: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '13px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: 0,
    letterSpacing: '-0.1px',
    lineHeight: '1.5',
  },

  // Provider Grid
  providerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '12px',
  },

  // Provider Card
  providerCard: {
    position: 'relative',
    background: 'rgba(255, 255, 255, 0.01)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '0.5px solid rgba(255, 255, 255, 0.04)',
    borderRadius: '12px',
    padding: '18px 16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minHeight: '130px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },

  providerCardSelected: {
    background: 'rgba(232, 115, 50, 0.02)',
    border: '1px solid rgba(232, 115, 50, 0.4)',
    boxShadow: '0 0 0 1px rgba(232, 115, 50, 0.1)',
  },

  // Selection Indicator
  selectionIndicator: {
    position: 'absolute',
    top: '14px',
    right: '14px',
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

  // Popularity Badge
  popularityBadge: {
    display: 'inline-block',
    padding: '3px 8px',
    background: 'rgba(232, 115, 50, 0.08)',
    border: '0.5px solid rgba(232, 115, 50, 0.2)',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '500',
    color: 'rgba(232, 115, 50, 0.9)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    alignSelf: 'flex-start',
  },

  providerName: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '15px',
    fontWeight: '500',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.2px',
    lineHeight: '1.3',
  },

  providerDescription: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '12px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    letterSpacing: '-0.1px',
    lineHeight: '1.4',
  },

  providerPricing: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '11px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.35)',
    margin: '4px 0 0 0',
    letterSpacing: '-0.05px',
  },

  // Action Footer
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

  // Empty State
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    textAlign: 'center',
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
    margin: 0,
    maxWidth: '500px',
    lineHeight: '1.6',
  },
};


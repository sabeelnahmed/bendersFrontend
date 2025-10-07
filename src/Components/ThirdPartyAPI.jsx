import React, { useState, useEffect } from 'react';
import { apiClient, API_ENDPOINTS } from '../Context';

export default function ThirdPartyAPI() {
  const [thirdPartyData, setThirdPartyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchThirdPartyAPIs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_THIRD_PARTY);
      setThirdPartyData(response.data);
      setLastFetched(new Date().toLocaleString());
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch third-party API data');
      console.error('Error fetching third-party APIs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThirdPartyAPIs();
  }, []);

  // Map API categories to appropriate icon emojis
  const getAPIIcon = (category) => {
    const iconMap = {
      'payment': '💳',
      'maps': '🗺️',
      'oauth': '🔐',
      'authentication': '🔑',
      'cloud': '☁️',
      'database': '🗄️',
      'email': '📧',
      'messaging': '💬',
      'sms': '📱',
      'storage': '📁',
      'default': '🔌'
    };
    
    return iconMap[category?.toLowerCase()] || iconMap.default;
  };

  const isEmpty = !thirdPartyData || 
    (Array.isArray(thirdPartyData) && thirdPartyData.length === 0) ||
    (typeof thirdPartyData === 'object' && Object.keys(thirdPartyData).length === 0);

  const apiList = Array.isArray(thirdPartyData) 
    ? thirdPartyData 
    : (thirdPartyData?.apis || thirdPartyData?.thirdPartyApis || []);

  // Loading State
  if (isLoading) {
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

  // Error State
  if (error) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.errorContainer}>
              <div style={styles.errorIcon}>⚠️</div>
              <h2 style={styles.errorTitle}>Error Loading Third-Party APIs</h2>
              <p style={styles.errorText}>{error}</p>
              <button
                className="api-retry-button"
                style={styles.retryButton}
                onClick={fetchThirdPartyAPIs}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Empty State
  if (isEmpty) {
    return (
      <>
        <style>{styles.cssStyles}</style>
        <div style={styles.appContainer}>
          <div style={styles.mainContentContainer}>
            <div style={styles.emptyContainer}>
              <div style={styles.emptyIcon}>✅</div>
              <h2 style={styles.emptyTitle}>No Third-Party APIs Needed</h2>
              <p style={styles.emptyText}>
                Based on the PRD analysis, your project doesn't require any external third-party API integrations.
              </p>
              <button
                className="api-retry-button"
                style={styles.retryButton}
                onClick={fetchThirdPartyAPIs}
              >
                Refresh Analysis
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main Content with APIs
  return (
    <>
      <style>{styles.cssStyles}</style>
      <div style={styles.appContainer}>
        {/* Header */}
        <div style={styles.headerContainer}>
          <div style={styles.headerContent}>
            <h1 style={styles.mainTitle}>Third-Party API Integration</h1>
            <p style={styles.subtitle}>
              External APIs identified from your PRD requirements
            </p>
          </div>
          <button
            className="api-refresh-button"
            style={styles.refreshButton}
            onClick={fetchThirdPartyAPIs}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* Summary Card */}
        {apiList.length > 0 && (
          <div className="fade-in-up" style={styles.summaryCard}>
            <div style={styles.summaryContent}>
              <div style={styles.summaryIcon}>🔌</div>
              <div style={styles.summaryText}>
                <h3 style={styles.summaryTitle}>
                  Found {apiList.length} Third-Party API{apiList.length !== 1 ? 's' : ''}
                </h3>
                <p style={styles.summaryDescription}>
                  These external services have been identified as necessary for your project
                </p>
              </div>
            </div>
          </div>
        )}

        {/* API Cards Grid */}
        <div style={styles.cardsGrid}>
          {apiList.map((api, index) => (
            <div 
              key={index}
              className="api-card fade-in-up"
              style={{...styles.apiCard, animationDelay: `${index * 0.1}s`}}
            >
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <div style={styles.cardHeaderLeft}>
                  <div style={styles.iconContainer}>
                    <span style={styles.categoryIcon}>{getAPIIcon(api.category)}</span>
                  </div>
                  <div>
                    <h3 style={styles.apiName}>{api.name || 'Unnamed API'}</h3>
                    {api.category && (
                      <span style={styles.categoryBadge}>{api.category}</span>
                    )}
                  </div>
                </div>
                {api.required && (
                  <span style={styles.requiredBadge}>Required</span>
                )}
              </div>

              {/* Description */}
              {api.description && (
                <p style={styles.apiDescription}>{api.description}</p>
              )}

              {/* Purpose */}
              {api.purpose && (
                <div style={styles.sectionBlock}>
                  <h4 style={styles.sectionLabel}>Purpose</h4>
                  <p style={styles.sectionText}>{api.purpose}</p>
                </div>
              )}

              {/* Features */}
              {api.features && api.features.length > 0 && (
                <div style={styles.sectionBlock}>
                  <h4 style={styles.sectionLabel}>Key Features</h4>
                  <ul style={styles.featureList}>
                    {api.features.map((feature, idx) => (
                      <li key={idx} style={styles.featureItem}>
                        <span style={styles.featureBullet}>•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Endpoints */}
              {api.endpoints && api.endpoints.length > 0 && (
                <div style={styles.sectionBlock}>
                  <h4 style={styles.sectionLabel}>API Endpoints</h4>
                  <div style={styles.endpointsContainer}>
                    {api.endpoints.map((endpoint, idx) => (
                      <code key={idx} style={styles.endpointCode}>
                        {endpoint}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div style={styles.cardFooter}>
                {api.provider && (
                  <div style={styles.providerInfo}>
                    <span style={styles.providerLabel}>Provider:</span>
                    <span style={styles.providerName}>{api.provider}</span>
                  </div>
                )}
                {api.documentation && (
                  <a 
                    href={api.documentation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="api-docs-link"
                    style={styles.docsLink}
                  >
                    View Docs
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Raw JSON Debug */}
        {thirdPartyData && (
          <details style={styles.debugSection}>
            <summary style={styles.debugSummary}>View Raw JSON (Debug)</summary>
            <pre style={styles.debugPre}>
              {JSON.stringify(thirdPartyData, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </>
  );
}

// Styles object matching the design system
const styles = {
  cssStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

    body {
      margin: 0;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(16px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .fade-in-up {
      animation: fadeInUp 0.6s ease-out;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .api-spinner {
      animation: spin 1s linear infinite;
    }

    .api-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .api-card:hover {
      transform: translateY(-4px);
      border-color: rgba(209, 96, 33, 0.4) !important;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
    }

    .api-refresh-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .api-refresh-button:hover {
      background: rgba(209, 96, 33, 0.15);
      border-color: rgba(209, 96, 33, 0.4);
      transform: translateY(-1px);
    }

    .api-retry-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .api-retry-button:hover {
      background: linear-gradient(135deg, #e87332 0%, #f28a4a 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(232, 115, 50, 0.35);
    }

    .api-docs-link {
      transition: all 0.2s ease;
    }

    .api-docs-link:hover {
      color: #f28a4a !important;
      transform: translateX(2px);
    }
  `,

  appContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%)',
    padding: '48px 32px',
    color: '#f9fafb',
  },

  mainContentContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 96px)',
  },

  // Loading State
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },

  spinner: {
    width: '48px',
    height: '48px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTop: '3px solid #D16021',
    borderRadius: '50%',
  },

  loadingText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },

  // Error State
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center',
    maxWidth: '500px',
  },

  errorIcon: {
    fontSize: '64px',
  },

  errorTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#f9fafb',
    margin: '0',
  },

  errorText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0',
    lineHeight: '1.6',
  },

  retryButton: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #D16021 0%, #e87332 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
  },

  // Empty State
  emptyContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center',
    maxWidth: '500px',
  },

  emptyIcon: {
    fontSize: '64px',
  },

  emptyTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#f9fafb',
    margin: '0',
  },

  emptyText: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0',
    lineHeight: '1.6',
  },

  // Header
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px',
  },

  headerContent: {
    flex: '1',
  },

  mainTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#f9fafb',
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px',
  },

  subtitle: {
    fontSize: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: '0',
  },

  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
  },

  // Summary Card
  summaryCard: {
    background: 'rgba(209, 96, 33, 0.08)',
    border: '1px solid rgba(209, 96, 33, 0.2)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
  },

  summaryContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },

  summaryIcon: {
    fontSize: '32px',
  },

  summaryText: {
    flex: '1',
  },

  summaryTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#f9fafb',
    margin: '0 0 8px 0',
  },

  summaryDescription: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0',
  },

  // Cards Grid
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 500px), 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },

  // API Card
  apiCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '24px',
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },

  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: '1',
  },

  iconContainer: {
    width: '48px',
    height: '48px',
    background: 'rgba(209, 96, 33, 0.1)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryIcon: {
    fontSize: '24px',
  },

  apiName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#f9fafb',
    margin: '0 0 4px 0',
  },

  categoryBadge: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'capitalize',
  },

  requiredBadge: {
    padding: '6px 12px',
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#f87171',
    fontSize: '11px',
    fontWeight: '600',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  apiDescription: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
    marginBottom: '16px',
  },

  sectionBlock: {
    marginBottom: '16px',
  },

  sectionLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },

  sectionText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
    margin: '0',
  },

  featureList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  featureItem: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },

  featureBullet: {
    color: '#D16021',
    fontWeight: '700',
  },

  endpointsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  endpointCode: {
    display: 'block',
    fontSize: '11px',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '8px 12px',
    borderRadius: '6px',
    color: '#D16021',
    fontFamily: "'Monaco', 'Menlo', monospace",
    overflow: 'auto',
  },

  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    flexWrap: 'wrap',
    gap: '12px',
  },

  providerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  providerLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },

  providerName: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  docsLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#D16021',
    textDecoration: 'none',
    fontWeight: '500',
  },

  // Debug Section
  debugSection: {
    marginTop: '40px',
  },

  debugSummary: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.4)',
    cursor: 'pointer',
    marginBottom: '12px',
  },

  debugPre: {
    background: 'rgba(0, 0, 0, 0.4)',
    padding: '20px',
    borderRadius: '12px',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.6)',
    overflowX: 'auto',
    fontFamily: "'Monaco', 'Menlo', monospace",
  },
};


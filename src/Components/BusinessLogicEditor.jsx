import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';

export default function BusinessLogicEditor() {
  // Password authentication states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // User Flow Manager states
  const [userFlows, setUserFlows] = useState({});
  const [constraints, setConstraints] = useState({});
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [htmlPreview, setHtmlPreview] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize OpenAI
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/user_flows.json')
        .then(res => res.json())
        .then(data => {
          console.log('User flows loaded:', data);
          setUserFlows(data);
        })
        .catch(err => console.error('Error loading user flows:', err));

      fetch('/validations_constraints.json')
        .then(res => res.json())
        .then(data => {
          console.log('Constraints loaded:', data);
          setConstraints(data);
        })
        .catch(err => console.error('Error loading constraints:', err));
    }
  }, [isAuthenticated]);

  // Password handlers
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

  // User Flow Manager functions
  const generateHtmlPreview = async (step) => {
    setIsGenerating(true);
    try {
      const stepConstraints = constraints[step.step_name] || {
        input_validations: [],
        business_constraints: [],
        domain_constraints: []
      };

      const constraintsText = `
Input Validations:
${stepConstraints.input_validations.map((v, i) => `${i + 1}. ${v}`).join('\n')}

Business Constraints:
${stepConstraints.business_constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Domain Constraints:
${stepConstraints.domain_constraints.map((c, i) => `${i + 1}. ${c}`).join('\n')}
      `;

      const prompt = `Create a simple, beautiful HTML page for this user step: "${step.step_name}"
Description: ${step.description}

Apply these constraints and validations:
${constraintsText}

Requirements:
- Create a complete HTML page with inline CSS
- Make it look modern and professional with a clean UI
- Include form inputs or UI elements relevant to this step
- IMPLEMENT THE VALIDATIONS AND CONSTRAINTS in the form
- Use a clean, minimal design with good spacing and colors
- Add placeholder text and sample data where appropriate
- Make it responsive and mobile-friendly
- Use nice gradients, shadows, and modern design patterns
- Add interactive elements like buttons with hover effects
- Show validation messages based on the constraints

Return ONLY the complete HTML code, nothing else. No explanations.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: 'You are an expert frontend developer. Generate clean, modern HTML with inline CSS that implements the given validations and constraints. Return only HTML code.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      let html = response.choices[0].message.content;

      const tripleBacktick = String.fromCharCode(96, 96, 96); // Creates ```
        if (html.includes(tripleBacktick + 'html')) {
          html = html.split(tripleBacktick + 'html')[1].split(tripleBacktick)[0];
        } else if (html.includes(tripleBacktick)) {
          html = html.split(tripleBacktick)[1].split(tripleBacktick)[0];
        }


      setHtmlPreview(html.trim());
    } catch (error) {
      console.error('Error generating HTML:', error);
      setHtmlPreview(`
        <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
          <h2 style="color: #f44336;">Error generating preview</h2>
          <p style="color: #666;">Please check your API key and try again.</p>
          <p style="color: #999; font-size: 12px;">${error.message}</p>
        </div>
      `);
    }
    setIsGenerating(false);
  };

  const handleFlowClick = (flowKey) => {
    setSelectedFlow(flowKey);
    setSelectedStep(null);
    setHtmlPreview('');
  };

  const handleStepClick = (step) => {
    setSelectedStep(step.step_name);
    setHtmlPreview('');
    generateHtmlPreview(step);
  };

  const handleBackToSteps = () => {
    setSelectedStep(null);
    setHtmlPreview('');
  };

  const handleRegeneratePreview = () => {
    const currentStep = currentFlowSteps.find(s => s.step_name === selectedStep);
    if (currentStep) {
      generateHtmlPreview(currentStep);
    }
  };

  const handleConstraintUpdate = (type, index, newValue) => {
    setConstraints(prev => {
      const updated = { ...prev };
      if (!updated[selectedStep]) {
        updated[selectedStep] = {
          input_validations: [],
          business_constraints: [],
          domain_constraints: []
        };
      }
      updated[selectedStep][type][index] = newValue;
      return updated;
    });
  };

  const handleAddConstraint = (type) => {
    setConstraints(prev => {
      const updated = { ...prev };
      if (!updated[selectedStep]) {
        updated[selectedStep] = {
          input_validations: [],
          business_constraints: [],
          domain_constraints: []
        };
      }
      updated[selectedStep][type].push('New constraint');
      return updated;
    });
  };

  const handleDeleteConstraint = (type, index) => {
    setConstraints(prev => {
      const updated = { ...prev };
      updated[selectedStep][type].splice(index, 1);
      return updated;
    });
  };

  const handleSaveConstraints = () => {
    const dataStr = JSON.stringify(constraints, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'validations_constraints.json';
    link.click();
    URL.revokeObjectURL(url);
    alert('✅ All constraints saved! Check your downloads folder.');
  };

  const formatFlowName = (flowKey) => {
    return flowKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const currentFlowData = selectedFlow ? userFlows[selectedFlow] : null;
  const currentFlowSteps = currentFlowData?.steps || [];

  // RENDER: Show User Flow Manager when authenticated
  if (isAuthenticated) {
    return (
      <div style={flowStyles.mainContainer}>
        {/* Left Sidebar - Flow List */}
        <div style={flowStyles.flowSidebar}>
          <h2 style={flowStyles.flowSidebarTitle}>User Flows</h2>
          <div style={flowStyles.flowList}>
            {Object.keys(userFlows).map((flowKey) => (
              <button
                key={flowKey}
                style={{
                  ...flowStyles.flowItem,
                  ...(selectedFlow === flowKey ? flowStyles.flowItemActive : {})
                }}
                onClick={() => handleFlowClick(flowKey)}
                onMouseEnter={(e) => {
                  if (selectedFlow !== flowKey) {
                    e.currentTarget.style.background = 'rgba(208, 93, 29, 0.2)';
                    e.currentTarget.style.borderLeft = '4px solid rgba(208, 93, 29, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFlow !== flowKey) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderLeft = '4px solid transparent';
                  }
                }}
              >
                {formatFlowName(flowKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={flowStyles.mainContent}>
          {!selectedFlow ? (
            <div style={flowStyles.welcomeScreen}>
              <h1 style={flowStyles.welcomeTitle}>Welcome to User Flow Manager</h1>
              <p style={flowStyles.welcomeSubtitle}>Select a user flow from the sidebar to get started</p>
            </div>
          ) : !selectedStep ? (
            <div style={flowStyles.stepsFlowContainer}>
              <div style={flowStyles.stepsFlowHeader}>
                <h2 style={flowStyles.stepsFlowTitle}>{formatFlowName(selectedFlow)}</h2>
                <p style={flowStyles.stepsFlowDescription}>{currentFlowData?.flow_description}</p>
              </div>

              <div style={flowStyles.stepsFlowContent}>
                {currentFlowSteps.map((step, index) => (
                  <React.Fragment key={index}>
                    <button
                      style={flowStyles.stepFlowCard}
                      onClick={() => handleStepClick(step)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(208, 93, 29, 0.4)';
                        e.currentTarget.style.borderColor = 'rgba(208, 93, 29, 1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
                        e.currentTarget.style.borderColor = 'rgba(163, 163, 163, 0.3)';
                      }}
                    >
                      <div style={flowStyles.stepNumber}>Step {step.sequence_order}</div>
                      <h3 style={flowStyles.stepFlowTitle}>{step.step_name}</h3>
                      <p style={flowStyles.stepFlowDescription}>{step.description}</p>
                      {step.is_optional && (
                        <span style={flowStyles.optionalBadge}>Optional</span>
                      )}
                    </button>

                    {index < currentFlowSteps.length - 1 && (
                      <div style={flowStyles.arrowContainer}>
                        <svg width="40" height="40" viewBox="0 0 40 40" style={flowStyles.arrow}>
                          <path
                            d="M 10 20 L 30 20 M 25 15 L 30 20 L 25 25"
                            stroke="rgba(163, 163, 163, 0.6)"
                            strokeWidth="2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <div style={flowStyles.detailContainer}>
              <div style={flowStyles.detailHeader}>
                <button style={flowStyles.backButton} onClick={handleBackToSteps}>
                  ← Back to Steps
                </button>
                <h2 style={flowStyles.detailTitle}>
                  {currentFlowSteps.find(s => s.step_name === selectedStep)?.step_name}
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={flowStyles.regenerateButton} onClick={handleRegeneratePreview}>
                     Update Preview
                  </button>
                  <button style={flowStyles.saveButton} onClick={handleSaveConstraints}>
                     Save All
                  </button>
                </div>
              </div>

              <div style={flowStyles.detailContent}>
                <div style={flowStyles.sidebar}>
                  <h3 style={flowStyles.sidebarTitle}>Constraints Editor</h3>
                  <p style={flowStyles.sidebarHint}>💡 Click "Update Preview" to see changes reflected in the HTML</p>

                  {/* Input Validations */}
                  <div style={flowStyles.constraintSection}>
                    <h4 style={flowStyles.constraintHeader}>
                      <span>Input Validations</span>
                      <button 
                        style={flowStyles.addButton}
                        onClick={() => handleAddConstraint('input_validations')}
                      >
                        + Add
                      </button>
                    </h4>
                    {(constraints[selectedStep]?.input_validations || []).map((validation, index) => (
                      <div key={index} style={flowStyles.constraintItem}>
                        <textarea
                          value={validation}
                          onChange={(e) => handleConstraintUpdate('input_validations', index, e.target.value)}
                          style={flowStyles.constraintInput}
                          rows="2"
                          placeholder="Enter validation rule..."
                        />
                        <button
                          style={flowStyles.deleteButton}
                          onClick={() => handleDeleteConstraint('input_validations', index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Business Constraints */}
                  <div style={flowStyles.constraintSection}>
                    <h4 style={flowStyles.constraintHeader}>
                      <span>Business Constraints</span>
                      <button 
                        style={flowStyles.addButton}
                        onClick={() => handleAddConstraint('business_constraints')}
                      >
                        + Add
                      </button>
                    </h4>
                    {(constraints[selectedStep]?.business_constraints || []).map((constraint, index) => (
                      <div key={index} style={flowStyles.constraintItem}>
                        <textarea
                          value={constraint}
                          onChange={(e) => handleConstraintUpdate('business_constraints', index, e.target.value)}
                          style={flowStyles.constraintInput}
                          rows="2"
                          placeholder="Enter business rule..."
                        />
                        <button
                          style={flowStyles.deleteButton}
                          onClick={() => handleDeleteConstraint('business_constraints', index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Domain Constraints */}
                  <div style={flowStyles.constraintSection}>
                    <h4 style={flowStyles.constraintHeader}>
                      <span>Domain Constraints</span>
                      <button 
                        style={flowStyles.addButton}
                        onClick={() => handleAddConstraint('domain_constraints')}
                      >
                        + Add
                      </button>
                    </h4>
                    {(constraints[selectedStep]?.domain_constraints || []).map((constraint, index) => (
                      <div key={index} style={flowStyles.constraintItem}>
                        <textarea
                          value={constraint}
                          onChange={(e) => handleConstraintUpdate('domain_constraints', index, e.target.value)}
                          style={flowStyles.constraintInput}
                          rows="2"
                          placeholder="Enter domain rule..."
                        />
                        <button
                          style={flowStyles.deleteButton}
                          onClick={() => handleDeleteConstraint('domain_constraints', index)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={flowStyles.previewContainer}>
                  <h3 style={flowStyles.previewTitle}>
                    Live Preview
                    {isGenerating && <span style={flowStyles.generating}> (Generating...)</span>}
                  </h3>
                  {isGenerating ? (
                    <div style={flowStyles.loader}>
                      <div style={flowStyles.loaderSpinner}></div>
                      <p>Generating HTML preview with AI...</p>
                    </div>
                  ) : (
                    <iframe
                      srcDoc={htmlPreview}
                      style={flowStyles.iframe}
                      title="HTML Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // RENDER: Show password protection screen when not authenticated
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

// Password Modal Styles
const styles = {
  cssStyles: `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
    
    body {
      margin: 0;
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

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

// User Flow Manager Styles
const flowStyles = {
  mainContainer: {
    display: 'flex',
    minHeight: '100vh',
    background: 'rgba(16, 16, 16, 1)',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },

  flowSidebar: {
    width: '280px',
    background: 'rgba(16, 16, 16, 1)',
    borderRight: '1px solid rgba(163, 163, 163, 0.3)',
    padding: '30px 0',
    overflowY: 'auto',
    flexShrink: 0,
  },
  flowSidebarTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'rgba(248, 248, 248, 0.98)',
    padding: '0 25px',
    marginBottom: '30px',
  },
  flowList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  flowItem: {
    background: 'transparent',
    border: 'none',
    borderLeft: '4px solid transparent',
    padding: '16px 25px',
    textAlign: 'left',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    color: 'rgba(248, 248, 248, 0.7)',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  flowItemActive: {
    background: 'rgba(208, 93, 29, 0.15)',
    borderLeft: '4px solid rgba(208, 93, 29, 1)',
    color: 'rgba(248, 248, 248, 0.98)',
  },

  mainContent: {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
  },

  welcomeScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '40px',
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: '48px',
    fontWeight: '700',
    color: 'rgba(248, 248, 248, 0.98)',
    marginBottom: '16px',
  },
  welcomeSubtitle: {
    fontSize: '20px',
    color: 'rgba(163, 163, 163, 1)',
  },

  stepsFlowContainer: {
    padding: '40px',
    minHeight: '100vh',
  },
  stepsFlowHeader: {
    marginBottom: '50px',
    textAlign: 'center',
  },
  stepsFlowTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: 'rgba(248, 248, 248, 0.98)',
    marginBottom: '12px',
  },
  stepsFlowDescription: {
    fontSize: '16px',
    color: 'rgba(163, 163, 163, 1)',
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: '1.6',
  },

  stepsFlowContent: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0 20px',
  },
  stepFlowCard: {
    background: 'rgba(24, 24, 24, 1)',
    border: '2px solid rgba(163, 163, 163, 0.3)',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    flex: '0 1 auto',
    minWidth: '200px',
    maxWidth: '280px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  stepNumber: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'rgba(208, 93, 29, 1)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  stepFlowTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'rgba(248, 248, 248, 0.98)',
    marginBottom: '10px',
    textTransform: 'capitalize',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  stepFlowDescription: {
    fontSize: '13px',
    color: 'rgba(163, 163, 163, 1)',
    lineHeight: '1.5',
    marginBottom: '8px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  optionalBadge: {
    display: 'inline-block',
    background: 'rgba(208, 93, 29, 0.2)',
    color: 'rgba(208, 93, 29, 1)',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    marginTop: '8px',
  },
  arrowContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 40px',
  },
  arrow: {
    display: 'block',
  },

  detailContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  detailHeader: {
    background: 'rgba(16, 16, 16, 1)',
    padding: '20px 30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(163, 163, 163, 0.3)',
    flexShrink: 0,
  },
  backButton: {
    padding: '10px 20px',
    fontSize: '14px',
    background: 'rgba(163, 163, 163, 0.2)',
    color: 'rgba(248, 248, 248, 0.98)',
    border: '1px solid rgba(163, 163, 163, 0.3)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  detailTitle: {
    fontSize: '24px',
    color: 'rgba(248, 248, 248, 0.98)',
    margin: 0,
    textTransform: 'capitalize',
    fontWeight: '700',
  },
  regenerateButton: {
    padding: '10px 20px',
    fontSize: '14px',
    background: 'rgba(29, 185, 84, 1)',
    color: 'rgba(248, 248, 248, 0.98)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  saveButton: {
    padding: '10px 20px',
    fontSize: '14px',
    background: 'rgba(208, 93, 29, 1)',
    color: 'rgba(248, 248, 248, 0.98)',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  detailContent: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  sidebar: {
    width: '400px',
    background: 'rgba(16, 16, 16, 1)',
    padding: '30px',
    overflowY: 'auto',
    borderRight: '1px solid rgba(163, 163, 163, 0.3)',
    flexShrink: 0,
  },
  sidebarTitle: {
    fontSize: '20px',
    marginBottom: '15px',
    color: 'rgba(248, 248, 248, 0.98)',
    fontWeight: '700',
  },
  sidebarHint: {
    fontSize: '13px',
    color: 'rgba(163, 163, 163, 1)',
    background: 'rgba(208, 93, 29, 0.1)',
    padding: '10px 12px',
    borderRadius: '6px',
    marginBottom: '25px',
    lineHeight: '1.5',
    borderLeft: '3px solid rgba(208, 93, 29, 1)',
  },
  constraintSection: {
    marginBottom: '30px',
  },
  constraintHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'rgba(248, 248, 248, 0.98)',
  },
  addButton: {
    padding: '6px 12px',
    fontSize: '12px',
    background: 'rgba(208, 93, 29, 1)',
    color: 'rgba(248, 248, 248, 0.98)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  constraintItem: {
    display: 'flex',
    gap: '10px',
    marginBottom: '12px',
    alignItems: 'flex-start',
  },
  constraintInput: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: '1px solid rgba(163, 163, 163, 0.5)',
    borderRadius: '6px',
    fontFamily: 'inherit',
    resize: 'vertical',
    background: 'rgba(24, 24, 24, 1)',
    color: 'rgba(248, 248, 248, 0.98)',
    lineHeight: '1.5',
  },
  deleteButton: {
    padding: '8px 12px',
    background: 'rgba(163, 163, 163, 0.2)',
    color: 'rgba(248, 248, 248, 0.98)',
    border: '1px solid rgba(163, 163, 163, 0.3)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    minWidth: '36px',
  },

  previewContainer: {
    flex: 1,
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  previewTitle: {
    fontSize: '20px',
    marginBottom: '20px',
    color: 'rgba(248, 248, 248, 0.98)',
    fontWeight: '700',
    flexShrink: 0,
  },
  generating: {
    color: 'rgba(208, 93, 29, 1)',
    fontSize: '14px',
  },
  iframe: {
    flex: 1,
    width: '100%',
    border: '1px solid rgba(163, 163, 163, 0.3)',
    borderRadius: '8px',
    background: 'white',
  },
  loader: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(163, 163, 163, 1)',
  },
  loaderSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(163, 163, 163, 0.3)',
    borderTop: '5px solid rgba(208, 93, 29, 1)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Add keyframes for spinner animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

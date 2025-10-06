import React, { useState } from 'react';
import {ConfigureIcon, DesignPreviewIcon, Largefileupload, Brandguidelines } from '../icons.jsx';
 
 
// --- ICONS ---
const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);

const UploadIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15V3M12 3L8 7M12 3L16 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 15V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);
 
 
// Main App component
export default function App({ onNavigateNext }) {
  const fileInputRef = React.useRef(null);
 
  const handleLogoUploadClick = () => {
    fileInputRef.current.click();
  };
 
  const handleLogoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("Selected logo file:", file.name);
    }
  };
 
  return (
    <>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        body {
          margin: 0;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .brand-upload-area {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .brand-upload-area:hover {
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.02);
        }

        .brand-upload-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .brand-upload-button:hover {
          background: rgba(209, 96, 33, 0.12);
          border-color: rgba(209, 96, 33, 0.4);
          transform: translateY(-1px);
        }

        .brand-color-swatch {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .brand-color-swatch:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .voice-pill {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .voice-pill.active {
          background: #D16021;
          color: white;
          box-shadow: 0 2px 12px rgba(209, 96, 33, 0.3);
        }

        .voice-pill:not(.active):hover {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .tab-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .tab-button.active {
          background: #D16021;
          color: white;
          box-shadow: 0 2px 12px rgba(209, 96, 33, 0.3);
        }

        .tab-button:not(.active):hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .editable-field {
          transition: all 0.2s ease;
        }

        .editable-field:hover {
          color: rgba(209, 96, 33, 0.9);
        }

        .icon-button {
          transition: all 0.2s ease;
          opacity: 0.5;
        }

        .icon-button:hover {
          opacity: 1;
          color: #D16021;
        }

        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
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

        .brand-continue-button:hover {
          background: linear-gradient(135deg, #e87332 0%, #f28a4a 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(208, 93, 29, 0.5);
        }

        .brand-continue-button:active {
          transform: translateY(0px);
          box-shadow: 0 4px 16px rgba(208, 93, 29, 0.4);
        }
      `}</style>
      <div style={styles.appContainer}>
        <MainContent
          fileInputRef={fileInputRef}
          handleLogoUploadClick={handleLogoUploadClick}
          handleLogoFileChange={handleLogoFileChange}
          onNavigateNext={onNavigateNext}
        />
      </div>
    </>
  );
}
 
 
// Main content area component
const MainContent = ({ fileInputRef, handleLogoUploadClick, handleLogoFileChange, onNavigateNext }) => {
  const [activeTab, setActiveTab] = useState('Preview');
  const [activeVoiceAttribute, setActiveVoiceAttribute] = useState('Professional');
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [selectedColors, setSelectedColors] = useState({
    primary: '#D16021',
    secondary: '#374151',
    accent: '#6B7280',
    background: '#1a1a1a',
    foreground: '#ffffff'
  });

  const [brandName, setBrandName] = useState('Your Brand');
  
  const [customFonts, setCustomFonts] = useState([
    // Sans-serif - Modern & Clean
    { id: 'montserrat', name: 'Montserrat', custom: false },
    { id: 'inter', name: 'Inter', custom: false },
    { id: 'roboto', name: 'Roboto', custom: false },
    { id: 'poppins', name: 'Poppins', custom: false },
    { id: 'open-sans', name: 'Open Sans', custom: false },
    { id: 'lato', name: 'Lato', custom: false },
    { id: 'work-sans', name: 'Work Sans', custom: false },
    { id: 'dm-sans', name: 'DM Sans', custom: false },
    { id: 'plus-jakarta', name: 'Plus Jakarta Sans', custom: false },
    { id: 'space-grotesk', name: 'Space Grotesk', custom: false },
    
    // Serif - Classic & Elegant
    { id: 'playfair', name: 'Playfair Display', custom: false },
    { id: 'merriweather', name: 'Merriweather', custom: false },
    { id: 'lora', name: 'Lora', custom: false },
    { id: 'crimson-text', name: 'Crimson Text', custom: false },
    
    // Display - Unique & Bold
    { id: 'bebas-neue', name: 'Bebas Neue', custom: false },
    { id: 'archivo-black', name: 'Archivo Black', custom: false },
  ]);
  const [selectedFont, setSelectedFont] = useState('montserrat');

  const [editableFields, setEditableFields] = useState({
    brandVoice: 'Building the Future of Technology',
    ageGroup: '25-45',
    demographics: 'Tech professionals',
    businessType: 'SaaS',
  });

  const [editingField, setEditingField] = useState(null);
  const fontInputRef = React.useRef(null);

  const handleFieldChange = (fieldName, value) => {
    setEditableFields({
      ...editableFields,
      [fieldName]: value
    });
  };

  const handleColorChange = (colorType, value) => {
    setSelectedColors({
      ...selectedColors,
      [colorType]: value
    });
  };

  const handleFontUploadClick = () => {
    fontInputRef.current.click();
  };

  const handleFontFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fontName = file.name.replace(/\.(ttf|otf|woff|woff2)$/i, '');
      const fontId = 'custom-' + Date.now();
      
      // Add the custom font to the list
      const newFont = {
        id: fontId,
        name: fontName,
        custom: true,
        file: file
      };
      
      setCustomFonts(prev => [...prev, newFont]);
      setSelectedFont(fontId);
      
      console.log("Uploaded font:", fontName);
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedLogo(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getSelectedFontName = () => {
    const font = customFonts.find(f => f.id === selectedFont);
    return font ? font.name : 'Montserrat';
  };

  const startEditing = (fieldName) => {
    setEditingField(fieldName);
  };

  const stopEditing = () => {
    setEditingField(null);
  };

  return (
    <div style={styles.mainContentContainer} className='custom-scrollbar'>
      <div style={styles.contentPadding} className='fade-in-up'>
        
        {/* Page Header */}
        <div style={styles.headerSection}>
          <h1 style={styles.pageTitle}>Brand Configuration</h1>
          <p style={styles.pageSubtitle}>Configure your brand identity for AI-generated code. Changes will be reflected in real-time preview.</p>
        </div>

        {/* Two Column Layout */}
        <div style={styles.mainGrid}>
          
          {/* Left Column - Configuration */}
          <div style={styles.configColumn}>
            
            {/* Brand Name */}
            <section style={styles.configSection}>
              <h2 style={styles.sectionTitle}>Brand Name</h2>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter your brand name"
                style={styles.brandNameInput}
              />
            </section>

            {/* Logo Upload Section */}
            <section style={styles.configSection}>
              <h2 style={styles.sectionTitle}>Logo</h2>
              <div className="brand-upload-area" style={uploadedLogo ? styles.uploadAreaWithLogo : styles.uploadArea}>
                {uploadedLogo ? (
                  <div style={styles.logoPreview}>
                    <img src={uploadedLogo} alt="Uploaded logo" style={styles.logoImage} />
                    <button 
                      className="brand-upload-button" 
                      style={styles.changeButton} 
                      onClick={handleLogoUploadClick}
                    >
                      Change Logo
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadIcon />
                    <p style={styles.uploadTitle}>Upload Your Logo</p>
                    <p style={styles.uploadHint}>PNG, JPG, SVG (Max 5MB)</p>
                    <button 
                      className="brand-upload-button" 
                      style={styles.uploadButton} 
                      onClick={handleLogoUploadClick}
                    >
                      Choose File
                    </button>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  accept="image/png,image/jpeg,image/svg+xml"
                  style={{ display: 'none' }}
                />
              </div>
            </section>

            {/* Color Palette */}
            <section style={styles.configSection}>
              <h2 style={styles.sectionTitle}>Brand Colors</h2>
              <div style={styles.colorList}>
                {[
                  { key: 'primary', name: 'Primary', description: 'Main brand color' },
                  { key: 'secondary', name: 'Secondary', description: 'Supporting color' },
                  { key: 'accent', name: 'Accent', description: 'Highlights & CTAs' },
                  { key: 'foreground', name: 'Foreground', description: 'Text & content' },
                  { key: 'background', name: 'Background', description: 'Base background' }
                ].map((color) => (
                  <div key={color.key} className="brand-color-swatch" style={styles.colorRow}>
                    <input
                      type="color"
                      value={selectedColors[color.key]}
                      onChange={(e) => handleColorChange(color.key, e.target.value)}
                      style={styles.colorPicker}
                    />
                    <div style={styles.colorDetails}>
                      <div style={styles.colorRowHeader}>
                        <span style={styles.colorName}>{color.name}</span>
                        <span style={styles.colorHex}>{selectedColors[color.key]}</span>
                      </div>
                      <span style={styles.colorDescription}>{color.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Typography */}
            <section style={styles.configSection}>
              <h2 style={styles.sectionTitle}>Typography</h2>
              <div style={styles.fontUploadContainer}>
                <div style={styles.fontSelectorRow}>
                  <div style={styles.fontSelectWrapper}>
                    <label style={styles.fontLabel}>Font Family</label>
                    <select 
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      style={styles.fontDropdown}
                    >
                      {customFonts.map(font => (
                        <option key={font.id} value={font.id}>
                          {font.name} {font.custom ? '(Custom)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button 
                    className="brand-upload-button" 
                    style={styles.uploadFontButton} 
                    onClick={handleFontUploadClick}
                  >
                    + Add Font
                  </button>
                  <input
                    type="file"
                    ref={fontInputRef}
                    onChange={handleFontFileChange}
                    accept=".ttf,.otf,.woff,.woff2"
                    style={{ display: 'none' }}
                  />
                </div>
                <p style={styles.fontHint}>Upload custom TTF, OTF, WOFF, or WOFF2 files</p>
              </div>
            </section>

            {/* Brand Voice */}
            <section style={styles.configSection}>
              <h2 style={styles.sectionTitle}>Brand Voice</h2>
              <div style={styles.voiceField}>
                <label style={styles.voiceLabel}>Tagline</label>
                <div style={styles.voiceInputWrapper}>
                  {editingField === 'brandVoice' ? (
                    <input
                      type="text"
                      value={editableFields.brandVoice}
                      onChange={(e) => handleFieldChange('brandVoice', e.target.value)}
                      onBlur={stopEditing}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          stopEditing();
                        }
                      }}
                      autoFocus
                      style={styles.voiceInput}
                    />
                  ) : (
                    <span
                      className="editable-field"
                      style={styles.voiceValue}
                      onClick={() => startEditing('brandVoice')}
                    >
                      {editableFields.brandVoice}
                    </span>
                  )}
                  <button
                    className="icon-button"
                    onClick={() => startEditing('brandVoice')}
                    style={styles.editButton}
                  >
                    <PencilIcon />
                  </button>
                </div>
              </div>

              <div style={styles.voiceAttributes}>
                <label style={styles.voiceLabel}>Tone</label>
                <div style={styles.voicePills}>
                  {['Professional', 'Approachable', 'Innovative', 'Clear'].map((attribute) => (
                    <button
                      key={attribute}
                      className={`voice-pill ${activeVoiceAttribute === attribute ? 'active' : ''}`}
                      onClick={() => setActiveVoiceAttribute(attribute)}
                      style={{
                        ...styles.voicePill,
                        ...(activeVoiceAttribute === attribute ? styles.voicePillActive : {}),
                      }}
                    >
                      {attribute}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Live Preview */}
          <div style={styles.previewColumn}>
            <div style={styles.previewSticky}>
              <div style={styles.previewHeader}>
                <h2 style={styles.previewTitle}>Live Preview</h2>
                <div style={styles.tabGroup}>
                  <button
                    className={`tab-button ${activeTab === 'Preview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Preview')}
                    style={{
                      ...styles.tab,
                      ...(activeTab === 'Preview' ? styles.tabActive : {}),
                    }}
                  >
                    App Preview
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'Components' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Components')}
                    style={{
                      ...styles.tab,
                      ...(activeTab === 'Components' ? styles.tabActive : {}),
                    }}
                  >
                    Components
                  </button>
                </div>
              </div>
              
              <div style={styles.previewContainer}>
                {activeTab === 'Preview' ? (
                  <div style={{ ...styles.mockupFrame, backgroundColor: selectedColors.background }}>
                    {/* Live Mockup Preview */}
                    <div style={styles.mockupContent}>
                      {/* Header with Logo and Brand Name */}
                      <div style={{ ...styles.mockupHeader, backgroundColor: selectedColors.secondary }}>
                        <div style={styles.mockupBrandSection}>
                          {uploadedLogo ? (
                            <img src={uploadedLogo} alt="Logo" style={styles.mockupLogo} />
                          ) : (
                            <div style={{ ...styles.mockupLogoPlaceholder, borderColor: selectedColors.accent }}>
                              Logo
                            </div>
                          )}
                          <span style={{ ...styles.mockupBrandName, color: selectedColors.foreground }}>{brandName}</span>
                        </div>
                        <div style={styles.mockupNav}>
                          <span style={{ ...styles.mockupNavItem, color: selectedColors.primary }}>Home</span>
                          <span style={{ ...styles.mockupNavItem, color: selectedColors.accent }}>Products</span>
                          <span style={{ ...styles.mockupNavItem, color: selectedColors.foreground, opacity: 0.6 }}>About</span>
                        </div>
                      </div>

                      {/* Hero Section */}
                      <div style={styles.mockupHero}>
                        <h1 style={{ ...styles.mockupHeadline, fontFamily: getSelectedFontName(), color: selectedColors.foreground }}>{editableFields.brandVoice}</h1>
                        <p style={{ ...styles.mockupSubheadline, color: selectedColors.accent }}>Tailored for {editableFields.demographics} in the {editableFields.businessType} industry</p>
                        <div style={styles.mockupButtonGroup}>
                          <button style={{ ...styles.mockupButton, backgroundColor: selectedColors.primary, color: selectedColors.foreground }}>
                            Get Started
                          </button>
                          <button style={{ ...styles.mockupButtonSecondary, borderColor: selectedColors.accent, color: selectedColors.accent }}>
                            Learn More
                          </button>
                        </div>
                      </div>

                      {/* Feature Cards */}
                      <div style={styles.mockupCards}>
                        {[
                          { icon: 'primary', label: 'Primary Feature' },
                          { icon: 'secondary', label: 'Secondary Feature' },
                          { icon: 'accent', label: 'Accent Feature' }
                        ].map((feature, i) => (
                          <div key={i} style={{ ...styles.mockupCard, borderColor: i === 1 ? selectedColors.secondary : 'rgba(255, 255, 255, 0.06)' }}>
                            <div style={{ 
                              ...styles.mockupCardIcon, 
                              backgroundColor: i === 0 ? `${selectedColors.primary}20` : i === 1 ? `${selectedColors.secondary}20` : `${selectedColors.accent}20`,
                              color: i === 0 ? selectedColors.primary : i === 1 ? selectedColors.secondary : selectedColors.accent
                            }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
                              </svg>
                            </div>
                            <h3 style={{ ...styles.mockupCardTitle, fontFamily: getSelectedFontName(), color: selectedColors.foreground }}>{feature.label}</h3>
                            <p style={{ ...styles.mockupCardText, color: `${selectedColors.foreground}80` }}>Showcase your brand with {activeVoiceAttribute.toLowerCase()} messaging</p>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div style={{ ...styles.mockupFooter, backgroundColor: selectedColors.secondary }}>
                        <span style={{ color: selectedColors.accent, fontSize: '12px' }}>© 2025 {brandName}. All rights reserved.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={styles.componentsPreview}>
                    {/* Component Examples */}
                    <div style={styles.componentSection}>
                      <span style={styles.componentLabel}>Buttons</span>
                      <div style={styles.componentRow}>
                        <button style={{ ...styles.previewButton, backgroundColor: selectedColors.primary, color: selectedColors.foreground, fontFamily: getSelectedFontName() }}>
                          Primary
                        </button>
                        <button style={{ ...styles.previewButton, backgroundColor: selectedColors.secondary, color: selectedColors.foreground, fontFamily: getSelectedFontName() }}>
                          Secondary
                        </button>
                        <button style={{ ...styles.previewButton, backgroundColor: 'transparent', color: selectedColors.accent, border: `1px solid ${selectedColors.accent}`, fontFamily: getSelectedFontName() }}>
                          Accent
                        </button>
                      </div>
                    </div>

                    <div style={styles.componentSection}>
                      <span style={styles.componentLabel}>Typography Scale</span>
                      <h1 style={{ ...styles.typeSample, fontSize: '28px', color: selectedColors.foreground, fontFamily: getSelectedFontName() }}>Heading 1</h1>
                      <h2 style={{ ...styles.typeSample, fontSize: '22px', color: selectedColors.foreground, fontFamily: getSelectedFontName() }}>Heading 2</h2>
                      <p style={{ ...styles.typeSample, fontSize: '15px', color: `${selectedColors.foreground}B3`, fontFamily: getSelectedFontName() }}>Body text with comfortable reading size</p>
                    </div>

                    <div style={styles.componentSection}>
                      <span style={styles.componentLabel}>Input Fields</span>
                      <input 
                        type="text" 
                        placeholder="Email address" 
                        style={{ 
                          ...styles.previewInput, 
                          borderColor: selectedColors.accent,
                          color: selectedColors.foreground,
                          fontFamily: getSelectedFontName()
                        }} 
                      />
                    </div>

                    <div style={styles.componentSection}>
                      <span style={styles.componentLabel}>Cards</span>
                      <div style={{ ...styles.previewCard, borderColor: selectedColors.secondary }}>
                        <h3 style={{ fontSize: '16px', color: selectedColors.foreground, margin: '0 0 8px 0', fontFamily: getSelectedFontName() }}>Card Title</h3>
                        <p style={{ fontSize: '13px', color: `${selectedColors.foreground}99`, margin: 0, fontFamily: getSelectedFontName() }}>Card content with foreground color</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div style={styles.previewFooter}>
                <span style={styles.previewNote}>Preview updates in real-time as you modify your brand settings</span>
              </div>

              {/* Continue Button */}
              <div style={styles.continueButtonContainer}>
                <button 
                  className="brand-continue-button" 
                  style={styles.continueButton}
                  onClick={() => onNavigateNext && onNavigateNext()}
                >
                  <span>Continue</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
 
 
// Styles object - Apple-inspired minimalism for B2B codegen platform
const styles = {
  appContainer: {
    backgroundColor: '#101010',
    color: '#ffffff',
    minHeight: '100vh',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
  },

  mainContentContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: '#101010',
  },

  contentPadding: {
    padding: '48px 64px',
    maxWidth: '1600px',
    margin: '0 auto',
    width: '100%',
  },

  // Header
  headerSection: {
    marginBottom: '48px',
    textAlign: 'center',
  },

  pageTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '38px',
    fontWeight: '600',
    color: '#ffffff',
    margin: '0 0 12px 0',
    letterSpacing: '-0.5px',
    lineHeight: '1.1',
  },

  pageSubtitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '15px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.55)',
    margin: 0,
    letterSpacing: '-0.2px',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  // Two Column Grid
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '420px 1fr',
    gap: '48px',
    alignItems: 'start',
  },

  configColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },

  configSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  sectionTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    margin: 0,
  },

  // Brand Name Input
  brandNameInput: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: 'rgba(255, 255, 255, 0.85)',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    outline: 'none',
    letterSpacing: '-0.2px',
  },

  // Upload Area
  uploadArea: {
    border: '1px dashed rgba(255, 255, 255, 0.12)',
    borderRadius: '14px',
    padding: '40px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.02)',
    color: 'rgba(255, 255, 255, 0.4)',
  },

  uploadAreaWithLogo: {
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
  },

  logoPreview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
  },

  logoImage: {
    maxWidth: '200px',
    maxHeight: '100px',
    objectFit: 'contain',
  },

  uploadTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    margin: 0,
    letterSpacing: '-0.2px',
  },

  uploadHint: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: 0,
    letterSpacing: '-0.1px',
  },

  uploadButton: {
    padding: '9px 24px',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: 'rgba(255, 255, 255, 0.85)',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '-0.2px',
  },

  changeButton: {
    padding: '8px 20px',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: 'rgba(255, 255, 255, 0.7)',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '-0.1px',
  },

  // Colors
  colorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  colorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
  },

  colorPicker: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    cursor: 'pointer',
    background: 'none',
  },

  colorDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },

  colorRowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  colorName: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: '-0.2px',
  },

  colorHex: {
    fontSize: '11px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: "'SF Mono', 'Monaco', monospace",
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },

  colorDescription: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: '-0.1px',
  },

  // Typography
  fontUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  fontSelectorRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '12px',
  },

  fontSelectWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },

  fontLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: '-0.1px',
  },

  fontDropdown: {
    padding: '12px 14px',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: 'rgba(255, 255, 255, 0.85)',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    outline: 'none',
    cursor: 'pointer',
    letterSpacing: '-0.2px',
  },

  uploadFontButton: {
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: 'rgba(255, 255, 255, 0.7)',
    background: 'transparent',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '-0.1px',
    whiteSpace: 'nowrap',
  },

  fontHint: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.35)',
    margin: 0,
    letterSpacing: '-0.1px',
    paddingLeft: '4px',
  },

  // Voice
  voiceField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  voiceLabel: {
    fontSize: '12px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: '-0.1px',
  },

  voiceInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '10px',
  },

  voiceValue: {
    fontSize: '14px',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    flex: 1,
    cursor: 'pointer',
    letterSpacing: '-0.2px',
  },

  voiceInput: {
    fontSize: '14px',
    fontWeight: '400',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: 'rgba(255, 255, 255, 0.85)',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    flex: 1,
    letterSpacing: '-0.2px',
  },

  editButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255, 255, 255, 0.4)',
  },

  voiceAttributes: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
  },

  voicePills: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },

  voicePill: {
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: 'rgba(255, 255, 255, 0.65)',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '-0.1px',
  },

  voicePillActive: {
    color: '#ffffff',
    background: '#D16021',
    border: '1px solid #D16021',
  },

  // Preview Column
  previewColumn: {
    position: 'relative',
  },

  previewSticky: {
    position: 'sticky',
    top: '48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  previewTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    margin: 0,
  },

  tabGroup: {
    display: 'inline-flex',
    gap: '6px',
    padding: '4px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },

  tab: {
    padding: '7px 14px',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: 'rgba(255, 255, 255, 0.55)',
    background: 'transparent',
    border: 'none',
    borderRadius: '7px',
    cursor: 'pointer',
    letterSpacing: '-0.1px',
  },

  tabActive: {
    color: '#ffffff',
    background: '#D16021',
  },

  previewContainer: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    overflow: 'hidden',
    minHeight: '600px',
  },

  // Mockup Preview
  mockupFrame: {
    padding: '0',
    background: '#0a0a0a',
  },

  mockupContent: {
    minHeight: '600px',
  },

  mockupHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },

  mockupBrandSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  mockupLogo: {
    height: '28px',
    objectFit: 'contain',
  },

  mockupLogoPlaceholder: {
    height: '28px',
    padding: '6px 12px',
    border: '1px dashed',
    borderRadius: '6px',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
    display: 'flex',
    alignItems: 'center',
  },

  mockupBrandName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#ffffff',
    letterSpacing: '-0.2px',
  },

  mockupNav: {
    display: 'flex',
    gap: '20px',
  },

  mockupNavItem: {
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '-0.1px',
    cursor: 'pointer',
  },

  mockupHero: {
    padding: '48px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },

  mockupHeadline: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.4px',
    maxWidth: '80%',
    lineHeight: '1.3',
  },

  mockupSubheadline: {
    fontSize: '14px',
    margin: 0,
    letterSpacing: '-0.1px',
    maxWidth: '70%',
  },

  mockupButtonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },

  mockupButton: {
    padding: '10px 24px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '-0.1px',
  },

  mockupButtonSecondary: {
    padding: '10px 24px',
    fontSize: '13px',
    fontWeight: '500',
    background: 'transparent',
    border: '1px solid',
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '-0.1px',
  },

  mockupCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    padding: '24px',
  },

  mockupCard: {
    padding: '20px 16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  mockupCardIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mockupCardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.2px',
  },

  mockupCardText: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    margin: 0,
    lineHeight: '1.5',
    letterSpacing: '-0.1px',
  },

  mockupFooter: {
    padding: '20px 24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'center',
  },

  // Components Preview
  componentsPreview: {
    padding: '32px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },

  componentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  componentLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  componentRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },

  previewButton: {
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '500',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    borderRadius: '8px',
    cursor: 'pointer',
    letterSpacing: '-0.1px',
  },

  typeSample: {
    margin: '8px 0',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    letterSpacing: '-0.3px',
  },

  previewInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: 'rgba(255, 255, 255, 0.85)',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '8px',
    outline: 'none',
    letterSpacing: '-0.2px',
  },

  previewCard: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
  },

  previewFooter: {
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.015)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
  },

  previewNote: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: '-0.1px',
  },

  // Continue Button
  continueButtonContainer: {
    paddingTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },

  continueButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 32px',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#ffffff',
    background: 'linear-gradient(135deg, #d05d1d 0%, #e87332 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    letterSpacing: '-0.2px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 16px rgba(208, 93, 29, 0.4)',
  },
};
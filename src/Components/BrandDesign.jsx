import React, { useState } from 'react';
import {ConfigureIcon, DesignPreviewIcon, Largefileupload, Brandguidelines } from '../icons.jsx';
 
 
// --- ICONS ---
const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
);
 
 
// Main App component
export default function App() {
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
          font-family: 'Montserrat', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .choose-file-button:hover {
            background-color: #2d2d2d;
        }
        .select-color-button:hover {
            background-color: #D16021;
        }
        .tab-button.active {
            background-color: #D16021;
            color: white;
        }
        .tab-button:not(.active):hover {
            background-color: #2d2d2d;
        }
        .voice-attribute-button.active {
          background-color: #D16021;
          color: white;
        }
        .voice-attribute-button:not(.active):hover {
          background-color: #2d2d2d;
        }
 
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
 
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      <div style={styles.appContainer}>
        <MainContent
          fileInputRef={fileInputRef}
          handleLogoUploadClick={handleLogoUploadClick}
          handleLogoFileChange={handleLogoFileChange}
        />
      </div>
    </>
  );
}
 
 
// Main content area component
const MainContent = ({ fileInputRef, handleLogoUploadClick, handleLogoFileChange }) => {
  const [activeTab, setActiveTab] = useState('Design Preview');
  const [activeVoiceAttribute, setActiveVoiceAttribute] = useState('Professional');
 
  const [editableFields, setEditableFields] = useState({
    brandVoice: 'Building the Future of Technology',
    ageGroup: 'Age Group',
    demographics: 'Demographics',
    businessType: 'Business Type',
  });
 
  const [editingField, setEditingField] = useState(null);
 
  const handleFieldChange = (fieldName, value) => {
    setEditableFields({
      ...editableFields,
      [fieldName]: value
    });
  };
 
  const startEditing = (fieldName) => {
    setEditingField(fieldName);
  };
 
  const stopEditing = () => {
    setEditingField(null);
  };
 
  return (
    <div style={styles.mainContentContainer} className='custom-scrollbar'>
      <div style={styles.contentPadding}>
        {/* Page Title */}
        <div style={styles.topSection}>
          <div style={styles.titleContainer}>
            <Brandguidelines />
          </div>
        </div>
 
        {/* Logo Upload Section */}
        <div style={styles.sectionCard}>
          <div style={styles.logoUploadBox}>
            <Largefileupload />
            <b>Upload Your Logo File</b>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoFileChange}
              style={{ display: 'none' }}
            />
            <button className="choose-file-button" style={styles.chooseFileButton} onClick={handleLogoUploadClick}>
              Choose File
            </button>
            <p style={styles.uploadSupportText}>Supports: PDF, DOCX, URLs, PNG, JPG & SVG</p>
          </div>
        </div>
 
        {/* Color Palette Section */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Color Palette</h2>
            <button className="select-color-button" style={styles.selectColorButton}>Select Color of your choice</button>
          </div>
          <div style={styles.colorPaletteGrid}>
            <div style={styles.colorSwatchContainer}>
              <div style={{ ...styles.colorSwatch, backgroundColor: '#D16021' }}></div>
              <span style={styles.colorName}>Primary Color</span>
              <span style={styles.colorHex}>#D16021</span>
            </div>
            <div style={styles.colorSwatchContainer}>
              <div style={{ ...styles.colorSwatch, backgroundColor: '#374151' }}></div>
              <span style={styles.colorName}>Secondary Color</span>
              <span style={styles.colorHex}>#374151</span>
            </div>
            <div style={styles.colorSwatchContainer}>
              <div style={{ ...styles.colorSwatch, backgroundColor: '#6b7280' }}></div>
              <span style={styles.colorName}>Accent Color</span>
              <span style={styles.colorHex}>#6B7280</span>
            </div>
            <div style={styles.colorSwatchContainer}>
              <div style={{ ...styles.colorSwatch, backgroundColor: '#ffffff' }}></div>
              <span style={styles.colorName}>Text Color</span>
              <span style={styles.colorHex}>#FFFFFF</span>
            </div>
            <div style={styles.colorSwatchContainer}>
              <div style={{ ...styles.colorSwatch, backgroundColor: '#9ca3af' }}></div>
              <span style={styles.colorName}>Secondary Text Color</span>
              <span style={styles.colorHex}>#9CA3AF</span>
            </div>
            <div style={styles.colorSwatchContainer}>
              <div style={{ ...styles.colorSwatch, backgroundColor: '#2d2d2d' }}></div>
              <span style={styles.colorName}>Background Color</span>
              <span style={styles.colorHex}>#2D2D2D</span>
            </div>
          </div>
        </div>
 
        {/* Typography Section */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Typography</h2>
          </div>
 
          <div style={styles.fontPreviewContainer} className='custom-scrollbar'>
            {/* Left Box - Heading Font */}
            <div style={{ flex: 1 }}>
              <div style={styles.fontSelectorGroup}>
                <span style={styles.fontLabel}>Heading Font:</span>
                <select style={styles.fontSelect}>
                  <option>Montserrat</option>
                </select>
              </div>
              <div style={styles.fontPreviewBox} className="gradient-border-box">
                <p style={styles.primaryHeadline}>Primary Headline</p>
                <p style={styles.secondaryHeadline}>Secondary Headline</p>
                <p style={styles.tertiaryHeadline}>Tertiary Headline</p>
              </div>
            </div>
 
            {/* Right Box - Body Font */}
            <div style={{ flex: 1 }}>
              <div style={styles.fontSelectorGroup}>
                <span style={styles.fontLabel}>Body Font:</span>
                <select style={styles.fontSelect}>
                  <option>Montserrat</option>
                </select>
              </div>
              <div style={styles.fontPreviewBox} className="gradient-border-box">
                <p style={styles.bodyText}>This is an example of body text in your selected font. Good typography enhances readability and reinforces your brand identity across all communications.</p>
                <p style={styles.bodyText}>This is an example of body text in your selected font. Good typography enhances readability.</p>
              </div>
            </div>
          </div>
        </div>
 
        {/* Brand Voice & Identity */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Brand Voice & Identity</h2>
          </div>
 
          <div style={styles.brandVoiceContentRow}>
            {/* Left Side - Brand Voice & Identity */}
            <div style={styles.brandVoiceLeftSection}>
              <span style={styles.fieldLabel}>Brand Voice & Identity</span>
              <div style={styles.brandVoiceItem}>
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
                    style={styles.editableInput}
                  />
                ) : (
                  <span
                    style={styles.brandVoiceText}
                    onClick={() => startEditing('brandVoice')}
                  >
                    {editableFields.brandVoice}
                  </span>
                )}
                <button
                  onClick={() => startEditing('brandVoice')}
                  style={styles.iconButton}
                >
                  <PencilIcon style={styles.editIcon} />
                </button>
              </div>
            </div>
             
            {/* Right Side - Voice Attributes */}
            <div style={styles.voiceAttributesRightSection}>
              <span style={styles.fieldLabel}>Voice Attributes</span>
              <div style={styles.voiceAttributeButtons}>
                {['Professional', 'Approachable', 'Innovative', 'Clear'].map((attribute) => (
                  <button
                    key={attribute}
                    className={`voice-attribute-button ${activeVoiceAttribute === attribute ? 'active' : ''}`}
                    onClick={() => setActiveVoiceAttribute(attribute)}
                    style={{
                      ...styles.voiceAttributeButton,
                      ...(activeVoiceAttribute === attribute ? styles.voiceAttributeButtonActive : {}),
                    }}
                  >
                    {attribute}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
 
        {/* Target Audience */}
        <div style={styles.sectionCard}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Target Audience</h2>
          </div>
          <div style={styles.targetAudienceGrid}>
            {/* Age Group Field */}
            <div style={styles.targetAudienceItem}>
              {editingField === 'ageGroup' ? (
                <input
                  type="text"
                  value={editableFields.ageGroup}
                  onChange={(e) => handleFieldChange('ageGroup', e.target.value)}
                  onBlur={stopEditing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      stopEditing();
                    }
                  }}
                  autoFocus
                  style={styles.editableInput}
                />
              ) : (
                <span
                  style={styles.targetAudienceText}
                  onClick={() => startEditing('ageGroup')}
                >
                  {editableFields.ageGroup}
                </span>
              )}
              <button
                onClick={() => startEditing('ageGroup')}
                style={styles.iconButton}
              >
                <PencilIcon style={styles.editIcon} />
              </button>
            </div>
 
            {/* Demographics Field */}
            <div style={styles.targetAudienceItem}>
              {editingField === 'demographics' ? (
                <input
                  type="text"
                  value={editableFields.demographics}
                  onChange={(e) => handleFieldChange('demographics', e.target.value)}
                  onBlur={stopEditing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      stopEditing();
                    }
                  }}
                  autoFocus
                  style={styles.editableInput}
                />
              ) : (
                <span
                  style={styles.targetAudienceText}
                  onClick={() => startEditing('demographics')}
                >
                  {editableFields.demographics}
                </span>
              )}
              <button
                onClick={() => startEditing('demographics')}
                style={styles.iconButton}
              >
                <PencilIcon style={styles.editIcon} />
              </button>
            </div>
 
            {/* Business Type Field */}
            <div style={styles.targetAudienceItem}>
              {editingField === 'businessType' ? (
                <input
                  type="text"
                  value={editableFields.businessType}
                  onChange={(e) => handleFieldChange('businessType', e.target.value)}
                  onBlur={stopEditing}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      stopEditing();
                    }
                  }}
                  autoFocus
                  style={styles.editableInput}
                />
              ) : (
                <span
                  style={styles.targetAudienceText}
                  onClick={() => startEditing('businessType')}
                >
                  {editableFields.businessType}
                </span>
              )}
              <button
                onClick={() => startEditing('businessType')}
                style={styles.iconButton}
              >
                <PencilIcon style={styles.editIcon} />
              </button>
            </div>
          </div>
        </div>
 
        {/* Design Preview / Configure Tabs */}
        <div style={styles.tabContainer}>
          <button
            className={`tab-button ${activeTab === 'Design Preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('Design Preview')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'Design Preview' ? styles.tabButtonActive : styles.tabButtonInactive),
            }}
          >
            <DesignPreviewIcon />
            Design Preview
          </button>
          <button
            className={`tab-button ${activeTab === 'Configure' ? 'active' : ''}`}
            onClick={() => setActiveTab('Configure')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'Configure' ? styles.tabButtonActive : styles.tabButtonInactive),
            }}
          >
            <ConfigureIcon />
            Configure
          </button>
        </div>
 
        {/* Preview Area */}
        <div style={styles.previewArea}>
          <p style={styles.previewUnavailableText}>Preview unavailable</p>
        </div>
 
      </div>
    </div>
  );
};
 
 
// Styles object
const styles = {
  appContainer: {
    backgroundColor: '#111217',
    color: '#f9fafb',
    minHeight: '100vh',
    fontFamily: "'Montserrat', sans-serif",
  },
  mainContentContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    backgroundColor: '#101010',
  },
  contentPadding: {
    padding: '32px 64px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  topSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  sectionCard: {
    backgroundColor: 'transparent',
    padding: '24px',
    marginBottom: '32px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0,
    color: '#f9fafb',
  },
  logoUploadBox: {
    border: '2px dashed #acacadff',
    borderRadius: '8px',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '120px',
  },
  chooseFileButton: {
    backgroundColor: '#3f3f46',
    color: '#f4f4f5',
    fontWeight: '500',
    padding: '10px 24px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
    marginBottom: '12px',
  },
  uploadSupportText: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  selectColorButton: {
    backgroundColor: '#3f3f46',
    color: '#f4f4f5',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background-color 0.2s',
  },
  colorPaletteGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '80px',
    justifyItems: 'center',
  },
  colorSwatchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  colorSwatch: {
    width: '180px',
    height: '80px',
    borderRadius: '8px',
    marginBottom: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  colorName: {
    fontSize: '13px',
    color: '#f9fafb',
    fontWeight: '500',
    marginBottom: '4px',
  },
  colorHex: {
    fontSize: '11px',
    color: '#9ca3af',
  },
  fontSelectorGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  fontLabel: {
    fontSize: '14px',
    color: '#f9fafb',
  },
  fontSelect: {
    backgroundColor: '#3f3f46',
    color: '#f4f4f5',
    border: '1px solid #D16021',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    appearance: 'none',
  },
  primaryHeadline: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    color: '#f9fafb',
  },
  secondaryHeadline: {
    fontSize: '20px',
    fontWeight: '600',
    margin: 0,
    color: '#f9fafb',
  },
  tertiaryHeadline: {
    fontSize: '16px',
    fontWeight: '500',
    margin: 0,
    color: '#f9fafb',
  },
  fontPreviewContainer: {
    display: 'flex',
    gap: '24px',
  },
  fontPreviewBox: {
    flex: 1,
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#1a1a1d',
    height: '100px',
    overflowY: 'auto',
  },
  bodyText: {
    fontSize: '14px',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
    color: '#9ca3af',
    overflowY: 'auto',
  },
  brandVoiceText: {
    fontSize: '14px',
    color: '#f9fafb',
    cursor: 'pointer',
  },
  editIcon: {
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  voiceAttributeButtons: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  voiceAttributeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    color: '#f4f4f5',
    padding: '17px 22px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background-color 0.2s, color 0.2s',
  },
  voiceAttributeButtonActive: {
    backgroundColor: '#D16021',
    color: 'white',
  },
  targetAudienceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '24px',
  },
  targetAudienceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #374151',
    width: 'fit-content',
  },
  targetAudienceText: {
    fontSize: '14px',
    color: '#f9fafb',
    cursor: 'pointer',
  },
  tabContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  tabButton: {
    backgroundColor: '#3f3f46',
    color: '#f4f4f5',
    fontWeight: '500',
    padding: '10px 24px',
    borderRadius: '15px',
    border: 'solid 1px #D16021',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background-color 0.2s, color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabButtonActive: {
    backgroundColor: '#D16021',
    color: 'white',
  },
  tabButtonInactive: {
    backgroundColor: '#3f3f46',
    color: '#f4f4f5',
  },
  previewArea: {
    backgroundColor: '#111217',
    borderRadius: '12px',
    border: '2px dashed #acacadff',
    minHeight: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '32px',
  },
  previewUnavailableText: {
    fontSize: '16px',
    color: '#9ca3af',
  },
  editableInput: {
    fontSize: '14px',
    color: '#D16021',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid #D16021',
    outline: 'none',
    padding: '4px 0',
    fontFamily: "'Montserrat', sans-serif",
    width: '100%',
    minWidth: '200px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandVoiceContentRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: '200px',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  brandVoiceLeftSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minWidth: '300px',
  },
  voiceAttributesRightSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },
  fieldLabel: {
    fontSize: '14px',
    color: '#f9fafb',
    fontWeight: '500',
    fontFamily: "'Montserrat', sans-serif",
    marginBottom: '8px',
  },
  brandVoiceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #374151',
    width: 'fit-content',
    minWidth: '280px',
  },
};
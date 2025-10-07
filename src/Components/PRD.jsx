import React from 'react';
import { apiClient, API_ENDPOINTS } from '../Context.jsx';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Main PRD component with Apple-inspired premium design
export default function PRD({ onNavigateNext }) {
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

        /* Minimal, refined animations */
        @keyframes prdFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }


        /* Upload button - Clean hover */
        .prd-upload-button:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.35);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
        }

        .prd-upload-button:active {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(0);
          box-shadow: none;
        }

        /* Process button - Clean hover */
        .prd-process-button:hover {
          background: #f28a4a;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(232, 115, 50, 0.35);
        }

        .prd-process-button:active {
          background: #e87332;
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(232, 115, 50, 0.25);
        }

        .prd-process-button:disabled {
          opacity: 0.35;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
        
        .prd-process-button:disabled:hover {
          background: #e87332;
        }

        /* Textarea - clear focus state */
        .prd-textarea:focus {
          outline: none;
          border-color: rgba(209, 96, 33, 0.5);
          background-color: rgba(255, 255, 255, 0.05);
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(209, 96, 33, 0.1);
        }

        .prd-textarea::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        /* Selected file - smooth entrance */
        @keyframes prdFileSlideIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .prd-selected-file {
          animation: prdFileSlideIn 0.25s ease-out;
        }

        .prd-selected-file button:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      `}</style>

      <div style={styles.appContainer}>
        <MainContent onNavigateNext={onNavigateNext} />
      </div>
    </>
  );
}

// Text extraction utility functions
const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }

  return fullText.trim();
};

const extractTextFromWord = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const extractTextFromTxt = async (file) => {
  return await file.text();
};

// Main content area component
const MainContent = ({ onNavigateNext }) => {
  const fileInputRef = React.useRef(null);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [selectedFileName, setSelectedFileName] = React.useState(null);
  const [extractedText, setExtractedText] = React.useState('');
  const [textValue, setTextValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isExtracting, setIsExtracting] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Fetch existing PRD on component mount
  React.useEffect(() => {
    const fetchPRD = async () => {
      try {
        // Get user_id and project_id from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

        // Make GET request with user_id and project_id as query params
        const response = await apiClient.get(API_ENDPOINTS.GET_PRD, {
          params: {
            user_id: user.id || null,
            project_id: project.id || null,
          },
        });

        // If text is returned, set it in the textarea
        if (response.data && response.data.text) {
          setTextValue(response.data.text);
          console.log('PRD fetched successfully');
        }
      } catch (err) {
        // Silently handle errors - if PRD doesn't exist, leave textarea empty
        console.log('No existing PRD found or error fetching PRD:', err.message);
      }
    };

    fetchPRD();
  }, []); // Empty dependency array means this runs once on mount

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setSelectedFileName(file.name);
    setError(null);
    setIsExtracting(true);

    try {
      let extractedContent = '';
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'pdf') {
        extractedContent = await extractTextFromPDF(file);
      } else if (fileExtension === 'docx' || fileExtension === 'doc') {
        extractedContent = await extractTextFromWord(file);
      } else if (fileExtension === 'txt') {
        extractedContent = await extractTextFromTxt(file);
      } else {
        throw new Error('Unsupported file format. Please upload PDF, Word, or TXT files.');
      }

      setExtractedText(extractedContent);
      console.log("Extracted text from file:", file.name);
    } catch (err) {
      console.error('Error extracting text from file:', err);
      setError(err.message || 'Failed to extract text from file. Please try again.');
      setSelectedFile(null);
      setSelectedFileName(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmitPRD = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Combine textarea text and extracted file text
      let combinedText = '';
      
      if (textValue.trim()) {
        combinedText = textValue.trim();
      }
      
      if (extractedText.trim()) {
        if (combinedText) {
          combinedText += '\n\n--- Content from uploaded file ---\n\n';
        }
        combinedText += extractedText.trim();
      }

      // Get user_id and project_id from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

      // Send combined text to backend with user_id and project_id
      const response = await apiClient.post(API_ENDPOINTS.UPLOAD_PRD, {
        text: combinedText,
        source: selectedFileName ? `file: ${selectedFileName}` : 'textarea',
        user_id: user.id || null,
        project_id: project.id || null,
      });

      console.log('PRD uploaded successfully:', response.data);
      
      // Navigate to next step on success
      if (onNavigateNext) {
        onNavigateNext();
      }
    } catch (err) {
      console.error('Error uploading PRD:', err);
      setError(err.response?.data?.message || 'Failed to upload PRD. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div style={styles.mainContentContainer}>
        <div style={styles.contentWrapper}>
          <main style={styles.mainSection}>
            {/* Page Heading */}
            <h1 style={styles.pageTitle}>What do you want to build ?</h1>
            <p style={styles.subtitle}>Describe your vision and we'll bring it to life</p>

            <textarea
              className="prd-textarea"
              style={styles.textarea}
              placeholder="E.g., An e-commerce platform for handmade crafts with seller profiles, shopping cart, secure payments..."
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
            />

            {selectedFileName && (
              <div className="prd-selected-file" style={styles.selectedFileTag}>
                {isExtracting ? (
                  <>
                    <LoadingSpinner />
                    <span style={styles.fileName}>Extracting text from {selectedFileName}...</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{flexShrink: 0, opacity: 0.7}}>
                      <path d="M8 2L8 10M8 2L5 5M8 2L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 11V12C3 12.5304 3.21071 13.0391 3.58579 13.4142C3.96086 13.7893 4.46957 14 5 14H11C11.5304 14 12.0391 13.893 12.4142 13.4142C12.7893 13.0391 13 12.5304 13 12V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span style={styles.fileName}>{selectedFileName}</span>
                    <button 
                      style={styles.removeFileBtn}
                      onClick={() => {
                        setSelectedFile(null);
                        setSelectedFileName(null);
                        setExtractedText('');
                      }}
                      aria-label="Remove file"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            )}

            {error && (
              <div style={styles.errorMessage}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{flexShrink: 0}}>
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4V8M8 11V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div style={styles.actionsContainer}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                style={{ display: 'none' }} 
                accept=".txt,.pdf,.doc,.docx"
              />
              
              <button 
                className="prd-upload-button" 
                style={styles.uploadButton} 
                onClick={handleUploadClick}
              >
                <UploadFileIcon />
                <span>Upload PRD</span>
              </button>

              <button 
                className="prd-process-button" 
                style={styles.processButton}
                disabled={(!textValue && !extractedText) || isLoading || isExtracting}
                onClick={handleSubmitPRD}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span>Processing...</span>
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
  );
};

// Refined styles - Pure Apple minimalism: open, spacious, breathable
const styles = {
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
    padding: '16px 32px 40px 32px',
    minHeight: '100vh',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: '720px',
    animation: 'prdFadeIn 0.8s ease-out',
  },
  mainSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  pageTitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '450',
    fontSize: '50px',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-1.8px',
    lineHeight: '1.1',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '400',
    fontSize: '18px',
    color: 'rgba(209, 96, 33, 0.95)',
    margin: '8px 0 0 0',
    letterSpacing: '0.1px',
    lineHeight: '1.5',
    textAlign: 'center',
  },
  textarea: {
    width: '100%',
    height: '280px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1.5px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    padding: '20px 24px',
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: '17px',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontWeight: '400',
    lineHeight: '1.7',
    letterSpacing: '-0.1px',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  selectedFileTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 14px',
    marginTop: '12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '-0.1px',
    alignSelf: 'flex-start',
  },
  fileName: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'rgba(255, 255, 255, 0.7)',
    maxWidth: '300px',
  },
  removeFileBtn: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '18px',
    lineHeight: '1',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    padding: 0,
  },
  actionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  uploadButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px 40px',
    background: 'transparent',
    border: '1.5px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '16px',
    fontWeight: '500',
    letterSpacing: '-0.2px',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: 'none',
  },
  processButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '16px 40px',
    background: '#e87332',
    border: 'none',
    borderRadius: '12px',
    color: '#ffffff',
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '16px',
    fontWeight: '500',
    letterSpacing: '-0.2px',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(232, 115, 50, 0.25)',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: '500',
    marginTop: '8px',
    alignSelf: 'stretch',
  },
};

// SVG Icons as React components - Refined
const UploadFileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 13V4M10 4L7 7M10 4L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 14V15C4 15.5304 4.21071 16.0391 4.58579 16.4142C4.96086 16.7893 5.46957 17 6 17H14C14.5304 17 15.0391 16.7893 15.4142 16.4142C15.7893 16.0391 16 15.5304 16 15V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoadingSpinner = () => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 18 18" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    style={{
      animation: 'spin 1s linear infinite',
    }}
  >
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
    <circle 
      cx="9" 
      cy="9" 
      r="7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      strokeDasharray="32"
      strokeDashoffset="8"
      opacity="0.8"
    />
  </svg>
);


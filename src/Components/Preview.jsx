import React, { useState } from 'react';
import { PreviewTitle } from '../icons.jsx';
 
// Main App component
export default function App() {
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
 
        /* Scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      <div style={styles.appContainer}>
        <MainContent />
      </div>
    </>
  );
}
 
const HtmlFilesHeader = () => {
  return (
    <div style={contentStyles.htmlFilesHeaderContainer}>
      <div style={contentStyles.htmlFilesTopRow}>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25.0383 7.77422L20.3508 3.08672C20.2637 2.99969 20.1602 2.93067 20.0464 2.88362C19.9326 2.83657 19.8107 2.8124 19.6875 2.8125H10.3125C9.81522 2.8125 9.33831 3.01004 8.98668 3.36167C8.63504 3.71331 8.4375 4.19022 8.4375 4.6875V6.5625H6.5625C6.06522 6.5625 5.58831 6.76004 5.23667 7.11168C4.88504 7.46331 4.6875 7.94022 4.6875 8.4375V25.3125C4.6875 25.8098 4.88504 26.2867 5.23667 26.6383C5.58831 26.99 6.06522 27.1875 6.5625 27.1875H19.6875C20.1848 27.1875 20.6617 26.99 21.0133 26.6383C21.365 26.2867 21.5625 25.8098 21.5625 25.3125V23.4375H23.4375C23.9348 23.4375 24.4117 23.24 24.7633 22.8883C25.115 22.5367 25.3125 22.0598 25.3125 21.5625V8.4375C25.3126 8.31435 25.2884 8.19239 25.2414 8.07858C25.1943 7.96477 25.1253 7.86135 25.0383 7.77422ZM19.6875 25.3125H6.5625V8.4375H15.5496L19.6875 12.5754V25.3125ZM23.4375 21.5625H21.5625V12.1875C21.5626 12.0643 21.5384 11.9424 21.4914 11.8286C21.4443 11.7148 21.3753 11.6113 21.2883 11.5242L16.6008 6.83672C16.5137 6.74969 16.4102 6.68067 16.2964 6.63362C16.1826 6.58657 16.0607 6.5624 15.9375 6.5625H10.3125V4.6875H19.2996L23.4375 8.82539V21.5625ZM16.875 17.8125C16.875 18.0611 16.7762 18.2996 16.6004 18.4754C16.4246 18.6512 16.1861 18.75 15.9375 18.75H10.3125C10.0639 18.75 9.8254 18.6512 9.64959 18.4754C9.47377 18.2996 9.375 18.0611 9.375 17.8125C9.375 17.5639 9.47377 17.3254 9.64959 17.1496C9.8254 16.9738 10.0639 16.875 10.3125 16.875H15.9375C16.1861 16.875 16.4246 16.9738 16.6004 17.1496C16.7762 17.3254 16.875 17.5639 16.875 17.8125ZM16.875 21.5625C16.875 21.8111 16.7762 22.0496 16.6004 22.2254C16.4246 22.4012 16.1861 22.5 15.9375 22.5H10.3125C10.0639 22.5 9.8254 22.4012 9.64959 22.2254C9.47377 22.0496 9.375 21.8111 9.375 21.5625C9.375 21.3139 9.47377 21.0754 9.64959 20.8996C9.8254 20.7238 10.0639 20.625 10.3125 20.625H15.9375C16.1861 20.625 16.4246 20.7238 16.6004 20.8996C16.7762 21.0754 16.875 21.3139 16.875 21.5625Z" fill="#D05D1D"/>
        </svg>
        <span style={contentStyles.htmlFilesTitle}>HTML Files Generated</span>
      </div>
      <p style={contentStyles.htmlFilesSubtitle}>Found 10 Generated pages</p>
    </div>
  );
};
 
const MainContentCard = () => {
  const files = [
    { name: 'Booking', file: 'booking.html', size: '32.18 KB' },
    { name: 'Confirmation', file: 'confirmation.html', size: '32.18 KB' },
    { name: 'Dashboard', file: 'dashboard.html', size: '32.18 KB' },
    { name: 'Login', file: 'login.html', size: '32.18 KB' },
    { name: 'Profile', file: 'profile.html', size: '32.18 KB' },
    { name: 'Sign UP', file: 'signup.html', size: '32.18 KB' },
    { name: 'Settings', file: 'settings.html', size: '32.18 KB' },
  ];
 
  return (
    <div style={contentStyles.mainCard}>
      <div style={contentStyles.cardLayout}>
        {/* Left section with fixed headers */}
        <div style={contentStyles.leftSection}>
          {/* Fixed Headers */}
          <div style={contentStyles.headersRow}>
            <div style={contentStyles.headerColumn1}>
              <h3 style={contentStyles.columnHeader}>File Name</h3>
            </div>
            <div style={contentStyles.headerColumn2}>
              <h3 style={contentStyles.columnHeader}>Issues</h3>
            </div>
          </div>
         
          <div style={contentStyles.headerDivider}></div>
         
          {/* Scrollable content */}
          <div style={contentStyles.scrollableContent} className="custom-scrollbar">
            <div style={contentStyles.columnsWrapper}>
              {/* Column 1: File Name */}
              <div style={contentStyles.column1}>
                {files.map((file, index) => (
                  <div key={index}>
                    <div style={contentStyles.fileItem}>
                      <div style={{...contentStyles.fileName, color: index === 0 ? 'rgba(208, 93, 29, 1)' : 'rgba(248, 248, 248, 1)'}}>
                        {file.name}
                      </div>
                      <div style={contentStyles.fileSubtext}>{file.file}</div>
                    </div>
                    {index < files.length - 1 && <div style={contentStyles.rowDivider}></div>}
                  </div>
                ))}
              </div>
 
              {/* Column 2: Issues */}
              <div style={contentStyles.column2}>
                {files.map((file, index) => (
                  <div key={index}>
                    <div style={contentStyles.issuesItem}>
                      <div style={contentStyles.sizeBadge}>{file.size}</div>
                    </div>
                    {index < files.length - 1 && <div style={contentStyles.rowDivider}></div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
 
        {/* Column 3: Preview Area */}
        <div style={contentStyles.column3}>
          <div style={contentStyles.previewContainer}>
            <h3 style={contentStyles.previewHeader}>Booking</h3>
            <div style={contentStyles.headerDivider}></div>
            <div style={contentStyles.previewBox}>
              <span style={contentStyles.previewText}>Booking Page Preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
const FlowChartButton = () => {
  return (
    <button style={contentStyles.flowChartButton}>
      <div style={contentStyles.flowChartButtonInner}>
        <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" fill="none">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span style={contentStyles.flowChartButtonText}>Go back to flow chart</span>
      </div>
    </button>
  );
};
 
const StartAgainButton = () => {
  return (
    <button style={contentStyles.startAgainButton}>
      <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.4993 21.3332C7.61463 21.3332 5.17122 20.3321 3.16914 18.33C1.16706 16.328 0.166016 13.8846 0.166016 10.9998C0.166016 8.11512 1.16706 5.67172 3.16914 3.66963C5.17122 1.66755 7.61463 0.666508 10.4993 0.666508C11.9848 0.666508 13.4056 0.973064 14.7618 1.58617C16.1181 2.19929 17.2806 3.07676 18.2493 4.21859V1.95817C18.2493 1.5922 18.3733 1.28565 18.6213 1.03851C18.8693 0.79137 19.1759 0.667369 19.541 0.666508C19.9061 0.665647 20.2131 0.789647 20.462 1.03851C20.7108 1.28737 20.8344 1.59392 20.8327 1.95817V8.41651C20.8327 8.78248 20.7087 9.08947 20.4607 9.33747C20.2127 9.58547 19.9061 9.70904 19.541 9.70817H13.0827C12.7167 9.70817 12.4102 9.58417 12.163 9.33617C11.9159 9.08817 11.7919 8.78162 11.791 8.41651C11.7902 8.0514 11.9142 7.74484 12.163 7.49684C12.4119 7.24884 12.7184 7.12484 13.0827 7.12484H17.216C16.5271 5.91929 15.5855 4.97206 14.3911 4.28317C13.1968 3.59429 11.8995 3.24984 10.4993 3.24984C8.34657 3.24984 6.51671 4.00331 5.00977 5.51026C3.50282 7.0172 2.74935 8.84706 2.74935 10.9998C2.74935 13.1526 3.50282 14.9825 5.00977 16.4894C6.51671 17.9964 8.34657 18.7498 10.4993 18.7498C11.9632 18.7498 13.3036 18.3787 14.5203 17.6364C15.7371 16.8941 16.6787 15.8983 17.3452 14.6488C17.5174 14.3474 17.7598 14.1377 18.0724 14.0198C18.385 13.9018 18.7023 13.8962 19.0243 14.003C19.3688 14.1106 19.6164 14.3366 19.7671 14.6811C19.9177 15.0255 19.907 15.3485 19.7348 15.6498C18.8521 17.3721 17.5928 18.7498 15.9566 19.7832C14.3205 20.8165 12.5014 21.3332 10.4993 21.3332Z" fill="#F8F8F8"/>
      </svg>
      <span style={contentStyles.startAgainButtonText}>Start Again</span>
    </button>
  );
};
 
// Main content area component
const MainContent = () => {
  return (
    <div style={styles.mainContentContainer} className='custom-scrollbar'>
      <div style={contentStyles.titleContainer}>
        <PreviewTitle />
      </div>
 
      <div style={contentStyles.htmlFilesContainer}>
        <HtmlFilesHeader />
      </div>
 
      <div style={contentStyles.generatedPagesWrapper}>
        <h2 style={contentStyles.generatedPagesTitle}>Generated Pages</h2>
        <MainContentCard />
      </div>
      {/* Divider below card */}
      <div style={contentStyles.bottomDivider}></div>
 
      {/* Buttons */}
      <div style={contentStyles.buttonsContainer}>
        <FlowChartButton />
        <StartAgainButton />
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
};
 
const contentStyles = {
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '60px',
  },
  htmlFilesContainer: {
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  htmlFilesHeaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  htmlFilesTopRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  htmlFilesTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '100%',
    color: 'rgba(248, 248, 248, 1)',
    margin: 0,
  },
  htmlFilesSubtitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '100%',
    color: 'rgba(163, 163, 163, 1)',
    margin: 0,
  },
  generatedPagesWrapper: {
    marginTop: '32px',
    paddingLeft: '40px',
    paddingRight: '40px',
  },
  generatedPagesTitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '100%',
    color: 'rgba(248, 248, 248, 0.98)',
    margin: 0,
    marginBottom: '24px',
  },
  mainCard: {
    width: 'calc(100vw - 80px)',
    maxWidth: '1400px',
    height: '600px',
    borderRadius: '12px',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)',
    borderRight: '1px solid rgba(255, 255, 255, 0.15)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
    borderTop: 'none',
    backdropFilter: 'blur(4px)',
  },
  cardLayout: {
    display: 'flex',
    width: '100%',
    height: '100%',
    gap: '0px',
  },
  column3: {
    flex: 1,
    padding: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnHeader: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '100%',
    color: 'rgba(248, 248, 248, 0.9)',
    margin: 0,
    marginBottom: '20px',
  },
  previewBox: {
    width: '100%',
    height: '90%',
    backgroundColor: '#000000',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '16px',
    color: 'rgba(163, 163, 163, 1)',
  },
  headerDivider: {
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: '12px',
    marginBottom: '12px',
  },
  rowDivider: {
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: '16px',
    marginBottom: '16px',
  },
  fileItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  fileName: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '100%',
  },
  fileSubtext: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '16px',
    lineHeight: '100%',
    color: 'rgba(163, 163, 163, 1)',
  },
  issuesItem: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '50px',
  },
  sizeBadge: {
    width: '95px',
    height: '41px',
    borderRadius: '12px',
    backgroundColor: 'rgba(248, 248, 248, 0.08)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '100%',
    color: 'rgba(248, 248, 248, 1)',
  },
  previewContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  previewHeader: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '100%',
    color: 'rgba(208, 93, 29, 1)',
    margin: 0,
    marginBottom: '0px',
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headersRow: {
    display: 'flex',
    flexShrink: 0,
  },
  headerColumn1: {
    width: '180px',
    padding: '24px',
    paddingBottom: '0px',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
  headerColumn2: {
    width: '180px',
    padding: '24px',
    paddingBottom: '0px',
  },
  scrollableContent: {
    display: 'flex',
    overflowY: 'auto',
    flex: 1,
  },
  columnsWrapper: {
    display: 'flex',
    width: '100%',
  },
  column1: {
    width: '180px',
    padding: '24px',
    paddingTop: '12px',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  },
  column2: {
    width: '180px',
    padding: '24px',
    paddingTop: '12px',
  },
  bottomDivider: {
    width: '100%',
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginTop: '40px',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '24px',
    marginTop: '40px',
    paddingLeft: '40px',
    paddingBottom: '40px',
  },
  flowChartButton: {
    width: '328px',
    height: '50px',
    borderRadius: '15px',
    border: '1px solid rgba(210, 98, 34, 1)',
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0%, rgba(83, 83, 83, 0.1) 100%)',
    boxShadow: '-1px 2px 4.8px 0px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowChartButtonInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '9px 35px',
  },
  flowChartButtonText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '100%',
    color: 'rgba(248, 248, 248, 1)',
    textAlign: 'center',
  },
  buttonIcon: {
    width: '20px',
    height: '20px',
    color: 'rgba(248, 248, 248, 1)',
  },
  startAgainButton: {
    width: '226px',
    height: '45px',
    borderRadius: '15px',
    padding: '9px 35px',
    background: 'rgba(208, 93, 29, 1)',
    border: '0.5px solid rgba(255, 255, 255, 0.04)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  startAgainButtonText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '100%',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },
};
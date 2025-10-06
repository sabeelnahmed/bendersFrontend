import React, { useState } from 'react';
import {DeploymentInformationIcon, DeploymentLogsIcon, FrontendConfigurationIcon, DeployFrontendIcon, ApplicationDeploymentTitle } from '../icons';

// Main App component
export default function App() {
  const [activeTab, setActiveTab] = useState('frontend');

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
        <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
}

// Tab Buttons
const TabButtons = ({ activeTab, setActiveTab }) => {
  return (
    <div style={tabButtonStyles.outerContainer}>
      <div style={tabButtonStyles.backgroundRect}></div>
      <div style={tabButtonStyles.innerContainer}>
        <button
          onClick={() => setActiveTab('frontend')}
          style={{
            ...tabButtonStyles.button,
            ...(activeTab === 'frontend' ? tabButtonStyles.buttonActive : tabButtonStyles.buttonInactive)
          }}
        >
          Frontend Generation
        </button>
        <button
          onClick={() => setActiveTab('backend')}
          style={{
            ...tabButtonStyles.button,
            ...(activeTab === 'backend' ? tabButtonStyles.buttonActive : tabButtonStyles.buttonInactive)
          }}
        >
          Backend Generation
        </button>
      </div>
    </div>
  );
};

const tabButtonStyles = {
  outerContainer: {
    position: 'relative',
    width: '565px',
    height: '55px',
  },
  backgroundRect: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '565px',
    height: '55px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.09)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  innerContainer: {
    position: 'absolute',
    top: '5px',
    left: '14px',
    width: '501px',
    height: '45px',
    display: 'flex',
    gap: '31px',
    zIndex: 1,
  },
  button: {
    width: '261px',
    height: '45px',
    borderRadius: '20px',
    padding: '10px 24px',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '100%',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  buttonActive: {
    background: 'linear-gradient(90deg, rgba(208, 93, 29, 0.38) 0%, rgba(83, 83, 83, 0.1) 100%)',
    color: 'rgba(248, 248, 248, 1)',
    border: '0.5px solid rgba(255, 255, 255, 0.5)',
  },
  buttonInactive: {
    background: 'transparent',
    color: 'rgba(248, 248, 248, 1)',
    border: 'none',
  },
};

// Main content area
const MainContent = ({ activeTab, setActiveTab }) => {
  const [repoName, setRepoName] = useState('my-frontend-app');
  const [githubToken, setGithubToken] = useState('');

  return (
    <div style={styles.mainContentContainer} className='custom-scrollbar'>
      {/* Title Section */}
      <div style={contentStyles.titleContainer}>
        <ApplicationDeploymentTitle />
      </div>

      {/* Tab Buttons */}
      <div style={contentStyles.tabButtonsContainer}>
        <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Two Column Layout */}
      <div style={deploymentLayoutStyles.container}>
        {/* Left Column - Contains Frontend Config and Deployment Info */}
        <div style={deploymentLayoutStyles.leftColumn}>
          {/* Frontend Configuration Card */}
          <div style={frontendConfigStyles.card}>
            {/* Card Header */}
            <div style={frontendConfigStyles.cardHeader}>
              <FrontendConfigurationIcon />
              <span style={frontendConfigStyles.headerText}>Frontend Configuration</span>
            </div>

            {/* Card Body */}
            <div style={frontendConfigStyles.cardBody}>
              {/* Repository Name Section */}
              <div style={frontendConfigStyles.fieldGroup}>
                <label style={frontendConfigStyles.label}>Repository Name</label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  style={frontendConfigStyles.input}
                  placeholder="my-frontend-app"
                />
              </div>

              {/* GitHub Personal Access Token Section */}
              <div style={frontendConfigStyles.fieldGroup}>
                <label style={frontendConfigStyles.label}>GitHub Personal Access Token</label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  style={frontendConfigStyles.input}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <p style={frontendConfigStyles.helperText}>
                  Token needs repo, write: packages and delete: packages permissions
                </p>
              </div>
              {/* Divider Line */}
              <div style={frontendConfigStyles.divider}></div>

              {/* Deploy Button */}
              <div style={frontendConfigStyles.buttonContainer}>
                <button style={frontendConfigStyles.deployButton}>
                  <DeployFrontendIcon />
                  <span style={frontendConfigStyles.buttonText}>Deploy Frontend</span>
                </button>
              </div>
            </div>
          </div>

          {/* Deployment Information Card */}
          <div style={deploymentInfoStyles.card}>
            <div style={deploymentInfoStyles.header}>
              <DeploymentInformationIcon />
              <span style={deploymentInfoStyles.headerText}>Deployment Information</span>
            </div>
            <div style={deploymentInfoStyles.body}>
              <ul style={deploymentInfoStyles.list}>
                <li style={deploymentInfoStyles.listItem}>
                  <span style={{position: 'absolute', left: '0'}}>•</span>
                  <span style={{paddingLeft: '20px', display: 'block'}}>Your code will be pushed to GitHub Container Registry (ghcr.io)</span>
                </li>
                <li style={deploymentInfoStyles.listItem}>
                  <span style={{position: 'absolute', left: '0'}}>•</span>
                  <span style={{paddingLeft: '20px', display: 'block'}}>Docker images will be built automatically</span>
                </li>
                <li style={deploymentInfoStyles.listItem}>
                  <span style={{position: 'absolute', left: '0'}}>•</span>
                  <span style={{paddingLeft: '20px', display: 'block'}}>Application will be deployed to EC2 instance</span>
                </li>
                <li style={deploymentInfoStyles.listItem}>
                  <span style={{position: 'absolute', left: '0'}}>•</span>
                  <span style={{paddingLeft: '20px', display: 'block'}}>Application will be deployed to EC2 instance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Deployment Logs Card */}
        <div style={deploymentLogsStyles.card}>
          {/* Card Header */}
          <div style={deploymentLogsStyles.cardHeader}>
            <DeploymentLogsIcon />
            <span style={deploymentLogsStyles.headerText}>Deployment Logs</span>
          </div>

          {/* Card Body */}
          <div style={deploymentLogsStyles.cardBody}>
            <p style={deploymentLogsStyles.emptyText}>Deployment logs will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Layout Container Styles
const deploymentLayoutStyles = {
  container: {
    display: 'flex',
    gap: '46px',
    padding: '0 46px',
    marginTop: '50px',
    marginBottom: '60px',
    boxSizing: 'border-box',
    alignItems: 'flex-start',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '23px',
    width: '48%',
    minWidth: '600px',
    maxWidth: '824px',
    flexShrink: 0,
  },
};

// Frontend Configuration Card Styles
const frontendConfigStyles = {
  card: {
    width: '100%',
    height: '563px',
    borderRadius: '12px',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)',
    border: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(4px)',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  cardHeader: {
    height: '87px',
    padding: '18px 44px',
    background: 'radial-gradient(146.53% 593.43% at 100% 0%, rgba(255, 255, 255, 0.13) 0%, rgba(30, 30, 30, 0.5) 100%)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxSizing: 'border-box',
  },
  headerText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '100%',
    color: 'rgba(248, 248, 248, 0.98)',
  },
  cardBody: {
    padding: '40px 44px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '24px',
    lineHeight: '100%',
    color: 'rgba(248, 248, 248, 0.98)',
  },
  input: {
    width: '100%',
    height: '59px',
    borderRadius: '12px',
    padding: '17px 22px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: 'none',
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '100%',
    color: 'rgba(163, 163, 163, 1)',
    outline: 'none',
    boxSizing: 'border-box',
  },
  helperText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '100%',
    color: 'rgba(163, 163, 163, 1)',
    margin: '8px 0 0 0',
  },
  divider: {
    width: '100%',
    height: '0px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    marginTop: '8px',
    marginBottom: '8px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0px',
  },
  deployButton: {
    width: '290px',
    height: '45px',
    borderRadius: '15px',
    padding: '9px 35px',
    background: 'rgba(208, 93, 29, 1)',
    border: '0.5px solid rgba(255, 255, 255, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  buttonText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '20px',
    lineHeight: '100%',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
};

// Deployment Information Card Styles
const deploymentInfoStyles = {
  card: {
    width: '100%',
    height: '338px',
    borderRadius: '12px',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)',
    border: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(4px)',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '32px 44px 24px 44px',
  },
  headerText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '100%',
    color: 'rgba(248, 248, 248, 0.98)',
  },
  body: {
    padding: '0 44px 32px 44px',
  },
  list: {
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  listItem: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '400',
    fontSize: '20px',
    lineHeight: '140%',
    color: 'rgba(248, 248, 248, 0.98)',
    marginBottom: '20px',
    position: 'relative',
  },
};

// Deployment Logs Card Styles
const deploymentLogsStyles = {
  card: {
    width: '48%',
    minWidth: '600px',
    maxWidth: '824px',
    height: '924px',
    borderRadius: '12px',
    background: 'radial-gradient(50% 50% at 50% 50%, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.5) 100%)',
    border: '1px solid',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(4px)',
    flexShrink: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    height: '87px',
    padding: '18px 44px',
    background: 'radial-gradient(146.53% 593.43% at 100% 0%, rgba(255, 255, 255, 0.13) 0%, rgba(30, 30, 30, 0.5) 100%)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxSizing: 'border-box',
  },
  headerText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '100%',
    color: 'rgba(248, 248, 248, 0.98)',
  },
  cardBody: {
    padding: '40px 44px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(924px - 87px)',
    boxSizing: 'border-box',
  },
  emptyText: {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '100%',
    color: 'rgba(163, 163, 163, 1)',
    textAlign: 'center',
    margin: 0,
  },
};

// Styles
const contentStyles = {
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '60px',
  },
  tabButtonsContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '40px',
  },
};

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

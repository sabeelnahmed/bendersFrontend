import React, { useState } from 'react';
import {
  UploadIcon,
  UserPersonaIcon,
  BusinessLogicEditorIcon,
  BrandDesignIcon,
  ApiIcon,
  CodeGenerationIcon,
  PreviewIcon,
  ApiFactoryIcon,
  DeployIcon,
  TestingIcon,
  PerformanceIcon
} from '../icons.jsx';

// Sidebar component
const Sidebar = ({ activeNav, setActiveNav }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { icon: <UploadIcon />, name: 'Requirements', description: 'Define your project requirements and specifications' },
    { icon: <UserPersonaIcon />, name: 'User Persona', description: 'Create detailed user personas for your application' },
    { icon: <BusinessLogicEditorIcon />, name: 'Business Logic Editor', description: 'Design and manage your business logic workflows' },
    { icon: <BrandDesignIcon />, name: 'Brand Design', description: 'Upload and manage your brand design assets' },
    { icon: <ApiIcon />, name: '3rd Party API', description: 'Integrate external APIs and services' },
    { icon: <CodeGenerationIcon />, name: 'Code Generation', description: 'Generate code from your specifications' },
    { icon: <PreviewIcon />, name: 'Preview', description: 'Preview your application in real-time' },
    { icon: <ApiFactoryIcon />, name: 'API Factory', description: 'Create and manage custom APIs' },
    { icon: <DeployIcon />, name: 'Deploy', description: 'Deploy your application to production' },
    { icon: <TestingIcon />, name: 'A/B Testing', description: 'Set up and analyze A/B tests' },
    { icon: <PerformanceIcon />, name: 'Performance Report', description: 'View detailed performance metrics and analytics' },
  ];

  return (
    <>
    
      <style>{`
        .sidebar-link {
          position: relative;
          overflow: hidden;
        }

        .sidebar-link::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 8px;
          padding: 1px;
          background: linear-gradient(135deg, rgba(209, 96, 33, 0.3), rgba(209, 96, 33, 0));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .sidebar-link.active::before {
          opacity: 1;
        }

        .sidebar-link:hover {
          background: linear-gradient(135deg, rgba(209, 96, 33, 0.15), rgba(45, 45, 45, 0.3));
          transform: translateX(2px);
        }

        .sidebar-link.active {
          background: linear-gradient(135deg, rgba(209, 96, 33, 0.25), rgba(209, 96, 33, 0.05));
          box-shadow: 0 0 20px rgba(209, 96, 33, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .sidebar-link .icon-container {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .sidebar-link:hover .icon-container {
          transform: scale(1.1);
        }

        .sidebar-link.active .icon-container {
          filter: drop-shadow(0 0 8px rgba(209, 96, 33, 0.6));
        }

        /* Scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(209, 96, 33, 0.3);
          border-radius: 2px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(209, 96, 33, 0.5);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(209, 96, 33, 0.3) rgba(255, 255, 255, 0.02);
        }

        /* Fixed drawer toggle button - doesn't scroll */
        .drawer-toggle-btn {
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1001;
        }

        .drawer-toggle-btn:hover {
          background: rgba(209, 96, 33, 0.1);
          color: #F97316;
        }

        .drawer-toggle-btn:active {
          transform: translateX(-50%) scale(0.95);
        }

        .drawer-toggle-btn svg {
          transition: transform 0.3s ease;
        }

        .drawer-toggle-btn.open svg {
          transform: rotate(180deg);
        }

        /* Scrollable nav container */
        .sidebar-nav-container {
          margin-top: 10px;
          overflow-y: auto;
          overflow-x: hidden;
          flex: 1;
        }

        .sidebar-nav-container::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }

        .sidebar-nav-container::-webkit-scrollbar-thumb {
          background: rgba(209, 96, 33, 0.3);
          border-radius: 2px;
        }

        .sidebar-nav-container::-webkit-scrollbar-thumb:hover {
          background: rgba(209, 96, 33, 0.5);
        }

        /* Side drawer overlay */
        .drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        /* Side drawer panel */
        .side-drawer {
          position: fixed;
          top: 72px;
          left: -320px;
          bottom: 0;
          width: 320px;
          background: linear-gradient(180deg, rgba(21, 21, 21, 0.98) 0%, rgba(16, 16, 16, 0.98) 100%);
          backdrop-filter: blur(40px) saturate(180%);
          border-right: 1px solid rgba(209, 96, 33, 0.2);
          box-shadow: 4px 0 30px rgba(0, 0, 0, 0.5);
          z-index: 999;
          transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .side-drawer.open {
          left: 103px;
        }

        /* Drawer header */
        .drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(209, 96, 33, 0.2);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          
        }

        .drawer-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #f5f5f7;
          margin: 0;
          letter-spacing: -0.3px;
          font-family: 'Montserrat', sans-serif;
        }

        .drawer-close-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.5);
          font-size: 24px;
          line-height: 1;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .drawer-close-btn:hover {
          background: rgba(209, 96, 33, 0.1);
          color: #F97316;
        }

        .drawer-close-btn:active {
          transform: scale(0.95);
        }

        /* Drawer body */
        .drawer-body {
          padding: 16px 24px 24px;
          overflow-y: auto;
          flex: 1;
        }

        .drawer-body::-webkit-scrollbar {
          width: 6px;
        }

        .drawer-body::-webkit-scrollbar-track {
          background: transparent;
        }

        .drawer-body::-webkit-scrollbar-thumb {
          background: rgba(209, 96, 33, 0.3);
          border-radius: 10px;
        }

        .drawer-body::-webkit-scrollbar-thumb:hover {
          background: rgba(209, 96, 33, 0.5);
        }

        /* Drawer items */
        .drawer-item {
          padding: 14px;
          margin-bottom: 10px;
          background: rgba(255, 255, 255, 0.02);
          border: 0.5px solid rgba(209, 96, 33, 0.15);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .drawer-item:hover {
          background: rgba(209, 96, 33, 0.05);
          border-color: rgba(209, 96, 33, 0.3);
        }

        .drawer-item:last-child {
          margin-bottom: 0;
        }

        .drawer-item h4 {
          font-size: 13px;
          font-weight: 600;
          color: #F97316;
          margin: 0 0 6px 0;
          letter-spacing: -0.2px;
          font-family: 'Montserrat', sans-serif;
        }

        .drawer-item p {
          font-size: 12px;
          font-weight: 400;
          color: rgba(245, 245, 247, 0.7);
          margin: 0;
          line-height: 1.5;
          letter-spacing: -0.1px;
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>

      <aside style={styles.sidebar}>
        {/* Fixed arrow button at the top - doesn't scroll */}
        <button 
          className={`drawer-toggle-btn ${isDrawerOpen ? 'open' : ''}`}
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          title="View component descriptions"
          aria-label="Toggle component descriptions"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Scrollable navigation container */}
        <div className="sidebar-nav-container">
          <nav style={styles.nav}>
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveNav(item.name)}
                className={`sidebar-link ${activeNav === item.name ? 'active' : ''}`}
                style={{
                  ...styles.navLink,
                  ...(activeNav === item.name ? styles.navLinkActive : styles.navLinkInactive)
                }}
              >
                <div className="icon-container" style={styles.navIconContainer}>
                  {item.icon}
                </div>
                <span style={{ marginTop: '4px', fontSize: '12px', textAlign: 'center', lineHeight: '1.2' }}>
                  {item.name}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Drawer overlay backdrop */}
      <div 
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Side drawer panel */}
      <div className={`side-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Component Guide</h3>
          <button 
            className="drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close drawer"
            title="Close"
          >
            ×
          </button>
        </div>
        <div className="drawer-body">
          {navItems.map((item) => (
            <div key={item.name} className="drawer-item">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Styles object
const styles = {
  sidebar: {
    width: '103px',
    background: 'linear-gradient(180deg, rgba(21, 21, 21, 1) 0%, rgba(16, 16, 16, 1) 100%)',
    padding: '28px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRight: '1px solid rgba(209, 96, 33, 0.2)',
    boxSizing: 'border-box',
    flexShrink: 0,
    overflowY: 'hidden',
    overflowX: 'hidden',
    boxShadow: '2px 0 20px rgba(0, 0, 0, 0.5), inset -1px 0 0 rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },

  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  navLink: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 4px',
    height: '62px',
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    fontFamily: "'Montserrat', sans-serif",
    textAlign: 'center',
    fontWeight: '500',
  },

  navIconContainer: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  navLinkActive: {
    color: '#F97316',
    fontWeight: '600',
  },

  navLinkInactive: {
    color: '#9ca3af',
  },
};

export default Sidebar;

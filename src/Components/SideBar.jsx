import React from 'react';
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
  const navItems = [
    { icon: <UploadIcon />, name: 'Requirements' },
    { icon: <UserPersonaIcon />, name: 'User Persona' },
    { icon: <BusinessLogicEditorIcon />, name: 'Business Logic Editor' },
    { icon: <BrandDesignIcon />, name: 'Brand Design' },
    { icon: <ApiIcon />, name: '3rd Party API' },
    { icon: <CodeGenerationIcon />, name: 'Code Generation' },
    { icon: <PreviewIcon />, name: 'Preview' },
    { icon: <ApiFactoryIcon />, name: 'API Factory' },
    { icon: <DeployIcon />, name: 'Deploy' },
    { icon: <TestingIcon />, name: 'A/B Testing' },
    { icon: <PerformanceIcon />, name: 'Performance Report' },
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
      `}</style>
      <aside style={styles.sidebar} className="custom-scrollbar">
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
      </aside>
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
    overflowY: 'auto',
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

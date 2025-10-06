import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodebendersLogo } from '../icons.jsx';
import Sidebar from './SideBar';
import PRD from './PRD';
import UserPersona from './UserPersona';
import BusinessLogicEditor from './BusinessLogicEditor';
import BrandDesign from './BrandDesign';
import ThirdPartyAPI from './ThirdPartyAPI';
import CodeGeneration from './CodeGeneration';
import Preview from './Preview';
import APIFactory from './APIFactory';
import Deploy from './Deploy';
import ABTesting from './ABTesting';
import PerformanceReport from './PerformanceReport';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Brand Design');
  const [user, setUser] = useState(null);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Get current project from localStorage
    const projectData = localStorage.getItem('currentProject');
    if (projectData) {
      try {
        const parsedProject = JSON.parse(projectData);
        setCurrentProject(parsedProject);
      } catch (error) {
        console.error('Error parsing project data:', error);
      }
    }
  }, []);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Render the appropriate component based on activeNav
  const renderMainContent = () => {
    switch (activeNav) {
      case 'Requirements':
        return <PRD onNavigateNext={() => setActiveNav('User Persona')} />;
      case 'User Persona':
        return <UserPersona onNavigateNext={() => setActiveNav('Business Logic Editor')} />;
      case 'Business Logic Editor':
        return <BusinessLogicEditor />;
      case 'Brand Design':
        return <BrandDesign />;
      case '3rd Party API':
        return <ThirdPartyAPI />;
      case 'Code Generation':
        return <CodeGeneration />;
      case 'Preview':
        return <Preview />;
      case 'API Factory':
        return <APIFactory />;
      case 'Deploy':
        return <Deploy />;
      case 'A/B Testing':
        return <ABTesting />;
      case 'Performance Report':
        return <PerformanceReport />;
      default:
        return <BrandDesign />;
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-left">
          {currentProject && (
            <button 
              className="back-btn" 
              onClick={() => navigate('/dashboard')}
              title="Back to Dashboard"
              aria-label="Back to Dashboard"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
          <CodebendersLogo />
          {currentProject && (
            <div className="project-name-container">
              <span className="current-project-name">{currentProject.name}</span>
            </div>
          )}
        </div>
        {user && (
          <div className="profile-section">
            <div className="profile-avatar">
              {getInitials(user.name || user.email)}
            </div>
            <span className="profile-name">{user.name || user.email}</span>
          </div>
        )}
      </header>
      <div className="home-content">
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <main className="home-main">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

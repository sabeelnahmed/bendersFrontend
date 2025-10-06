import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../api/projectService';
import './Dashboard.css';

// Asset imports
const codebendersLogo = "/assets/codebenders-logo.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: ''
  });
  const [creatingProject, setCreatingProject] = useState(false);

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

    // Fetch user projects
    fetchProjects();

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (showProfileDropdown && !event.target.closest('.dashboard-profile-section-top')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await projectService.listProjects();
      setProjects(response.projects || response || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      // Fallback to mock data if API fails
      const mockProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!newProject.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    setCreatingProject(true);
    setError('');

    try {
      const projectData = {
        name: newProject.name.trim(),
        description: newProject.description.trim()
      };

      const createdProject = await projectService.createProject(projectData);
      
      // Add new project to list
      setProjects(prev => [...prev, createdProject]);
      
      // Reset form and close modal
      setNewProject({ name: '', description: '' });
      setShowModal(false);
      
      // Store current project and navigate to home
      localStorage.setItem('currentProject', JSON.stringify(createdProject));
      navigate('/home');
      
    } catch (err) {
      console.error('Error creating project:', err);
      
      // Fallback to mock creation
      const mockProject = {
        id: 'project-' + Date.now(),
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Save to localStorage
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      const updatedProjects = [...existingProjects, mockProject];
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      
      setProjects(updatedProjects);
      setNewProject({ name: '', description: '' });
      setShowModal(false);
      
      // Store current project and navigate to home
      localStorage.setItem('currentProject', JSON.stringify(mockProject));
      navigate('/home');
    } finally {
      setCreatingProject(false);
    }
  };

  const handleProjectClick = (project) => {
    // Store selected project and navigate to home
    localStorage.setItem('currentProject', JSON.stringify(project));
    navigate('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentProject');
    navigate('/login');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard-page">
      {/* Logo Section at top left */}
      <div className="dashboard-logo-section-top">
        <img src={codebendersLogo} alt="Codebenders" className="dashboard-logo-image" />
        <div className="dashboard-logo-text">
          <span className="dashboard-logo-text-span">Codebenders</span>
        </div>
      </div>

      {/* Profile Section at top right */}
      {user && (
        <div className="dashboard-profile-section-top">
          <div 
            className="dashboard-profile-info"
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div className="dashboard-profile-avatar">
              {getInitials(user.name || user.email)}
            </div>
            <span className="dashboard-profile-name">{user.name || user.email}</span>
            <span className="dashboard-profile-chevron">
              {showProfileDropdown ? '▲' : '▼'}
            </span>
          </div>

          {/* Dropdown Menu */}
          {showProfileDropdown && (
            <div className="dashboard-profile-dropdown">
              <button 
                className="dashboard-dropdown-item"
                onClick={() => {
                  setShowProfileDropdown(false);
                  // Navigate to profile page when implemented
                  console.log('Navigate to profile');
                }}
              >
                <span className="dashboard-dropdown-icon">👤</span>
                <span>Profile</span>
              </button>
              <button 
                className="dashboard-dropdown-item"
                onClick={() => {
                  setShowProfileDropdown(false);
                  // Navigate to account page when implemented
                  console.log('Navigate to account');
                }}
              >
                <span className="dashboard-dropdown-icon">⚙️</span>
                <span>Account</span>
              </button>
              <div className="dashboard-dropdown-divider"></div>
              <button 
                className="dashboard-dropdown-item dashboard-dropdown-item-logout"
                onClick={() => {
                  setShowProfileDropdown(false);
                  handleLogout();
                }}
              >
                <span className="dashboard-dropdown-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Container */}
      <div className="dashboard-content-wrapper">
        {/* Page Header */}
        <div className="dashboard-header-section">
          <div className="dashboard-header-text">
            <h1 className="dashboard-page-title">My Projects</h1>
            <p className="dashboard-page-subtitle">Select a project to continue or create a new one</p>
          </div>
          <button className="dashboard-create-project-btn" onClick={() => setShowModal(true)}>
            <span className="dashboard-plus-icon">+</span>
            <span>New Project</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="dashboard-error-banner">
            {error}
          </div>
        )}

        {/* Projects Container */}
        <div className="dashboard-projects-container">
          {loading ? (
            <div className="dashboard-loading-state">
              <div className="dashboard-spinner"></div>
              <p>Loading projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="dashboard-empty-state">
              <div className="dashboard-empty-icon">📁</div>
              <h2>No projects yet</h2>
              <p>Create your first project to get started with enterprise-grade code generation</p>
              <button className="dashboard-create-first-project-btn" onClick={() => setShowModal(true)}>
                <span>Create Project</span>
              </button>
            </div>
          ) : (
            <div className="dashboard-projects-grid">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="dashboard-project-card"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="dashboard-project-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 9h18M9 3v6M15 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="dashboard-project-name">{project.name}</h3>
                  <p className="dashboard-project-description">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="dashboard-project-meta">
                    <span className="dashboard-project-date">
                      Updated {formatDate(project.updated_at || project.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="dashboard-modal-overlay" onClick={() => !creatingProject && setShowModal(false)}>
          <div className="dashboard-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <h2>Create New Project</h2>
              <button 
                className="dashboard-modal-close" 
                onClick={() => setShowModal(false)}
                disabled={creatingProject}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="dashboard-modal-body">
                <div className="dashboard-form-group">
                  <label htmlFor="projectName">Project Name *</label>
                  <input
                    id="projectName"
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name"
                    disabled={creatingProject}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="projectDescription">Description</label>
                  <textarea
                    id="projectDescription"
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter a brief description of your project"
                    rows="4"
                    disabled={creatingProject}
                  />
                </div>
              </div>
              <div className="dashboard-modal-footer">
                <button 
                  type="button" 
                  className="dashboard-btn-cancel" 
                  onClick={() => setShowModal(false)}
                  disabled={creatingProject}
                >
                  <span>Cancel</span>
                </button>
                <button 
                  type="submit" 
                  className="dashboard-btn-create"
                  disabled={creatingProject}
                >
                  <span>{creatingProject ? 'Creating...' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

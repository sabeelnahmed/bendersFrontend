# Project Management Guide

## Overview

The application now includes a Dashboard screen that allows users to manage their projects. After logging in, users are directed to the Dashboard where they can view all their projects, create new ones, and select a project to work on.

## Features

### 1. Dashboard Screen
- **Location**: `/dashboard`
- **Purpose**: Central hub for project management
- **Access**: Automatically shown after successful login

### 2. Project List
- Displays all projects belonging to the logged-in user
- Shows project name, description, and last update date
- Click on any project card to open it in the main application

### 3. Create New Project
- Click the "New Project" button to open a modal
- Fill in:
  - **Project Name** (required)
  - **Description** (optional)
- After creation, automatically navigates to `/home` with the selected project

### 4. Empty State
- If no projects exist, displays a friendly empty state
- Provides a call-to-action to create the first project

## Flow

```
Login → Dashboard → (Select/Create Project) → Home (Project Editor)
```

1. User logs in via `/login`
2. Redirected to `/dashboard`
3. User can:
   - Select an existing project (opens in `/home`)
   - Create a new project (opens in `/home` after creation)
4. The selected project is stored in localStorage as `currentProject`

## API Endpoints

### Project Endpoints

```javascript
// List all projects for current user
GET /api/v1/projects
Query params: page, size, search

// Create a new project
POST /api/v1/projects
Body: { name: string, description?: string }

// Get project by ID
GET /api/v1/projects/{projectId}

// Update project
PATCH /api/v1/projects/{projectId}
Body: { name?: string, description?: string }

// Delete project
DELETE /api/v1/projects/{projectId}

// Get project statistics
GET /api/v1/projects/{projectId}/stats
```

## API Service

The `projectService.js` file provides convenient methods for interacting with the project API:

```javascript
import { projectService } from '../api/projectService';

// List projects
const projects = await projectService.listProjects({ page: 1, size: 50 });

// Create project
const newProject = await projectService.createProject({
  name: 'My Project',
  description: 'Project description'
});

// Get project
const project = await projectService.getProjectById(projectId);

// Update project
const updated = await projectService.updateProject(projectId, {
  name: 'Updated Name'
});

// Delete project
await projectService.deleteProject(projectId);
```

## Local Storage

The application uses localStorage for:

- `token`: Authentication token
- `user`: User information
- `currentProject`: Currently selected project
- `projects`: Fallback storage for projects (when API is unavailable)

## Fallback Mechanism

If the backend API is not available, the application will:
1. Use localStorage to store projects
2. Generate mock project IDs
3. Allow full functionality in offline/development mode

## File Structure

```
src/
├── Components/
│   ├── Dashboard.jsx          # Dashboard component
│   └── Dashboard.css          # Dashboard styles
├── api/
│   ├── authService.js         # Authentication API calls
│   └── projectService.js      # Project API calls (NEW)
└── Context.jsx                # API configuration & endpoints
```

## Styling

The Dashboard uses a modern, responsive design with:
- Gradient background
- Card-based layout for projects
- Modal for creating new projects
- Smooth animations and transitions
- Mobile-responsive grid

## Future Enhancements

Potential improvements:
- Project search and filtering
- Project templates
- Project sharing and collaboration
- Project archiving
- Sorting options (by date, name, etc.)
- Project tags/categories
- Bulk operations (delete multiple projects)


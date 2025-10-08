# 📁 Project ID Flow - Complete Guide

This document explains **exactly** how the `project_id` flows from Dashboard to other components.

---

## 🎯 The Complete Flow

### Step 1: User Actions in Dashboard

There are **two ways** a project gets selected:

#### Option A: User Clicks Existing Project

```javascript
// Dashboard.jsx - Line 271
<div onClick={() => handleProjectClick(project)}>
  <h3>{project.name}</h3>
</div>

// handleProjectClick function - Line 127-131
const handleProjectClick = (project) => {
  // Store the ENTIRE project object in localStorage
  localStorage.setItem('currentProject', JSON.stringify(project));
  navigate('/home');
};
```

**What `project` object looks like:**
```javascript
{
  id: "proj_1",                      // ← This is the project_id!
  name: "E-commerce Platform",
  description: "My awesome project",
  status: "in_progress",
  created_at: "2024-10-01T10:00:00Z",
  updated_at: "2024-10-07T10:00:00Z"
}
```

#### Option B: User Creates New Project

```javascript
// Dashboard.jsx - Line 94-96
const handleCreateProject = async () => {
  // ... after creating project ...
  const createdProject = await projectService.createProject(projectData);
  
  // Store the newly created project in localStorage
  localStorage.setItem('currentProject', JSON.stringify(createdProject));
  navigate('/home');
};
```

**Mock fallback (if API fails) - Line 102-108:**
```javascript
const mockProject = {
  id: 'project-' + Date.now(),    // ← Generates: "project-1696700000000"
  name: newProject.name.trim(),
  description: newProject.description.trim(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

localStorage.setItem('currentProject', JSON.stringify(mockProject));
```

---

### Step 2: Stored in localStorage

After either action above, the **entire project object** is stored:

```javascript
// What's in localStorage:
localStorage.getItem('currentProject')
// Returns: '{"id":"project-123","name":"My App","description":"...",...}'
```

**Key Point:** We store the **entire project object**, not just the ID!

---

### Step 3: Retrieved in Other Components (e.g., PRD.jsx)

```javascript
// PRD.jsx - Line 208-209
const user = JSON.parse(localStorage.getItem('user') || '{}');
const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

// Now we have:
// project = {
//   id: "project-123",
//   name: "My App",
//   description: "...",
//   ...
// }

// Extract just the ID to send to backend
const response = await apiClient.post(API_ENDPOINTS.UPLOAD_PRD, {
  text: combinedText,
  user_id: user.id,           // From user object
  project_id: project.id,     // ← From project object! 
});
```

---

## 🔄 Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        DASHBOARD                             │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴────────────┐
                │                        │
        User Clicks Project      User Creates Project
                │                        │
                ↓                        ↓
    ┌─────────────────────┐  ┌─────────────────────┐
    │ handleProjectClick  │  │ handleCreateProject │
    │                     │  │                     │
    │ Gets project from   │  │ Creates new project │
    │ projects array      │  │ with generated ID   │
    └──────────┬──────────┘  └──────────┬──────────┘
               │                        │
               └───────────┬────────────┘
                          │
                          ↓
        ┌─────────────────────────────────────┐
        │ localStorage.setItem(               │
        │   'currentProject',                 │
        │   JSON.stringify(project)           │
        │ )                                   │
        └──────────────┬──────────────────────┘
                       │
                       ↓
        ┌─────────────────────────────────────┐
        │        localStorage Storage         │
        │                                     │
        │  Key: "currentProject"              │
        │  Value: {                           │
        │    id: "project-123",    ← ID HERE! │
        │    name: "My App",                  │
        │    description: "...",              │
        │    created_at: "...",               │
        │    updated_at: "..."                │
        │  }                                  │
        └──────────────┬──────────────────────┘
                       │
                       │ User navigates to Home → PRD page
                       ↓
        ┌─────────────────────────────────────┐
        │            PRD.jsx                  │
        │                                     │
        │ const project = JSON.parse(         │
        │   localStorage.getItem(             │
        │     'currentProject'                │
        │   ) || '{}'                         │
        │ )                                   │
        │                                     │
        │ // Extracts the ID:                │
        │ project.id → "project-123"          │
        └──────────────┬──────────────────────┘
                       │
                       │ Makes API call
                       ↓
        ┌─────────────────────────────────────┐
        │      POST /api/upload_prd           │
        │                                     │
        │      Body: {                        │
        │        text: "...",                 │
        │        user_id: "user_abc",         │
        │        project_id: "project-123" ✅ │
        │      }                              │
        └─────────────────────────────────────┘
```

---

## 📝 Code Examples

### Example 1: Checking What's Stored

Open browser console on any page and run:

```javascript
// Get the stored project
const project = JSON.parse(localStorage.getItem('currentProject'));
console.log(project);

// Output:
// {
//   id: "project-1696700000000",
//   name: "My E-commerce App",
//   description: "Building an online store",
//   created_at: "2024-10-07T10:00:00.000Z",
//   updated_at: "2024-10-07T10:00:00.000Z"
// }

// Get just the ID
console.log(project.id);
// Output: "project-1696700000000"
```

### Example 2: Using in Any Component

```javascript
import React from 'react';
import { apiClient } from '../Context.jsx';

const MyComponent = () => {
  const handleSubmit = async () => {
    // Step 1: Get project from localStorage
    const project = JSON.parse(
      localStorage.getItem('currentProject') || '{}'
    );
    
    // Step 2: Extract the ID
    const projectId = project.id;
    
    console.log('Current Project ID:', projectId);
    // Output: "Current Project ID: project-1696700000000"
    
    // Step 3: Use in API call
    const response = await apiClient.post('/api/some-endpoint', {
      project_id: projectId,
      // ... other data
    });
  };
  
  return <button onClick={handleSubmit}>Submit</button>;
};
```

### Example 3: Displaying Current Project Info

```javascript
// Home.jsx already does this! - Line 36-45
useEffect(() => {
  const projectData = localStorage.getItem('currentProject');
  if (projectData) {
    try {
      const parsedProject = JSON.parse(projectData);
      setCurrentProject(parsedProject);
      // Now you can display: parsedProject.name, parsedProject.id, etc.
    } catch (error) {
      console.error('Error parsing project data:', error);
    }
  }
}, []);
```

---

## 🗂️ Project Object Structure

### From Backend API
When fetched from the backend, projects look like:

```javascript
{
  id: "proj_1",                      // Backend-generated ID
  name: "E-commerce Platform",
  description: "Online store",
  status: "in_progress",
  created_at: "2024-10-01T10:00:00Z",
  updated_at: "2024-10-07T10:00:00Z"
}
```

### Mock Fallback (Generated Locally)
When API fails, projects are created with:

```javascript
{
  id: "project-1696700000000",       // Timestamp-based ID
  name: "User Input Name",
  description: "User Input Description",
  created_at: "2024-10-07T10:00:00.000Z",
  updated_at: "2024-10-07T10:00:00.000Z"
}
```

**Both formats work the same way!** The `id` field is always accessible via `project.id`.

---

## 🎓 Key Takeaways

1. **Entire project object is stored**, not just the ID
   ```javascript
   localStorage.setItem('currentProject', JSON.stringify(project));
   ```

2. **Retrieved as an object**, then we extract the ID
   ```javascript
   const project = JSON.parse(localStorage.getItem('currentProject') || '{}');
   const projectId = project.id;  // ← Extract the ID
   ```

3. **Persists across page navigation**
   - Set in Dashboard
   - Available in Home, PRD, BrandDesign, etc.
   - Cleared only on logout

4. **The `project` object contains:**
   - ✅ `id` - The project identifier
   - ✅ `name` - Display name
   - ✅ `description` - Project description
   - ✅ `created_at`, `updated_at` - Timestamps
   - ✅ Other metadata as needed

---

## 🔍 Debugging Tips

### Check if a project is selected:

```javascript
const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

if (!project.id) {
  console.error('No project selected!');
  // Redirect to dashboard or show error
} else {
  console.log('Working with project:', project.id);
  // Proceed with API call
}
```

### Clear project selection:

```javascript
// Done automatically on logout (Dashboard.jsx - Line 136)
localStorage.removeItem('currentProject');
```

### View in browser DevTools:

1. Open Chrome DevTools (F12)
2. Go to "Application" tab
3. Navigate to "Local Storage" → Your domain
4. Look for key: `currentProject`
5. See the full JSON value stored

---

## 💡 Why Store the Entire Object?

**Benefits:**
- ✅ Can display project name in header (`Home.jsx` does this)
- ✅ Can show project description
- ✅ Don't need extra API calls to get project details
- ✅ Easy to access any project field when needed

**Alternatives we could use (but don't):**
- ❌ Store only the ID: `localStorage.setItem('projectId', project.id)`
  - Would need API calls to get name/description
  - Less efficient
  
- ❌ Pass via route params: `/home?projectId=123`
  - Lost on page refresh
  - More complex state management

**Our approach is the best for this use case!** 🎯

---

## 🚀 Summary

```
Dashboard → Select/Create Project → Store Entire Object → Extract ID When Needed
    ↓              ↓                        ↓                      ↓
  User         Project Object         localStorage            API Call
  Action         {id, name,...}      'currentProject'      project_id: id
```

The `project_id` comes from `project.id` where `project` is the object stored in localStorage after selecting or creating a project in the Dashboard! 🎉



# Dashboard API Signatures with Mock Data

Complete API specifications with JSON mock data for Dashboard page endpoints.

---

## 1. List Projects

### Request

```http
GET /api/v1/projects?page=1&size=50&search= HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Success Response (200 OK)

**With Multiple Projects:**
```json
{
  "projects": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "E-commerce Platform",
      "description": "B2B e-commerce solution with advanced inventory management and real-time analytics",
      "created_at": "2025-10-01T09:15:30.000Z",
      "updated_at": "2025-10-05T14:22:15.000Z"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Customer Portal",
      "description": "Self-service portal for customer account management",
      "created_at": "2025-09-28T11:30:00.000Z",
      "updated_at": "2025-10-04T16:45:22.000Z"
    },
    {
      "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "name": "Internal Dashboard",
      "description": "Analytics dashboard for business intelligence and reporting",
      "created_at": "2025-09-25T08:00:00.000Z",
      "updated_at": "2025-10-03T10:15:30.000Z"
    },
    {
      "id": "d4e5f6a7-b8c9-0123-def1-234567890123",
      "name": "Mobile App Backend",
      "description": "RESTful API backend for iOS and Android applications",
      "created_at": "2025-09-20T14:20:00.000Z",
      "updated_at": "2025-10-02T09:30:45.000Z"
    },
    {
      "id": "e5f6a7b8-c9d0-1234-ef12-345678901234",
      "name": "Payment Gateway Integration",
      "description": "Secure payment processing system with multiple payment providers",
      "created_at": "2025-09-15T10:45:00.000Z",
      "updated_at": "2025-10-01T13:20:10.000Z"
    },
    {
      "id": "f6a7b8c9-d0e1-2345-f123-456789012345",
      "name": "Inventory Management System",
      "description": null,
      "created_at": "2025-09-10T16:30:00.000Z",
      "updated_at": "2025-09-30T11:55:22.000Z"
    }
  ],
  "total": 6,
  "page": 1,
  "size": 50,
  "pages": 1
}
```

**Empty State (No Projects):**
```json
{
  "projects": [],
  "total": 0,
  "page": 1,
  "size": 50,
  "pages": 0
}
```

**With Pagination:**
```json
{
  "projects": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Project 1",
      "description": "First project",
      "created_at": "2025-10-01T09:15:30.000Z",
      "updated_at": "2025-10-05T14:22:15.000Z"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Project 2",
      "description": "Second project",
      "created_at": "2025-09-28T11:30:00.000Z",
      "updated_at": "2025-10-04T16:45:22.000Z"
    }
  ],
  "total": 25,
  "page": 1,
  "size": 2,
  "pages": 13
}
```

### Error Responses

**401 Unauthorized - Missing or Invalid Token:**
```json
{
  "detail": "Not authenticated",
  "status_code": 401
}
```

**401 Unauthorized - Token Expired:**
```json
{
  "detail": "Token has expired",
  "status_code": 401
}
```

**403 Forbidden:**
```json
{
  "detail": "You don't have permission to access this resource",
  "status_code": 403
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error",
  "status_code": 500,
  "error": "Database connection failed"
}
```

---

## 2. Create Project

### Request

```http
POST /api/v1/projects HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "AI Chatbot Platform",
  "description": "Enterprise chatbot solution with NLP and machine learning capabilities"
}
```

**Request Body Examples:**

**Full Details:**
```json
{
  "name": "AI Chatbot Platform",
  "description": "Enterprise chatbot solution with NLP and machine learning capabilities"
}
```

**Minimal (Name Only):**
```json
{
  "name": "Quick Project"
}
```

**With Empty Description:**
```json
{
  "name": "Marketing Website",
  "description": ""
}
```

**With Null Description:**
```json
{
  "name": "Marketing Website",
  "description": null
}
```

### Success Response (201 Created)

```json
{
  "id": "g7h8i9j0-k1l2-3456-m789-012345678901",
  "name": "AI Chatbot Platform",
  "description": "Enterprise chatbot solution with NLP and machine learning capabilities",
  "created_at": "2025-10-05T15:45:30.123Z",
  "updated_at": "2025-10-05T15:45:30.123Z"
}
```

**Created with Minimal Data:**
```json
{
  "id": "h8i9j0k1-l2m3-4567-n890-123456789012",
  "name": "Quick Project",
  "description": null,
  "created_at": "2025-10-05T16:00:00.000Z",
  "updated_at": "2025-10-05T16:00:00.000Z"
}
```

### Error Responses

**400 Bad Request - Missing Required Field:**
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ],
  "status_code": 400
}
```

**400 Bad Request - Name Too Long:**
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "ensure this value has at most 255 characters",
      "type": "value_error.any_str.max_length",
      "ctx": {
        "limit_value": 255
      }
    }
  ],
  "status_code": 400
}
```

**400 Bad Request - Description Too Long:**
```json
{
  "detail": [
    {
      "loc": ["body", "description"],
      "msg": "ensure this value has at most 1000 characters",
      "type": "value_error.any_str.max_length",
      "ctx": {
        "limit_value": 1000
      }
    }
  ],
  "status_code": 400
}
```

**400 Bad Request - Invalid Data Type:**
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "str type expected",
      "type": "type_error.str"
    }
  ],
  "status_code": 400
}
```

**400 Bad Request - Empty Name:**
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "Project name cannot be empty",
      "type": "value_error"
    }
  ],
  "status_code": 400
}
```

**401 Unauthorized:**
```json
{
  "detail": "Not authenticated",
  "status_code": 401
}
```

**409 Conflict - Duplicate Project Name:**
```json
{
  "detail": "A project with this name already exists",
  "status_code": 409
}
```

**422 Unprocessable Entity - Validation Error:**
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "Project name can only contain alphanumeric characters, spaces, and hyphens",
      "type": "value_error.str.regex"
    }
  ],
  "status_code": 422
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Failed to create project",
  "status_code": 500,
  "error": "Database write operation failed"
}
```

---

## Data Type Specifications

### Project Object Schema

```typescript
interface Project {
  id: string;              // UUID v4 format
  name: string;            // Required, 1-255 characters
  description: string | null;  // Optional, 0-1000 characters
  created_at: string;      // ISO 8601 datetime with timezone
  updated_at: string;      // ISO 8601 datetime with timezone
}
```

### List Projects Response Schema

```typescript
interface ProjectListResponse {
  projects: Project[];     // Array of project objects
  total: number;          // Total number of projects
  page: number;           // Current page number (1-indexed)
  size: number;           // Items per page
  pages: number;          // Total number of pages
}
```

### Error Response Schema

```typescript
interface ErrorResponse {
  detail: string | ValidationError[];
  status_code: number;
  error?: string;         // Optional additional error info
}

interface ValidationError {
  loc: string[];          // Location of the error (e.g., ["body", "name"])
  msg: string;           // Error message
  type: string;          // Error type identifier
  ctx?: object;          // Optional context information
}
```

---

## Usage in Dashboard.jsx

### Frontend Flow

1. **Page Load:**
```javascript
// Calls GET /api/v1/projects
const response = await projectService.listProjects();
// response.data = { projects: [...], total: 6, page: 1, size: 50, pages: 1 }
```

2. **Create Project:**
```javascript
// User fills modal form and submits
const projectData = {
  name: "New Project",
  description: "Project description"
};
const createdProject = await projectService.createProject(projectData);
// createdProject = { id: "...", name: "New Project", ... }

// Store in localStorage
localStorage.setItem('currentProject', JSON.stringify(createdProject));

// Navigate to /home
navigate('/home');
```

---

## Testing Commands

### List Projects
```bash
curl -X GET "http://localhost:8000/api/v1/projects" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### List Projects with Pagination
```bash
curl -X GET "http://localhost:8000/api/v1/projects?page=1&size=10" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Create Project (Full)
```bash
curl -X POST "http://localhost:8000/api/v1/projects" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AI Chatbot Platform",
    "description": "Enterprise chatbot solution with NLP"
  }'
```

### Create Project (Name Only)
```bash
curl -X POST "http://localhost:8000/api/v1/projects" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Quick Project"
  }'
```

---

## Postman Collection

Import this JSON into Postman for quick testing:

```json
{
  "info": {
    "name": "Dashboard APIs",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "List Projects",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/v1/projects?page=1&size=50",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "projects"],
          "query": [
            {"key": "page", "value": "1"},
            {"key": "size", "value": "50"}
          ]
        }
      }
    },
    {
      "name": "Create Project",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Test Project\",\n  \"description\": \"Test Description\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/projects",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "projects"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8000"
    },
    {
      "key": "token",
      "value": "YOUR_TOKEN_HERE"
    }
  ]
}
```

---

## Notes for Backend Team

1. **Authentication**: All endpoints require valid JWT token in Authorization header
2. **Timestamps**: Use ISO 8601 format with timezone (e.g., `2025-10-05T15:45:30.123Z`)
3. **UUIDs**: Use UUID v4 format for project IDs
4. **Null vs Empty**: Frontend treats both `null` and empty string `""` as no description
5. **Case Sensitivity**: Project names should be case-insensitive for duplicate checking
6. **User Isolation**: Users should only see/access their own projects
7. **Sorting**: Projects should be sorted by `updated_at` DESC by default
8. **Validation**: Trim whitespace from name and description before saving
9. **Rate Limiting**: Implement rate limiting to prevent abuse
10. **CORS**: Configure CORS to allow frontend origin

---

## Status Codes Summary

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST request (project created) |
| 400 | Bad Request | Invalid input/validation error |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | User doesn't have permission |
| 409 | Conflict | Duplicate project name |
| 422 | Unprocessable Entity | Validation failed |
| 500 | Internal Server Error | Server-side error |


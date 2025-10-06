# Dashboard API Documentation

This document outlines the API endpoints required for the Dashboard page functionality.

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All requests must include a Bearer token in the Authorization header:
```
Authorization: Bearer {access_token}
```

---

## Endpoints Used in Dashboard

### 1. List Projects

**Endpoint:** `GET /projects`

**Description:** Retrieves all projects belonging to the authenticated user.

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 1 | Page number for pagination |
| size | integer | No | 50 | Number of items per page |
| search | string | No | - | Search query to filter projects by name |

**Example Request:**
```bash
GET /api/v1/projects?page=1&size=50
```

**Success Response:** `200 OK`
```json
{
  "projects": [
    {
      "id": "uuid-string",
      "name": "My Project",
      "description": "Project description",
      "created_at": "2025-10-05T12:00:00Z",
      "updated_at": "2025-10-05T14:30:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "size": 50
}
```

**Error Responses:**

`401 Unauthorized`
```json
{
  "detail": "Not authenticated"
}
```

`500 Internal Server Error`
```json
{
  "detail": "Internal server error"
}
```

---

### 2. Create Project

**Endpoint:** `POST /projects`

**Description:** Creates a new project for the authenticated user.

**Headers:**
```json
{
  "Authorization": "Bearer {access_token}",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "My New Project",
  "description": "Optional project description"
}
```

**Field Validation:**
| Field | Type | Required | Max Length | Description |
|-------|------|----------|------------|-------------|
| name | string | Yes | 255 | Project name (must be unique per user) |
| description | string | No | 1000 | Project description |

**Example Request:**
```bash
POST /api/v1/projects
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "name": "E-commerce Platform",
  "description": "B2B e-commerce solution with inventory management"
}
```

**Success Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "E-commerce Platform",
  "description": "B2B e-commerce solution with inventory management",
  "created_at": "2025-10-05T15:00:00Z",
  "updated_at": "2025-10-05T15:00:00Z"
}
```

**Error Responses:**

`400 Bad Request` - Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

`401 Unauthorized`
```json
{
  "detail": "Not authenticated"
}
```

`409 Conflict` - Duplicate Project Name
```json
{
  "detail": "Project with this name already exists"
}
```

`500 Internal Server Error`
```json
{
  "detail": "Internal server error"
}
```

---

## Data Models

### Project Object

```typescript
{
  id: string;              // UUID v4
  name: string;            // 1-255 characters
  description?: string;    // 0-1000 characters, optional
  created_at: string;      // ISO 8601 datetime
  updated_at: string;      // ISO 8601 datetime
}
```

---

## Frontend Implementation Notes

### Dashboard.jsx Usage

1. **On Page Load:**
   - Calls `GET /projects` to fetch all user projects
   - Displays projects in a grid layout
   - Shows empty state if no projects exist

2. **Create New Project:**
   - User clicks "New Project" button
   - Modal opens with form (name + description)
   - On submit, calls `POST /projects`
   - On success, redirects to `/home` with selected project
   - Project data stored in `localStorage` as `currentProject`

### Fallback Behavior

If API calls fail (network error, server down), the frontend will:
- Use `localStorage` to store and retrieve projects
- Continue functioning in offline mode
- Display cached data to the user

---

## Testing with cURL

### List Projects
```bash
curl -X GET "http://localhost:8000/api/v1/projects" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Create Project
```bash
curl -X POST "http://localhost:8000/api/v1/projects" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "This is a test project"
  }'
```

---

## Security Requirements

1. **Authentication:** All endpoints require valid JWT token
2. **Authorization:** Users can only access their own projects
3. **Rate Limiting:** Consider implementing rate limits (e.g., 100 requests/minute)
4. **Input Validation:** Sanitize all input fields to prevent XSS/SQL injection
5. **HTTPS:** Use HTTPS in production environment

---

## Questions?

Contact the frontend team for any clarifications or additional requirements.


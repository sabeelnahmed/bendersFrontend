# API Integration Documentation

## Overview

This project integrates with a FastAPI backend for authentication and user management. All API calls are centralized through `Context.jsx` and `authService.js`.

---

## Configuration

### Base URL Setup

**File:** `src/Context.jsx`

```javascript
const API_CONFIG = {
  baseURL: 'http://localhost:8000', // Change this to your backend URL
  timeout: 10000, // 10 seconds
};
```

**Update this URL** before deploying or connecting to a different backend.

---

## Authentication Flow

### 1. **Register (Sign Up)**

**Endpoint:** `POST /api/v1/auth/register`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "user@example.com",        // Required
  "password": "securepass123",        // Required (min 8 chars)
  "full_name": "John Doe",            // Optional
  "username": "johndoe",              // Optional (3-50 chars)
  "phone_number": "+1234567890"       // Optional
}
```

**Success Response (201):**
```json
{
  "id": 123,
  "email": "user@example.com",
  "is_active": true,
  "is_superuser": false,
  "is_verified": false,
  "username": "johndoe",
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00",
  "last_login": null,
  "oauth_provider": null
}
```

**Error Responses:**
- `400` - User already exists: `{ "detail": "REGISTER_USER_ALREADY_EXISTS" }`
- `400` - Invalid password: `{ "detail": { "code": "REGISTER_INVALID_PASSWORD", "reason": "..." } }`

---

### 2. **Login**

**Endpoint:** `POST /api/v1/auth/login`

**Content-Type:** `application/x-www-form-urlencoded`

**Request Body:**
```
username=user@example.com&password=securepass123
```

**Success Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": 123,
    "email": "user@example.com",
    "is_active": true,
    "is_verified": false,
    "full_name": "John Doe",
    // ... other user fields
  }
}
```

**Storage:**
- Token stored in: `localStorage.getItem('token')`
- User data stored in: `localStorage.getItem('user')`

---

### 3. **Logout**

**Endpoint:** `POST /api/v1/auth/logout`

**Authorization:** Bearer token required

**Success Response (200):** Empty object

---

## Current User Operations

### Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Authorization:** Bearer token required

**Response:** UserMe object with sensitive data

---

### Update Current User

**Endpoint:** `PATCH /api/v1/auth/me`

**Authorization:** Bearer token required

**Request Body:** UserUpdate schema (all fields optional)

---

### Delete Current User

**Endpoint:** `DELETE /api/v1/auth/me`

**Authorization:** Bearer token required

---

### Change Password

**Endpoint:** `POST /api/v1/auth/me/change-password`

**Authorization:** Bearer token required

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"  // Min 8 chars
}
```

---

## Password Recovery

### 1. Request Password Reset

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (202):** Accepted

---

### 2. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

**Error Codes:**
- `RESET_PASSWORD_BAD_TOKEN` - Bad or expired token
- `RESET_PASSWORD_INVALID_PASSWORD` - Password validation failed

---

## Email Verification

### 1. Request Verification Token

**Endpoint:** `POST /api/v1/auth/request-verify-token`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

---

### 2. Verify Email

**Endpoint:** `POST /api/v1/auth/verify`

**Request Body:**
```json
{
  "token": "verification-token-from-email"
}
```

**Error Codes:**
- `VERIFY_USER_BAD_TOKEN` - Bad token
- `VERIFY_USER_ALREADY_VERIFIED` - Already verified

---

## Admin Operations

**Note:** All admin operations require superuser privileges.

### List Users

**Endpoint:** `GET /api/v1/auth/users`

**Query Parameters:**
- `page` (int, default: 1)
- `size` (int, 1-100, default: 10)
- `search` (string, optional)
- `is_active` (boolean, optional)
- `is_verified` (boolean, optional)

**Response:**
```json
{
  "users": [...],
  "total": 100,
  "page": 1,
  "size": 10,
  "pages": 10
}
```

---

### Get User by ID

**Endpoint:** `GET /api/v1/auth/users/{user_id}`

---

### Update User

**Endpoint:** `PATCH /api/v1/auth/users/{user_id}`

---

### Delete User

**Endpoint:** `DELETE /api/v1/auth/users/{user_id}`

---

### Verify User (Admin)

**Endpoint:** `POST /api/v1/auth/users/{user_id}/verify`

---

### Ban User

**Endpoint:** `POST /api/v1/auth/users/{user_id}/ban`

---

### Unban User

**Endpoint:** `POST /api/v1/auth/users/{user_id}/unban`

---

## Using the API in Your Components

### Option 1: Using authService (Recommended)

```javascript
import authService from '../api/authService';

// Register
try {
  const user = await authService.register({
    email: 'user@example.com',
    password: 'password123',
    full_name: 'John Doe'
  });
  console.log('User created:', user);
} catch (error) {
  console.error('Registration failed:', error);
}

// Login
try {
  const { access_token, user } = await authService.login(
    'user@example.com',
    'password123'
  );
  localStorage.setItem('token', access_token);
  localStorage.setItem('user', JSON.stringify(user));
} catch (error) {
  console.error('Login failed:', error);
}

// Get current user
try {
  const user = await authService.getCurrentUser();
  console.log('Current user:', user);
} catch (error) {
  console.error('Failed to get user:', error);
}
```

---

### Option 2: Using apiClient Directly

```javascript
import { apiClient, API_ENDPOINTS } from '../Context';

// Make a request
try {
  const response = await apiClient.get(API_ENDPOINTS.ME);
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "detail": "Error message or error code"
}
```

### Validation Error (422)

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "Invalid email format",
      "type": "value_error"
    }
  ]
}
```

### Common Error Handling Pattern

```javascript
try {
  const response = await authService.someMethod();
  // Handle success
} catch (err) {
  let errorMessage = 'Operation failed';
  
  if (err.response?.data?.detail) {
    const detail = err.response.data.detail;
    
    if (typeof detail === 'string') {
      errorMessage = detail;
    } else if (typeof detail === 'object' && detail.reason) {
      errorMessage = detail.reason;
    } else if (Array.isArray(detail)) {
      // Validation errors
      errorMessage = detail.map(e => e.msg).join(', ');
    }
  }
  
  setError(errorMessage);
}
```

---

## Authorization

### Setting Up Authorization

The `apiClient` automatically adds the Bearer token to requests if available:

```javascript
// Token is automatically read from localStorage and added as:
// Authorization: Bearer <token>
```

### Manual Token Management

```javascript
// Store token after login
localStorage.setItem('token', access_token);

// Remove token on logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

---

## Health Checks

### App Health

**Endpoint:** `GET /api/v1/health`

### Auth Service Health

**Endpoint:** `GET /api/v1/auth/health`

---

## Data Schemas

### UserCreate
- `email` (string, required)
- `password` (string, min 8 chars, required)
- `username` (string, 3-50 chars, optional)
- `full_name` (string, max 255 chars, optional)
- `phone_number` (string, max 20 chars, optional)

### UserUpdate
All fields optional

### UserRead
- `id` (integer)
- `email` (string)
- `is_active` (boolean)
- `is_superuser` (boolean)
- `is_verified` (boolean)
- `username` (string | null)
- `full_name` (string | null)
- `phone_number` (string | null)
- `created_at` (datetime)
- `updated_at` (datetime)
- `last_login` (datetime | null)
- `oauth_provider` (string | null)

---

## Security Notes

1. **CORS**: Ensure backend allows your frontend origin
2. **HTTPS**: Use HTTPS in production
3. **Token Storage**: Tokens are stored in localStorage (consider security implications)
4. **Token Expiration**: Implement token refresh if backend supports it
5. **Logout**: Always clear localStorage on logout

---

## Troubleshooting

### CORS Errors
- Verify backend CORS configuration
- Check if backend is running
- Ensure correct URL in `Context.jsx`

### 401 Unauthorized
- Token might be expired
- User might need to re-login
- Check if endpoint requires authentication

### 422 Validation Error
- Check request body format
- Verify required fields are present
- Validate data types match schema

---

## Complete Endpoint Reference

See `src/Context.jsx` for all available endpoints and `src/api/authService.js` for all available methods.


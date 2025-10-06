# API Integration Setup

## Context.jsx Configuration

The `Context.jsx` file contains the centralized API configuration for the entire application.

### Current Configuration

```javascript
const API_CONFIG = {
  baseURL: 'http://localhost:8000', // Change this to your backend IP and port
  timeout: 10000, // 10 seconds timeout
};
```

### Updating the API Base URL

**Option 1: Directly edit Context.jsx**
Change the `baseURL` in the `API_CONFIG` object:
```javascript
baseURL: 'http://your-backend-ip:port'
```

**Option 2: Programmatically (if needed at runtime)**
```javascript
import { updateApiBaseUrl } from './Context';
updateApiBaseUrl('http://new-backend-ip:port');
```

## Using the API in Other Components

### Import the necessary items:
```javascript
import { apiClient, API_ENDPOINTS } from '../Context';
```

### Making API Calls:

**POST Request Example:**
```javascript
const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
  email: 'user@example.com',
  password: 'password123'
});
```

**GET Request Example:**
```javascript
const response = await apiClient.get('/api/users');
```

**PUT/PATCH Request Example:**
```javascript
const response = await apiClient.put('/api/user/123', {
  name: 'New Name'
});
```

**DELETE Request Example:**
```javascript
const response = await apiClient.delete('/api/user/123');
```

## Available Endpoints

Current endpoints defined in `Context.jsx`:
- `API_ENDPOINTS.LOGIN` → `/api/login`
- `API_ENDPOINTS.SIGNUP` → `/api/signup`

### Adding New Endpoints

Edit the `API_ENDPOINTS` object in `Context.jsx`:
```javascript
export const API_ENDPOINTS = {
  LOGIN: '/api/login',
  SIGNUP: '/api/signup',
  PROFILE: '/api/profile',        // Add new endpoints here
  DASHBOARD: '/api/dashboard',
  // ... more endpoints
};
```

## Features

### 1. **Automatic Token Management**
The axios instance automatically:
- Adds the auth token to requests from localStorage
- Handles token-based authentication

### 2. **Global Error Handling**
- Network errors are logged automatically
- Server errors are caught and logged
- Error responses are returned to the caller for custom handling

### 3. **Request/Response Interceptors**
- Request interceptor: Adds authentication headers
- Response interceptor: Handles common error scenarios

## API Response Handling

### Login/Signup Expected Response Format:
```javascript
{
  token: "jwt-token-string",
  user: {
    id: 1,
    name: "User Name",
    email: "user@example.com"
  }
}
```

The token and user data are automatically stored in localStorage.

## Error Handling in Components

```javascript
try {
  const response = await apiClient.post(API_ENDPOINTS.LOGIN, data);
  // Handle success
} catch (err) {
  const errorMessage = err.response?.data?.message || 'Default error message';
  setError(errorMessage);
}
```

## Backend Requirements

Your backend should:
1. Accept POST requests at `/api/login` and `/api/signup`
2. Return a JSON response with `token` and `user` fields
3. Accept JSON Content-Type headers
4. Handle CORS if frontend and backend are on different domains

### Example Backend Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Login successful"
}
```

### Example Backend Error Response:
```json
{
  "message": "Invalid credentials",
  "error": "AUTHENTICATION_FAILED"
}
```

## Testing the API Connection

You can test the API by:
1. Running your backend server
2. Starting the frontend with `npm run dev`
3. Attempting to login/signup
4. Checking browser console for API logs

## Common Issues

### CORS Errors
If you see CORS errors, ensure your backend allows requests from your frontend origin:
```javascript
// Backend example (Express.js)
app.use(cors({
  origin: 'http://localhost:5173', // Your Vite dev server
  credentials: true
}));
```

### Network Errors
- Verify the backend is running
- Check the IP address and port in Context.jsx
- Ensure no firewall is blocking the connection


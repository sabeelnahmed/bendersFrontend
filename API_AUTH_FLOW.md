# API Authentication & Data Flow

This document explains how authentication tokens, user IDs, and project IDs are handled in the CodeBenders application.

## 🔐 Authentication Flow

### 1. Login Process

When a user logs in via `Login.jsx`:

```javascript
// User submits email and password
const response = await apiClient.post(API_ENDPOINTS.LOGIN, formBody);

// Backend returns:
{
  "access_token": "mock_jwt_z3G3V2cJ9C9tivmW0iII1JUJaobS5BFCSJtYYGPgGlI",
  "token_type": "bearer",
  "user": {
    "id": "user_ebc8f5fc5a18d0fa",
    "email": "user@example.com",
    "name": "User",
    "is_verified": true,
    "created_at": "2025-10-07T13:27:41.412187"
  }
}

// Data is stored in localStorage:
localStorage.setItem('token', response.data.access_token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### 2. Token Injection (Automatic)

**Important:** The token is **automatically** added to ALL API requests via the axios interceptor in `Context.jsx`:

```javascript
// Context.jsx - Request Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**You don't need to manually add the token to requests!** It's sent as a header:
```
Authorization: Bearer mock_jwt_z3G3V2cJ9C9tivmW0iII1JUJaobS5BFCSJtYYGPgGlI
```

---

## 📤 Sending User & Project Data in API Calls

### Frontend Implementation (PRD.jsx)

When making API calls, you can include `user_id` and `project_id` in the **request payload**:

```javascript
// Get user_id and project_id from localStorage
const user = JSON.parse(localStorage.getItem('user') || '{}');
const project = JSON.parse(localStorage.getItem('currentProject') || '{}');

// Send in API request
const response = await apiClient.post(API_ENDPOINTS.UPLOAD_PRD, {
  text: combinedText,
  source: 'textarea',
  user_id: user.id,        // ✅ Sent in body
  project_id: project.id,  // ✅ Sent in body
  // Note: token is sent automatically in Authorization header
});
```

### Backend Implementation (mock_backend.py)

The backend receives three pieces of authentication/context data:

```python
@app.post("/api/upload_prd")
async def upload_prd(
    request: PRDUploadRequest,
    authorization: Optional[str] = Header(None)  # Token from header
):
    # 1. Extract token from Authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    # 2. Get user_id from request body
    user_id = request.user_id
    
    # 3. Get project_id from request body
    project_id = request.project_id
    
    # Now you have all three pieces of data!
    print(f"Token: {token}")
    print(f"User ID: {user_id}")
    print(f"Project ID: {project_id}")
```

---

## 📊 Complete Data Flow Diagram

```
┌─────────────┐
│   Login     │
│  (Login.jsx)│
└──────┬──────┘
       │
       │ POST /api/v1/auth/login
       │ { username, password }
       ↓
┌─────────────┐
│   Backend   │
│ (FastAPI)   │
└──────┬──────┘
       │
       │ Returns: { access_token, user: {...} }
       ↓
┌─────────────────────────────┐
│   localStorage              │
│   • token                   │
│   • user (id, email, name)  │
└─────────────────────────────┘
       │
       ↓
┌─────────────┐
│  Dashboard  │
│ Select/     │
│ Create      │
│ Project     │
└──────┬──────┘
       │
       │ Stores project in localStorage
       ↓
┌─────────────────────────────┐
│   localStorage              │
│   • token                   │
│   • user                    │
│   • currentProject ✅       │
└─────────────────────────────┘
       │
       ↓
┌─────────────┐
│  PRD.jsx    │
│  Submit     │
│  PRD        │
└──────┬──────┘
       │
       │ POST /api/upload_prd
       │ Headers: { Authorization: "Bearer <token>" } ← Automatic
       │ Body: {
       │   text: "...",
       │   user_id: "user_abc123",
       │   project_id: "project_xyz789"
       │ }
       ↓
┌─────────────┐
│   Backend   │
│  Receives:  │
│  • Token    │ ← From Authorization header
│  • User ID  │ ← From request body
│  • Project  │ ← From request body
│    ID       │
└─────────────┘
```

---

## 🎯 Key Points

### What's Automatic
- ✅ **Token is automatically sent** in the `Authorization` header
- ✅ No need to manually add token to requests
- ✅ Works for ALL API calls using `apiClient`

### What You Need to Include Manually
- 📝 **user_id** - Include in request body when needed
- 📁 **project_id** - Include in request body when needed
- 📄 Any other business data

### How to Access in Backend
- 🔑 **Token**: Extract from `Authorization` header
- 👤 **User ID**: From request body (`request.user_id`)
- 📁 **Project ID**: From request body (`request.project_id`)

---

## 💡 Usage Example

### Any Component Making API Calls

```javascript
import { apiClient, API_ENDPOINTS } from '../Context.jsx';

const MyComponent = () => {
  const handleApiCall = async () => {
    // Get stored data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const project = JSON.parse(localStorage.getItem('currentProject') || '{}');
    
    try {
      const response = await apiClient.post(API_ENDPOINTS.YOUR_ENDPOINT, {
        // Your data
        someData: 'value',
        
        // Include user_id and project_id
        user_id: user.id,
        project_id: project.id,
        
        // Token is automatically sent in headers! 🎉
      });
      
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return <button onClick={handleApiCall}>Make API Call</button>;
};
```

---

## 🧪 Testing

When you run the mock backend (`python mock_backend.py`), you'll see logs showing all three pieces of data:

```
📥 PRD Upload Request:
   🔑 Token: mock_jwt_z3G3V2cJ9C...
   👤 User ID: user_ebc8f5fc5a18d0fa
   📁 Project ID: project-1234567890
   📄 Source: textarea
   📝 Text Length: 150 characters
```

---

## 🔒 Security Notes

### For Production:
1. **Token Validation**: In production, validate the JWT token on the backend
2. **Token Expiration**: Implement token expiry and refresh logic
3. **HTTPS Only**: Always use HTTPS in production
4. **Verify Ownership**: Verify that the user_id from the token matches the user_id in the request
5. **Project Access**: Verify that the user has access to the specified project_id

### Current Mock Implementation:
- ⚠️ Mock backend accepts any token (for development)
- ⚠️ No token validation is performed
- ⚠️ This is for testing purposes only

---

## 📝 Summary

| Data | Where It Comes From | How It's Sent | How to Access (Backend) |
|------|-------------------|---------------|------------------------|
| **Token** | Login response → localStorage | Auto (Authorization header) | `authorization` header param |
| **User ID** | Login response → localStorage | Manually in request body | `request.user_id` |
| **Project ID** | Dashboard → localStorage | Manually in request body | `request.project_id` |

**Remember:** The token is already being sent automatically! You only need to add user_id and project_id to your request bodies when needed. 🚀


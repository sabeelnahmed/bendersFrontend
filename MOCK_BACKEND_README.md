# Mock Backend API - Setup Guide

This mock FastAPI backend provides endpoints for testing the CodeBenders frontend.

## 📦 Installation

### Option 1: Using pip (Recommended)

```bash
# Install Python dependencies
pip install -r requirements.txt
```

### Option 2: Using virtual environment (Best Practice)

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## 🚀 Running the Server

```bash
# Run the mock backend
python mock_backend.py
```

The server will start on `http://localhost:8000`

## 📚 Available Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Root endpoint |
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/auth/login` | User login with email/password |
| POST | `/api/upload_prd` | Upload and process PRD text |
| GET | `/api/v1/projects` | Get all projects |

### Interactive API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🧪 Testing the Endpoints

### Testing the Login Endpoint

#### Using curl:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password123"
```

#### Using Python requests:

```python
import requests

url = "http://localhost:8000/api/v1/auth/login"
data = {
    "username": "user@example.com",
    "password": "password123"
}

response = requests.post(url, data=data)  # Note: 'data' not 'json' for form data
print(response.json())
```

#### Expected Response:

```json
{
  "access_token": "mock_jwt_xyzABC123...",
  "token_type": "bearer",
  "user": {
    "id": "user_1234abcd",
    "email": "user@example.com",
    "name": "User",
    "is_verified": true,
    "created_at": "2024-10-07T12:00:00.000000"
  }
}
```

**Note**: The mock backend accepts any credentials with a password length >= 3 characters.

### Testing the PRD Upload Endpoint

#### Using curl:

```bash
curl -X POST "http://localhost:8000/api/upload_prd" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Build an e-commerce platform with shopping cart, payment integration, and user accounts. The platform should support multiple vendors and have a review system.",
    "source": "textarea"
  }'
```

#### Using Python requests:

```python
import requests

url = "http://localhost:8000/api/upload_prd"
data = {
    "text": "Build a social media app with posts, comments, and likes",
    "source": "file: my_prd.pdf"
}

response = requests.post(url, json=data)
print(response.json())
```

#### Expected Response:

```json
{
  "success": true,
  "message": "PRD processed successfully",
  "data": {
    "prd_id": "prd_mock_12345",
    "text_length": 145,
    "word_count": 23,
    "source": "textarea",
    "analysis": {
      "contains_features": true,
      "contains_requirements": false,
      "contains_goals": false,
      "estimated_complexity": "medium"
    },
    "extracted_sections": {
      "overview": "Mock project overview extracted from PRD",
      "target_users": ["User type 1", "User type 2"],
      "key_features": [
        "Feature 1 from PRD",
        "Feature 2 from PRD",
        "Feature 3 from PRD"
      ],
      "technical_requirements": [
        "Backend API",
        "Database",
        "Frontend UI"
      ]
    },
    "next_steps": [
      "Review generated user personas",
      "Select target audience",
      "Define brand design",
      "Configure business logic"
    ],
    "timestamp": "2024-10-07T12:00:00Z"
  }
}
```

## 🔧 Configuration

### CORS Settings

The backend is configured to allow requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React default)

To add more origins, edit the `allow_origins` list in `mock_backend.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://your-custom-origin:port"
    ],
    ...
)
```

## 🛠️ Development

### Hot Reload

For development with auto-reload on code changes:

```bash
uvicorn mock_backend:app --reload --host 0.0.0.0 --port 8000
```

### Change Port

To run on a different port:

```bash
# Edit mock_backend.py, line at the bottom:
uvicorn.run(app, host="0.0.0.0", port=8001)
```

## 📝 Notes

- This is a **mock backend** for testing purposes
- All data is temporary and not persisted
- Replace with a real backend for production use
- The mock generates realistic responses but doesn't actually process the PRD text

## 🐛 Troubleshooting

### Port Already in Use

If port 8000 is already in use:

```bash
# Find the process using port 8000
lsof -ti:8000

# Kill the process
kill -9 $(lsof -ti:8000)

# Or change the port in mock_backend.py
```

### Module Not Found Error

Make sure you've installed the requirements:

```bash
pip install -r requirements.txt
```

### CORS Errors

Ensure your frontend URL is in the `allow_origins` list in `mock_backend.py`.


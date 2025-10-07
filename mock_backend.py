from fastapi import FastAPI, HTTPException, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
from datetime import datetime, timedelta
import secrets

app = FastAPI(title="CodeBenders API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request models
class PRDUploadRequest(BaseModel):
    text: str
    source: Optional[str] = "textarea"
    user_id: Optional[str] = None
    project_id: Optional[str] = None


# Response models
class PRDUploadResponse(BaseModel):
    success: bool
    message: str
    data: dict


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "CodeBenders API is running", "version": "1.0.0"}


@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "codebenders-api"}


@app.post("/api/v1/auth/login")
async def login(username: str = Form(...), password: str = Form(...)):
    """
    Mock login endpoint
    
    Accepts:
    - username: User's email address (sent as form data)
    - password: User's password (sent as form data)
    
    Returns:
    - access_token: JWT-like mock token
    - token_type: Bearer
    - user: User object with email, name, and id
    """
    
    # For mock purposes, accept any non-empty credentials
    if not username or not password:
        raise HTTPException(
            status_code=400,
            detail="Username and password are required"
        )
    
    # Mock validation - in real app, verify credentials against database
    # For now, reject only if password is too short
    if len(password) < 3:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    
    # Generate a mock JWT-like token
    mock_token = f"mock_jwt_{secrets.token_urlsafe(32)}"
    
    # Extract name from email
    user_name = username.split('@')[0] if '@' in username else username
    
    # Create mock user object
    user_data = {
        "id": f"user_{secrets.token_hex(8)}",
        "email": username,
        "name": user_name.capitalize(),
        "is_verified": True,
        "created_at": datetime.now().isoformat(),
    }
    
    return {
        "access_token": mock_token,
        "token_type": "bearer",
        "user": user_data
    }


@app.post("/api/upload_prd", response_model=PRDUploadResponse)
async def upload_prd(
    request: PRDUploadRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Mock endpoint for PRD upload
    
    Accepts:
    - text: Combined text from textarea and/or extracted from uploaded file
    - source: Origin of the text (e.g., "textarea" or "file: filename.pdf")
    - user_id: ID of the user uploading the PRD (optional)
    - project_id: ID of the project this PRD belongs to (optional)
    
    Headers:
    - Authorization: Bearer token (automatically sent by frontend)
    
    Returns:
    - success: Boolean indicating if processing was successful
    - message: Human-readable message
    - data: Processed PRD data
    """
    
    # Extract token from Authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    # Log the incoming request for debugging
    print(f"\n📥 PRD Upload Request:")
    print(f"   🔑 Token: {token[:20] + '...' if token else 'None'}")
    print(f"   👤 User ID: {request.user_id}")
    print(f"   📁 Project ID: {request.project_id}")
    print(f"   📄 Source: {request.source}")
    print(f"   📝 Text Length: {len(request.text)} characters\n")
    
    # Validate that text is not empty
    if not request.text or len(request.text.strip()) == 0:
        raise HTTPException(
            status_code=400,
            detail="PRD text cannot be empty"
        )
    
    # Mock processing of the PRD text
    word_count = len(request.text.split())
    char_count = len(request.text)
    
    # Extract some mock insights
    has_features = "feature" in request.text.lower()
    has_requirements = "requirement" in request.text.lower()
    has_goals = "goal" in request.text.lower()
    
    # Mock response data
    response_data = {
        "prd_id": "prd_mock_12345",
        "user_id": request.user_id,
        "project_id": request.project_id,
        "text_length": char_count,
        "word_count": word_count,
        "source": request.source,
        "analysis": {
            "contains_features": has_features,
            "contains_requirements": has_requirements,
            "contains_goals": has_goals,
            "estimated_complexity": "medium" if word_count > 100 else "low",
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
        "timestamp": datetime.now().isoformat()
    }
    
    return PRDUploadResponse(
        success=True,
        message="PRD processed successfully",
        data=response_data
    )


@app.get("/api/v1/projects")
async def get_projects():
    """Mock endpoint for getting projects"""
    return {
        "success": True,
        "projects": [
            {
                "id": "proj_1",
                "name": "E-commerce Platform",
                "status": "in_progress",
                "created_at": "2024-10-01T10:00:00Z"
            },
            {
                "id": "proj_2",
                "name": "Social Media App",
                "status": "draft",
                "created_at": "2024-10-05T15:30:00Z"
            }
        ]
    }


@app.get("/api/get_userpersonas")
async def get_userpersonas(
    user_id: Optional[str] = None,
    project_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """
    Mock endpoint for getting user personas
    
    Query Parameters:
    - user_id: ID of the user (optional)
    - project_id: ID of the project (optional)
    
    Headers:
    - Authorization: Bearer token (automatically sent by frontend)
    
    Returns:
    - success: Boolean indicating if request was successful
    - personas: List of user personas (empty if none exist)
    """
    
    # Extract token from Authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    # Log the incoming request for debugging
    print(f"\n📥 Get User Personas Request:")
    print(f"   🔑 Token: {token[:20] + '...' if token else 'None'}")
    print(f"   👤 User ID: {user_id}")
    print(f"   📁 Project ID: {project_id}\n")
    
    # For demonstration, return empty personas 50% of the time
    # You can change this logic based on your needs
    import random
    
    # Uncomment line below to always return data for testing
    # has_personas = True
    
    # Uncomment line below to always return empty for testing
    # has_personas = False
    
    # Random behavior for testing both scenarios
    has_personas = random.choice([True, False])
    
    if has_personas:
        # Return mock personas when data exists
        mock_personas = [
            {
                "id": "persona-1",
                "name": "System Administrator",
                "description": "Manages user accounts, system configurations, and monitors platform health. Requires comprehensive dashboard with admin controls.",
                "goals": ["Efficient user management", "System monitoring", "Access control"],
                "painPoints": ["Complex configuration processes", "Limited visibility into system health"],
                "keyFeatures": ["User management dashboard", "System analytics", "Role-based access control"]
            },
            {
                "id": "persona-2",
                "name": "Business Analyst",
                "description": "Analyzes business data, generates reports, and makes data-driven decisions. Needs intuitive analytics and reporting tools.",
                "goals": ["Data visualization", "Report generation", "Trend analysis"],
                "painPoints": ["Difficulty in accessing real-time data", "Complex reporting interfaces"],
                "keyFeatures": ["Interactive dashboards", "Custom report builder", "Data export capabilities"]
            },
            {
                "id": "persona-3",
                "name": "End User/Customer",
                "description": "Primary user of the application who interacts with core features. Expects simple, intuitive interface with quick task completion.",
                "goals": ["Quick task completion", "Easy navigation", "Reliable service"],
                "painPoints": ["Complicated workflows", "Slow response times"],
                "keyFeatures": ["Streamlined workflows", "Quick actions", "Responsive interface"]
            },
            {
                "id": "persona-4",
                "name": "Developer/Technical User",
                "description": "Integrates systems, manages APIs, and customizes functionality. Requires technical documentation and developer tools.",
                "goals": ["API integration", "System customization", "Technical documentation"],
                "painPoints": ["Poor API documentation", "Limited customization options"],
                "keyFeatures": ["API documentation", "Developer console", "Webhook management"]
            }
        ]
        
        return {
            "success": True,
            "personas": mock_personas,
            "message": "User personas retrieved successfully"
        }
    else:
        # Return empty personas
        return {
            "success": True,
            "personas": [],
            "message": "No user personas found"
        }


class UserPersonasUploadRequest(BaseModel):
    selected_personas: list
    user_id: Optional[str] = None
    project_id: Optional[str] = None


@app.post("/api/upload_userpersonas")
async def upload_userpersonas(
    request: UserPersonasUploadRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Mock endpoint for uploading selected user personas
    
    Accepts:
    - selected_personas: List of selected persona objects
    - user_id: ID of the user (optional)
    - project_id: ID of the project (optional)
    
    Headers:
    - Authorization: Bearer token (automatically sent by frontend)
    
    Returns:
    - success: Boolean indicating if upload was successful
    - message: Human-readable message
    - data: Saved personas data
    """
    
    # Extract token from Authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    # Log the incoming request for debugging
    print(f"\n📤 Upload User Personas Request:")
    print(f"   🔑 Token: {token[:20] + '...' if token else 'None'}")
    print(f"   👤 User ID: {request.user_id}")
    print(f"   📁 Project ID: {request.project_id}")
    print(f"   👥 Selected Personas Count: {len(request.selected_personas)}")
    print(f"   📋 Personas: {[p.get('name', 'Unknown') for p in request.selected_personas]}\n")
    
    # Validate that at least one persona is selected
    if not request.selected_personas or len(request.selected_personas) == 0:
        raise HTTPException(
            status_code=400,
            detail="At least one persona must be selected"
        )
    
    # Mock response data
    response_data = {
        "personas_saved": request.selected_personas,
        "count": len(request.selected_personas),
        "user_id": request.user_id,
        "project_id": request.project_id,
        "saved_at": datetime.now().isoformat(),
        "next_step": "brand_design"
    }
    
    return {
        "success": True,
        "message": f"Successfully saved {len(request.selected_personas)} user persona(s)",
        "data": response_data
    }


@app.get("/api/get_branddesign")
async def get_branddesign(
    user_id: Optional[str] = None,
    project_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """
    Mock endpoint for getting brand design configuration
    
    Query Parameters:
    - user_id: ID of the user (optional)
    - project_id: ID of the project (optional)
    
    Headers:
    - Authorization: Bearer token (automatically sent by frontend)
    
    Returns:
    - Brand design data or empty object if no data exists
    """
    
    # Extract token from Authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    # Log the incoming request for debugging
    print(f"\n📥 Get Brand Design Request:")
    print(f"   🔑 Token: {token[:20] + '...' if token else 'None'}")
    print(f"   👤 User ID: {user_id}")
    print(f"   📁 Project ID: {project_id}\n")
    
    # For demonstration, return empty brand design 50% of the time
    # You can change this logic based on your needs
    import random
    
    # Uncomment line below to always return data for testing
    # has_brand_design = True
    
    # Uncomment line below to always return empty for testing (use defaults)
    # has_brand_design = False
    
    # Random behavior for testing both scenarios
    has_brand_design = random.choice([True, False])
    
    if has_brand_design:
        # Return mock brand design when data exists
        mock_brand_design = {
            "brandName": "TechCorp Solutions",
            "logoUrl": None,  # No logo uploaded
            "colors": {
                "primary": "#3B82F6",     # Blue
                "secondary": "#1E293B",   # Dark slate
                "accent": "#8B5CF6",      # Purple
                "background": "#0F172A",  # Very dark blue
                "foreground": "#F8FAFC"   # Off-white
            },
            "fontFamily": "Inter",
            "brandVoice": "Innovation Through Technology",
            "tone": "Professional",
            "timestamp": datetime.now().isoformat()
        }
        
        print("   ✅ Returning saved brand design data")
        return mock_brand_design
    else:
        # Return empty object - frontend will use defaults (black, orange, white with Montserrat)
        print("   ⚠️  No brand design found - frontend will use defaults")
        return {}


class BrandDesignUploadRequest(BaseModel):
    brandName: str
    logoUrl: Optional[str] = None
    colors: dict
    fontFamily: str
    brandVoice: str
    tone: str
    user_id: Optional[str] = None
    project_id: Optional[str] = None


@app.post("/api/upload_branddesign")
async def upload_branddesign(
    request: BrandDesignUploadRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Mock endpoint for uploading/saving brand design configuration
    
    Accepts:
    - brandName: Brand name
    - logoUrl: Logo URL or base64 (optional)
    - colors: Object with primary, secondary, accent, background, foreground colors
    - fontFamily: Font family name
    - brandVoice: Brand voice/tagline
    - tone: Brand tone
    - user_id: ID of the user (optional)
    - project_id: ID of the project (optional)
    
    Headers:
    - Authorization: Bearer token (automatically sent by frontend)
    
    Returns:
    - success: Boolean indicating if upload was successful
    - message: Human-readable message
    - data: Saved brand design data
    """
    
    # Extract token from Authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    # Log the incoming request for debugging
    print(f"\n📤 Upload Brand Design Request:")
    print(f"   🔑 Token: {token[:20] + '...' if token else 'None'}")
    print(f"   👤 User ID: {request.user_id}")
    print(f"   📁 Project ID: {request.project_id}")
    print(f"   🎨 Brand Name: {request.brandName}")
    print(f"   🎨 Font Family: {request.fontFamily}")
    print(f"   🎨 Brand Voice: {request.brandVoice}")
    print(f"   🎨 Tone: {request.tone}")
    print(f"   🎨 Colors: {request.colors}\n")
    
    # Validate required fields
    if not request.brandName or len(request.brandName.strip()) == 0:
        raise HTTPException(
            status_code=400,
            detail="Brand name is required"
        )
    
    if not request.colors:
        raise HTTPException(
            status_code=400,
            detail="Brand colors are required"
        )
    
    # Mock response data
    response_data = {
        "brandName": request.brandName,
        "logoUrl": request.logoUrl,
        "colors": request.colors,
        "fontFamily": request.fontFamily,
        "brandVoice": request.brandVoice,
        "tone": request.tone,
        "user_id": request.user_id,
        "project_id": request.project_id,
        "saved_at": datetime.now().isoformat(),
        "next_step": "business_logic"
    }
    
    print("   ✅ Brand design saved successfully")
    
    return {
        "success": True,
        "message": "Brand design saved successfully",
        "data": response_data
    }


@app.get("/api/get_thirdparty")
async def get_thirdparty(
    user_id: Optional[str] = None,
    project_id: Optional[str] = None,
    authorization: Optional[str] = Header(None)
):
    """
    Mock endpoint for getting third-party API requirements
    
    Query Parameters:
    - user_id: ID of the user (optional)
    - project_id: ID of the project (optional)
    
    Headers:
    - Authorization: Bearer token (automatically sent by frontend)
    
    Returns:
    - Third-party API data based on PRD analysis, or empty object if no APIs needed
    """
    
    # Extract token from Authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    # Log the request
    print(f"\n📡 Get Third-Party APIs Request:")
    print(f"   🔑 Token: {token[:20] + '...' if token else 'None'}")
    print(f"   👤 User ID: {user_id}")
    print(f"   📁 Project ID: {project_id}\n")
    
    # Simulate different responses based on conditions
    # In a real implementation, this would analyze the PRD and determine required APIs
    
    # Example 1: Return empty when no third-party APIs needed
    # return {}
    
    # Example 2: Return list of third-party APIs
    mock_third_party_apis = {
        "apis": [
            {
                "name": "Stripe",
                "category": "payment",
                "provider": "Stripe Inc.",
                "description": "Payment processing and subscription management",
                "purpose": "Handle secure payments, subscriptions, and invoicing",
                "required": True,
                "features": [
                    "Credit card processing",
                    "Subscription billing",
                    "Invoice generation",
                    "Payment webhooks"
                ],
                "endpoints": [
                    "POST /v1/payment_intents",
                    "POST /v1/customers",
                    "POST /v1/subscriptions"
                ],
                "documentation": "https://stripe.com/docs/api"
            },
            {
                "name": "Google Maps",
                "category": "maps",
                "provider": "Google",
                "description": "Location services and mapping",
                "purpose": "Provide location search, geocoding, and map visualization",
                "required": True,
                "features": [
                    "Geocoding",
                    "Place search",
                    "Distance matrix",
                    "Static maps"
                ],
                "endpoints": [
                    "GET /maps/api/geocode/json",
                    "GET /maps/api/place/nearbysearch/json",
                    "GET /maps/api/distancematrix/json"
                ],
                "documentation": "https://developers.google.com/maps/documentation"
            },
            {
                "name": "Auth0",
                "category": "oauth",
                "provider": "Auth0",
                "description": "Authentication and authorization platform",
                "purpose": "Manage user authentication with OAuth 2.0 and social login",
                "required": False,
                "features": [
                    "Social login (Google, Facebook, etc.)",
                    "Multi-factor authentication",
                    "Single sign-on",
                    "User management"
                ],
                "endpoints": [
                    "POST /oauth/token",
                    "GET /userinfo",
                    "POST /dbconnections/signup"
                ],
                "documentation": "https://auth0.com/docs/api"
            },
            {
                "name": "Twilio",
                "category": "sms",
                "provider": "Twilio",
                "description": "SMS and communication services",
                "purpose": "Send SMS notifications and verification codes",
                "required": False,
                "features": [
                    "SMS messaging",
                    "Phone verification",
                    "Two-factor authentication",
                    "Delivery tracking"
                ],
                "endpoints": [
                    "POST /2010-04-01/Accounts/{AccountSid}/Messages.json",
                    "GET /2010-04-01/Accounts/{AccountSid}/Messages/{MessageSid}.json"
                ],
                "documentation": "https://www.twilio.com/docs/sms"
            },
            {
                "name": "SendGrid",
                "category": "email",
                "provider": "Twilio SendGrid",
                "description": "Email delivery and marketing platform",
                "purpose": "Send transactional and marketing emails",
                "required": True,
                "features": [
                    "Transactional emails",
                    "Email templates",
                    "Email analytics",
                    "Bounce handling"
                ],
                "endpoints": [
                    "POST /v3/mail/send",
                    "GET /v3/stats"
                ],
                "documentation": "https://docs.sendgrid.com/api-reference"
            }
        ],
        "summary": {
            "total": 5,
            "required": 3,
            "optional": 2,
            "categories": ["payment", "maps", "oauth", "sms", "email"]
        },
        "analyzed_at": datetime.now().isoformat(),
        "prd_version": "1.0.0"
    }
    
    print("   ✅ Returning third-party API requirements")
    
    # To simulate "no third-party APIs needed", uncomment the line below:
    # return {}
    
    return mock_third_party_apis


if __name__ == "__main__":
    print("=" * 60)
    print("🚀 CodeBenders Mock API Server Starting...")
    print("=" * 60)
    print("📍 Server URL: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("📊 Health Check: http://localhost:8000/api/v1/health")
    print("🔐 Login: POST http://localhost:8000/api/v1/auth/login")
    print("📝 PRD Upload: POST http://localhost:8000/api/upload_prd")
    print("📂 Projects: GET http://localhost:8000/api/v1/projects")
    print("👥 Get Personas: GET http://localhost:8000/api/get_userpersonas")
    print("💾 Save Personas: POST http://localhost:8000/api/upload_userpersonas")
    print("🎨 Get Brand Design: GET http://localhost:8000/api/get_branddesign")
    print("💾 Save Brand Design: POST http://localhost:8000/api/upload_branddesign")
    print("🔌 Get Third-Party APIs: GET http://localhost:8000/api/get_thirdparty")
    print("=" * 60)
    print("\n⚡ Starting server...\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )


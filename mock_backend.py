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
    
    # Example 2: Return list of third-party APIs (generic categories, not specific providers)
    mock_third_party_apis = {
        "apis": [
            {
                "name": "Payment Processing",
                "category": "payment",
                "description": "Secure payment gateway for processing transactions, subscriptions, and refunds",
                "purpose": "Your application requires payment processing capabilities for handling customer transactions, managing subscriptions, and processing refunds securely"
            },
            {
                "name": "Maps & Location Services",
                "category": "maps",
                "description": "Geolocation and mapping services for address lookup and route planning",
                "purpose": "Based on your PRD, the application needs location-based features including address search, geocoding, distance calculations, and interactive maps"
            },
            {
                "name": "Authentication & Authorization",
                "category": "oauth",
                "description": "Social login and identity management platform",
                "purpose": "To simplify user onboarding and provide secure authentication, your app needs OAuth integration for social login and SSO capabilities"
            },
            {
                "name": "SMS & Messaging",
                "category": "sms",
                "description": "SMS notification and verification services",
                "purpose": "Your application requires SMS capabilities for sending verification codes, transactional alerts, and notifications to users"
            },
            {
                "name": "Email Services",
                "category": "email",
                "description": "Transactional and marketing email delivery platform",
                "purpose": "For sending user notifications, password resets, promotional emails, and transactional communications reliably at scale"
            },
            {
                "name": "Cloud Storage",
                "category": "storage",
                "description": "Scalable object storage for files and media",
                "purpose": "Your application needs to store and serve user-generated content, images, documents, and media files securely and efficiently"
            },
            {
                "name": "Push Notifications",
                "category": "messaging",
                "description": "Mobile and web push notification services",
                "purpose": "To engage users with timely updates and alerts, your app requires push notification capabilities across mobile and web platforms"
            }
        ],
        "summary": {
            "total": 7,
            "categories": ["payment", "maps", "oauth", "sms", "email", "storage", "messaging"]
        },
        "analyzed_at": datetime.now().isoformat(),
        "prd_version": "1.0.0"
    }
    
    print("   ✅ Returning third-party API requirements")
    
    # To simulate "no third-party APIs needed", uncomment the line below:
    # return {}
    
    return mock_third_party_apis


class ThirdPartyApisUploadRequest(BaseModel):
    selected_apis: list
    user_id: Optional[str] = None
    project_id: Optional[str] = None


@app.post("/api/upload_thirdparty")
async def upload_thirdparty(
    request: ThirdPartyApisUploadRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Mock endpoint for uploading selected third-party APIs
    
    Accepts:
    - selected_apis: List of selected API objects
    - user_id: ID of the user (optional)
    - project_id: ID of the project (optional)
    
    Headers:
    - Authorization: Bearer token (automatically sent by frontend)
    
    Returns:
    - success: Boolean indicating if upload was successful
    - message: Human-readable message
    - data: Saved APIs data
    """
    
    # Extract token from Authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    # Log the incoming request for debugging
    print(f"\n📤 Upload Third-Party APIs Request:")
    print(f"   🔑 Token: {token[:20] + '...' if token else 'None'}")
    print(f"   👤 User ID: {request.user_id}")
    print(f"   📁 Project ID: {request.project_id}")
    print(f"   🔌 Selected APIs Count: {len(request.selected_apis)}")
    print(f"   📋 APIs: {[api.get('name', 'Unknown') for api in request.selected_apis]}\n")
    
    # Validate that at least one API is selected
    if not request.selected_apis or len(request.selected_apis) == 0:
        raise HTTPException(
            status_code=400,
            detail="At least one API must be selected"
        )
    
    # Provider recommendations based on API categories
    provider_recommendations = {
        "payment": [
            {"name": "Stripe", "description": "Complete payment platform", "popularity": "Most Popular", "pricing": "2.9% + 30¢ per transaction"},
            {"name": "PayPal", "description": "Widely trusted payment solution", "popularity": "Popular", "pricing": "2.9% + 30¢ per transaction"},
            {"name": "Square", "description": "Point of sale and payments", "popularity": "Growing", "pricing": "2.6% + 10¢ per transaction"},
            {"name": "Razorpay", "description": "Payment gateway for India", "popularity": "Regional", "pricing": "2% per transaction"}
        ],
        "maps": [
            {"name": "Google Maps", "description": "Comprehensive mapping platform", "popularity": "Most Popular", "pricing": "$7 per 1000 requests"},
            {"name": "Mapbox", "description": "Customizable maps", "popularity": "Popular", "pricing": "$5 per 1000 requests"},
            {"name": "OpenStreetMap", "description": "Open source mapping", "popularity": "Free", "pricing": "Free"},
            {"name": "Here Maps", "description": "Enterprise mapping solution", "popularity": "Enterprise", "pricing": "Custom pricing"}
        ],
        "oauth": [
            {"name": "Auth0", "description": "Universal authentication platform", "popularity": "Most Popular", "pricing": "Free up to 7000 users"},
            {"name": "Firebase Auth", "description": "Google's authentication service", "popularity": "Popular", "pricing": "Free tier available"},
            {"name": "Okta", "description": "Enterprise identity management", "popularity": "Enterprise", "pricing": "Starting at $5/user/month"},
            {"name": "AWS Cognito", "description": "Scalable user directory", "popularity": "Enterprise", "pricing": "Pay per active user"}
        ],
        "sms": [
            {"name": "Twilio", "description": "Programmable SMS platform", "popularity": "Most Popular", "pricing": "$0.0079 per SMS"},
            {"name": "AWS SNS", "description": "Amazon's notification service", "popularity": "Popular", "pricing": "$0.00645 per SMS"},
            {"name": "Vonage", "description": "Global SMS API", "popularity": "Growing", "pricing": "Starting at $0.0084 per SMS"},
            {"name": "MessageBird", "description": "Multi-channel messaging", "popularity": "Growing", "pricing": "Starting at $0.0081 per SMS"}
        ],
        "email": [
            {"name": "SendGrid", "description": "Email delivery platform", "popularity": "Most Popular", "pricing": "Free up to 100 emails/day"},
            {"name": "Mailgun", "description": "Email API for developers", "popularity": "Popular", "pricing": "Pay as you go"},
            {"name": "AWS SES", "description": "Amazon's email service", "popularity": "Cost-effective", "pricing": "$0.10 per 1000 emails"},
            {"name": "Postmark", "description": "Transactional email", "popularity": "Premium", "pricing": "$15 per 10,000 emails"}
        ],
        "storage": [
            {"name": "AWS S3", "description": "Scalable object storage", "popularity": "Most Popular", "pricing": "$0.023 per GB/month"},
            {"name": "Google Cloud Storage", "description": "Google's storage solution", "popularity": "Popular", "pricing": "$0.020 per GB/month"},
            {"name": "Azure Blob Storage", "description": "Microsoft's cloud storage", "popularity": "Enterprise", "pricing": "$0.018 per GB/month"},
            {"name": "Cloudinary", "description": "Media management platform", "popularity": "Media-focused", "pricing": "Free tier available"}
        ],
        "messaging": [
            {"name": "Firebase Cloud Messaging", "description": "Google's push notifications", "popularity": "Most Popular", "pricing": "Free"},
            {"name": "OneSignal", "description": "Multi-platform notifications", "popularity": "Popular", "pricing": "Free tier available"},
            {"name": "Pusher", "description": "Real-time messaging", "popularity": "Developer-friendly", "pricing": "Free up to 100 connections"},
            {"name": "Amazon SNS", "description": "AWS notification service", "popularity": "Enterprise", "pricing": "Pay per notification"}
        ]
    }
    
    # Build recommendations for selected APIs
    recommendations = []
    for api in request.selected_apis:
        category = api.get('category', '').lower()
        if category in provider_recommendations:
            recommendations.append({
                "api_category": api.get('name'),
                "category": category,
                "description": api.get('description'),
                "providers": provider_recommendations[category]
            })
    
    # Mock response data
    response_data = {
        "apis_saved": request.selected_apis,
        "provider_recommendations": recommendations,
        "count": len(request.selected_apis),
        "user_id": request.user_id,
        "project_id": request.project_id,
        "saved_at": datetime.now().isoformat(),
        "next_step": "select_specific_providers"
    }
    
    print("   ✅ Third-party APIs saved successfully")
    print(f"   📋 Returning {len(recommendations)} provider recommendations")
    
    return {
        "success": True,
        "message": f"Successfully saved {len(request.selected_apis)} third-party API(s)",
        "data": response_data
    }


class ThirdPartyProvidersUploadRequest(BaseModel):
    selected_providers: dict
    user_id: Optional[str] = None
    project_id: Optional[str] = None


@app.post("/api/upload_thirdprovider")
async def upload_thirdprovider(
    request: ThirdPartyProvidersUploadRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Mock endpoint for uploading selected third-party providers
    
    Accepts:
    - selected_providers: Dictionary with category as key and provider name as value
      Example: {"payment": "Stripe", "maps": "Google Maps"}
    - user_id: ID of the user (optional)
    - project_id: ID of the project (optional)
    
    Headers:
    - Authorization: Bearer token (automatically sent by frontend)
    
    Returns:
    - success: Boolean indicating if upload was successful
    - message: Human-readable message
    - data: Saved providers data with API key requirements
    """
    
    # Extract token from Authorization header
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
    
    # Log the incoming request for debugging
    print(f"\n📤 Upload Third-Party Providers Request:")
    print(f"   🔑 Token: {token[:20] + '...' if token else 'None'}")
    print(f"   👤 User ID: {request.user_id}")
    print(f"   📁 Project ID: {request.project_id}")
    print(f"   🔌 Selected Providers Count: {len(request.selected_providers)}")
    print(f"   📋 Providers: {request.selected_providers}\n")
    
    # Validate that at least one provider is selected
    if not request.selected_providers or len(request.selected_providers) == 0:
        raise HTTPException(
            status_code=400,
            detail="At least one provider must be selected"
        )
    
    # Generate API key requirements for each selected provider
    api_key_requirements = []
    for category, provider_name in request.selected_providers.items():
        # Define what keys each provider needs
        key_info = {
            "category": category,
            "provider": provider_name,
            "keys_required": []
        }
        
        # Provider-specific key requirements
        if provider_name == "Stripe":
            key_info["keys_required"] = [
                {"name": "Publishable Key", "field": "stripe_publishable_key", "description": "Public key for client-side", "required": True},
                {"name": "Secret Key", "field": "stripe_secret_key", "description": "Secret key for server-side", "required": True}
            ]
        elif provider_name == "PayPal":
            key_info["keys_required"] = [
                {"name": "Client ID", "field": "paypal_client_id", "description": "PayPal application client ID", "required": True},
                {"name": "Client Secret", "field": "paypal_client_secret", "description": "PayPal application secret", "required": True}
            ]
        elif provider_name == "Google Maps":
            key_info["keys_required"] = [
                {"name": "API Key", "field": "google_maps_api_key", "description": "Google Maps API key", "required": True}
            ]
        elif provider_name == "Mapbox":
            key_info["keys_required"] = [
                {"name": "Access Token", "field": "mapbox_access_token", "description": "Mapbox public access token", "required": True}
            ]
        elif provider_name == "Auth0":
            key_info["keys_required"] = [
                {"name": "Domain", "field": "auth0_domain", "description": "Auth0 tenant domain", "required": True},
                {"name": "Client ID", "field": "auth0_client_id", "description": "Application client ID", "required": True},
                {"name": "Client Secret", "field": "auth0_client_secret", "description": "Application client secret", "required": True}
            ]
        elif provider_name == "Firebase Auth":
            key_info["keys_required"] = [
                {"name": "API Key", "field": "firebase_api_key", "description": "Firebase API key", "required": True},
                {"name": "Project ID", "field": "firebase_project_id", "description": "Firebase project ID", "required": True}
            ]
        elif provider_name == "Twilio":
            key_info["keys_required"] = [
                {"name": "Account SID", "field": "twilio_account_sid", "description": "Twilio account SID", "required": True},
                {"name": "Auth Token", "field": "twilio_auth_token", "description": "Twilio auth token", "required": True}
            ]
        elif provider_name == "SendGrid":
            key_info["keys_required"] = [
                {"name": "API Key", "field": "sendgrid_api_key", "description": "SendGrid API key", "required": True}
            ]
        elif provider_name == "AWS S3":
            key_info["keys_required"] = [
                {"name": "Access Key ID", "field": "aws_access_key_id", "description": "AWS access key ID", "required": True},
                {"name": "Secret Access Key", "field": "aws_secret_access_key", "description": "AWS secret access key", "required": True},
                {"name": "Region", "field": "aws_region", "description": "AWS region (e.g., us-east-1)", "required": True},
                {"name": "Bucket Name", "field": "aws_bucket_name", "description": "S3 bucket name", "required": True}
            ]
        else:
            # Generic API key for other providers
            key_info["keys_required"] = [
                {"name": "API Key", "field": f"{category}_api_key", "description": f"{provider_name} API key", "required": True}
            ]
        
        api_key_requirements.append(key_info)
    
    # Mock response data
    response_data = {
        "providers_saved": request.selected_providers,
        "count": len(request.selected_providers),
        "api_key_requirements": api_key_requirements,
        "user_id": request.user_id,
        "project_id": request.project_id,
        "saved_at": datetime.now().isoformat(),
        "next_step": "enter_api_keys"
    }
    
    print("   ✅ Third-party providers saved successfully")
    print(f"   🔑 API keys required: {len(api_key_requirements)}")
    
    return {
        "success": True,
        "message": f"Successfully saved {len(request.selected_providers)} provider(s)",
        "data": response_data
    }


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
    print("💾 Save Third-Party APIs: POST http://localhost:8000/api/upload_thirdparty")
    print("💾 Save Third-Party Providers: POST http://localhost:8000/api/upload_thirdprovider")
    print("=" * 60)
    print("\n⚡ Starting server...\n")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )


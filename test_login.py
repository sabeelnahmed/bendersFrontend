#!/usr/bin/env python3
"""
Quick test script for the login endpoint
Run this after starting the mock backend server
"""

import requests
import json

# API endpoint
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/v1/auth/login"

def test_login_success():
    """Test successful login"""
    print("\n" + "="*60)
    print("🧪 Testing Login Endpoint - SUCCESS CASE")
    print("="*60)
    
    data = {
        "username": "test@example.com",
        "password": "password123"
    }
    
    print(f"\n📤 Sending POST to: {LOGIN_URL}")
    print(f"📋 Data: {data}")
    
    try:
        response = requests.post(LOGIN_URL, data=data)
        response.raise_for_status()
        
        print(f"\n✅ Status Code: {response.status_code}")
        print(f"📥 Response:")
        print(json.dumps(response.json(), indent=2))
        
        # Verify response structure
        result = response.json()
        assert "access_token" in result, "Missing access_token"
        assert "user" in result, "Missing user object"
        assert result["user"]["email"] == data["username"], "Email mismatch"
        
        print("\n✅ All assertions passed!")
        
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Error: {e}")
        if hasattr(e.response, 'text'):
            print(f"Response: {e.response.text}")

def test_login_failure():
    """Test login failure with short password"""
    print("\n" + "="*60)
    print("🧪 Testing Login Endpoint - FAILURE CASE")
    print("="*60)
    
    data = {
        "username": "test@example.com",
        "password": "12"  # Too short
    }
    
    print(f"\n📤 Sending POST to: {LOGIN_URL}")
    print(f"📋 Data: {data} (password too short)")
    
    try:
        response = requests.post(LOGIN_URL, data=data)
        
        print(f"\n⚠️  Status Code: {response.status_code}")
        print(f"📥 Response:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 401:
            print("\n✅ Expected 401 error received!")
        else:
            print(f"\n❌ Unexpected status code: {response.status_code}")
        
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Error: {e}")

def test_login_missing_fields():
    """Test login failure with missing fields"""
    print("\n" + "="*60)
    print("🧪 Testing Login Endpoint - MISSING FIELDS")
    print("="*60)
    
    data = {
        "username": "test@example.com",
        # password is missing
    }
    
    print(f"\n📤 Sending POST to: {LOGIN_URL}")
    print(f"📋 Data: {data} (missing password)")
    
    try:
        response = requests.post(LOGIN_URL, data=data)
        
        print(f"\n⚠️  Status Code: {response.status_code}")
        print(f"📥 Response:")
        print(json.dumps(response.json(), indent=2))
        
        if response.status_code == 422:  # FastAPI validation error
            print("\n✅ Expected 422 validation error received!")
        else:
            print(f"\n❌ Unexpected status code: {response.status_code}")
        
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    print("\n🚀 Starting Login API Tests")
    print("⚠️  Make sure the mock backend is running on http://localhost:8000")
    print("   Run: python mock_backend.py")
    
    input("\nPress Enter to continue...")
    
    try:
        # Test health endpoint first
        print("\n" + "="*60)
        print("🏥 Testing Health Endpoint")
        print("="*60)
        health_response = requests.get(f"{BASE_URL}/api/v1/health", timeout=5)
        print(f"✅ Server is running: {health_response.json()}")
        
        # Run tests
        test_login_success()
        test_login_failure()
        test_login_missing_fields()
        
        print("\n" + "="*60)
        print("✅ All tests completed!")
        print("="*60 + "\n")
        
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Could not connect to the server.")
        print("   Please make sure the mock backend is running:")
        print("   python mock_backend.py\n")
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}\n")



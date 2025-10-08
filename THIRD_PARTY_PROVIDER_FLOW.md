# Third-Party Provider Selection & API Key Configuration Flow

## Overview
This document describes the complete flow for selecting third-party providers and configuring their API keys.

## Flow Diagram
```
ThirdPartyAPI.jsx → SpecificThirdParty.jsx → ThirdPartyKey.jsx → API Factory
     (Select           (Select specific         (Enter API keys)
   API categories)       providers)
```

---

## 1. ThirdPartyAPI.jsx
**Purpose**: User selects which types of third-party APIs they need (e.g., payment, maps, auth)

### User Flow:
1. View available API categories (Payment, Maps, OAuth, SMS, Email, Storage, Messaging)
2. Select one or more categories by clicking on cards
3. Click "Continue" button

### Technical Details:
- **GET Endpoint**: `/api/get_thirdparty`
- **POST Endpoint**: `/api/upload_thirdparty`
- **Data Stored in localStorage**: `providerRecommendations`
- **Navigation**: `ThirdPartyAPI` → `Specific Third Party`

### Backend Response Structure:
```json
{
  "success": true,
  "message": "Successfully saved 2 third-party API(s)",
  "data": {
    "apis_saved": [...],
    "provider_recommendations": [
      {
        "api_category": "Payment Processing",
        "category": "payment",
        "description": "...",
        "providers": [
          {
            "name": "Stripe",
            "description": "Complete payment platform",
            "popularity": "Most Popular",
            "pricing": "2.9% + 30¢ per transaction"
          },
          ...
        ]
      }
    ],
    "count": 2,
    "next_step": "select_specific_providers"
  }
}
```

---

## 2. SpecificThirdParty.jsx
**Purpose**: User selects specific providers for each API category

### User Flow:
1. View recommended providers for each selected category
2. Select one provider per category (first provider auto-selected by default)
3. Click "Continue" button

### Technical Details:
- **Data Source**: `localStorage.getItem('providerRecommendations')`
- **POST Endpoint**: `/api/upload_thirdprovider`
- **Data Stored in localStorage**: `apiKeyRequirements`
- **Navigation**: `Specific Third Party` → `Third Party Key`

### Request Format:
```json
{
  "selected_providers": {
    "payment": "Stripe",
    "maps": "Google Maps",
    "oauth": "Auth0"
  },
  "user_id": "user_123",
  "project_id": "project_456"
}
```

### Backend Response Structure:
```json
{
  "success": true,
  "message": "Successfully saved 3 provider(s)",
  "data": {
    "providers_saved": {
      "payment": "Stripe",
      "maps": "Google Maps",
      "oauth": "Auth0"
    },
    "count": 3,
    "api_key_requirements": [
      {
        "category": "payment",
        "provider": "Stripe",
        "keys_required": [
          {
            "name": "Publishable Key",
            "field": "stripe_publishable_key",
            "description": "Public key for client-side",
            "required": true
          },
          {
            "name": "Secret Key",
            "field": "stripe_secret_key",
            "description": "Secret key for server-side",
            "required": true
          }
        ]
      },
      ...
    ],
    "next_step": "enter_api_keys"
  }
}
```

---

## 3. ThirdPartyKey.jsx
**Purpose**: User enters API keys for each selected provider

### User Flow:
1. View all selected providers and their required API keys
2. Enter API keys in password-protected input fields
3. Click "Continue" button

### Technical Details:
- **Data Source**: `localStorage.getItem('apiKeyRequirements')`
- **POST Endpoint**: Not yet implemented (TODO)
- **Data Stored in localStorage**: `thirdPartyApiKeys`
- **Navigation**: `Third Party Key` → `API Factory`

### Data Structure:
```json
{
  "stripe_publishable_key": "pk_test_...",
  "stripe_secret_key": "sk_test_...",
  "google_maps_api_key": "AIza...",
  "auth0_domain": "myapp.auth0.com",
  "auth0_client_id": "abc123...",
  "auth0_client_secret": "xyz789..."
}
```

### UI Features:
- Password-protected input fields for security
- Provider-specific key requirements
- Category badges for context
- Validation for required fields
- Loading states during submission

---

## Backend Endpoints

### 1. GET `/api/get_thirdparty`
Returns available API categories based on PRD analysis.

**Response**: Array of API categories with descriptions and purposes.

### 2. POST `/api/upload_thirdparty`
Saves selected API categories and returns provider recommendations.

**Request Body**:
```python
{
  "selected_apis": [...],
  "user_id": Optional[str],
  "project_id": Optional[str]
}
```

**Response**: Provider recommendations for each selected category.

### 3. POST `/api/upload_thirdprovider`
Saves selected providers and returns API key requirements.

**Request Body**:
```python
{
  "selected_providers": dict,  # {"category": "provider_name"}
  "user_id": Optional[str],
  "project_id": Optional[str]
}
```

**Response**: API key requirements for each selected provider.

---

## Provider-Specific Key Requirements

### Stripe (Payment)
- Publishable Key (client-side)
- Secret Key (server-side)

### PayPal (Payment)
- Client ID
- Client Secret

### Google Maps
- API Key

### Mapbox
- Access Token

### Auth0
- Domain
- Client ID
- Client Secret

### Firebase Auth
- API Key
- Project ID

### Twilio (SMS)
- Account SID
- Auth Token

### SendGrid (Email)
- API Key

### AWS S3 (Storage)
- Access Key ID
- Secret Access Key
- Region
- Bucket Name

### Generic Provider
- API Key (default for unlisted providers)

---

## Console Logging

All three components include comprehensive console logging for debugging:

### ThirdPartyAPI.jsx
- ✅ Upload success
- 📦 Full response
- 📋 Provider recommendations
- 💾 localStorage storage
- ✓ Verification
- 🚀 Navigation

### SpecificThirdParty.jsx
- 🔍 Loading data
- 📦 Raw localStorage data
- ✅ Parsed data
- 📊 Data counts
- ✓ Auto-selection
- 📤 Upload initiation
- 🚀 Navigation

### ThirdPartyKey.jsx
- 🔍 Loading requirements
- 📦 Raw localStorage data
- ✅ Parsed data
- 📊 Provider counts
- 🔑 API key structure
- 📤 Submission
- 💾 Storage
- 🚀 Navigation

---

## Design Philosophy

### Apple Minimalist Design
- Clean, spacious layouts
- Subtle animations (fadeIn)
- Consistent color palette (#D16021 primary orange)
- Montserrat font family
- Glass-morphism effects (rgba backgrounds)
- Clear visual hierarchy
- Accessible hover states
- Loading and empty states

### User Experience
- Auto-selection of first provider for better UX
- Password-protected API key inputs for security
- Clear validation messages
- Disabled states during async operations
- Visual feedback for selections
- Comprehensive error handling

---

## Testing

### Manual Testing Steps:

1. **Start Backend**:
   ```bash
   python mock_backend.py
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Test Flow**:
   - Navigate to "3rd Party API" page
   - Select API categories (e.g., Payment, Maps)
   - Click "Continue"
   - Verify navigation to "Specific Third Party"
   - Check console for provider recommendations
   - Select providers (or use auto-selected ones)
   - Click "Continue"
   - Verify navigation to "Third Party Key"
   - Check console for API key requirements
   - Enter API keys
   - Click "Continue"
   - Verify navigation to "API Factory"

4. **Check Browser Console**:
   - All console logs should show successful data flow
   - localStorage should contain all required data

---

## Future Enhancements

### Backend
- [ ] Create `/api/upload_apikeys` endpoint to securely save API keys
- [ ] Add encryption for API keys in transit and at rest
- [ ] Add validation for API key formats
- [ ] Add API key verification (test keys against provider APIs)

### Frontend
- [ ] Add "Skip" option for users who want to add keys later
- [ ] Add "Test Connection" buttons to verify API keys
- [ ] Add tooltips with links to provider documentation
- [ ] Add "Show/Hide" toggle for password fields
- [ ] Add form validation with real-time feedback
- [ ] Add ability to edit previously saved keys

### Security
- [ ] Implement secure key storage (backend encryption)
- [ ] Add key rotation capabilities
- [ ] Add audit logging for key access
- [ ] Implement key expiration warnings

---

## File Changes Summary

### Modified Files:
1. **src/Context.jsx** - Added `UPLOAD_THIRD_PARTY_PROVIDERS` endpoint
2. **src/Components/SpecificThirdParty.jsx** - Added POST functionality and navigation
3. **src/Components/Home.jsx** - Added ThirdPartyKey navigation and import
4. **mock_backend.py** - Added `/api/upload_thirdprovider` endpoint

### New Files:
1. **src/Components/ThirdPartyKey.jsx** - New component for API key configuration

---

## Error Handling

All components include:
- Try-catch blocks for async operations
- `finally` blocks to reset loading states
- User-friendly error messages via alerts
- Console error logging for debugging
- Validation before API calls

---

## Data Flow

```
localStorage Flow:
1. ThirdPartyAPI → stores 'providerRecommendations'
2. SpecificThirdParty → reads 'providerRecommendations', stores 'apiKeyRequirements'
3. ThirdPartyKey → reads 'apiKeyRequirements', stores 'thirdPartyApiKeys'
4. API Factory → reads 'thirdPartyApiKeys' (future)
```

---

## Notes

- All API keys are stored in localStorage for now (TODO: move to secure backend)
- Password fields prevent accidental key exposure
- Auto-selection improves UX by reducing clicks
- Console logging helps with debugging data flow issues
- All components follow the same design system for consistency


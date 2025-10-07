# Brand Design API Integration

## Overview
The Brand Design component now integrates with the backend API to fetch and save brand configuration. If no data exists on the backend, it uses default colors matching the application's black, orange, and white theme with Montserrat font.

## API Endpoints

### GET `/api/get_branddesign`
Fetches brand design configuration from the backend.

**Response (when data exists):**
```json
{
  "brandName": "TechCorp Solutions",
  "logoUrl": "base64_or_url",
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#1E293B",
    "accent": "#8B5CF6",
    "background": "#0F172A",
    "foreground": "#F8FAFC"
  },
  "fontFamily": "Inter",
  "brandVoice": "Innovation Through Technology",
  "tone": "Professional"
}
```

**Response (when empty):**
```json
{}
```

### POST `/api/upload_branddesign`
Saves brand design configuration to the backend.

**Request Body:**
```json
{
  "brandName": "Your Brand",
  "logoUrl": "base64_or_url",
  "colors": {
    "primary": "#D16021",
    "secondary": "#374151",
    "accent": "#6B7280",
    "background": "#1a1a1a",
    "foreground": "#ffffff"
  },
  "fontFamily": "Montserrat",
  "brandVoice": "Building the Future of Technology",
  "tone": "Professional",
  "user_id": "optional",
  "project_id": "optional"
}
```

## Default Theme Colors

When the API returns empty data, the component uses these defaults:

- **Primary**: `#D16021` (Orange - main brand color)
- **Secondary**: `#2d3748` (Dark Charcoal - supporting color)
- **Accent**: `#6B7280` (Gray - highlights)
- **Background**: `#1a1a1a` (Black - base background)
- **Foreground**: `#ffffff` (White - text & content)
- **Font**: `Montserrat`

These colors match the application's existing black, orange, and white theme.

## Implementation Details

### Frontend (`BrandDesign.jsx`)

1. **Imports**:
   - Added `useEffect` from React
   - Imported `brandService` from `../api/brandService.js`

2. **Default Colors**:
   - Defined `defaultColors` object matching app theme
   - Used as fallback when API is empty or fails

3. **Data Fetching**:
   - `useEffect` hook fetches data on component mount
   - If response has data → uses API values
   - If response is empty → uses default colors
   - If API fails → uses default colors (with console error)

4. **API Service** (`brandService.js`):
   - `getBrandDesign()` - GET request to fetch brand design
   - `uploadBrandDesign(brandData)` - POST request to save brand design

### Backend (`mock_backend.py`)

1. **GET Endpoint** (`/api/get_branddesign`):
   - Returns mock brand design 50% of the time (random)
   - Returns empty object `{}` 50% of the time
   - Can be configured to always return data or always return empty

2. **POST Endpoint** (`/api/upload_branddesign`):
   - Validates required fields (brandName, colors)
   - Saves brand design configuration
   - Returns success response

## Testing the Integration

### Option 1: Test with Empty Response (Default Colors)
In `mock_backend.py` (line 418), uncomment:
```python
has_brand_design = False
```

This will always return empty data, and the frontend will use default black/orange/white theme.

### Option 2: Test with API Data
In `mock_backend.py` (line 415), uncomment:
```python
has_brand_design = True
```

This will always return mock brand design data from the API.

### Option 3: Random Behavior (Current)
Leave both commented - the API randomly returns data or empty (50/50).

## Usage Flow

1. User navigates to Brand Design page
2. Component mounts and calls `GET /api/get_branddesign`
3. **If API returns data**: Component populates with saved values
4. **If API returns empty `{}`**: Component uses default theme colors
5. User can modify brand settings
6. On "Continue", can call `POST /api/upload_branddesign` to save changes

## Files Modified

1. ✅ `/src/Context.jsx` - Added API endpoints
2. ✅ `/src/api/brandService.js` - Created brand service (NEW)
3. ✅ `/src/Components/BrandDesign.jsx` - Integrated API fetching
4. ✅ `/mock_backend.py` - Added GET and POST endpoints

## Continue Button Functionality

✅ **IMPLEMENTED**: The Continue button now automatically saves brand design data to the backend before navigating.

### Flow:
1. User clicks "Continue" button
2. `handleContinue()` function is called
3. Brand design data is prepared with current state:
   - `brandName`
   - `logoUrl` (uploaded logo or null)
   - `colors` (all color values)
   - `fontFamily` (selected font)
   - `brandVoice` (tagline)
   - `tone` (selected tone)
4. Data is sent to `POST /api/upload_branddesign`
5. On success: Navigates to next page
6. On error: Shows alert and stays on page

### Error Handling:
- Console logs success/failure
- Shows user-friendly alert on error
- Prevents navigation if save fails


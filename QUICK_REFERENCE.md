# 🚀 Quick Reference Card

## 📋 Available Pages

| URL | Page | Status |
|-----|------|--------|
| `/login` | Login | ✅ Ready |
| `/signup` | Sign Up | ✅ Ready |
| `/forgot-password` | Forgot Password | ✅ Ready |
| `/reset-password?token=xxx` | Reset Password | ✅ Ready |

---

## 🔧 Setup (5 Minutes)

### 1. Update Backend URL
**File:** `src/Context.jsx` (Line 3)
```javascript
baseURL: 'http://YOUR_IP:PORT'
```

### 2. Start Dev Server
```bash
npm run dev
```

### 3. Test
Visit: `http://localhost:5173/login`

---

## 💻 Quick API Usage

### Import
```javascript
import authService from '../api/authService';
```

### Login
```javascript
const { access_token, user } = await authService.login(email, password);
localStorage.setItem('token', access_token);
```

### Register
```javascript
const user = await authService.register({
  email, password, full_name
});
```

### Forgot Password
```javascript
await authService.forgotPassword(email);
// User gets email with reset link
```

### Reset Password
```javascript
await authService.resetPassword(token, newPassword);
```

### Get Current User
```javascript
const user = await authService.getCurrentUser();
```

### Logout
```javascript
await authService.logout();
localStorage.clear();
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/Context.jsx` | API config & endpoints |
| `src/api/authService.js` | All API methods |
| `src/Components/Login.jsx` | Login page |
| `src/Components/Signup.jsx` | Signup page |
| `src/Components/ForgotPassword.jsx` | Forgot password |
| `src/Components/ResetPassword.jsx` | Reset password |
| `src/App.jsx` | Routes |

---

## 🎯 Common Tasks

### Add Protected Route
```javascript
// In component
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) navigate('/login');
}, []);
```

### Check if Logged In
```javascript
const isLoggedIn = !!localStorage.getItem('token');
```

### Get User Data
```javascript
const user = JSON.parse(localStorage.getItem('user'));
```

### Handle 401 Errors
```javascript
catch (error) {
  if (error.response?.status === 401) {
    localStorage.clear();
    navigate('/login');
  }
}
```

---

## 🎨 UI Components

All pages include:
- ✅ Full-screen video background
- ✅ Glassmorphism overlay
- ✅ Loading states
- ✅ Error/Success messages
- ✅ Password visibility toggle
- ✅ Responsive design

---

## 🔐 API Endpoints

### Available NOW:
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password

### Ready to Use (No UI yet):
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user
- `PATCH /api/v1/auth/me` - Update profile
- `DELETE /api/v1/auth/me` - Delete account
- `POST /api/v1/auth/me/change-password` - Change password
- `POST /api/v1/auth/request-verify-token` - Request verification
- `POST /api/v1/auth/verify` - Verify email
- `GET /api/v1/auth/users` - List users (admin)
- And 7 more admin endpoints...

---

## 🐛 Troubleshooting

### CORS Error
- Enable CORS on backend for your frontend URL

### 401 Unauthorized
- Token expired - user needs to re-login

### Connection Refused
- Check backend is running
- Verify IP/port in Context.jsx

### Form Not Submitting
- Check console for errors
- Verify backend endpoint exists

---

## 📚 Documentation

- **COMPLETE_FEATURES.md** - Full feature list
- **API_INTEGRATION.md** - Complete API docs
- **INTEGRATION_SUMMARY.md** - Setup guide
- **authService.js** - JSDoc for all methods

---

## ✅ Testing Checklist

- [ ] Update baseURL in Context.jsx
- [ ] Backend is running
- [ ] Can register new user
- [ ] Can login
- [ ] Token is stored
- [ ] Can request password reset
- [ ] Can reset password with token
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Loading states work

---

## 🎉 You're Ready!

Everything is configured and ready to use. Just update the backend URL and start coding!

**Happy coding! 🚀**


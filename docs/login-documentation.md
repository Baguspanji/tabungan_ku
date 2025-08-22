# Dokumentasi Login - Aplikasi Tabungan

## Overview

Sistem login pada aplikasi tabungan menggunakan Firebase Authentication dengan implementasi email/password authentication. Username yang diinput oleh user akan dikonversi menjadi format email untuk kompatibilitas dengan Firebase Auth.

## Arsitektur Login

### Flow Authentication

```text
User Input → Username Conversion → Firebase Auth → Session Management → Redirect
```

### Komponen Utama

1. **Frontend Login Form** (`login.html`)
2. **Firebase Authentication** (Backend)
3. **Session Management** (Auto-handled by Firebase)
4. **Route Protection** (Auth state monitoring)

## Struktur File Login

### 1. HTML Structure

```html
<!-- Login Form Container -->
<form id="loginForm" class="p-6 space-y-4">
    <!-- Username Input -->
    <input type="text" id="username" name="username" required>
    
    <!-- Password Input dengan Toggle Visibility -->
    <input type="password" id="password" name="password" required>
    <div id="togglePassword">Show/Hide Password</div>
    
    <!-- Submit Button dengan Loading State -->
    <button type="submit">
        <span id="loginText">Masuk</span>
        <span id="loadingIcon" class="hidden">Loading...</span>
    </button>
</form>
```

### 2. CSS Styling

**Design Features:**

- Responsive design dengan Tailwind CSS
- Modern UI dengan shadow dan rounded corners
- Loading animations dan transitions
- Alert system dengan slide animations

**Color Scheme:**

- Primary: Blue (`bg-blue-600`)
- Background: Light gray (`bg-gray-50`)
- Text: Gray variations for hierarchy

### 3. JavaScript Functionality

#### Auth State Management

```javascript
// Check if user is already logged in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, redirect to index.html
        window.location.href = "index.html";
    }
});
```

#### Username to Email Conversion

```javascript
// Convert username to email format for Firebase
const email = `${username}@tabungan.app`;
```

## Authentication Flow

### 1. User Input Validation

**Required Fields:**

- Username: Text input (required)
- Password: Password input (required)

**Client-side Validation:**

- Empty field checking
- Trim whitespace from username
- Real-time form validation

### 2. Firebase Authentication Process

```javascript
firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        // Success handling
        showAlert("Login berhasil. Mengalihkan...", "success");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    })
    .catch((error) => {
        // Error handling
        handleLoginError(error);
    });
```

### 3. Error Handling

**Error Codes & Messages:**

| Error Code | User Message | Description |
|------------|--------------|-------------|
| `auth/user-not-found` | "Username atau password salah." | User doesn't exist |
| `auth/wrong-password` | "Username atau password salah." | Incorrect password |
| `auth/too-many-requests` | "Terlalu banyak percobaan login. Coba lagi nanti." | Rate limiting |
| `default` | "Terjadi kesalahan saat login. Silakan coba lagi." | Generic error |

## UI/UX Features

### 1. Loading States

**Button Loading Animation:**
```javascript
// Show loading
$("#loginText").text("Memproses...");
$("#loadingIcon").removeClass("hidden");

// Hide loading
$("#loginText").text("Masuk");
$("#loadingIcon").addClass("hidden");
```

### 2. Password Visibility Toggle

```javascript
$("#togglePassword").click(function() {
    const passwordInput = $("#password");
    const passwordIcon = $(this).find('i');
    
    if (passwordInput.attr("type") === "password") {
        passwordInput.attr("type", "text");
        passwordIcon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
        passwordInput.attr("type", "password");
        passwordIcon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
});
```

### 3. Alert Notification System

**Alert Types:**

- `success`: Green background, check icon
- `error`: Red background, exclamation icon
- `warning`: Yellow background, warning icon
- `info`: Blue background, info icon

**Features:**

- Auto-dismiss after 4 seconds
- Manual close button
- Slide-in/slide-out animations
- Accessible with ARIA attributes

## Security Considerations

### 1. Firebase Authentication Security

- **Secure Communication**: All auth requests use HTTPS
- **Session Management**: Firebase handles token refresh automatically
- **Rate Limiting**: Built-in protection against brute force attacks

### 2. Client-side Security

```javascript
// Persistence set to LOCAL for session management
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
```

### 3. Route Protection

**Automatic Redirection:**

- Logged-in users redirected from login page to main app
- Non-authenticated users redirected to login page

## Configuration

### Firebase Config Integration

```javascript
// Firebase configuration loaded from firebase-config.js
<script src="firebase-config.js"></script>
```

**Required Firebase Services:**

- Firebase Auth (`firebase-auth-compat.js`)
- Firebase App (`firebase-app-compat.js`)
- Firebase Firestore (`firebase-firestore-compat.js`)

### Dependencies

**External Libraries:**

- jQuery 3.7.1 (DOM manipulation)
- Tailwind CSS 4 (Styling)
- Font Awesome 6.4.2 (Icons)
- Google Fonts Inter (Typography)

## User Experience Flow

### 1. Landing on Login Page

```text
Page Load → Check Auth State → Show Login Form OR Redirect to App
```

### 2. Login Process

```text
Input Credentials → Validate → Show Loading → Authenticate → Handle Result
```

### 3. Success Flow

```text
Authentication Success → Show Success Message → Delay (1s) → Redirect to Main App
```

### 4. Error Flow

```text
Authentication Error → Hide Loading → Show Error Message → Allow Retry
```

## Accessibility Features

### 1. Keyboard Navigation

- Tab order optimization
- Enter key submits form
- Focus management (auto-focus on username)

### 2. Screen Reader Support

```html
<!-- ARIA labels and roles -->
<div id="alertContainer" aria-live="assertive" aria-atomic="true"></div>
<button aria-label="Tutup notifikasi">Close</button>
```

### 3. Visual Indicators

- Clear error states
- Loading indicators
- Focus states for form inputs

## Performance Optimizations

### 1. Resource Loading

- CDN usage for external libraries
- Efficient CSS animations
- Lazy loading of non-critical resources

### 2. User Experience

- Immediate feedback for user actions
- Progressive loading states
- Smooth transitions between states

## Testing Considerations

### 1. Test Scenarios

**Positive Cases:**

- Valid username and password
- Password visibility toggle
- Auto-redirect for logged-in users

**Negative Cases:**

- Invalid credentials
- Empty form submission
- Network connectivity issues
- Rate limiting scenarios

### 2. Browser Compatibility

- Modern browser support (ES6+)
- Mobile responsive design
- Touch-friendly interface

## Maintenance Notes

### 1. Firebase Configuration

- Monitor Firebase usage quotas
- Update Firebase SDK versions
- Review security rules periodically

### 2. UI Updates

- Test responsive design on various devices
- Validate accessibility compliance
- Update styling frameworks as needed

---

*Dokumentasi ini menjelaskan implementasi sistem login pada aplikasi tabungan yang menggunakan Firebase Authentication dengan antarmuka yang user-friendly dan keamanan yang terjamin.*

# Google Logout Fix - Account Switching

## Problem
Users were unable to switch Google accounts after logging out. When a user logged out and then clicked "Sign in with Google," they would automatically be logged back in with the same Google account, preventing account switching.

## Root Cause
The original logout implementation only cleared the local session cookie but **did not sign the user out from the Cognito User Pool** (which is connected to Google OAuth). This left an active Google session in the browser, so subsequent login attempts would automatically use that existing session.

## Solution
The fix implements a complete logout flow that:

1. **Clears the local authentication cookie** (`auth-token`) on the Next.js app
2. **Revokes the OAuth token** at the Cognito authorization server using the `/oauth2/revoke` endpoint
3. **Redirects to Cognito's logout endpoint** to clear the Google session and any Cognito session cookies

## Changes Made

### 1. [src/app/api/auth/logout/route.ts](src/app/api/auth/logout/route.ts)
**Enhanced the logout API endpoint to:**
- Construct the Cognito logout URL with proper parameters
- Attempt to revoke the access token at Cognito's `/oauth2/revoke` endpoint
- Return the logout URL to the client for complete session clearing
- Handle errors gracefully while still clearing local cookies

**Key additions:**
```typescript
// Attempt to revoke the token at Cognito
await fetch(`${baseUrl}/oauth2/revoke`, {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    client_id: clientId!,
    token: token,
  }).toString(),
});

// Include logout URL in response for client-side redirect
logoutUrl: domain ? `${domain.startsWith("http") ? domain : `https://${domain}`}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(redirectUri)}` : null,
```

### 2. [src/components/navbar.tsx](src/components/navbar.tsx)
**Updated the logout handler to:**
- Call the enhanced logout endpoint
- Receive the logout URL from the response
- Redirect to Cognito's logout endpoint (if available) to clear the Google session
- Fall back to `/login` if the logout URL is not available

**Key changes:**
```typescript
const handleLogout = async () => {
  try {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    const data = await response.json();
    
    // If we have a logout URL from Cognito, redirect there to clear the Google session
    if (data.logoutUrl) {
      window.location.href = data.logoutUrl;
    } else {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout failed:", error);
    window.location.href = "/login";
  }
};
```

## How It Works

1. **User clicks "Logout"** in the navbar
2. **Frontend calls `/api/auth/logout`** 
3. **Backend:**
   - Clears the `auth-token` cookie
   - Attempts to revoke the token at `{COGNITO_DOMAIN}/oauth2/revoke`
   - Generates the Cognito logout URL: `{COGNITO_DOMAIN}/logout?client_id={CLIENT_ID}&logout_uri=/login`
   - Returns the logout URL to the client
4. **Frontend receives logout URL** and redirects to it
5. **Cognito/Google clears the session** and redirects back to `/login`
6. **User is now completely signed out** and can log in with a different Google account

## Browser Flow

```
User Click "Logout"
        ↓
Frontend: fetch("/api/auth/logout")
        ↓
Backend: Clear cookie + Revoke token + Return logout URL
        ↓
Frontend: Redirect to Cognito logout endpoint
        ↓
Cognito: Clear Google/OAuth session
        ↓
Cognito: Redirect to /login
        ↓
User: Can now log in with different account ✓
```

## Testing

To verify the fix works:

1. **Test Google Login:**
   - Log in with Google account A
   - Verify you're logged in

2. **Test Account Switching:**
   - Click "Logout"
   - You should be redirected to Cognito's logout endpoint
   - After clearing, you'll be redirected back to `/login`
   - Click "Sign in with Google"
   - Google should now show the account picker (allowing selection of account A or B)
   - Select account B (or log out of account A first if not shown)
   - You should now be logged in as account B ✓

3. **Test Fallback:**
   - The system gracefully falls back to `/login` if Cognito URLs are not configured

## Environment Variables Required

These should already be set in your `.env.local`:

```
NEXT_PUBLIC_COGNITO_DOMAIN=your-cognito-domain.auth.region.amazoncognito.com
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH_CALLBACK_URL=http://localhost:3000/api/auth/callback  (or your production URL)
```

## Additional Notes

- The fix is **backward compatible** - if Cognito is not configured, it will still work by just clearing the local cookie
- The logout endpoint now **attempts token revocation** in addition to cookie clearing
- Error handling ensures the user is always redirected to the login page, even if something fails
- The solution works for both Google OAuth and Cognito native authentication flows
